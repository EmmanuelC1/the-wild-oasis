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

/**
 * Insert a new row into ```cabins``` table in DB
 * @param {object} newCabin All cabin info {name, regularPrice, discount, description, image}
 * @returns {Promise}
 */
export async function createCabin(newCabin) {
  const { data, error } = await supabase
    .from('cabins')
    .insert([newCabin]) // newCabin should be fomatted to match db table rows already
    .select();

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created.');
  }

  return data;
}

/**
 * Delete a cabin from ```cabins``` table in DB that matches the id
 * @param {Number} id Cabin id to delete
 * @returns {Promise}
 */
export async function deleteCabin(id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be deleted.');
  }

  return data;
}
