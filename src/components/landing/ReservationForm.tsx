import { Package, Reservation, FormErrors } from '@/types/reservation';
import { BUFFETS, EVENT_TYPES } from '@/lib/constants';
import { getMinDate, detectPeriod } from '@/lib/utils';
import BuffetOption from './BuffetOption';

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
  const minDate = getMinDate(form.guests);
  const period = detectPeriod(form.time);
  const selectedPkg = packages.find((p) => p.id === selectedPackage);
  const guestCount = parseInt(form.guests) || 0;

  const isVisible = (fieldKey: string) => {
    if (!selectedPkg || !selectedPkg.visible_fields) return true;
    return selectedPkg.visible_fields.includes(fieldKey);
  };

  return (
    <div className="section-form" id="form-section">
      <div className="form-header">
        <h2>Solicitar reserva</h2>
        <p>Preencha os dados e nossa equipe confirmará pelo WhatsApp.</p>
      </div>

      {selectedPkg && (
        <div className="form-pkg-active">
          Pacote selecionado: <strong>{selectedPkg.title}</strong>
        </div>
      )}

      <div className="row2">
        <div className="field">
          <label className="lbl">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            placeholder="Seu nome"
            className={errors.name ? 'err' : ''}
          />
          {errors.name && <p className="err-msg">{errors.name}</p>}
        </div>
        <div className="field">
          <label className="lbl">WhatsApp</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => onFormChange({ phone: e.target.value })}
            placeholder="(35) 99999-9999"
            className={errors.phone ? 'err' : ''}
          />
          {errors.phone && <p className="err-msg">{errors.phone}</p>}
        </div>
      </div>

      {isVisible('guests') && (
        <div className="field">
          <label className="lbl">Número de pessoas</label>
          <input
            type="number"
            min="1"
            max="100"
            value={form.guests}
            onChange={(e) => onFormChange({ guests: e.target.value })}
            placeholder="Ex: 25"
            className={errors.guests ? 'err' : ''}
          />
          {errors.guests ? (
            <p className="err-msg">{errors.guests}</p>
          ) : (
            form.guests && (
              <p className="hint">
                {guestCount > 20
                  ? '⚠ Antecedência mínima: 2 dias'
                  : '✓ Antecedência mínima: 1 dia'}
              </p>
            )
          )}
        </div>
      )}

      <div className="row2">
        <div className="field">
          <label className="lbl">Data</label>
          <input
            type="date"
            min={minDate}
            value={form.date}
            onChange={(e) => onFormChange({ date: e.target.value })}
            className={errors.date ? 'err' : ''}
          />
          {errors.date && <p className="err-msg">{errors.date}</p>}
        </div>
        <div className="field">
          <label className="lbl">Horário</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => onFormChange({ time: e.target.value })}
            className={errors.time ? 'err' : ''}
          />
          {errors.time ? (
            <p className="err-msg">{errors.time}</p>
          ) : (
            period && (
              <p className="hint">
                {period === 'noturno' ? '🌙 Noturno · sem taxa' : '☀️ Diurno · taxa aplicável'}
              </p>
            )
          )}
        </div>
      </div>

      {isVisible('eventType') && (
        <div className="field">
          <label className="lbl">Tipo de evento</label>
          <select
            value={form.eventType}
            onChange={(e) => onFormChange({ eventType: e.target.value, birthday: false })}
            className={errors.eventType ? 'err' : ''}
          >
            <option value="">Selecione...</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.eventType && <p className="err-msg">{errors.eventType}</p>}
        </div>
      )}

      {isVisible('birthday') && form.eventType === 'Aniversário' && (
        <div className="bday-row">
          <input
            type="checkbox"
            id="bday"
            checked={form.birthday}
            onChange={(e) => onFormChange({ birthday: e.target.checked })}
          />
          <label htmlFor="bday">
            Tem aniversariante na mesa?{' '}
            <span style={{ fontSize: '12px', color: 'var(--red)' }}>
              (ganha pizza broto doce · mesas com 12+ pessoas)
            </span>
          </label>
        </div>
      )}

      {isVisible('buffet') && (
        <div className="field">
          <label className="lbl">Cardápio</label>
          {BUFFETS.map((buffet) => (
            <BuffetOption
              key={buffet.value}
              option={buffet}
              isSelected={form.buffet === buffet.value}
              onSelect={() => onFormChange({ buffet: buffet.value })}
            />
          ))}
          {errors.buffet && <p className="err-msg">{errors.buffet}</p>}
        </div>
      )}

      {isVisible('notes') && (
        <div className="field">
          <label className="lbl">
            Observações <span className="opt">(opcional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => onFormChange({ notes: e.target.value })}
            placeholder="Ex: vou levar bolo e enfeites..."
          ></textarea>
        </div>
      )}

      <div className="info-box">
        ℹ️ Pagamento somente à vista &nbsp;·&nbsp; Pode trazer bolo, docinhos e enfeites
        &nbsp;·&nbsp; Eventos com música exclusivamente familiar
      </div>

      <button className="btn-primary" onClick={onSubmit}>
        Solicitar reserva
      </button>
    </div>
  );
}
