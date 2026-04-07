# PLANO — Landing Page: Maximizar Conversão (D'Luigi Pizzaria)

Adicionar elementos de **prova social e confiança** à landing page existente para converter visitantes vindos do Instagram em reservas.

---

## Contexto

Visitantes chegam pelos canais de vendas  → precisam de confiança visual antes de reservar.  
O funil ideal é: **Interesse → Confiança visual → Prova social → Ação (formulário)**.

---

## O que implementar

### 1. Seção: Galeria de Fotos do Espaço

- **Imagens:** pasta `public/imagens d luigi/`
- **Layout:** grid responsivo — 3 colunas (desktop) → 2 (tablet) → 1 (mobile)
- **Efeito:** hover com zoom suave (`scale(1.05)`, `transition 300ms`)
- **Título da seção:** *"Veja Como É"* ou *"Nossos Momentos"*
- **Objetivo:** mostrar o ambiente real antes de reservar
- **Performance:** `loading="lazy"` em todas as imagens

---

### 2. Seção: Avaliações Google

- **Imagens:** todas da pasta `public/imagens-avaliações-dluigi/`
- **Layout:** carrossel — 3 cards visíveis (desktop), 1 (mobile), auto-scroll suave
- **Card visual:** screenshot da avaliação, `border-radius`, sombra suave, fundo branco/creme
- **Título da seção:** *"O que nossos clientes dizem"*

**Botão CTA abaixo da seção:**
```
[ Ver todas as avaliações no Google ]
```
- Link: `https://share.google/Ad4BjYviXDuN000cr`
- `target="_blank"`
- Estilo: outline âmbar/dourado → hover: fundo dourado, texto branco

---

### 3. Ordem final da página

```
1. Hero (já existe)              → CTA principal
2. Pacotes Visuais (já existe)   → pré-preenchem formulário
3. [NOVO] Galeria de Fotos       → "Veja Como É"
4. [NOVO] Avaliações Google      → "O que dizem sobre nós"
5. Formulário de Reserva (já existe) → Ação
```

---

## Checklist de Verificação

- [ ] Galeria renderiza com imagens corretas da `public/`
- [ ] Carrossel de avaliações funciona no mobile
- [ ] Botão do Google abre em nova aba (`target="_blank"`)
- [ ] Link correto: `https://share.google/Ad4BjYviXDuN000cr`
- [ ] Todas as imagens têm `loading="lazy"`
- [ ] Layout responsivo em mobile, tablet e desktop

---

## Nota técnica

> O caminho real do projeto é:
> `C:\Users\tiago\OneDrive\Desktop\PROJETOS GITHUB\dluigi-reservas-oficial`
>
> Na próxima sessão, abrir o VS Code nesse caminho para que a IA consiga acessar e editar os arquivos.
