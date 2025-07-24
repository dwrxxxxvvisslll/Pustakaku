import { supabase } from './supabase';

interface BookData {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status?: string;
  notes?: string;
  isFavorite?: boolean;
}

interface UpdateBookData {
  status?: string;
  notes?: string;
  isFavorite?: boolean;
}

export async function getUserBooks() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };

  return await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id);
}

// Fungsi baru untuk mendapatkan hanya buku favorit
export async function getFavoriteBooks() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };

  return await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_favorite', true);
}

export async function addBook(bookData: BookData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };

  return await supabase
    .from('books')
    .insert([
      {
        user_id: user.id,
        book_id: bookData.id,
        title: bookData.title,
        author: bookData.author,
        cover_url: bookData.coverUrl,
        status: bookData.status || 'want_to_read',
        notes: bookData.notes || '',
        is_favorite: bookData.isFavorite || false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
}

export async function updateBook(id: number, bookData: UpdateBookData) {
  return await supabase
    .from('books')
    .update({
      status: bookData.status,
      notes: bookData.notes,
      is_favorite: bookData.isFavorite,
      updated_at: new Date()
    })
    .eq('id', id);
}

export async function deleteBook(id: number) {
  return await supabase
    .from('books')
    .delete()
    .eq('id', id);
}

// Fungsi untuk toggle favorit
export async function toggleFavorite(bookId: string, isFavorite: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };

  return await supabase
    .from('books')
    .update({
      is_favorite: isFavorite,
      updated_at: new Date()
    })
    .eq('book_id', bookId)
    .eq('user_id', user.id);
}

// Fungsi untuk cek apakah buku favorit
export async function checkIfFavorite(bookId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };

  const { data, error } = await supabase
    .from('books')
    .select('is_favorite')
    .eq('book_id', bookId)
    .eq('user_id', user.id)
    .single();

  return { data: data?.is_favorite || false, error };
}