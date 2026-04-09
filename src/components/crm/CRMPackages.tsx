import { useState, useEffect } from 'react';
import { Package } from '@/types/reservation';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function CRMPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [uploading, setUploading] = useState(false);
  const [landingConfig, setLandingConfig] = useState({ title: '', subtitle: '' });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    const { data } = await supabase.from('packages').select('*').order('created_at', { ascending: true });
    if (data) setPackages(data as Package[]);

    const { data: settingsData } = await supabase.from('settings').select('value').eq('id', 'landing_packages').maybeSingle();
    if (settingsData && settingsData.value) {
      setLandingConfig({
        title: settingsData.value.title || 'Escolha o seu momento',
        subtitle: settingsData.value.subtitle || 'Selecione um pacote para pré-preencher a reserva automaticamente'
      });
    } else {
      setLandingConfig({
        title: 'Escolha o seu momento',
        subtitle: 'Selecione um pacote para pré-preencher a reserva automaticamente'
      });
    }

    setLoading(false);
  };

  const handleSaveConfig = async () => {
    const { error } = await supabase.from('settings').upsert({
      id: 'landing_packages',
      value: landingConfig,
      updated_at: new Date().toISOString()
    });
    if (error) {
       alert("Erro ao salvar textos: " + error.message);
    } else {
       alert("Textos atualizados com sucesso!");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingPkg) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    setUploading(true);
    const { error: uploadError } = await supabase.storage
      .from('package_images')
      .upload(fileName, file);

    if (uploadError) {
      alert('Erro ao fazer upload: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('package_images').getPublicUrl(fileName);
    const updatedUrls = [...(editingPkg.image_urls || []), data.publicUrl];
    setEditingPkg({ ...editingPkg, image_urls: updatedUrls });
    setUploading(false);
  };
  
  const handleRemoveImage = (index: number) => {
    if (!editingPkg) return;
    const updatedUrls = [...(editingPkg.image_urls || [])];
    updatedUrls.splice(index, 1);
    setEditingPkg({ ...editingPkg, image_urls: updatedUrls });
  };

  const handleSave = async (pkg: Package) => {
    let errorObj = null;
    if (pkg.id && pkg.id !== 'new') {
      const { error } = await supabase.from('packages').update({
        title: pkg.title,
        desc: pkg.desc,
        tag: pkg.tag,
        event_type: pkg.event_type,
        buffet: pkg.buffet,
        icon_name: pkg.icon_name,
        color: pkg.color,
        active: pkg.active,
        image_urls: pkg.image_urls,
        price: pkg.price,
        visible_fields: pkg.visible_fields
      }).eq('id', pkg.id);
      errorObj = error;
    } else {
      const { id, created_at, ...insertData } = pkg;
      const { error } = await supabase.from('packages').insert([insertData]);
      errorObj = error;
    }
    
    if (!errorObj) {
      alert('Conteúdo salvo com sucesso!');
      loadPackages();
    } else {
      alert('Falha ao salvar: ' + errorObj.message);
    }
    setEditingPkg(null);
  };

  const handleCreate = () => {
    setEditingPkg({
      id: 'new',
      title: '',
      desc: '',
      tag: '',
      event_type: 'Aniversário',
      buffet: 'buffet_full',
      icon_name: 'Star',
      color: '#FFF0EE',
      active: true,
      image_urls: [],
      price: '',
      visible_fields: ['guests', 'date', 'time', 'eventType', 'buffet', 'notes', 'birthday']
    } as Package);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este pacote?')) {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (!error) loadPackages();
    }
  };

  const renderForm = () => {
    if (!editingPkg) return null;

    return (
      <div className="bg-[#151515] p-6 rounded-xl border border-[#2A2A2A] mb-8 shadow-2xl relative mt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A2A2A]">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {editingPkg.id === 'new' ? '✨ Criar Novo Pacote' : '📝 Editar Pacote'}
          </h3>
          <button onClick={() => setEditingPkg(null)} className="text-[#888] hover:text-white transition-colors p-2 bg-[#222] hover:bg-[#333] rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Col 1: Basic Info */}
          <div className="space-y-5">
            <div>
              <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.15em] mb-3">Informações Principais</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Título do Pacote</label>
                  <input 
                    type="text" 
                    value={editingPkg.title} 
                    onChange={e => setEditingPkg({...editingPkg, title: e.target.value})}
                    className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm"
                    placeholder="Ex: Aniversário em Família"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Descrição Curta</label>
                  <textarea 
                    value={editingPkg.desc} 
                    onChange={e => setEditingPkg({...editingPkg, desc: e.target.value})}
                    className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm h-24 resize-none leading-relaxed"
                    placeholder="Pizza, bolo, espaço kids..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Destaque (Tag)</label>
                    <input 
                      type="text" 
                      value={editingPkg.tag} 
                      onChange={e => setEditingPkg({...editingPkg, tag: e.target.value})}
                      className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm"
                      placeholder="Ex: Até 100 pessoas"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Preço (Opcional)</label>
                    <input 
                      type="text" 
                      value={editingPkg.price || ''} 
                      onChange={e => setEditingPkg({...editingPkg, price: e.target.value})}
                      className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm"
                      placeholder="Ex: Por pessoa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#AAA] mb-2 font-medium ml-1">Imagens de Divulgação (Galeria do Pacote)</label>
                  <div className="flex gap-2 items-center flex-wrap">
                    {(editingPkg.image_urls || []).map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#333] group shadow-inner">
                        <img src={url} alt="Pacote" className="w-full h-full object-cover" />
                        <button onClick={() => handleRemoveImage(idx)} className="absolute inset-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0 m-0 border-none cursor-pointer">
                          <Trash2 size={18} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                    <label className={`w-16 h-16 rounded-xl border border-dashed border-[#444] bg-[#111] hover:bg-[#222] transition-colors flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Plus size={20} className="text-[#888]" />
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploading && <div className="text-[11px] text-[#10B981] animate-pulse mt-2 ml-1">Enviando imagem...</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Res Form Mapping & Options */}
          <div className="space-y-5">
            <div>
              <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.15em] mb-3">Automação de Reserva</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Preencher "Evento" no form com:</label>
                    <input 
                      type="text" 
                      value={editingPkg.event_type} 
                      onChange={e => setEditingPkg({...editingPkg, event_type: e.target.value})}
                      className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Pré-selecionar Cardápio:</label>
                    <div className="relative">
                      <select 
                        value={editingPkg.buffet} 
                        onChange={e => setEditingPkg({...editingPkg, buffet: e.target.value})}
                        className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option value="alacarte">À la carte</option>
                        <option value="buffet_food">Buffet de Comidas</option>
                        <option value="buffet_full">Buffet Completo</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#888]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111] border border-[#2A2A2A] p-5 rounded-xl shadow-inner mt-2">
                  <label className="block text-sm font-semibold text-white mb-4 tracking-tight">
                    Quais campos o cliente precisará <span className="text-[#FF5A5A]">preencher</span>?
                  </label>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    {[
                      { key: 'date', label: 'Selecionar Data' },
                      { key: 'time', label: 'Preencher Horário' },
                      { key: 'guests', label: 'Qtd de Pessoas' },
                      { key: 'eventType', label: 'Exibir Tipo de Evento' },
                      { key: 'buffet', label: 'Exibir Cardápio' },
                      { key: 'birthday', label: 'Checkbox Aniversariante' },
                      { key: 'notes', label: 'Campo de Observações' }
                    ].map((field) => {
                      const isChecked = (editingPkg.visible_fields || []).includes(field.key);
                      return (
                        <label key={field.key} className="flex items-center gap-3 text-xs font-medium text-[#AAA] cursor-pointer hover:text-white transition-colors group">
                          <div className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-colors shadow-sm ${isChecked ? 'bg-[#FF5A5A] border-[#FF5A5A]' : 'bg-[#1A1A1A] border-[#444] group-hover:border-[#666]'}`}>
                            {isChecked && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {
                              const fields = editingPkg.visible_fields || [];
                              setEditingPkg({
                                ...editingPkg, 
                                visible_fields: isChecked ? fields.filter(f => f !== field.key) : [...fields, field.key]
                              });
                            }}
                            className="hidden"
                          />
                          {field.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-start gap-4 mt-6 p-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] cursor-pointer hover:border-[#444] hover:bg-[#222] transition-all group shadow-sm">
                  <div className={`mt-0.5 w-[22px] h-[22px] rounded-[6px] border-2 flex items-center justify-center transition-colors shadow-inner flex-shrink-0 ${editingPkg.active ? 'bg-[#10B981] border-[#10B981]' : 'bg-[#111] border-[#555] group-hover:border-[#777]'}`}>
                    {editingPkg.active && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={editingPkg.active} 
                    onChange={e => setEditingPkg({...editingPkg, active: e.target.checked})}
                    className="hidden"
                  />
                  <div>
                    <div className={`text-sm font-bold tracking-tight mb-0.5 transition-colors ${editingPkg.active ? 'text-white' : 'text-[#AAA] group-hover:text-[#CCC]'}`}>
                      Publicar Pacote online
                    </div>
                    <div className="text-xs text-[#777] leading-tight">O pacote aparecerá imediatamente na página inicial da pizzaria, visível para todos os clientes.</div>
                  </div>
                </label>

              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#2A2A2A] justify-end">
            <button onClick={() => setEditingPkg(null)} className="px-6 py-3 bg-transparent text-[#AAA] hover:text-white border border-[#444] hover:bg-[#222] rounded-lg font-semibold cursor-pointer transition-all text-sm">
              Cancelar
            </button>
            <button onClick={() => handleSave(editingPkg)} className="px-6 py-3 bg-[#FF5A5A] hover:bg-[#E04848] text-white shadow-lg shadow-red-500/20 border-none rounded-lg font-bold cursor-pointer flex items-center gap-2 transition-all text-sm">
              <Check size={18} strokeWidth={2.5} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Carregando pacotes...</div>;

  return (
    <div className="crm-fade-in">
      <div className="crm-dash-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="view-title">Gestão de Pacotes & Textos</h2>
          <p className="view-sub">Crie/edite pacotes e gerencie os textos de exibição na landing page</p>
        </div>
        {!editingPkg && (
          <button onClick={handleCreate} style={{ padding: '10px 24px', background: 'var(--red)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Novo Pacote
          </button>
        )}
      </div>

      {!editingPkg && (
        <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px', border: '1px solid #2A2A2A', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#FFF' }}>Textos da Seção de Pacotes na Página Inicial</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Título</label>
              <input 
                type="text" 
                value={landingConfig.title}
                onChange={(e) => setLandingConfig({...landingConfig, title: e.target.value})}
                style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Subtítulo / Descrição</label>
              <input 
                type="text" 
                value={landingConfig.subtitle}
                onChange={(e) => setLandingConfig({...landingConfig, subtitle: e.target.value})}
                style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
              />
            </div>
          </div>
          <button onClick={handleSaveConfig} style={{ padding: '8px 16px', background: '#333', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Salvar Textos</button>
        </div>
      )}

      {renderForm()}

      {!editingPkg && (
        <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ background: '#242424' }}>
              <tr>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Título</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Tag / Fotos</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Cardápio</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => {
                const getBuffetLabel = (val: string) => {
                  if (val === 'buffet_full') return 'Buffet Completo';
                  if (val === 'buffet_food') return 'Buffet de Comidas';
                  if (val === 'alacarte') return 'À la carte';
                  return val;
                };

                return (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <td style={{ padding: '16px', color: '#FFF', fontWeight: 500 }}>{pkg.title}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>
                    {pkg.tag}
                    {pkg.image_urls && pkg.image_urls.length > 0 && (
                      <span style={{ marginLeft: 8, fontSize: 11, background: '#2A2A2A', padding: '2px 6px', borderRadius: 10 }}>📸 {pkg.image_urls.length}</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>{getBuffetLabel(pkg.buffet)}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: pkg.active ? '#10B981' : '#888', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, background: pkg.active ? 'rgba(16,185,129,0.1)' : '#222' }}>
                      {pkg.active ? 'Ativo' : 'Oculto'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditingPkg(pkg)} style={{ background: '#2A2A2A', border: 'none', color: '#FFF', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(pkg.id)} style={{ background: 'rgba(220,38,38,0.1)', border: 'none', color: '#DC2626', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              )})}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                    Nenhum pacote cadastrado. Clique em "Novo Pacote" para criar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
