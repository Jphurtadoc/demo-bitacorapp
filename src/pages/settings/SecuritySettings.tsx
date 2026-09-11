import { useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, Circle, Eye, EyeOff, KeyRound, Shield } from 'lucide-react';

const DEMO_CURRENT_PASSWORD = 'Admin123*';

const inputClassName =
  'w-full rounded-xl border border-border bg-surface px-3 py-2.5 pr-11 text-sm font-medium text-foreground outline-none transition-colors focus:border-border focus:ring-2 focus:ring-brand/10';

const inputErrorClassName =
  'w-full rounded-xl border border-red-300 bg-red-50/40 px-3 py-2.5 pr-11 text-sm font-medium text-foreground outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:focus:border-red-400 dark:focus:ring-red-500/20';

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  visible: boolean;
  onToggleVisible: () => void;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  visible,
  onToggleVisible,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-subtle"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={error ? inputErrorClassName : inputClassName}
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-subtle transition-colors hover:text-foreground"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}

function getPasswordRules(password: string) {
  return [
    { id: 'length', label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { id: 'upper', label: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
    { id: 'number', label: 'Un número', met: /\d/.test(password) },
    { id: 'special', label: 'Un carácter especial', met: /[^A-Za-z0-9]/.test(password) },
  ];
}

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const rules = useMemo(() => getPasswordRules(newPassword), [newPassword]);
  const allRulesMet = rules.every((rule) => rule.met);

  const toggleVisible = (field: keyof typeof visible) => {
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSuccess(false);

    const nextErrors: Record<string, string> = {};

    if (!currentPassword) {
      nextErrors.currentPassword = 'Ingresa tu contraseña actual.';
    } else if (currentPassword !== DEMO_CURRENT_PASSWORD) {
      nextErrors.currentPassword = 'La contraseña actual no es correcta.';
    }

    if (!newPassword) {
      nextErrors.newPassword = 'Ingresa una nueva contraseña.';
    } else if (!allRulesMet) {
      nextErrors.newPassword = 'La nueva contraseña no cumple los requisitos.';
    } else if (newPassword === currentPassword) {
      nextErrors.newPassword = 'La nueva contraseña debe ser distinta a la actual.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirma la nueva contraseña.';
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccess(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-primary/15 dark:text-primary">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="page-section-title mb-1 text-xl">Seguridad</h3>
          <p className="text-sm text-subtle">
            Actualiza tu contraseña para proteger el acceso a tu cuenta.
          </p>
        </div>
      </div>

      {success ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>
            Contraseña actualizada. En el entorno de demostración el cambio queda registrado
            solo en esta sesión.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <PasswordField
          id="current-password"
          label="Contraseña actual"
          value={currentPassword}
          onChange={(value) => {
            setCurrentPassword(value);
            setErrors((prev) => ({ ...prev, currentPassword: '' }));
            setSuccess(false);
          }}
          error={errors.currentPassword}
          autoComplete="current-password"
          visible={visible.current}
          onToggleVisible={() => toggleVisible('current')}
        />

        <PasswordField
          id="new-password"
          label="Nueva contraseña"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value);
            setErrors((prev) => ({ ...prev, newPassword: '' }));
            setSuccess(false);
          }}
          error={errors.newPassword}
          autoComplete="new-password"
          visible={visible.next}
          onToggleVisible={() => toggleVisible('next')}
        />

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className={`flex items-center gap-2 text-xs font-medium ${
                rule.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-subtle'
              }`}
            >
              {rule.met ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {rule.label}
            </li>
          ))}
        </ul>

        <PasswordField
          id="confirm-password"
          label="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            setSuccess(false);
          }}
          error={errors.confirmPassword}
          autoComplete="new-password"
          visible={visible.confirm}
          onToggleVisible={() => toggleVisible('confirm')}
        />

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-sm font-bold text-[#ffffff] shadow-sm transition-opacity hover:opacity-90 dark:bg-primary dark:hover:bg-primary-hover"
          >
            <KeyRound size={16} />
            Cambiar contraseña
          </button>
        </div>
      </form>
    </div>
  );
}
