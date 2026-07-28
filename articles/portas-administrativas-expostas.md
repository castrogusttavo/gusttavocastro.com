---
title: Porta administrativa aberta não é bug. É configuração padrão que ninguém revisitou
description: "Como restringimos o console do MinIO e a UI de management do RabbitMQ ao loopback do servidor — e por que nada ter acontecido até agora não era evidência de que estava seguro."
slug: portas-administrativas-expostas
image: /static/images/portas-administrativas.png
date: "2026-08-03"
---

O console administrativo do MinIO e a UI de management do RabbitMQ estavam acessíveis publicamente desde o primeiro dia.

Ninguém tinha explorado isso. Não é a mesma coisa que estar seguro.

---

## O que estava exposto

Duas superfícies administrativas, nenhuma delas necessária ao público:

* Console web do MinIO, na porta 9001, aberto em `0.0.0.0`
* UI de management do RabbitMQ, na porta 15672, também aberta

Nenhuma das duas é a API que a aplicação consome. São os painéis de administração — gerenciar buckets, filas, usuários, credenciais.

---

## Por que isso importa mais do que parece

Painel administrativo acessível publicamente é superfície de ataque desnecessária.

Não é sobre achar que alguém ia invadir amanhã. É sobre remover um caminho de ataque que não precisava existir — o tipo de item que ISO 27001 (controle de acesso) e SOC2 cobram como padrão mínimo, não como luxo.

Se a aplicação não precisa que esses painéis sejam públicos, eles não deveriam ser.

---

## A correção não foi sofisticada

Duas mudanças, nenhuma delas invasiva:

* Console do MinIO rebindado de `0.0.0.0:9001` para `127.0.0.1:9001`. A API de storage, que a aplicação de fato consome, continuou exposta na rede interna do Docker — sem impacto.
* Imagem do RabbitMQ trocada para a versão sem o plugin de management. A porta 15672 deixou de ser mapeada. O protocolo que a aplicação usa para falar com a fila continuou intacto.

Nada de reescrever infraestrutura. Duas linhas de configuração fecharam duas portas que nunca deveriam ter sido abertas.

---

## O trade-off que aceitamos

Sem UI de management em produção, debug de fila fica menos imediato.

Documentamos um procedimento de túnel SSH para quando alguém precisar inspecionar o RabbitMQ em produção. Em desenvolvimento local, o plugin de management continua disponível sob demanda.

Trocamos conveniência de debug ocasional por superfície de ataque zerada. Dado o volume de operação, a troca compensa.

---

## O que ficou de fora, de propósito

Postgres e Redis continuam expostos na mesma configuração padrão.

Não porque esquecemos. Porque essa issue tinha escopo definido — MinIO e RabbitMQ — e resolver tudo de uma vez teria misturado mudanças sem necessidade. Restringir o resto é o próximo passo natural, não uma correção emergencial.

Regra de firewall de borda também fica fora: é camada complementar, resolve um problema diferente do que configuração de bind resolve.

---

## O aprendizado

Nada ter acontecido não é prova de que uma porta aberta era segura. É prova de que ninguém explorou ainda.

Configuração padrão de infraestrutura carrega decisões de segurança implícitas — e "implícito" é exatamente onde elas ficam sem dono até alguém perguntar.
