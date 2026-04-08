import { useState, useEffect } from 'react';
import { Package } from '@/types/reservation';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function CRMPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    const { data } = await supabase.from('packages').select('*').order('created_at', { ascending: true });
    if (data) setPackages(data as Package[]);
    setLoading(false);
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
    if (editingPkg.image_url && !editingPkg.image_urls?.includes(editingPkg.image_url)) {
      // Migrate old image_url if present
      updatedUrls.unshift(editingPkg.image_url);
    }
    setEditingPkg({ ...editingPkg, image_urls: updatedUrls, image_url: '' });
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
      <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px', border: '1px solid #2A2A2A', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#FFF' }}>{editingPkg.id === 'new' ? 'Novo Pacote' : 'Editar Pacote'}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Título</label>
            <input 
              type="text" 
              value={editingPkg.title} 
              onChange={e => setEditingPkg({...editingPkg, title: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Imagens do Pacote</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
              {(editingPkg.image_urls || []).map((url, idx) => (
                <div key={idx} style={{ position: 'relative', width: '48px', height: '48px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '6px', background: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <button onClick={() => handleRemoveImage(idx)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                </div>
              ))}
              {(!editingPkg.image_urls || editingPkg.image_urls.length === 0) && (
                <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#666' }}>Vazio</div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ width: '100%', fontSize: '13px', color: '#FFF' }} 
              />
            </div>
            {uploading && <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>Fazendo upload...</div>}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Descrição (O que inclui, preços a partir de, etc)</label>
          <textarea 
            value={editingPkg.desc} 
            onChange={e => setEditingPkg({...editingPkg, desc: e.target.value})}
            style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px', height: '60px' }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Tag Principal</label>
            <input 
              type="text" 
              value={editingPkg.tag} 
              onChange={e => setEditingPkg({...editingPkg, tag: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Preço Opcional (ex: R$ 1.500)</label>
            <input 
              type="text" 
              value={editingPkg.price || ''} 
              onChange={e => setEditingPkg({...editingPkg, price: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
              placeholder="Deixe vazio para ocultar"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Tipo Evento Form</label>
            <input 
              type="text" 
              value={editingPkg.event_type} 
              onChange={e => setEditingPkg({...editingPkg, event_type: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Cardápio Form</label>
            <select 
              value={editingPkg.buffet} 
              onChange={e => setEditingPkg({...editingPkg, buffet: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
            >
              <option value="alacarte">À la carte</option>
              <option value="buffet_food">Buffet de comidas</option>
              <option value="buffet_full">Buffet completo</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Cor HEX</label>
            <input 
              type="text" 
              value={editingPkg.color} 
              onChange={e => setEditingPkg({...editingPkg, color: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#121212', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} 
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px', background: '#222', padding: '16px', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#FFF', marginBottom: '12px', fontWeight: 600 }}>Campos visíveis no Formulário de Reserva (Nome e Zap são obrigatórios)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { key: 'date', label: 'Data' },
              { key: 'time', label: 'Hora' },
              { key: 'guests', label: 'Qtd Pessoas' },
              { key: 'eventType', label: 'Tipo Evento' },
              { key: 'buffet', label: 'Cardápio' },
              { key: 'birthday', label: 'Checkbox Aniversário?' },
              { key: 'notes', label: 'Observações Extras' }
            ].map((field) => {
              const isChecked = (editingPkg.visible_fields || []).includes(field.key);
              return (
                <label key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#CCC', cursor: 'pointer' }}>
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
                    style={{ width: '16px', height: '16px' }}
                  />
                  {field.label}
                </label>
              );
            })}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <input 
            type="checkbox" 
            checked={editingPkg.active} 
            onChange={e => setEditingPkg({...editingPkg, active: e.target.checked})}
            style={{ width: '16px', height: '16px' }}
          />
          <label style={{ fontSize: '14px', color: '#FFF' }}>Ativo (Aparece na Landing Page)</label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleSave(editingPkg)} style={{ padding: '10px 24px', background: '#10B981', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} /> Salvar
          </button>
          <button onClick={() => setEditingPkg(null)} style={{ padding: '10px 24px', background: 'transparent', color: '#888', border: '1px solid #444', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <X size={16} /> Cancelar
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div>Carregando pacotes...</div>;

  return (
    <div className="crm-fade-in">
      <div className="crm-dash-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="view-title">Gestão de Pacotes</h2>
          <p className="view-sub">Crie e edite os pacotes visíveis para seus clientes na landing page</p>
        </div>
        {!editingPkg && (
          <button onClick={handleCreate} style={{ padding: '10px 24px', background: 'var(--red)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Novo Pacote
          </button>
        )}
      </div>

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
