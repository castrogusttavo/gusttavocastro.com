---
title: Tiramos o RabbitMQ do ar. Ninguém notou — porque ninguém nunca usou
description: "RabbitMQ rodava desde o início sem nenhum cliente Node conectado a ele. Por que infraestrutura ociosa não é neutra, e por que trocamos por BullMQ sobre o Redis que já existia."
slug: por-que-tiramos-o-rabbitmq
image: /static/images/rabbitmq-bullmq.png
date: "2026-08-10"
---

RabbitMQ estava no `docker-compose` desde o início. Porta AMQP aberta, volume dedicado, container saudável.

Nenhum cliente Node jamais se conectou a ele.

---

## O sintoma

Duas semanas antes, tínhamos acabado de restringir a UI de management do RabbitMQ ao loopback do servidor — parte do trabalho de fechar painéis administrativos expostos sem necessidade.

A pergunta natural veio logo depois: por que manter rodando algo que a gente só estava fechando o acesso?

A resposta, ao investigar: zero código consumia aquela fila. Nenhuma dependência Node para RabbitMQ no projeto. Estava lá desde o início, ocioso, consumindo memória e superfície de configuração — sem entregar nada.

Infraestrutura que ninguém usa não é neutra. Ela continua custando: recursos, superfície de ataque, e a carga cognitiva de "isso aqui é importante?" toda vez que alguém lê o compose.

---

## A decisão: BullMQ sobre o Redis que já existia

Precisávamos de fila de verdade — trabalho de retenção de dados (LGPD) estava prestes a depender disso. Três opções na mesa:

* **Cron do host** — descartado. Acopla execução de job a deploy de servidor, e não escala para múltiplas instâncias sem coordenação extra.
* **Schedule do GitHub Actions** — descartado. Resolve tarefas simples, mas não é desenhado para processar job com retry, backoff e estado.
* **BullMQ sobre Redis** — escolhido. O Redis já rodava em produção, já tinha TLS configurado, e BullMQ é biblioteca Node nativa — sem protocolo novo para operar, sem painel novo para proteger.

A decisão não foi só adotar BullMQ. Foi remover o RabbitMQ por completo, no mesmo movimento — não depreciar aos poucos, não manter os dois "por precaução". Precaução contra o quê, se nada nunca dependeu dele?

---

## Scaffolding antes de qualquer fila real

A primeira entrega não criou nenhuma fila de negócio. Entregou a estrada vazia:

* Conexão `ioredis` dedicada, espelhando a configuração de TLS já usada pelo Redis de cache
* Um registro vazio de filas e workers, para as próximas ondas popularem
* Um processo worker separado, com desligamento gracioso em `SIGTERM`/`SIGINT` e log estruturado
* Bull Board — o painel de inspeção de filas — seguindo a mesma regra que tinha acabado de fechar o RabbitMQ: bind em loopback, sem exposição pública

Separar "montar a infraestrutura" de "escrever a primeira fila real" foi deliberado. Confundir os dois passos é como acabamos com sistemas onde a primeira feature carrega o peso de decisões de infraestrutura que deveriam ter sido resolvidas antes — e via de regra, mal resolvidas sob pressão de prazo.

---

## O que isso virou depois

O scaffolding vazio hoje sustenta quatro filas reais: retenção de dados, ciclo de vida de conta, exportação de dados pessoais e reversão de trial expirado.

O worker roda como processo Node independente, fora do runtime do Next — importa services e repositories diretamente, com build próprio via esbuild para produção. Cada fila tem política de retry com backoff exponencial, e cada processor foi desenhado para ser idempotente: reexecutar o mesmo job, por falha ou reprocessamento, não duplica efeito nem corrompe estado.

Os jobs recorrentes — limpeza diária de sessões expiradas, verificação horária de trials vencidos — são registrados de forma idempotente no boot do worker. Rodar o registro de novo a cada deploy não duplica o agendamento.

Nada disso existia no dia em que o RabbitMQ saiu. Existia só o espaço vazio, pronto para receber.

---

## O aprendizado

Infraestrutura ociosa não é grátis só porque não falha.

Ela ocupa uma porta, um volume, uma linha no compose que alguém vai ter que entender daqui a um ano perguntando "isso aqui ainda é usado?". Cada peça sem dono é ou desperdício de recurso, ou superfície de ataque, ou as duas coisas.

E montar a estrada antes de definir para onde ela vai não é enrolação. É a diferença entre a primeira feature carregar decisão de infraestrutura nas costas, ou só ligar o motor numa pista que já estava pronta.
