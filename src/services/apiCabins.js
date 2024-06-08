import supabase from './supabase';

/**
 * Returns all cabin data in ```cabins``` table from supabase DB
 * @returns {Promise}
 */
export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded.');
  }

  return data;
}
