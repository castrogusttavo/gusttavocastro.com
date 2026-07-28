---
title: Matamos o endpoint genérico de upload. Cada arquivo tem seu próprio risco
description: "Como estruturamos object storage com MinIO e S3: por que abandonamos um endpoint único de upload e passamos a tratar avatar, capa de projeto e currículo como três decisões de risco diferentes."
slug: object-storage-minio-s3
image: /static/images/object-storage-minio-s3.png
date: "2026-08-06"
---

Existia, em algum momento, um endpoint genérico de upload. Um bucket único, sem autenticação, recebendo conteúdo em JSON.

Era um bench de teste. Funcionava. E é exatamente o tipo de atalho que sobrevive tempo demais se ninguém questionar.

Não existe mais.

---

## Um cliente, cinco buckets, dois perfis

A aplicação fala com object storage através de um cliente único — MinIO em desenvolvimento, compatível com a API S3, trocando apenas o endpoint em produção.

Mas o que esse cliente escreve é particionado por feature, não por conveniência:

* `avatars` e `user-covers` — público, imagem de perfil
* `projects-covers` — público, capa de projeto
* `career-applications` — privado, currículo em PDF
* `user-exports` — privado, export de dados para LGPD

Cada bucket é criado sob demanda, na primeira escrita. Não existe provisionamento antecipado.

E existem só dois perfis possíveis: público, com política de leitura aberta e URL servida direto; ou privado, sem política nenhuma, acessível apenas via link assinado com prazo de expiração.

---

## Por que matamos o endpoint genérico

Um endpoint único de upload parece simplicidade. Na prática, esconde cinco decisões diferentes atrás de uma interface só: quem pode escrever, o que é aceito, quem pode ler depois, por quanto tempo, e o que acontece quando o arquivo é substituído.

Um avatar de usuário e um currículo de candidatura não compartilham nenhuma dessas respostas. Tratá-los pela mesma rota genérica significa ou super-permissionar o avatar, ou super-restringir o currículo.

A decisão foi: cada feature tem sua própria rota autenticada e seu próprio bucket. Upload sempre como `multipart/form-data` — nunca mais JSON com conteúdo em base64 fingindo ser um payload comum.

---

## Validação não é genérica, e não tentamos fingir que é

Dois módulos de validação convivem, cada um com sua própria régua:

* **Mídia de perfil/projeto** — aceita apenas JPEG, PNG ou WebP, até 5MB.
* **Currículo** — exige `application/pdf` exato, até 10MB, e confere os *magic bytes* do arquivo. Não confiamos só no `content-type` declarado pelo cliente — um arquivo que se apresenta como PDF mas não começa com a assinatura de um PDF é rejeitado antes de chegar ao bucket.

Os dois módulos não compartilham código entre si, mesmo seguindo o mesmo padrão de fundo (validar → garantir bucket → gravar). É uma duplicação deliberada. Unificar faz sentido quando aparecer um terceiro tipo de upload validado — antes disso, seria abstração pagando por um problema que ainda não existe.

---

## Público quando o dado já é público. Presigned quando não é

Avatar e capa de projeto vão para bucket público, com URL servida direto — porque o dado já era destinado a ser visível a qualquer pessoa que acessasse o perfil ou o projeto.

Currículo e export de dados pessoais vão para bucket privado. Nenhuma URL é devolvida diretamente ao cliente. O único caminho de acesso é um link assinado, com prazo de expiração — sete dias, no caso do currículo enviado ao time de recrutamento.

A régua é simples: URL pública só quando o conteúdo já era público por natureza. Qualquer coisa que carregue dado pessoal passa por link temporário.

---

## Upload tem rate limit próprio

Upload não usa o limite genérico de API. Tem o seu: 10 pontos por minuto, por usuário — mais restritivo que o limite geral de requisições.

Faz sentido: escrever bytes em disco custa mais do que ler um registro, e é a superfície mais fácil de abusar para esgotar armazenamento ou banda.

---

## O que ainda não resolvemos

Duas lacunas conhecidas, deixadas abertas de propósito:

* **Capa de projeto fica órfã ao trocar.** Avatar e capa de usuário reusam a mesma chave — trocar o arquivo sobrescreve, sem deixar lixo. Capa de projeto usa uma chave aleatória por upload, então trocar a imagem deixa a versão anterior esquecida no bucket, sem limpeza automática.
* **Sem cota de storage por workspace ou usuário.** Qualquer plano pode subir arquivos até o limite do rate limit de upload — não existe teto agregado de espaço.

Nenhuma política de expiração nativa está configurada no MinIO. A única "expiração" que existe hoje é explícita: um job que apaga currículos vencidos por regra de retenção, não uma política automática do bucket.

São lacunas conhecidas, não descobertas tardias. Ficam registradas para quando o volume justificar o esforço de fechá-las.

---

## O aprendizado

Upload parece uma feature. Na prática é uma decisão composta: quem escreve, quem lê, por quanto tempo o link vive, e o que sobra quando alguém troca o arquivo.

Um endpoint genérico esconde essas perguntas atrás de uma interface conveniente. Cinco rotas específicas obrigam a responder cada uma delas, uma vez por feature — o que é mais trabalho no dia em que se escreve o código, e bem menos trabalho no dia em que algo vaza.
