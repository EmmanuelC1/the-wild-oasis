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
  // newCabin.image contains File (object) of all image details
  // replacing '/' because supabase will create folders based on that
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  const imagePath = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create cabin
  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }]) // newCabin should be fomatted to match db table rows already, except img
    .select();

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created.');
  }

  // 2. Upload image
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin IF there was an error uploading image
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(storageError);
    throw new Error('Cabin photo could not be uploaded, please try again');
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
