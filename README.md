# Planner Casamento

Plataforma web estatica para planejamento de casamentos, criada a partir do PRD do projeto.

## Como usar

Abra `index.html` no navegador. O app salva os dados no `localStorage` do proprio navegador.

## Publicacao

Este projeto esta preparado para publicacao como site estatico na Vercel.

1. Suba os arquivos para um repositorio no GitHub.
2. Na Vercel, importe o repositorio.
3. Use as configuracoes padrao de projeto estatico, sem comando de build.

O app usa Supabase Auth e sincroniza o estado do planner na tabela `planner_states`.

Para ativar o banco em um projeto novo do Supabase, rode no SQL Editor o arquivo:

`supabase/migrations/20260618000000_create_planner_states.sql`

## Modulos incluidos

- Login, cadastro e recuperacao de senha simulados
- Onboarding com composicao do casal, nomes separados, data, estilo, tipo, orcamento e meta de convidados
- Dashboard com contagem regressiva, progresso A.R.O., orcamento, convidados e pagamentos
- Checklist em quadro por periodo, com tarefas padrao pendentes, prioridade, edicao livre e conclusao pela bolinha
- Orcamento em cartoes com percentual base, valores sugeridos e reais
- Convidados com RSVP, grupos e papeis reutilizaveis, importacao CSV, filtros e organizacao por grupo, papel ou status
- Importacao de convidados por cabecalhos flexiveis, aceitando CSV com virgula, ponto e virgula ou tab
- Mesas com mapa visual, arraste de convidados com rolagem automatica, selecao de mesa por clique, nomes soltos no mapa, grupo sem mesa, nomes expansiveis, numero sugerido, area por grupo, titulo opcional e mesas reposicionaveis
- Musicas por momento da cerimonia/festa
- Identidade visual com fontes web gratuitas, preview tipografico ao vivo e paleta de cores organizada por grupos
- Fornecedores com categorias reutilizaveis, agrupamento por categoria/status e ordenacao por nome ou valor
- Pagamentos com vencimento e status
- Compromissos com data, hora, fornecedor e lembrete
- Exportacao CSV do modulo atual

## Observacao tecnica

Esta versao e um MVP de frontend sem backend. Para producao, o proximo passo natural e conectar autenticacao real, banco PostgreSQL e storage para contratos.
