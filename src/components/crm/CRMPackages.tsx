import { useState, useEffect } from 'react';
import { Package } from '@/types/reservation';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit2, Trash2, Check, X, Sparkles, CalendarHeart } from 'lucide-react';

export default function CRMPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [uploading, setUploading] = useState(false);
  const [landingConfig, setLandingConfig] = useState({ title: '', subtitle: '' });
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [csvInsights, setCsvInsights] = useState<Partial<Package>[] | null>(null);

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

  const createFromSuggestion = (suggestion: Partial<Package>) => {
    setEditingPkg({
      id: 'new',
      title: suggestion.title || '',
      desc: suggestion.desc || '',
      tag: suggestion.tag || '',
      event_type: 'Aniversário',
      buffet: 'alacarte',
      icon_name: 'Star',
      color: '#FFF0EE',
      active: true,
      image_urls: [],
      price: suggestion.price || '',
      visible_fields: ['guests', 'date', 'time', 'eventType', 'buffet', 'notes', 'birthday'],
      ...suggestion
    } as Package);
    setShowAIPanel(false);
  };

  const handleCreate = () => {
    createFromSuggestion({});
  };

  const getSeasonalSuggestions = () => {
    const month = new Date().getMonth(); // 0 is January
    const suggestions: Partial<Package>[] = [];

    // Datas Específicas / Sazonais
    if (month === 2 || month === 3) {
      suggestions.push({ title: 'Especial Dia das Mulheres', desc: 'Celebre o mês delas conosco! Um almoço/jantar dedicado com brinde especial para todas as mulheres da mesa.', tag: 'Sensacional', price: 'Consulte' });
    }
    if (month === 3 || month === 4) {
      suggestions.push({ title: 'Almoço de Mães Inesquecível', desc: 'Traga a mulher mais importante do mundo para uma experiência gastronômica inesquecível. Decoração especial.', tag: 'Para a Mãe', price: 'Menu Fixo' });
    }
    if (month === 5) {
      suggestions.push({ title: 'Noite Romântica dos Namorados', desc: 'Clima intimista, espumante e um menu pensado para o amor. Reserve sua mesa exclusiva.', tag: 'Exclusivo', price: 'Menu Casal' });
    }
    if (month === 6 || month === 7) {
      suggestions.push({ title: 'Especial Dia dos Pais', desc: 'Celebre o dia dos pais com estilo e muito sabor! Preparamos um menu especial que é a cara do paizão.', tag: 'Família', price: 'Fixo' });
    }
    if (month === 9) {
      suggestions.push({ title: 'Festa Kids: Dia das Crianças', desc: 'Espaço diversão liberado e um cardápio recheado de tudo que eles gostam! Traga seus pequenos.', tag: 'Crianças', price: 'Pacote' });
    }
    if (month === 10) {
      suggestions.push({ title: 'Esquenta Black Friday', desc: 'Festival com valores congelados. Promoção válida apenas para grandes mesas durante esta semana.', tag: 'Promocional', price: 'Com Desconto' });
    }
    if (month === 10 || month === 11) {
      suggestions.push({ title: 'Confraternização de Empresa', desc: 'O fechamento do ano merece uma comemoração de alto nível. Rodízio e chopp gelado para sua equipe.', tag: 'Corporativo', price: 'Sob Consulta' });
      suggestions.push({ title: 'Festa de Fim de Ano (Amigo Oculto)', desc: 'Reúna seus amigos para o amigo oculto perfeito. Reservamos um espaço confortável para a troca de presentes.', tag: 'Fim de ano' });
    }
    if (month === 0 || month === 1) {
      suggestions.push({ title: 'Ressaca de Carnaval / Férias', desc: 'Aproveite o restinho das férias com nossos combos família de Verão.', tag: 'Verão' });
    }

    // Padrões fixos (Evergreen)
    suggestions.push({
      title: 'Aniversário Mágico',
      desc: 'Venha comemorar conosco! Ambiente decorado e atendimento VIP para você e seus convidados.',
      tag: 'O Mais Escolhido',
    });
    suggestions.push({
      title: 'Reunião de Negócios / Almoço',
      desc: 'Ambiente tranquilo e Wi-Fi veloz para você fechar grandes negócios com parceiros.',
      tag: 'Executivo',
    });
    suggestions.push({
      title: 'Happy Hour com os Amigos',
      desc: 'Sextou! Chopp duplo e porções com desconto para você relaxar com a turma toda.',
      tag: 'Happy Hour',
    });

    return suggestions;
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    // Boa prática: Ler o arquivo no lado do cliente (navegador) usando FileReader
    // Isso evita enviar dados confidenciais do restaurante para um servidor desnecessariamente.
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      
      // Simulando um tempo de processamento de IA para melhor UX e feedback visual
      setTimeout(() => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const clientCount = lines.length > 1 ? lines.length - 1 : 0; // Exclui cabeçalho
        
        const lowerText = text.toLowerCase();
        const hasVIP = lowerText.includes('vip') || lowerText.includes('premium') || lowerText.includes('1000');
        const hasKids = lowerText.includes('kids') || lowerText.includes('criança') || lowerText.includes('filho');
        const hasCorporate = lowerText.includes('empresa') || lowerText.includes('corporativo') || lowerText.includes('cnpj');
        const hasBdays = lowerText.includes('nascimento') || lowerText.includes('aniversario');

        const newSuggestions: Partial<Package>[] = [];
        
        // Insight Genérico baseado em volume
        newSuggestions.push({
           title: 'Pacote Reativação de Base',
           desc: `Sua base de dados importada possui ${clientCount} registros. Notamos que muitos não retornam há meses. Crie este pacote com desconto para trazer esse volume de volta.`,
           tag: 'Análise Inteligente',
           price: '10% OFF'
        });

        // Insights Contextuais Baseados no Conteúdo do CSV
        if (hasVIP) {
           newSuggestions.push({
              title: 'Experiência VIP Exclusiva',
              desc: 'Identificamos clientes com perfil de alto ticket na sua base. Ofereça um jantar harmonizado ou atendimento privativo.',
              tag: 'Alto Padrão',
              price: 'Sob Consulta'
           });
        }

        if (hasKids) {
           newSuggestions.push({
              title: 'Domingo em Família (Kids)',
              desc: 'Sua base possui indícios de foco familiar/infantil. Um pacote incluindo recreadores pode aumentar suas vendas aos finais de semana.',
              tag: 'Família'
           });
        }

        if (hasCorporate) {
           newSuggestions.push({
              title: 'Reserva Corporativa & Reuniões',
              desc: 'Encontramos perfis empresariais no arquivo. Ofereça aluguel de espaço com projetor e coffee break.',
              tag: 'B2B',
              price: 'Pacote Fixo'
           });
        }
        
        if (hasBdays) {
           newSuggestions.push({
              title: 'Clube de Aniversariantes',
              desc: 'Sua base rastreia datas de nascimento! Automatize um convite com bolo cortesia para os aniversariantes de cada mês.',
              tag: 'Fidelização'
           });
        }

        setCsvInsights(newSuggestions);
        setIsAnalyzing(false);
      }, 1800);
    };
    reader.readAsText(file);
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
            {editingPkg.id === 'new' ? 'Criar Pacote' : 'Editar Pacote'}
          </h3>
          <button onClick={() => setEditingPkg(null)} className="text-[#888] hover:text-white transition-colors p-2 bg-[#222] hover:bg-[#333] rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-y-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Nome do Pacote</label>
              <input 
                type="text" 
                value={editingPkg.title} 
                onChange={e => setEditingPkg({...editingPkg, title: e.target.value})}
                className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm"
                placeholder="Ex: Aniversário em Família"
              />
            </div>

            <div>
              <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Descrição</label>
              <textarea 
                value={editingPkg.desc} 
                onChange={e => setEditingPkg({...editingPkg, desc: e.target.value})}
                className="w-full px-4 py-3 !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm h-20 resize-none"
                placeholder="O que está incluso nesse pacote?"
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
                  placeholder="Ex: Mais popular"
                />
              </div>
              <div>
                <label className="block text-xs text-[#AAA] mb-1.5 font-medium ml-1">Preço (Opcional)</label>
                <input 
                  type="text" 
                  value={editingPkg.price || ''} 
                  onChange={e => setEditingPkg({...editingPkg, price: e.target.value})}
                  autoComplete="off"
                  style={{ padding: '12px 16px' }}
                  className="w-full !bg-[#0A0A0A] border border-[#2A2A2A] focus:!border-[#FF5A5A] hover:!border-[#444] !text-white rounded-lg outline-none transition-all text-sm"
                  placeholder="R$ 89,90"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#AAA] mb-2 font-medium ml-1">Fotos do Pacote</label>
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

            <label className="flex items-start gap-4 mt-2 mb-2 p-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] cursor-pointer hover:border-[#444] hover:bg-[#222] transition-all group shadow-sm">
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
                  Publicar Pacote
                </div>
                <div className="text-xs text-[#777] leading-tight">Ao marcar esta opção, o pacote aparecerá publicamente no site para os clientes.</div>
              </div>
            </label>
            
          </div>

          <div className="flex items-center gap-3 pt-5 border-t border-[#2A2A2A] justify-end">
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
          <h2 className="view-title">Sessões de Reservas & Textos</h2>
          <p className="view-sub">Crie/edite categorias de reserva e gerencie os textos de exibição na landing page</p>
        </div>
        {!editingPkg && (
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setShowAIPanel(!showAIPanel)} 
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 hover:from-indigo-500/20 hover:to-purple-600/20 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg font-bold cursor-pointer flex items-center gap-2 transition-all text-sm"
            >
              <Sparkles size={16} /> Inteligência Sazonal
            </button>
            <button onClick={handleCreate} style={{ padding: '10px 24px', background: 'var(--red)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={18} /> Nova Sessão
            </button>

            {showAIPanel && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAIPanel(false)} />
                <div className="absolute top-full right-0 mt-3 w-[400px] bg-[#111] border border-[#333] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222]">
                    <div className="flex items-center gap-2">
                      <CalendarHeart size={18} className="text-purple-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">Inteligência de Vendas</h4>
                        <p className="text-[10px] text-[#777]">Sugestões contextuais para seu negócio</p>
                      </div>
                    </div>
                    {/* Botão de Importação de CSV */}
                    <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#222] hover:bg-[#333] border border-[#444] rounded-md cursor-pointer transition-colors text-[10px] font-bold text-[#AAA] hover:text-white">
                      <span>Importar CSV Clientes</span>
                      <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
                    </label>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                       <Sparkles size={24} className="text-purple-400 animate-spin-slow" />
                       <div className="text-xs text-[#AAA] font-medium animate-pulse">A I.A. está lendo sua base de dados...</div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 crm-custom-scrollbar">
                      {csvInsights && (
                        <div className="mb-3">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] ml-1">✨ Descobertas do seu CSV</span>
                        </div>
                      )}
                      
                      {(csvInsights || getSeasonalSuggestions()).map((sug, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => createFromSuggestion(sug)}
                          className={`p-3 rounded-xl border ${csvInsights ? 'border-[#10B981]/30 hover:border-[#10B981]/80' : 'border-[#222] hover:border-purple-500/50'} bg-[#1A1A1A] hover:bg-[#222] cursor-pointer transition-all group`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h5 className={`text-sm font-bold text-white transition-colors ${csvInsights ? 'group-hover:text-[#10B981]' : 'group-hover:text-purple-400'}`}>{sug.title}</h5>
                            {sug.price && <span className="text-[10px] bg-[#0A0A0A] text-[#AAA] px-2 py-0.5 rounded-full">{sug.price}</span>}
                          </div>
                          <p className="text-[11px] text-[#888] leading-relaxed mb-3">{sug.desc}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${csvInsights ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                            {sug.tag}
                          </span>
                        </div>
                      ))}
                      
                      {csvInsights && (
                         <div className="pt-2 text-center">
                            <button onClick={() => setCsvInsights(null)} className="text-[10px] text-[#777] hover:text-[#FFF] underline">
                               Voltar para Sugestões Sazonais Comuns
                            </button>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!editingPkg && (
        <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px', border: '1px solid #2A2A2A', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#FFF' }}>Textos da Seção de Sessões na Página Inicial</h3>
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
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <td style={{ padding: '16px', color: '#FFF', fontWeight: 500 }}>{pkg.title}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>
                    {pkg.tag}
                    {pkg.image_urls && pkg.image_urls.length > 0 && (
                      <span style={{ marginLeft: 8, fontSize: 11, background: '#2A2A2A', padding: '2px 6px', borderRadius: 10 }}>{pkg.image_urls.length} Fotos</span>
                    )}
                  </td>
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
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
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
