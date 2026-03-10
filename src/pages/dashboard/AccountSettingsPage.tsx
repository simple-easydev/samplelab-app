import { useState } from 'react';
import {
  User,
  Pencil,
  Eye,
  EyeOff,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SettingsTabs } from './SettingsTabs';

function ProfileAvatar() {
  return (
    <div className="relative shrink-0 size-[120px]">
      <div className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-full size-full flex items-center justify-center">
        <User className="size-12 text-[#7f7766]" />
      </div>
      <button
        type="button"
        className="absolute top-0 right-0 bg-[#161410] text-[#fffbf0] flex items-center justify-center size-10 rounded-full hover:opacity-90 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-[#161410]/40 focus-visible:ring-offset-2"
        aria-label="Edit profile photo"
      >
        <Pencil className="size-5" />
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-base font-medium text-[#5e584b] leading-6">
        {label}
      </label>
      {children}
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  helperText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  helperText?: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-base font-medium text-[#5e584b] leading-6">
        {label}
      </label>
      <div className="flex h-12 items-center gap-2 border border-[#d6ceb8] rounded-xs px-3 bg-white">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-sm text-[#161410] placeholder:text-[#7f7766] outline-none"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="shrink-0 p-1 text-[#5e584b] hover:text-[#161410]"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
      {helperText && (
        <p className="text-xs text-[#7f7766] tracking-[0.2px]">{helperText}</p>
      )}
    </div>
  );
}

export default function AccountSettingsPage() {
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Johnson');
  const [displayName, setDisplayName] = useState('alexbeats');
  const [email, setEmail] = useState('your@email.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClass =
    'h-12 border border-[#d6ceb8] rounded-xs px-3 text-sm text-[#161410] placeholder:text-[#7f7766] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161410]/20 focus-visible:border-[#161410]';

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-8">
        <SettingsTabs />

        <div className="flex flex-col gap-6">
          {/* Profile */}
          <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            Profile
          </h1>
          <ProfileAvatar />
          <div className="flex flex-col gap-5 w-full">
            <Field label="First name">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Last name">
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Display name">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Button
              type="button"
              className="h-12 px-4 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-base rounded-xs"
            >
              Save changes
            </Button>
          </div>
        </div>

        {/* Security */}
        <div className="flex flex-col gap-8">
          <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            Security
          </h2>
          <div className="flex flex-col gap-5 w-full">
            <PasswordField
              label="Current password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              showPassword={showCurrentPassword}
              onToggleVisibility={() =>
                setShowCurrentPassword((v) => !v)
              }
            />
            <PasswordField
              label="New password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={setNewPassword}
              showPassword={showNewPassword}
              onToggleVisibility={() => setShowNewPassword((v) => !v)}
              helperText="At least 8 characters"
            />
            <PasswordField
              label="Confirm password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              showPassword={showConfirmPassword}
              onToggleVisibility={() =>
                setShowConfirmPassword((v) => !v)
              }
            />
            <Button
              type="button"
              className="h-12 px-4 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-base rounded-xs"
            >
              Update password
            </Button>
          </div>
        </div>

        {/* Account actions */}
        <div className="flex flex-col gap-8">
          <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            Account actions
          </h2>
          <div className="flex flex-col gap-0 w-full">
            <button
              type="button"
              onClick={() => {
                // TODO: wire sign-out
              }}
              className="flex items-center gap-2 py-2 text-[#161410] font-medium text-base hover:underline"
            >
              <ArrowRight className="size-6 shrink-0" />
              Log out
            </button>
            <div className="h-px w-full bg-[#e8e2d2] my-2" />
            <button
              type="button"
              className="flex items-center gap-2 py-2 text-[#b3402d] font-medium text-base hover:underline"
            >
              <Trash2 className="size-6 shrink-0" />
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
