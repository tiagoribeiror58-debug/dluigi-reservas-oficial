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

# Imagens

O José tem fotos dos eventos realizados (qualidade razoável, não cinematográfica).

**Decisão atual:** placeholders até receber o material. Troca é simples — 4 URLs no código.

**Sobre upload no admin:** não implementado agora. Fotos mudam raramente. Recomendado: editar URL direto no código + deploy.

---

# Status do Protótipo

- [ ]  Formulário de reserva com validações completas
- [ ]  Landing page com 4 pacotes visuais (pré-preenchem o formulário)
- [ ]  Painel admin com filtros e ações (confirmar/cancelar)
- [ ]  Hero section com CTA + tagline
- [ ]  Pacotes visuais integrados na mesma página (sem tela separada)
- [ ]  Backend/banco de dados (agora é in-memory)
- [ ]  Notificação pro José
- [ ]  Valor da taxa diurna
- [ ]  Fotos reais dos eventos
- [ ]  Deploy

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