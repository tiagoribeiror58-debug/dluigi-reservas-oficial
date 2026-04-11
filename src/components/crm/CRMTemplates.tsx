import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, RotateCcw, Pencil, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  order_index: number;
}

const DEFAULT_TEMPLATES = [
  {
    name: 'Primeiro Contato',
    category: 'Confirmação',
    content: 'Olá {nome}! 👋\n\nAqui é da D\'Luigi Pizzaria.\nRecebemos seu pedido de reserva para o dia {data} às {horario} para {pessoas} pessoas.\n\nPodemos confirmar sua mesa?',
    order_index: 1,
  },
  {
    name: 'Follow-up',
    category: 'Lembrete',
    content: 'Oi {nome}, tudo bem? 😊\n\nPassando para lembrar da sua reserva conosco hoje às {horario}.\n\nPara o pacote {pacote}, já estamos com tudo preparado!\nNos vemos mais tarde? 🍕',
    order_index: 2,
  },
  {
    name: 'Envio de Proposta',
    category: 'Orçamento Especial',
    content: '{nome}, boa tarde! 📄\n\nConforme conversamos sobre o seu evento com pacote {pacote}, preparei uma proposta especial para vocês.\n\nTemos as melhores opções para tornar o momento inesquecível!',
    order_index: 3,
  },
  {
    name: 'Cancelamento',
    category: 'No-show / Ajuste',
    content: 'Olá {nome}, notamos que não conseguiremos te receber hoje às {horario}.\n\nGostaria de reagendar para outra data?',
    order_index: 4,
  }
];

export default function CRMTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MessageTemplate>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error(error);
      toast.error('Erro ao carregar templates');
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const restoreDefaults = async () => {
    if (!confirm('Deseja restaurar os templates padrão? Isso não apagará os atuais, mas adicionará os básicos novamente.')) return;
    
    setLoading(true);
    const { error } = await supabase.from('message_templates').insert(DEFAULT_TEMPLATES);
    
    if (error) {
      toast.error('Erro ao restaurar');
      console.error(error);
    } else {
      toast.success('Templates padrão restaurados!');
      loadTemplates();
    }
  };

  const handleEdit = (t: MessageTemplate) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const handleSave = async () => {
    if (!editForm.id) {
      // Create new
      const { data, error } = await supabase
        .from('message_templates')
        .insert([{
          name: editForm.name || 'Novo Template',
          category: editForm.category || 'Geral',
          content: editForm.content || '',
          order_index: templates.length + 1
        }])
        .select()
        .single();
        
      if (error) toast.error('Erro ao criar template');
      else {
        toast.success('Template criado!');
        setTemplates([...templates, data]);
        setEditingId(null);
      }
    } else {
      // Update existing
      const { error } = await supabase
        .from('message_templates')
        .update({
          name: editForm.name,
          category: editForm.category,
          content: editForm.content
        })
        .eq('id', editForm.id);
        
      if (error) toast.error('Erro ao atualizar');
      else {
        toast.success('Template salvo!');
        setTemplates(templates.map(t => t.id === editForm.id ? { ...t, ...editForm } as MessageTemplate : t));
        setEditingId(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;
    
    const { error } = await supabase.from('message_templates').delete().eq('id', id);
    if (error) toast.error('Erro ao excluir');
    else {
      toast.success('Template excluído!');
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const handleNew = () => {
    setEditingId('new');
    setEditForm({ name: '', category: '', content: '' });
  };

  if (loading && templates.length === 0) {
    return <div className="text-[#888] animate-pulse">Carregando templates...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#E2E2E2]">Templates de Mensagem</h2>
          <p className="text-sm text-[#888]">Use variáveis: {'{nome}'}, {'{data}'}, {'{horario}'}, {'{pessoas}'}, {'{pacote}'}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={restoreDefaults}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] text-[#AAA] hover:text-[#E2E2E2] rounded-lg transition-colors border border-[#333] font-medium text-sm"
          >
            <RotateCcw size={16} /> Restaurar Padrão
          </button>
          <button 
            onClick={handleNew}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#FF5A5A] hover:bg-[#FF4A4A] text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-[#FF5A5A]/20"
          >
            <Plus size={16} /> Novo Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-[#141414] border border-[#222] rounded-xl p-5 flex flex-col gap-4">
            
            {editingId === template.id ? (
              <div className="flex flex-col gap-4 animate-in fade-in">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Nome do Template"
                    className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E2E2E2] focus:border-[#FF5A5A] outline-none"
                  />
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="Categoria (ex: Confirmação)"
                    className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E2E2E2] focus:border-[#FF5A5A] outline-none"
                  />
                </div>
                <textarea
                  value={editForm.content}
                  onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Conteúdo da mensagem..."
                  className="w-full h-32 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E2E2E2] focus:border-[#FF5A5A] outline-none resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="p-2 text-[#888] hover:text-[#E2E2E2] bg-[#1A1A1A] rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#FF5A5A] hover:bg-[#FF4A4A] text-white rounded-lg transition-colors font-medium text-sm">
                    <Save size={16} /> Salvar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#E2E2E2]">{template.name}</h3>
                    <span className="text-xs text-[#888]">{template.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(template)} className="p-2 text-[#888] hover:text-[#E2E2E2] hover:bg-[#222] rounded-lg transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(template.id)} className="p-2 text-[#888] hover:text-[#FF5A5A] hover:bg-[#FF5A5A]/10 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-[#0A0A0A] rounded-lg p-4 border border-[#1A1A1A] overflow-y-auto max-h-48 custom-scrollbar">
                  <p className="text-sm text-[#AAA] whitespace-pre-wrap leading-relaxed">{template.content}</p>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Modal for completely new template */}
        {editingId === 'new' && (
          <div className="bg-[#141414] border border-[#FF5A5A]/50 shadow-[0_0_15px_rgba(255,90,90,0.1)] rounded-xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nome do Template"
                className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E2E2E2] focus:border-[#FF5A5A] outline-none"
              />
              <input
                type="text"
                value={editForm.category}
                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="Categoria"
                className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E2E2E2] focus:border-[#FF5A5A] outline-none"
              />
            </div>
            <textarea
              value={editForm.content}
              onChange={e => setEditForm({ ...editForm, content: e.target.value })}
              placeholder="Olá {nome}, como vai..."
              className="w-full h-32 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E2E2E2] focus:border-[#FF5A5A] outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingId(null)} className="p-2 text-[#888] hover:text-[#E2E2E2] bg-[#1A1A1A] rounded-lg transition-colors">
                <X size={16} />
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#FF5A5A] hover:bg-[#FF4A4A] text-white rounded-lg transition-colors font-medium text-sm">
                <Save size={16} /> Salvar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
