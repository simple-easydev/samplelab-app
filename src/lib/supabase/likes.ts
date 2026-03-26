import { supabase } from './client';

async function getSessionUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === '23505';
}

// --- Samples ---

export async function isSampleLiked(sampleId: string): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) return false;
  const { data, error } = await supabase
    .from('user_sample_likes')
    .select('sample_id')
    .eq('user_id', userId)
    .eq('sample_id', sampleId)
    .maybeSingle();
  if (error) return false;
  return data != null;
}

export async function likeSample(
  sampleId: string
): Promise<{ ok: true } | { error: string }> {
  const userId = await getSessionUserId();
  if (!userId) return { error: 'Sign in to save favorites.' };
  const { error } = await supabase.from('user_sample_likes').insert({
    user_id: userId,
    sample_id: sampleId,
  });
  if (error && !isUniqueViolation(error)) {
    return { error: error.message };
  }
  return { ok: true };
}

export async function unlikeSample(
  sampleId: string
): Promise<{ ok: true } | { error: string }> {
  const userId = await getSessionUserId();
  if (!userId) return { error: 'Sign in to save favorites.' };
  const { error } = await supabase
    .from('user_sample_likes')
    .delete()
    .eq('user_id', userId)
    .eq('sample_id', sampleId);
  if (error) return { error: error.message };
  return { ok: true };
}

// --- Packs ---

export async function isPackLiked(packId: string): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) return false;
  const { data, error } = await supabase
    .from('user_pack_likes')
    .select('pack_id')
    .eq('user_id', userId)
    .eq('pack_id', packId)
    .maybeSingle();
  if (error) return false;
  return data != null;
}

export async function likePack(
  packId: string
): Promise<{ ok: true } | { error: string }> {
  const userId = await getSessionUserId();
  if (!userId) return { error: 'Sign in to save favorites.' };
  const { error } = await supabase.from('user_pack_likes').insert({
    user_id: userId,
    pack_id: packId,
  });
  if (error && !isUniqueViolation(error)) {
    return { error: error.message };
  }
  return { ok: true };
}

export async function unlikePack(
  packId: string
): Promise<{ ok: true } | { error: string }> {
  const userId = await getSessionUserId();
  if (!userId) return { error: 'Sign in to save favorites.' };
  const { error } = await supabase
    .from('user_pack_likes')
    .delete()
    .eq('user_id', userId)
    .eq('pack_id', packId);
  if (error) return { error: error.message };
  return { ok: true };
}
