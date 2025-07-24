import { supabase } from './supabase';

interface ProfileData {
  fullName: string;
  bio: string;
  avatarUrl: string;
}

export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };

  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
}

export async function updateUserProfile(profileData: ProfileData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };

  return await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: profileData.fullName,
      bio: profileData.bio,
      avatar_url: profileData.avatarUrl,
      updated_at: new Date()
    });
}