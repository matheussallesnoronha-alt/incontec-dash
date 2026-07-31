# INCONTEC AI — workflow do n8n

Este workflow recebe a pergunta do painel "INCONTEC AI" do dashboard, busca dados
reais no Supabase, monta um prompt e chama a API da Anthropic (Claude) para gerar
a resposta. A chave da IA e a `service_role key` do Supabase ficam guardadas nas
credenciais do n8n — nunca no dashboard (HTML/JS), que é público.

## 1. Importar o workflow

No n8n: **Workflows → Import from File** e selecione `incontec-ai-workflow.json`.

## 2. Criar as credenciais

O n8n não exporta valores de credenciais (por segurança), então você precisa criar
duas credenciais do tipo **Header Auth** manualmente:

**"Supabase Service Role"**
- Name: `apikey`
- Value: a `service_role key` do seu projeto Supabase (em Project Settings → API).
  ⚠️ Essa chave dá acesso total ao banco — nunca a coloque no frontend.

Depois, abra os nós **Fetch KPIs** e **Fetch Top Bancos** e, no campo de
autenticação, selecione a credencial "Supabase Service Role". Você também precisa
adicionar manualmente o header `Authorization: Bearer <mesma service_role key>`
em cada um desses dois nós (aba Headers), já que o PostgREST exige os dois
headers (`apikey` e `Authorization`).

**"Anthropic API Key"**
- Name: `x-api-key`
- Value: sua chave de API da Anthropic (console.anthropic.com).

Abra o nó **Call Claude** e selecione essa credencial.

## 3. Pegar a URL do webhook

Abra o nó **Webhook**, copie a **Production URL** (algo como
`https://seu-n8n.app/webhook/incontec-ai`).

Cole essa URL em [`js/config.js`](../js/config.js), na constante `N8N_WEBHOOK_URL`.

## 4. Ativar

Ative o workflow (toggle no canto superior direito do editor). Sem isso, a URL de
produção do webhook não responde.

## Testar sem o dashboard

```bash
curl -X POST "https://seu-n8n.app/webhook/incontec-ai" \
  -H "Content-Type: application/json" \
  -d '{"question":"Qual o saldo total disponível?"}'
```

Deve retornar `{"answer":"..."}`.

## O que o workflow faz

1. **Webhook** — recebe `{ question }` via POST.
2. **Fetch KPIs** / **Fetch Top Bancos** — busca `vw_kpis` e os 5 maiores saldos de
   `vw_bancos` no Supabase (com a `service_role key`, que ignora RLS).
3. **Build Prompt** — monta um prompt em português com esses dados reais e a
   pergunta do usuário, instruindo o modelo a não inventar números fora dos dados
   fornecidos.
4. **Call Claude** — chama a API da Anthropic (`claude-sonnet-4-5`) com esse prompt.
5. **Extract Answer** / **Respond to Webhook** — devolve `{ answer }` para o
   dashboard.

Se quiser usar outro provedor (OpenAI, etc.), troque só o nó **Call Claude** —
o resto do workflow não muda.
