---
title: Cache não lança exceção. Cache vira miss
description: "Como estruturamos duas camadas independentes de cache — Redis de aplicação e cache de RSC do Next — e por que a regra mais importante nunca foi sobre armazenar, foi sobre invalidar e sobre nunca deixar uma falha de cache virar falha de request."
slug: cache-full-stack-invalidacao
image: /static/images/cache-invalidacao.png
date: "2026-07-29"
---

Cache parece um problema de armazenamento. Guardar o dado certo, no lugar certo, pelo tempo certo.

Não é. É um problema de invalidação — e de o que acontece quando o próprio cache falha.

---

## Falha de cache não é falha de request

Toda operação de cache está envolvida em captura de erro, sem exceção. Uma leitura que falha não propaga erro — vira um miss, como se o dado nunca tivesse sido cacheado. O serviço busca a fonte real e segue. Uma escrita ou invalidação que falha vira um no-op registrado em log, silenciosamente, sem interromper nada.

Nenhum erro de cache chega até a camada HTTP. Redis fora do ar nunca derruba uma requisição — só faz o sistema responder um pouco mais devagar, buscando direto da fonte.

Essa regra parece óbvia até você ver um sistema onde não é seguida: um `try/catch` esquecido, e uma instabilidade momentânea no Redis vira erro 500 num endpoint que não tinha nada a ver com cache.

---

## Read-through pertence ao serviço, não ao cache

O objeto de cache sabe fazer três coisas: buscar, gravar, invalidar. Não sabe nada sobre o banco de dados.

A lógica de "buscar no cache, e se não achar, buscar na fonte e preencher de volta" vive na camada de serviço, orquestrando os dois lados. O cache em si permanece burro de propósito — sem saber de onde o dado vem, sem depender de nenhum repositório.

Essa separação evita um acoplamento incômodo: mudar a fonte de dado não deveria exigir tocar no código de cache, e vice-versa.

---

## Writes invalidam. Nunca repovoam

Toda operação de escrita — criar, atualizar, apagar — invalida a entrada correspondente no cache. Nenhuma escrita tenta repovoar o cache diretamente com o novo valor.

A próxima leitura, inevitavelmente, vai bater um miss e repovoar pelo caminho normal de read-through. Parece um passo a mais desnecessário, mas evita um bug sutil: gravar no cache um estado intermediário, calculado apressadamente dentro da própria transação de escrita, que diverge do que realmente ficou persistido.

Invalidar é sempre mais seguro do que tentar adivinhar o valor novo.

---

## Invalidação cruzada: quando um dado depende de outro

Nem toda invalidação é local. Quando uma mudança em um domínio afeta um dado que está embutido em outro — um usuário sendo adicionado ou removido de um workspace, por exemplo — os dois lados precisam ser invalidados juntos, mesmo que só um deles tenha mudado diretamente.

O mesmo vale para eventos externos: um webhook de pagamento que muda o plano ativo de um workspace invalida o cache daquele workspace assim que a mudança é persistida — não espera o TTL expirar sozinho, porque quinze minutos de plano desatualizado é tempo demais quando o que está em jogo é o que o usuário pode ou não fazer.

---

## TTL é decisão de coerência, não só de performance

O tempo de vida do cache de usuário e de workspace foi escolhido para coincidir com a janela do token de acesso — não por acaso, por coerência de sessão. Um dado cacheado não devia sobreviver, sozinho, além do tempo em que a sessão que o usa também é válida.

Um cache de snapshot de status, recalculado a cada trinta segundos, carrega uma versão no nome da própria chave. Mudar o formato do dado cacheado no futuro é só mudar esse sufixo — o cache antigo simplesmente para de ser lido, sem exigir nenhuma migração ou limpeza manual.

TTL não é só "quanto tempo até ficar velho". É também "o que eu quero que aconteça quando o formato do dado mudar".

---

## Dois clientes, um Redis físico

O mesmo servidor Redis atende duas responsabilidades completamente separadas: o cache de aplicação, com um cliente, e a fila de background jobs, com outro cliente diferente — bibliotecas distintas, conexões distintas, propósitos distintos.

Compartilhar o servidor físico é economia de infraestrutura. Compartilhar o cliente teria sido acoplamento desnecessário — cada consumidor tem requisitos de conexão diferentes, e misturar os dois teria significado que uma mudança de configuração para um afetaria o outro sem necessidade.

---

## Cache de página é uma camada ortogonal, não concorrente

Fragmentos de interface derivados de pouca ou nenhuma entrada — um cumprimento que muda com a hora do dia, por exemplo — são cacheados numa camada completamente diferente: o cache nativo de componentes de servidor, memorizando a saída já renderizada.

Essa camada não compete com o cache de domínio. Uma guarda a saída de renderização; a outra guarda dado de negócio. Não se sobrepõem, e confundir as duas responsabilidades — tentar cachear DTO de domínio como fragmento de render, ou vice-versa — é o tipo de erro que parece funcionar até o dia em que os dois ficam dessincronizados.

---

## O que aceitamos não resolver ainda

* **Sem proteção contra stampede.** Se muitas chaves expiram ao mesmo tempo, várias requisições simultâneas batem na fonte real antes que a primeira consiga repovoar o cache. No volume atual, isso não pesa. Fica registrado como o próximo ajuste natural se o volume crescer a ponto de importar.
* **JSON sem versionamento de schema**, exceto no cache versionado explicitamente. Mudar o formato de um dado cacheado sem atualizar o prefixo da chave pode entregar uma versão antiga do formato até o TTL vencer sozinho. Conhecido, não resolvido — o custo de resolver antes de precisar seria maior que o risco atual.

---

## O aprendizado

Errar com cache raramente é esquecer de cachear.

É esquecer de invalidar no momento certo, ou deixar uma falha do próprio cache virar uma falha da aplicação que devia estar protegida por ele. Guardar o dado é a parte fácil. O resto é o trabalho de verdade.
