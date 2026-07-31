# INCONTEC AI — workflow do n8n

A IA do dashboard usa um workflow já existente no n8n do Incontec, chamado
**"Incontec AI - Assistente Financeira"**. Ele estava criado mas nunca tinha
funcionado (apontava para uma tabela `contas_receber_calc` que não existe mais
no Supabase, sem autenticação, e sem nó de resposta configurado corretamente).
Foi corrigido diretamente no editor do n8n, sem precisar de um workflow novo.

## Fluxo atual

```
Webhook (POST) → Buscar dados (Supabase) → Montar contexto (Code)
  → Chamar Claude (HTTP Request) → Extrair resposta (Code) → Respond to Webhook
```

1. **Webhook** — recebe `{ "pergunta": "..." }` via POST. Sem autenticação
   (a URL em si, com um UUID aleatório, é o único "segredo").
2. **Buscar dados (Supabase)** — consulta `vw_inadimplencia` (Cliente, Obra,
   Total a Receber, Data Venda), autenticado via credencial "Custom Auth
   account" (headers `apikey`/`Authorization` com a `service_role key` do
   Supabase — nunca a `anon key`, já que aqui a query roda no servidor).
3. **Montar contexto (Code)** — agrega os dados (total vencido, top 10
   clientes) e monta o corpo da chamada à Anthropic já como JSON string
   (`claudeBody`), evitando problemas de escaping de aspas/quebras de linha.
4. **Chamar Claude (HTTP Request)** — POST para `api.anthropic.com/v1/messages`,
   corpo = `{{ $json.claudeBody }}`. A chave da Anthropic está direto no
   header `x-api-key` deste nó (não numa credencial dedicada — ideal seria
   migrar para uma credencial Header Auth, mas funciona como está).
5. **Extrair resposta (Code)** — pega `content[0].text` da resposta da
   Anthropic e retorna `{ resposta: "..." }`.
6. **Respond to Webhook** — modo "First Incoming Item", devolve o item do
   passo anterior direto, sem template manual (evita o mesmo problema de
   escaping do passo 3).

## URL de produção

Já configurada em [`js/config.js`](../js/config.js) (`N8N_WEBHOOK_URL`):

```
https://n8n.incontec.com.br/webhook/691d5bfd-e73f-4b59-9c0e-b26a298f6943
```

## Testar sem o dashboard

```bash
curl -X POST "https://n8n.incontec.com.br/webhook/691d5bfd-e73f-4b59-9c0e-b26a298f6943" \
  -H "Content-Type: application/json" \
  -d '{"pergunta":"Qual o total vencido?"}'
```

Deve retornar `{"resposta":"..."}`.

## Pontos de atenção para o futuro

- **Sem autenticação no webhook**: qualquer pessoa com a URL pode chamar e
  consumir crédito da API da Anthropic. Como o path é um UUID aleatório, não é
  adivinhável, mas para mais segurança dá para adicionar Header Auth no nó
  Webhook.
- **Chave da Anthropic em texto puro** no nó "Chamar Claude" (não numa
  credencial). Funciona, mas fica visível para quem tiver acesso de edição a
  esse workflow no n8n.
- **`vw_inadimplencia` só tem títulos vencidos** (ver nota no
  [dashboard](../js/derive.js)) — a IA está instruída a responder só com base
  nesses dados, então perguntas sobre recebíveis "em dia" não terão resposta
  precisa até existir uma fonte melhor.
- Há também um branch de IA (AI Agent + ferramentas Supabase) que foi montado
  no workflow **"Projeto Final - Visconde"** durante a investigação inicial,
  antes de decidir usar o workflow dedicado acima. Ficou com o path do webhook
  renomeado para `incontec-ai-visconde-backup` (inativo, não interfere em
  nada) — pode ser removido com segurança se não for usado.
