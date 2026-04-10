import { useState } from 'react';
import { Package, Reservation, FormErrors } from '@/types/reservation';
import { BUFFETS, EVENT_TYPES } from '@/lib/constants';
import BuffetOption from './BuffetOption';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

interface ReservationFormProps {
  form: Reservation;
  errors: FormErrors;
  packages: Package[];
  selectedPackage: string | null;
  onFormChange: (updates: Partial<Reservation>) => void;
  onSubmit: () => void;
}

export default function ReservationForm({
  form,
  errors,
  packages,
  selectedPackage,
  onFormChange,
  onSubmit,
}: ReservationFormProps) {
  const [step, setStep] = useState(1);
  const selectedPkg = packages.find((p) => p.id === selectedPackage);
  const todayStr = new Date().toISOString().split('T')[0];

  const handlePhoneChange = (val: string) => {
    let clean = val.replace(/\D/g, "");
    if (clean.length > 11) clean = clean.slice(0, 11);
    
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `(${clean.slice(0, 2)}) `;
      if (clean.length > 7) {
        formatted += `${clean.slice(2, 7)}-${clean.slice(7)}`;
      } else {
        formatted += clean.slice(2);
      }
    }
    onFormChange({ phone: formatted });
  };

  const isVisible = (fieldKey: string) => {
    if (!selectedPkg || !selectedPkg.visible_fields) return true;
    return selectedPkg.visible_fields.includes(fieldKey);
  };

  const validateStep1 = () => {
    return form.name.trim() !== '' && form.phone.length >= 14;
  };

  return (
    <div className="section-form p-0 max-w-full bg-transparent" id="form-section">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#111] mb-2 tracking-tight">Finalizar reserva</h2>
        <p className="text-[#666] text-sm">
          {step === 1 ? "Inicie com seus dados principais." : "Preencha os detalhes da sua reserva."}
        </p>
      </div>

      {selectedPkg && (
        <div className="form-pkg-active uppercase text-xs tracking-wider">
          Pacote: <strong>{selectedPkg.title}</strong>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-[#7A1515]' : 'bg-[#E2D0C0]'}`} />
        <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#7A1515]' : 'bg-[#E2D0C0]'}`} />
      </div>

      <div className="relative overflow-hidden min-h-[300px]">
        {/* Step 1: Contato e Convidados */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="field">
              <label className="lbl">Seu Nome</label>
              <input
                type="text"
                value={form.name}
                autoComplete="off"
                spellCheck="false"
                onChange={(e) => onFormChange({ name: e.target.value })}
                placeholder="Ex: João da Silva"
                className={errors.name ? 'err' : ''}
              />
              {errors.name && <p className="err-msg">{errors.name}</p>}
            </div>

            <div className="field">
              <label className="lbl">WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                autoComplete="off"
                spellCheck="false"
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(00) 00000-0000"
                className={errors.phone ? 'err' : ''}
              />
              {errors.phone && <p className="err-msg">{errors.phone}</p>}
            </div>

            {/* Removed guests field */}

            <button 
              className="btn-primary flex items-center justify-center gap-2 mt-4" 
              onClick={() => {
                if(validateStep1()) setStep(2);
                else {
                  if(!form.name) onFormChange({ name: form.name }); // Triggers generic react revalidation visually if needed
                  toast?.error && toast.error("Preencha todos os campos corretamente.");
                }
              }}
              disabled={!validateStep1()}
              style={{ opacity: validateStep1() ? 1 : 0.6 }}
            >
              Avançar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Detalhes do Evento */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="row2">
              <div className="field">
                <label className="lbl">Data</label>
                <input
                  type="date"
                  min={todayStr}
                  value={form.date}
                  onChange={(e) => onFormChange({ date: e.target.value })}
                  className={`w-full ${errors.date ? 'err' : ''}`}
                />
                {errors.date && <p className="err-msg">{errors.date}</p>}
              </div>
              <div className="field">
                <label className="lbl">Horário</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => onFormChange({ time: e.target.value })}
                  className={`w-full ${errors.time ? 'err' : ''}`}
                />
                {errors.time && <p className="err-msg">{errors.time}</p>}
              </div>
            </div>

            {isVisible('eventType') && (
              <div className="field">
                <label className="lbl">Qual é o motivo da reserva?</label>
                <Select value={form.eventType} onValueChange={(val) => onFormChange({ eventType: val, birthday: false })}>
                  <SelectTrigger className={`h-[54px] w-full bg-[var(--glass-bg)] border border-[var(--border)] rounded-2xl text-[16px] px-[20px] shadow-sm hover:border-[#7A1515] transition-colors focus:ring-2 focus:ring-[#7A1515]/20 focus:border-[#7A1515] ${errors.eventType ? 'border-[#C41E3A]' : ''}`}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E2D0C0] rounded-xl shadow-xl z-[1000]">
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="cursor-pointer font-medium hover:bg-[#F5E6D3] m-1 rounded-lg">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.eventType && <p className="err-msg">{errors.eventType}</p>}
              </div>
            )}

            {isVisible('buffet') && (
              <div className="field mt-6">
                <label className="lbl mb-3">Preferência de Formato e Cardápio</label>
                <div className="flex flex-col gap-3">
                  {BUFFETS.map((buffet) => (
                    <BuffetOption
                      key={buffet.value}
                      option={buffet}
                      isSelected={form.buffet === buffet.value}
                      onSelect={() => onFormChange({ buffet: buffet.value })}
                    />
                  ))}
                </div>
                {errors.buffet && <p className="err-msg">{errors.buffet}</p>}
              </div>
            )}

            {isVisible('notes') && (
              <div className="field mt-6">
                <label className="lbl">
                  Observações / Dúvidas Especiais <span className="text-[#8A7569]/60 font-normal normal-case">(Opcional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => onFormChange({ notes: e.target.value })}
                  placeholder="Restrições alimentares, dúvidas do pacote..."
                  className="resize-none"
                ></textarea>
              </div>
            )}

            <div className="flex gap-4 mt-6 pt-4 border-t border-[var(--border)]">
              <button 
                className="flex items-center justify-center w-12 h-[56px] rounded-2xl border border-[var(--border)] text-[#666] hover:bg-[#F5E6D3] transition-colors shrink-0" 
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={20} />
              </button>
              <button className="btn-primary flex-1" onClick={onSubmit}>
                Confirmar Solicitação
              </button>
            </div>
            <p className="text-xs text-center text-[#888] mt-4 font-medium">Nossa equipe responderá com rápidez via WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
