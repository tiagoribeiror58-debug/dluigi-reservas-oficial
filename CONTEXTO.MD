# Contexto

Conversa com **José Junior (D'Luigi Pizzaria)** sobre desenvolvimento de um sistema simples de reservas de espaço para eventos. O objetivo é validar a ideia antes de codar qualquer coisa em produção.

---

# Sobre o Negócio

**D'Luigi Pizzaria** — Passos/MG, há mais de 15 anos na cidade.

- Rua Dr. João Bráulio, 127, Centro
- WhatsApp: (35) 3521-8700 / Proprietário Luiz Faustinone: (35) 99809-0003
- Instagram: @dluigipizzaria

## Espaço

- **Salão inferior:** até 100 pessoas — exclusivo para reservas diurnas
- **Salão superior:** 3 salas, maior comporta até 12 pessoas — aberto para clientes regulares de seg a sex no almoço
- **Área kids:** única, compartilhada
- Dois eventos simultâneos são possíveis

---

# Regras de Reserva Mapeadas

## Antecedência

- Até 20 pessoas → mínimo 1 dia
- Mais de 20 pessoas → mínimo 2 dias

## Datas Bloqueadas

- Dia das Mães (2º domingo de maio)
- Dia dos Namorados (12 de junho)
- Dia dos Pais (2º domingo de agosto)

## Tipo de Evento

Apenas eventos familiares. Proibido: funk, balada, discoteca.

Eventos já realizados: aniversários, bodas, mini recepção de casamento, confraternizações.

## Itens Externos Permitidos

Bolo, docinhos e enfeites simples. Demais itens de consumo exclusivos da pizzaria.

## Pagamento

Somente à vista. Sem parcelamento. Sem cheque.

**Aniversariante:** ganha uma pizza broto doce (mesa com 12+ pessoas).

---

# Modalidades de Reserva

## Noturna (dom–dom, 19h–24h)

- Reserva **não exclusiva**
- Sem taxa de reserva
- 3 opções de cardápio:
    - À la carte — pagamento na saída
    - Buffet de comidas (pizzas + batatas pré-definidas, bebidas à parte) — 30% entrada + 70% saída
    - Buffet completo (comidas + bebidas) — 50% entrada + 50% saída

## Diurna (seg–sex, 11h–15h — salões superiores apenas, pequeno público)

- Reserva **exclusiva** no salão inferior
- **Com taxa de reserva** (valor varia conforme nº de pessoas — necessário saber quantidade para contratar freelancers)
- Antecedência mínima: 2 dias
- Mesmas 3 opções de cardápio
- Sáb e dom: exclusivo / Seg–sex: salas superiores podem ter clientes regulares

> ⚠️ Valor da taxa diurna ainda não definido pelo José — pendente.
> 

---

# Pacotes Visuais Propostos

Baseados no perfil de eventos da pizzaria, para a landing page:

| Pacote | Evento pré-selecionado | Cardápio pré-selecionado |
| --- | --- | --- |
| 🎂 Aniversário em família | Aniversário | Buffet completo |
| 💍 Bodas & Mini casamento | Mini casamento | Buffet completo |
| 🤝 Confraternização | Confraternização | Buffet de comidas |
| 🔒 Evento exclusivo | Outro | À la carte |

---

# Arquitetura do Sistema (KISS)

## Fluxo

```
Landing com pacotes visuais → Formulário pré-preenchido → Confirmação manual pelo José via WhatsApp
```

## Rotas

- `/` — Landing + formulário de reserva (cliente)
- `/admin` — Painel de gestão (José) com senha simples

## O que o sistema faz

- Coleta pedido de reserva com todos os dados necessários
- Valida regras automaticamente (antecedência, datas bloqueadas, capacidade)
- Detecta período (diurno/noturno) pelo horário informado
- Exibe painel admin com status: pendente / confirmada / cancelada
- **Não confirma automaticamente** — confirmação é manual pelo José via WhatsApp

## O que deliberadamente não faz (agora)

- Notificação automática pro José
- Pagamento online
- Upload de imagens pelo admin
- Calendário de disponibilidade público

---

**Status atual:** Imagens reais do José já integradas na `public/imagens-dluigi/` (13 fotos). Galeria com carrossel horizontal + lightbox implementados.

**Sobre upload no admin:** não implementado agora. Fotos mudam raramente. Recomendado: editar URL direto no código + deploy.

---

# Status do Protótipo

- [x]  Formulário de reserva com validações completas
- [x]  Landing page com 4 pacotes visuais (pré-preenchem o formulário)
- [x]  Painel admin com filtros e ações (confirmar/cancelar)
- [x]  Hero section com CTA + tagline
- [x]  Pacotes visuais integrados na mesma página (sem tela separada)
- [x]  Backend/banco de dados (Supabase)
- [x]  Deploy (Vercel)
- [x]  Fotos reais dos eventos (13 imagens em galeria com carrossel + lightbox)
- [x]  Galeria de fotos com carrossel horizontal e preview em tela cheia
- [x]  Seção de vídeos com player fullscreen e controle de velocidade
- [x]  Seção de Avaliações Google com CTA linkado
- [x]  Refatoração UI/UX (Apple-style: Inter, glassmorphism, header flutuante)
- [ ]  Notificação automática pro José
- [ ]  Valor da taxa diurna
- [ ]  Imagens de avaliações Google (pasta `public/imagens-avaliações-dluigi` está vazia)

---

# Decisões desta sessão (01/04/26)

## Imagens — como trocar

O José tem fotos dos eventos (qualidade razoável, não cinematográfica). Autenticidade é um ativo para uma pizzaria familiar.

**3 opções avaliadas:**

| Opção | Descrição | Complexidade |
| --- | --- | --- |
| Hardcoded no código | URL da imagem no código, troca via deploy | Mínima |
| Campo de URL no admin | José cola URL (Instagram, Drive, etc.) | Baixa |
| Upload no admin | José faz upload direto | Alta — precisa de storage (Supabase, Cloudinary) |

**Decisão: Opção 1 agora.** Fotos do José chegam → cola URL no código → deploy. Upload no admin só se José mudar fotos com frequência.

## Landing + Formulário — mesma tela

Decisão: não separar em duas telas. Pacotes visuais no topo pré-preenchem o formulário abaixo via scroll suave. KISS mantido.

## Próximas perguntas em aberto

- Com que frequência o José atualizaria as fotos dos pacotes?
- Quando avançar para backend real: Supabase (já no stack do Tiago)

---

# Atualizações (07/04/26)

## UI/UX Refatoração (Apple-style)
- Fonte migrada de DM Sans → **Inter** (sistema de fontes Apple-like)
- Header simplificado: Removemos o background branco/glassmorphism e agora mantemos apenas a logo flutuando perfeitamente centralizada (minimalismo apple-like).
- Hero centralizado e cinematográfico, altura 100vh, tipografia escalada com `clamp`
- Cards de pacote com glassmorphism, sombras suaves, border-radius 24px
- Formulário com inputs arredondados, foco com glow vermelho, botão com spring animation
- Paleta de cores unificada: tudo via `var(--red)`, `var(--cream)`, `var(--warm)` — sem cores hardcoded fora do `:root`

## Novos Componentes
- `PhotoGallery.tsx` — carrossel horizontal com lightbox (13 fotos reais)
- `GoogleReviewsSection.tsx` — seção de avaliações com CTA para Google Reviews
- `VideoSection.tsx` — player fullscreen com controle de velocidade (vídeos 1–5)

## Pendências Abertas
- Imagens da seção de avaliações Google (`public/imagens-avaliações-dluigi` está vazia — arquivo corrompido)
- Valor da taxa diurna ainda não definido pelo José

---

# Estratégia de Pacotes (Definida em 08/04/26) - FEATURE PARA IMPLEMENTAR:

Segue o fluxo fechado, sem variações, já otimizado para KISS e conversão.

---

# 1) Entrada (Landing)

Usuário chega na `/`

Vê imediatamente:

* Hero (proposta clara)
* Pacotes visuais (3–5 opções)

---

# 2) Escolha guiada

Usuário NÃO começa pelo formulário.

Ele faz:

```
Escolher pacote → clicar
```

Exemplo mental:

> “Quero aniversário → clico no pacote de aniversário”

---

# 3) Ação ao clicar

Ao clicar em um pacote:

### Sistema faz 3 coisas automaticamente:

1. Scroll suave até o formulário
2. Pré-preenche campos
3. Destaca visualmente que o pacote foi selecionado

---

## Campos preenchidos

* Tipo de evento → “Aniversário”
* Nº de pessoas → “12” (ou intervalo sugerido)
* Cardápio → “Buffet completo”
* Observações →
  `"Pacote selecionado: Aniversário em família"`

---

# 4) Ajuste pelo usuário (mínimo)

Usuário só ajusta:

* Data
* Horário
* Nome
* WhatsApp

Opcional:

* alterar nº de pessoas

👉 Não força decisão complexa

---

# 5) Validação automática

Ao enviar:

Sistema valida:

* antecedência mínima
* datas bloqueadas
* capacidade

Se inválido:

* erro direto (sem enviar)

Se válido:

* segue fluxo

---

# 6) Confirmação visual

Tela ou mensagem:

> “Pedido enviado. Confirmação será feita pelo WhatsApp.”

👉 reforça que não é automático

---

# 7) Backend (registro)

Reserva salva com:

* dados do cliente
* dados do evento
* `pacote_escolhido`

---

# 8) Admin (/admin)

José vê:

Lista com:

* Nome
* Data
* Nº pessoas
* **Pacote (se houver)**
* Status

---

## Exemplo real no admin

```
João Silva
12 pessoas
Aniversário
Pacote: Aniversário em família
Status: Pendente
```

---

# 9) Decisão manual (ponto central)

José:

```
abre → analisa → chama no WhatsApp → confirma
```

Sistema NÃO interfere.

---

# 10) Caminho alternativo (importante)

Usuário pode ignorar pacotes:

```
entra → rola → preenche manualmente
```

👉 sistema continua funcionando igual

---

# 11) Resumo estrutural

```
Landing
  ↓
Pacotes (indução)
  ↓
Clique
  ↓
Formulário pré-preenchido
  ↓
Envio
  ↓
Validação
  ↓
Banco
  ↓
Admin
  ↓
WhatsApp (José)
```

---

# 12) Lógica invisível (o que realmente importa)

* Pacote NÃO cria nova lógica de negócio
* Só reduz fricção de decisão
* E simula atendimento humano

---

# O que pode estar impreciso aqui e por quê

* Não há dados reais de comportamento do usuário → não é garantido que clicarão nos pacotes
* Não há validação com tráfego atual → impacto no funil é inferido
* Tempo de resposta do José no WhatsApp não considerado → pode afetar conversão final
* Distribuição real de tipos de evento não informada → pacotes podem não refletir demanda real

---


"contexto dessa decisão do dia 08/04: 1) Psicologia (como o cliente decide)

O cliente não calcula tudo racionalmente. Ele usa atalhos mentais.

O que o pacote faz:
Âncora de preço
Ver um pacote de R$ X faz qualquer coisa abaixo parecer “barata”.
Efeito escolha fácil
Em vez de pensar “o que pedir?”, ele pensa
👉 “qual desses eu pego?”
Evita erro
Ele sente que o pacote já foi “bem pensado” por quem entende
Analogia simples

Buffet vs prato à la carte:

À la carte → você pensa muito
Buffet → você só pega

👉 Pacote = buffet de decisão

O que pode estar impreciso aqui e por quê
Não há teste com clientes reais da pizzaria → reação pode variar
Tipos de público (família vs jovem) podem responder diferente
2) Simplicidade (redução de fricção)

Quanto mais decisões, maior a chance de abandono.

Sem pacote:
escolher evento
escolher comida
pensar quantidade
pensar custo

👉 esforço alto → abandono

Com pacote:
Escolher pacote → ajustar → enviar

👉 esforço mínimo

Regra prática

Cada campo que você remove = mais chance de conversão

O que pode estar impreciso aqui e por quê
Não há métrica atual de abandono → não dá pra quantificar ganho
Alguns usuários podem preferir controle total
3) Percepção de valor (onde o dinheiro entra)

Valor não é o que custa.
É o que parece que você recebe.

Pacote muda o enquadramento

Sem pacote:

“vou gastar R$ 300 em pizza”

Com pacote:

“vou fazer um evento completo por R$ 300”

👉 mesmo valor, sensação diferente

Componentes que aumentam valor percebido
descrição clara (“inclui X, Y, Z”)
contexto (“ideal para aniversário”)
comparação implícita (“vale mais que pedir separado”)
Analogia

Comprar:

só pizza → gasto
“experiência de aniversário” → investimento emocional
O que pode estar impreciso aqui e por quê
Não há validação de preço real → percepção depende muito disso
Se o pacote for mal descrito, o efeito desaparece
🧩 Conclusão unificada
Psicologia → facilita decidir
Simplicidade → reduz esforço
Percepção → justifica gastar mais

👉 Os três juntos = mais conversão + maior ticket"