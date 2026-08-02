---
title: Antes de construir um agente, tente resolver com uma chamada só
description: "IA deixou de ser experimento e virou parte séria do roadmap. Um mapa prático de LLM engineering: por que a maioria dos problemas não precisa de agente, por que RAG é problema de busca antes de ser de IA, e o que muda com modelos que seguem instrução mais literalmente."
slug: llm-engineering-agentes-rag-prompt
image: /static/images/llm-engineering.png
date: "2026-08-01"
---

IA deixou de ser experimento de fim de semana e virou parte do que estamos construindo de verdade. Isso muda o padrão de rigor.

Vale organizar o que aprendemos antes de qualquer decisão de produto sobre onde IA entra.

---

## LLM não é mágica. É previsão de token

Um modelo de linguagem prevê o próximo pedaço de texto dado um contexto. Tudo que parece raciocínio emerge dessa previsão sobre uma janela de contexto — a memória de trabalho do modelo, que se esgota e se perde entre uma chamada e outra, porque o modelo não guarda estado sozinho.

Isso reformula o que é "engenharia" nessa área: quase todo o trabalho é colocar a informação certa dentro do contexto e validar o que sai do outro lado. Não é diferente em espírito de qualquer sistema que recebe entrada não-confiável e precisa produzir saída confiável — só que aqui a "função" no meio é probabilística, não determinística.

---

## Comece simples: três níveis de complexidade

Existe uma hierarquia clara, e a tentação é pular direto para o topo:

1. **Chamada única** — classificar, resumir, extrair, responder uma pergunta.
2. **Workflow** — várias chamadas encadeadas, orquestradas por código que você escreve.
3. **Agente** — o modelo decide sozinho os próximos passos, com ferramentas à disposição.

A regra prática é só subir de nível quando o nível de baixo genuinamente não resolve. Um agente custa mais latência, mais tokens, e erra mais do que um workflow determinístico — porque parte da decisão sobre o que fazer deixou de ser sua e passou a ser do modelo.

Construir um agente para um problema que uma chamada única resolveria não é sofisticação. É custo e risco desnecessários vestidos de inovação.

---

## RAG é problema de busca antes de ser de IA

Dar a um modelo acesso a conhecimento que ele não tem — dado privado, recente, específico — segue um padrão de duas fases: indexar documentos offline, quebrando-os em pedaços e transformando cada um em vetor; e, na consulta, recuperar os pedaços mais parecidos com a pergunta antes de pedir a resposta.

O detalhe que a maioria subestima: a qualidade da resposta final é um teto imposto pela qualidade da busca. Um modelo excelente recebendo os trechos errados produz uma resposta errada com a mesma confiança de uma certa. A maior parte do esforço de fazer RAG bem não está em ajustar o prompt — está em melhorar como os documentos são pedaçados e recuperados.

Mesmo com janelas de contexto enormes, capazes de receber um corpus inteiro de uma vez, recuperar só o relevante continua compensando: menos tokens, menos custo, e a atenção do modelo focada no que importa em vez de diluída em tudo.

---

## Prompt engineering mudou com modelos mais literais

Modelos mais recentes seguem instrução de forma mais literal do que os anteriores. Isso é uma vantagem — mas também significa que truques herdados de modelos antigos, como instruções em caixa alta gritando urgência, passam a disparar comportamento exagerado em vez de simplesmente serem ignorados como ruído.

Duas práticas continuam valendo, independente da geração do modelo: separar instrução de dado com delimitadores explícitos — o que também reduz o risco de conteúdo malicioso embutido no dado ser interpretado como comando —, e decompor uma tarefa complexa em etapas menores em vez de um único prompt tentando fazer dez coisas de uma vez.

Prompt vago produz saída genérica. Isso nunca deixou de ser verdade.

---

## Agente é um sistema distribuído em miniatura

O ciclo de um agente com ferramentas é simples de descrever: o modelo decide chamar uma ferramenta, alguém executa essa chamada, o resultado volta para o modelo, e o ciclo se repete até a tarefa terminar.

O que esse ciclo exige na prática é exatamente o que qualquer sistema distribuído exige: validar entrada não-confiável — os argumentos que o modelo gera para uma ferramenta não são garantidamente seguros —, colocar confirmação humana antes de qualquer ação irreversível, e limitar o número de iterações antes que um loop sem fim vire uma conta inesperada.

Existe ainda um vetor de ataque específico dessa arquitetura: o resultado que uma ferramenta traz de volta — o conteúdo de uma página, a resposta de uma API — pode conter instrução disfarçada de dado. Tratar todo resultado de ferramenta como entrada não-confiável, nunca como comando, é defesa básica.

---

## O que isso muda no jeito de medir qualidade

"Melhorei o prompt" sem nenhuma forma de medir é opinião, não engenharia.

Avaliação de um sistema com IA precisa separar duas perguntas: a busca está recuperando o material certo, e a resposta final está fiel a esse material. Confundir as duas — culpar o modelo quando o problema era a busca, ou vice-versa — é o jeito mais comum de gastar tempo otimizando a peça errada.

---

## O aprendizado

Engenharia de IA não é sobre o modelo.

É sobre domar um componente probabilístico dentro de um sistema que precisa continuar previsível o suficiente para alguém confiar nele. O modelo entrega inteligência; a engenharia entrega as bordas — contexto certo, validação de saída, limite de ação, e uma forma honesta de medir se está funcionando.
