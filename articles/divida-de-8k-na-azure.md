---
title: Como queimamos 8 mil reais na Azure por falta de governança técnica
description: "Como a ausência de observabilidade, rate limit e estratégia de testes gerou um custo de 8 mil reais na Azure. E o que mudou na nossa maturidade de engenharia depois disso."
slug: divida-de-8k-na-azure
image: /static/images/8k-aws.png
date: "2026-02-07"
---

Arquitetura:
- API em PHP
- Sistema multi-tenant
- Integrações externas pagas por request
- Testes de integração executando contra ambiente em cloud
- Ambientes compartilhando infraestrutura

Em um ciclo, a conta subiu aproximadamente 8 mil reais.

Não houve ataque.
Não houve pico real de usuários.

Houve ausência de controle.

## O erro não foi escala. Foi falta de governança

O problema não era CPU, memória ou número de usuários.

Era sistêmico:
- Testes de integração rodando diretamente contra serviços reais
- Baixa disciplina para execução local
- Nenhuma limitação de tráfego por tenant
- Ausência de métricas por endpoint
- Nenhum alerta baseado em taxa de aquisição

Sem visibilidade, custou virou variável invisível.

## O que a observabilidade revelou

Implementamos monitoramento com:
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)

Passamos a medir:
- Request por endpoint
- Request por tenant
- Latência média
- Taxa de erro
- Volume por ambiente

Descobrimos endpoints sendo chamados milhares de vezes por minuto por scripts de teste e execuções mal configuradas.

Cloud não estava cara.
Nós estávamos operando no escuro.

## Rate limit como mecanismo financeiro

Implementamos rate limit em três níveis:
- Por tenant
- Por token
- Por IP

Objetivo: impedir que um único consumidor impacte custo e escalabilidade global.

Rate limit deixou de ser apenas proteção contra abuso.
Virou instrumento de governança financeira.

## Testes podem ser um gerador invisível de custo

Rodar tudo contra serviços reais é confortável.
Mas é financeiramente irresponsável.

A maior fonte de consumo vinha de testes mal controlados e execuções repetidas em ambientes compartilhados.

Precisávamos equilibrar fidelidade e previsibilidade.

## Mock data e test doubles sem governança geram falsa segurança

### Mock Data
Criamos:
- Seed previsível de banco
- Fixture reutilizáveis
- Massa de dados representativa

Eliminamos dependência de dados dinâmicos em cloud para validar a regrar de negócio.

### Test Doubles
Adotamos:
- Mocks para valida interação
- Stubs para respostas determinísticas
- Fakes para simular integrações externas críticas

Mas aqui existe risco: drift.

Se o fake evolui diferente do serviço real, você cri segurança ilusória.

## Evitando drift entre fake e serviço real
Medidas adotadas:
- Contract tests obrigatórios para integrações
- Versionamento explícito de contratos
- Teste real períodico contra o serviço oficial
- Monitoramento de breaking changes

O fake não substitui a integração real.
Ele reduz custo operacional.

## Integração real é decisão arquitetural, não hábito automático
Definimos critérios claros.

Roda integração real quando:
- Validar contrato
- Testar fluxo crítico
- Alterar camada de integração
- Próximo de release em produção

Não rodar integração real quando:
- Testar regrar de negócio isolada
- Validar comportamento interno
- Executar CI de alta frequência

Integração real virou evento controlado.
Não execução automática.

## O que mudou na maturidade do time
- Resolução significativa de custo variável
- Previsibilidade de consumo
- Alertas e métricas como padrão
- Consciência de billing como parte da arquitetura

Aprendizado central:

Arquitetura não é só design patter.
É controle de risco operacional.

Cloud não pune quem escala.
Pune quem não mede.