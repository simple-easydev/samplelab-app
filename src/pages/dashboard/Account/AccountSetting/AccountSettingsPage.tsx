import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import {
  User,
  Pencil,
  Eye,
  EyeOff,
  ArrowRight,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SettingsTabs } from '../SettingsTabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { authManager } from '@/lib/supabase/auth-manager';
import { toast } from 'sonner';

const AVATAR_BUCKET = 'avatars' as const;

type UserProfileRow = {
  name: string | null;
  email: string;
  avatar_url: string | null;
};

type EditableProfile = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
};

function getProfileFromSession(
  user: NonNullable<ReturnType<typeof useAuth>['session']>['user'],
  profile?: UserProfileRow | null
): EditableProfile {
  const metadata = user.user_metadata ?? {};
  const firstName = String(metadata.first_name ?? '').trim();
  const lastName = String(metadata.last_name ?? '').trim();
  const metadataDisplayName = String(
    metadata.display_name ?? metadata.username ?? ''
  ).trim();
  const combinedName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const profileName = (profile?.name ?? '').trim();

  return {
    firstName,
    lastName,
    displayName: metadataDisplayName || profileName || combinedName,
    email: profile?.email ?? user.email ?? '',
    avatarUrl:
      profile?.avatar_url ??
      (typeof metadata.avatar_url === 'string' ? metadata.avatar_url : null),
  };
}

function ProfileAvatar({
  avatarUrl,
  uploading,
  onEdit,
}: {
  avatarUrl: string | null;
  uploading: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="relative shrink-0 size-[120px]">
      <div className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-full size-full flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile avatar"
            className="size-full object-cover"
          />
        ) : (
          <User className="size-12 text-[#7f7766]" />
        )}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-[#161410]/45 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-[#fffbf0]" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onEdit}
        disabled={uploading}
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
  const { session, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initialProfile, setInitialProfile] = useState<EditableProfile | null>(
    null
  );
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClass =
    'h-12 border border-[#d6ceb8] rounded-xs px-3 text-sm text-[#161410] placeholder:text-[#7f7766] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161410]/20 focus-visible:border-[#161410]';

  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const normalizedDisplayName = displayName.trim();
  const normalizedEmail = email.trim();
  const normalizedCurrentPassword = currentPassword.trim();
  const normalizedNewPassword = newPassword.trim();
  const normalizedConfirmPassword = confirmPassword.trim();

  const hasProfileChanges =
    normalizedFirstName !== (initialProfile?.firstName ?? '') ||
    normalizedLastName !== (initialProfile?.lastName ?? '') ||
    normalizedDisplayName !== (initialProfile?.displayName ?? '') ||
    normalizedEmail !== (initialProfile?.email ?? '');

  /** At least one of first/last is filled but the other is empty (Option A still requires both). */
  const hasOnlyOneNameFieldFilled = Boolean(
    (normalizedFirstName && !normalizedLastName) ||
      (!normalizedFirstName && normalizedLastName)
  );

  const canSaveProfile =
    (hasProfileChanges || hasOnlyOneNameFieldFilled) &&
    Boolean(session) &&
    !isLoading &&
    isProfileLoaded &&
    !isProfileSaving;

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!session?.user) {
        if (!cancelled) {
          setFirstName('');
          setLastName('');
          setDisplayName('');
          setEmail('');
          setAvatarUrl(null);
          setInitialProfile(null);
          setIsProfileLoaded(true);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('name, email, avatar_url')
          .eq('id', session.user.id)
          .maybeSingle<UserProfileRow>();

        if (error) {
          throw error;
        }

        if (!cancelled) {
          const nextProfile = getProfileFromSession(session.user, data);
          setFirstName(nextProfile.firstName);
          setLastName(nextProfile.lastName);
          setDisplayName(nextProfile.displayName);
          setEmail(nextProfile.email);
          setAvatarUrl(nextProfile.avatarUrl);
          setInitialProfile(nextProfile);
          setIsProfileLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load account profile:', error);
        if (!cancelled) {
          const fallbackProfile = getProfileFromSession(session.user, null);
          setFirstName(fallbackProfile.firstName);
          setLastName(fallbackProfile.lastName);
          setDisplayName(fallbackProfile.displayName);
          setEmail(fallbackProfile.email);
          setAvatarUrl(fallbackProfile.avatarUrl);
          setInitialProfile(fallbackProfile);
          setIsProfileLoaded(true);
        }
      }
    }

    setIsProfileLoaded(false);
    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session]);

  async function uploadAvatar(file: File) {
    if (!session?.user) {
      toast.error('You need to be signed in to update your avatar.');
      return;
    }

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Please choose an image file.');
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('Please choose an image under 5 MB.');
      return;
    }

    setIsAvatarUploading(true);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `customers/${session.user.id}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

      const avatarValue = `${publicUrl}?t=${Date.now()}`;
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          avatar_url: avatarValue,
        },
      });

      if (authError) {
        throw authError;
      }

      const { error: profileError } = await supabase
        .from('users')
        .update({ avatar_url: avatarValue })
        .eq('id', session.user.id);

      if (profileError) {
        throw profileError;
      }

      await authManager.refreshUserData();
      setAvatarUrl(avatarValue);
      toast.success('Profile photo updated.');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload avatar.'
      );
    } finally {
      setIsAvatarUploading(false);
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    await uploadAvatar(file);
  }

  function onProfileFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void handleSaveProfile();
  }

  async function handleSaveProfile() {
    if (!session?.user) {
      toast.error('You need to be signed in to update your account.');
      return;
    }

    if (!canSaveProfile) {
      return;
    }

    if (!normalizedFirstName || !normalizedLastName) {
      toast.error('First and last name are required.');
      return;
    }

    if (!normalizedDisplayName) {
      toast.error('Display name is required.');
      return;
    }

    if (!normalizedEmail) {
      toast.error('Email is required.');
      return;
    }

    setIsProfileSaving(true);

    try {
      const fullName = `${normalizedFirstName} ${normalizedLastName}`.trim();
      const metadata = {
        ...session.user.user_metadata,
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        display_name: normalizedDisplayName,
        full_name: fullName,
        name: fullName,
      };

      const emailChanged = normalizedEmail !== (session.user.email ?? '');
      const { error: authError } = await supabase.auth.updateUser({
        ...(emailChanged ? { email: normalizedEmail } : {}),
        data: metadata,
      });

      if (authError) {
        throw authError;
      }

      const { error: profileError } = await supabase
        .from('users')
        .update({
          name: normalizedDisplayName,
          email: normalizedEmail,
        })
        .eq('id', session.user.id);

      if (profileError) {
        throw profileError;
      }

      await authManager.refreshUserData();
      const { data: authRes, error: getUserError } = await supabase.auth.getUser();
      if (getUserError) {
        throw getUserError;
      }
      const u = authRes.user;
      if (u) {
        const { data: row, error: rowError } = await supabase
          .from('users')
          .select('name, email, avatar_url')
          .eq('id', u.id)
          .maybeSingle<UserProfileRow>();
        if (rowError) {
          throw rowError;
        }
        const nextProfile = getProfileFromSession(u, row);
        setFirstName(nextProfile.firstName);
        setLastName(nextProfile.lastName);
        setDisplayName(nextProfile.displayName);
        setEmail(nextProfile.email);
        setAvatarUrl(nextProfile.avatarUrl);
        setInitialProfile(nextProfile);
      } else {
        setInitialProfile({
          firstName: normalizedFirstName,
          lastName: normalizedLastName,
          displayName: normalizedDisplayName,
          email: normalizedEmail,
          avatarUrl,
        });
      }

      if (emailChanged) {
        toast.success('Profile updated', {
          description: 'Check your inbox to confirm the new email if required.',
        });
      } else {
        toast.success('Profile updated');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to update profile', {
        description: error instanceof Error ? error.message : 'Failed to save profile.',
      });
    } finally {
      setIsProfileSaving(false);
    }
  }

  async function handleUpdatePassword() {
    if (!session?.user) {
      toast.error('You need to be signed in to update your password.');
      return;
    }

    if (!normalizedNewPassword) {
      toast.error('Please enter a new password.');
      return;
    }

    if (normalizedNewPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (normalizedNewPassword !== normalizedConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsPasswordSaving(true);

    try {
      const emailForReauth = session.user.email ?? normalizedEmail;
      if (emailForReauth && normalizedCurrentPassword) {
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: emailForReauth,
          password: normalizedCurrentPassword,
        });

        if (reauthError) {
          throw new Error('Current password is incorrect.');
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: normalizedNewPassword,
      });

      if (error) {
        throw error;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated.');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update password.'
      );
    } finally {
      setIsPasswordSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-8">
        <SettingsTabs />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <div className="flex flex-col gap-6">
          {/* Profile */}
          <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            Profile
          </h1>
          <ProfileAvatar
            avatarUrl={avatarUrl}
            uploading={isAvatarUploading}
            onEdit={() => fileInputRef.current?.click()}
          />
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={onProfileFormSubmit}
          >
            <Field label="First name">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                disabled={!session || isLoading || !isProfileLoaded}
              />
            </Field>
            <Field label="Last name">
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                disabled={!session || isLoading || !isProfileLoaded}
              />
            </Field>
            <Field label="Display name">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
                disabled={!session || isLoading || !isProfileLoaded}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                disabled={!session || isLoading || !isProfileLoaded}
              />
            </Field>
            <Button
              type="submit"
              disabled={!canSaveProfile}
              className="h-12 px-4 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-base rounded-xs"
            >
              {isProfileSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
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
              onClick={handleUpdatePassword}
              disabled={
                !session ||
                isLoading ||
                isPasswordSaving ||
                !normalizedNewPassword ||
                normalizedNewPassword !== normalizedConfirmPassword
              }
              className="h-12 px-4 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-base rounded-xs"
            >
              {isPasswordSaving ? 'Updating...' : 'Update password'}
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
