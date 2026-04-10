import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Columns, Users, MessageSquare, Package, BarChart2, RefreshCw } from 'lucide-react';

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

interface FAQSection {
  icon: React.ReactNode;
  title: string;
  color: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    icon: <BarChart2 size={18} />,
    title: 'Dashboard',
    color: '#60A5FA',
    items: [
      {
        q: 'O que os números do Dashboard significam?',
        a: (
          <>
            Os cards mostram um resumo em tempo real de todas as reservas:
            <br /><br />
            — <strong>Total de Leads:</strong> toda reserva que chegou pelo site, independente do status.<br />
            — <strong>Novos:</strong> pedidos ainda não contactados.<br />
            — <strong>Fechados:</strong> eventos confirmados com o cliente.<br />
            — <strong>Perdidos:</strong> clientes que cancelaram ou pararam de responder.<br /><br />
            Os dados atualizam automaticamente sempre que uma reserva chega ou é editada.
          </>
        ),
      },
    ],
  },
  {
    icon: <Columns size={18} />,
    title: 'Pipeline (Kanban)',
    color: '#A78BFA',
    items: [
      {
        q: 'Como funciona o Pipeline?',
        a: (
          <>
            O Pipeline é um mural visual dividido em 5 colunas que representam o estágio de cada cliente:
            <br /><br />
            — <strong>Novo:</strong> a pessoa acabou de preencher o formulário do site.<br />
            — <strong>Em Contato:</strong> você enviou a primeira mensagem de boas-vindas.<br />
            — <strong>Negociando:</strong> está alinhando data, taxa ou cardápio.<br />
            — <strong>Fechado:</strong> reserva confirmada e alinhada para o evento.<br />
            — <strong>Perdido:</strong> cancelou ou não respondeu mais.<br /><br />
            Arraste o card de um cliente para mover entre colunas. O sistema salva automaticamente.
          </>
        ),
      },
      {
        q: 'Posso mover um lead que foi marcado como "Perdido" de volta?',
        a: (
          <>
            Sim. Basta arrastar o card de volta para a coluna desejada, ou abrir o modal do lead e alterar o status manualmente pelo seletor no topo.
          </>
        ),
      },
    ],
  },
  {
    icon: <Users size={18} />,
    title: 'Leads (Clientes)',
    color: '#34D399',
    items: [
      {
        q: 'Como ver os detalhes completos de um cliente?',
        a: (
          <>
            Na aba <strong>Leads</strong>, clique em qualquer linha da tabela. O modal de atendimento abrirá com:
            <br /><br />
            — Nome, WhatsApp, data, horário e número de pessoas.<br />
            — Tipo de evento e cardápio escolhido.<br />
            — Pacote selecionado (se houver).<br />
            — Anotações internas (visíveis só para você).<br />
            — Aba de Templates do WhatsApp para enviar mensagens prontas.
          </>
        ),
      },
      {
        q: 'Como alterar o status de uma reserva?',
        a: (
          <>
            Abra o modal do cliente (clicando no nome) e use o seletor <em>"Mudar status:"</em> no topo. A mudança salva e atualiza o Pipeline imediatamente — sem precisar recarregar a página.
          </>
        ),
      },
      {
        q: 'O que são as "Anotações Internas"?',
        a: (
          <>
            São notas privadas que só você (admin) vê — o cliente nunca tem acesso. Use para registrar combinados verbais, condições especiais, ou qualquer detalhe do atendimento.
          </>
        ),
      },
      {
        q: 'O que é o campo "Período" (Diurno/Noturno)?',
        a: (
          <>
            O sistema detecta automaticamente o período com base no horário informado pelo cliente:
            <br /><br />
            — <strong>Noturno:</strong> 19h às 24h — reserva <em>não exclusiva</em>, sem taxa.<br />
            — <strong>Diurno:</strong> 11h às 15h — reserva <em>exclusiva</em> do salão inferior, <em>com taxa</em> (valor a definir com o José).<br /><br />
            Isso é importante para saber se precisa cobrar a taxa de reserva na negociação.
          </>
        ),
      },
    ],
  },
  {
    icon: <MessageSquare size={18} />,
    title: 'Templates do WhatsApp',
    color: '#FBBF24',
    items: [
      {
        q: 'Como usar os Templates?',
        a: (
          <>
            Abra o modal de um cliente → aba <strong>Mensagens</strong>.<br /><br />
            Escolha o template adequado ao estágio do atendimento (ex: "Primeiro Contato", "Confirmação", "Lembrete"). O texto é gerado automaticamente com o nome e dados do cliente.<br /><br />
            Clique em <strong>Copiar e Abrir WhatsApp</strong> — o app abrirá direto na conversa com aquela pessoa, com o texto já colado.
          </>
        ),
      },
      {
        q: 'Posso editar o texto do template antes de enviar?',
        a: (
          <>
            Sim. O texto gerado fica em um campo editável antes de você copiar. Ajuste o que precisar — o sistema não envia nada automaticamente, você sempre revisa antes.
          </>
        ),
      },
    ],
  },
  {
    icon: <Package size={18} />,
    title: 'Pacotes',
    color: '#FB923C',
    items: [
      {
        q: 'O que são os Pacotes?',
        a: (
          <>
            Pacotes são atalhos visuais que aparecem na landing page para o cliente. Em vez de preencher tudo do zero, ele clica em "Aniversário em família" e toda a lógica flui mais amigável.<br /><br />
            <strong>Na prática:</strong> reduz o esforço do cliente e aumenta a chance de conversão. O sistema não muda a lógica — apenas facilita a decisão de compra.
          </>
        ),
      },
      {
        q: 'Como subir várias fotos para um único pacote?',
        a: (
          <>
            Na edição de pacotes, clique no botão para fazer o upload da imagem. Você pode continuar clicando e adicionando **quantas imagens quiser**!<br /><br />
            Isso cria automaticamente um carrossel nas telas dos clientes, melhorando a imersão na hora da escolha. Para deletar uma foto, basta clicar no pequeno 'x' vermelho sobreposta nela.
          </>
        ),
      },
      {
        q: 'Como editar, ativar ou desativar um pacote?',
        a: (
          <>
            Vá para a aba <strong>Pacotes</strong> no menu lateral. De lá você pode:<br /><br />
            — Ver todos os pacotes cadastrados.<br />
            — Ativar ou desativar (pacotes inativos somem do site na hora).<br />
            — Editar título, descrição curta, imagens e **preço opcional (aparecerá com destaque na capa)**.<br /><br />
            As mudanças refletem imediatamente na landing page — sem complexidade.
          </>
        ),
      },
    ],
  },
  {
    icon: <RefreshCw size={18} />,
    title: 'Regras de Negócio',
    color: '#F472B6',
    items: [
      {
        q: 'Quais datas ficam bloqueadas automaticamente?',
        a: (
          <>
            O sistema bloqueia automaticamente as datas de alta demanda definidas pelo José:
            <br /><br />
            — <strong>Dia das Mães</strong> (2º domingo de maio)<br />
            — <strong>Dia dos Namorados</strong> (12 de junho)<br />
            — <strong>Dia dos Pais</strong> (2º domingo de agosto)<br /><br />
            O cliente não consegue enviar o formulário nessas datas — recebe um aviso explicando.
          </>
        ),
      },
      {
        q: 'Como funciona a antecedência mínima?',
        a: (
          <>
            O sistema valida automaticamente:
            <br /><br />
            — Eventos de <strong>até 20 pessoas</strong>: mínimo 1 dia de antecedência.<br />
            — Eventos com <strong>mais de 20 pessoas</strong>: mínimo 2 dias de antecedência.<br /><br />
            Se o cliente tentar escolher uma data muito próxima, o formulário bloqueia e informa o motivo.
          </>
        ),
      },
      {
        q: 'O sistema confirma reservas automaticamente?',
        a: (
          <>
            <strong>Não.</strong> Isso é intencional.<br /><br />
            O sistema recebe o pedido, valida os dados e te avisa. A confirmação final acontece via WhatsApp entre você e o cliente — você tem controle total antes de comprometer a data.
          </>
        ),
      },
      {
        q: 'O aniversariante ganha pizza de graça?',
        a: (
          <>
            Sim, mas só em mesas com <strong>12 ou mais pessoas</strong>. O cliente indica no formulário se haverá um aniversariante. Isso aparece no modal de atendimento para você lembrar na hora do evento.
          </>
        ),
      },
    ],
  },
];

function AccordionItem({ item, defaultOpen = false }: { item: FAQItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        borderBottom: '1px solid #2A2A2A',
        transition: 'all 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          color: open ? '#FFF' : '#C0C0C0',
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'left',
          padding: '18px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'color 0.2s',
        }}
      >
        <span>{item.q}</span>
        {open ? <ChevronUp size={16} color="#888" /> : <ChevronDown size={16} color="#888" />}
      </button>
      {open && (
        <div
          style={{
            padding: '0 20px 20px',
            color: '#A0A0A0',
            fontSize: '13px',
            lineHeight: '1.75',
          }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function CRMAjuda() {
  return (
    <div className="crm-fade-in" style={{ maxWidth: '820px', margin: '0 auto', paddingRight: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'rgba(251, 191, 36, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HelpCircle size={24} color="#FBBF24" />
        </div>
        <div>
          <h2 className="view-title">Central de Ajuda</h2>
          <p className="view-sub">Tudo que você precisa saber para usar o sistema do D'Luigi</p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {FAQ_SECTIONS.map((section) => (
          <div
            key={section.title}
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            {/* Section Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '18px 20px',
              borderBottom: '1px solid #2A2A2A',
              background: '#1f1f1f',
            }}>
              <span style={{ color: section.color }}>{section.icon}</span>
              <span style={{ color: section.color, fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {section.title}
              </span>
            </div>

            {/* FAQ Items */}
            {section.items.map((item, i) => (
              <AccordionItem key={i} item={item} defaultOpen={i === 0 && section.title === 'Pipeline (Kanban)'} />
            ))}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: '32px', marginBottom: '16px',
        padding: '16px 20px',
        background: 'rgba(139, 0, 0, 0.08)',
        border: '1px solid rgba(139, 0, 0, 0.2)',
        borderRadius: '10px',
        color: '#888',
        fontSize: '13px',
        lineHeight: '1.6',
      }}>
        <strong style={{ color: '#aaa' }}>Algo não está claro?</strong> Fale com o Tiago — ele desenvolveu este sistema e pode ajustar qualquer detalhe conforme o negócio evoluir.
      </div>
    </div>
  );
}
