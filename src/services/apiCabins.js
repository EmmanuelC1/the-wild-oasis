import supabase from './supabase';

/**
 * Returns all cabin rows and their data in ```cabins``` table from supabase DB
 * @returns {Promise}
 */
export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}

/**
 * Selects and retrived cabin data from ```cabins``` DB table by ID
 * @param {Number} id Cabin ID to retrieve
 * @returns {Promise}
 */
export async function getCabinById(id) {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Cabin selected could not be retrieved from database');
  }

  return data;
}

/**
 * Insert a new row into ```cabins``` table in DB
 * @param {object} newCabin All cabin info {name, regularPrice, discount, description, image}
 * @returns {Promise}
 */
export async function createEditCabin(newCabin, id) {
  console.log(newCabin, id);

  // newCabin.image contains File (object) of all image details
  // check if 'newCabin.image' starts with supabaseURL. If it does, user did not edit img and we want to reuse the old img
  const hasImagePath = newCabin.image?.startsWith?.(
    import.meta.env.VITE_SUPABASE_URL
  );

  // replacing '/' because supabase will create folders based on that
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  // check if 'newCabin.image' starts with supabaseURL. If it does, user did not edit img and we want to reuse the old img
  const imagePath = hasImagePath
    ? newCabin.image
    : `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/Edit cabin
  let query = supabase.from('cabins');

  // A. CREATE - attach insert to query if creating new cabin (no id passed in to func)
  if (!id) {
    // newCabin should be fomatted to match db table rows already, except img
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  // B. EDIT - attach update, eq to query if editing cabin (id passed in to func)
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq('id', id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  // 2. Upload image
  if (hasImagePath) return data; // no need to upload image if it was not edited

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if there was an error uploading image
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(storageError);
    throw new Error('Cabin photo could not be uploaded, please try again');
  }

  return data;
}

/**
 * Delete a cabin from ```cabins``` table in DB that matches the id, as well as deletes cabin image from Supabse storage bucket
 * @param {Number} id Cabin id to delete
 * @returns {Promise}
 */
export async function deleteCabin(id) {
  // 1. Select cabin from DB using id
  const cabinData = await getCabinById(id);
  const imgFileName = cabinData[0].image.split('/').at(-1); // Get image file name

  // 2. Delete image from DB storage bucket
  const { error: imageDeleteError } = await supabase.storage
    .from('cabin-images')
    .remove([imgFileName]);

  if (imageDeleteError) {
    console.error(imageDeleteError);
    throw new Error('Cabin photo could not be deleted. Cabin was not deleted');
  }

  // 3. Delete cabin from DB cabins table, if image was deleted
  if (!imageDeleteError) {
    const { error: cabinDeleteError } = await supabase
      .from('cabins')
      .delete()
      .eq('id', id);

    if (cabinDeleteError) {
      console.error(cabinDeleteError);
      throw new Error('Cabin could not be deleted');
    }
  }
}
