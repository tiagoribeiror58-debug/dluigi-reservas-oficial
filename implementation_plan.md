# Refinamentos Premium & Formulários Flexíveis

Este plano detalha como implementaremos a lista de 7 alterações solicitadas para deixar o sistema mais customizável para o admin e com visual ainda mais sofisticado para o cliente.

## Proposed Changes

### 1. UI/UX: Remoção da Tag e Novo Header
- **Remoção de Elemento**: No `PackageCard.tsx`, removerei a tag de confirmação verde inconsistente com o fluxo do modal.
- **Header Estático**: No `Header.tsx`, mudarei a classe de css `fixed` para `absolute`, garantindo que a logo fique atrelada apenas à primeira seção (topo da tela) e desapareça organicamente ao rolar a página.
- **Hero Escuro**: Ajustarei o gradiente do `Hero.tsx` para tons de vermelho ainda mais escuros e sóbrios, combinando com a identidade visual da D'Luigi.

### 2. Preço Opcional no Pacote
- **Banco de Dados**: Adicionar a coluna `price` (texto) à tabela `packages`.
- **Admin**: Adicionar um input opcional no `CRMPackages.tsx`.
- **Área do Cliente**: Se o preço for preenchido, exibir uma badge elegante na foto do pacote e no modal.

### 3. Formulário Dark Premium
- **Estilos**: A metade direita do modal (onde fica o formulário) passará a usar um background vermelho muito escuro (`var(--red)` escurecido ou cor análoga) com textos brancos/claros, inputs translúcidos com bordas sutis. Uma estética "Night Mode Premium".
- **Home**: Reordenar a landing page para que a seção de vídeos "Celebre Conosco" fique no final, encostada no Footer.

### 4. Múltiplas Fotos & Carrossel
- **Banco de Dados / Tipos**: O campo atual `image_url` (texto único) será convertido semanticamente (ou usando JSON/array) para suportar múltiplas URLs.
- **Admin**: O adm poderá fazer upload de várias fotos sucessivas. Haverá um preview mostrando a galeria do pacote dentro do painel.
- **Modal do Cliente**: A lateral esquerda do Modal Premium terá um mini-carrossel (com setas ou paginação) exibindo todas as fotos em alta qualidade.

### 5. Formulário Dinâmico (Configurável por Pacote)
> [!WARNING]
> Esta é a mudança estrutural mais delicada. Para manter o sistema rápido (KISS) sem precisar criar um "Google Forms", utilizaremos um sistema de *Visibilidade de Campos*.

- **Admin (Configuração)**: Dentro da edição de cada Pacote, o admin terá caixas de seleção (checkboxes) para decidir quais campos existem. Exemplo:
  - [x] Pedir Data e Hora
  - [x] Pedir Quantidade de Pessoas
  - [ ] Pedir Cardápio (desativado se o pacote já inclui tudo)
  - [ ] Pedir Observação extra
- **Cliente**: No modal de reserva, o formulário exibirá *apenas* os campos ativados naquele pacote.
- **Vantagem**: Reduz ainda mais o esforço do cliente dependendo do pacote, mantendo o banco de dados fácil de ler.

---

## Open Questions

**Sobre o Formulário Dinâmico (Item 4 da sua lista):**
A abordagem que sugeri acima (o admin ligar/desligar a visibilidade dos campos que já existem no sistema, como Cardápio, Pessoas, Tipo de Vento) resolve o seu problema?
Ou você queria a capacidade de criar "Campos de Texto Personalizados" do absoluto zero (ex: "Qual o seu sabor de bolo favorito?")?
*> (Recomendo fortemente a primeira opção de ligar/desligar para manter a integridade visual premium do formulário).*

## Verification Plan
1. Lançaremos testes no form para garantir que apenas os campos designados ao pacote estão sendo cobrados.
2. Você precisará rodar um simples comando SQL (fornecido por mim) para atualizar os campos de Preço e Flexibilidade na tabela.
3. Faremos uploads múltiplos testando o carrossel no Modal.
