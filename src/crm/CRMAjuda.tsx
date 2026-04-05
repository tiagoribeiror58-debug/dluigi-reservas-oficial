import { HelpCircle } from 'lucide-react';

export default function CRMAjuda() {
  return (
    <div className="crm-fade-in" style={{ maxWidth: '800px', margin: '0 auto', overflowY: 'auto', paddingRight: '12px' }}>
      <div className="crm-dash-header" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <HelpCircle size={32} color="#FBBF24" />
        <div>
          <h2 className="view-title">Central de Ajuda</h2>
          <p className="view-sub">Aprenda a usar todas as funcionalidades do sistema</p>
        </div>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', overflow: 'hidden' }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #2A2A2A' }}>
          <h3 style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '16px' }}>
            🚀 Como funciona o Pipeline?
          </h3>
          <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.6' }}>
            O Pipeline (Kanban) é dividido em 5 etapas padronizadas:
            <br/><br/>
            - <strong>Novo:</strong> A pessoa acabou de preencher pelo site.<br/>
            - <strong>Em Contato:</strong> Você enviou a primeira mensagem de reconhecimento.<br/>
            - <strong>Negociando:</strong> Aprofundando taxas, mudança de data ou tipo de pacote.<br/>
            - <strong>Fechado:</strong> A reserva foi confirmada e alinhada para o dia do evnto.<br/>
            - <strong>Perdido:</strong> A pessoa cancelou ou não respondeu mais.
          </p>
        </div>

        <div style={{ padding: '24px', borderBottom: '1px solid #2A2A2A' }}>
          <h3 style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '16px' }}>
            💬 Como usar os Templates do WhatsApp?
          </h3>
          <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.6' }}>
            Ao clicar em cima de qualquer Lead, na tabela ou no mural, o modal principal de Atendimento se abrirá.<br/><br/>
            Na aba <strong>Mensagens</strong>, clique em um dos botões amarelos (ex: "Primeiro Contato"). O texto customizado será gerado automaticamente. Basta clicar no botão verde copiar na parte inferior e o seu WhatsApp Web ou App se abrirá imediatamente com aquela pessoa.
          </p>
        </div>
        
        <div style={{ padding: '24px' }}>
          <h3 style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '16px' }}>
            📝 Como alterar Status?
          </h3>
          <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.6' }}>
            Selecione o Lead para abrir o Modal principal do cliente. Logo no topo há um seletor <em>"Mudar status:"</em>. Altere-o que ele salvará imediatamente puxando ele de coluna ou recalculando as taxas do painel da página inicial.
          </p>
        </div>

      </div>
    </div>
  );
}
