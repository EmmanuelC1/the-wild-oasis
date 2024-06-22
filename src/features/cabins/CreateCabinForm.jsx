import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { createEditCabin } from '../../services/apiCabins';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;

  // check if we are editing or adding new cabin (cabinToEdit will be {} if new cabin therefore false)
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    // if editing, use default values for cabin we are editing, otherwise empty input fields
    defaultValues: isEditSession ? editValues : {},
  });

  // get access to form validation error
  const { errors } = formState;

  // get access to form validation error
  const queryClient = useQueryClient();

  // Add new cabin
  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: newCabin => createEditCabin(newCabin),
    onSuccess: () => {
      // toast pop-up notification
      toast.success('Cabin was successfuly created');

      // force re-fetch to display new cabin in UI
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });

      // clear form
      reset();
    },
    onError: err => toast.error(err.message),
  });

  // Edit cabin
  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      // toast pop-up notification
      toast.success('Cabin succesfully edited');

      // force re-fetch to display new cabin in UI
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });

      // clear form
      reset();
    },
    onError: err => toast.error(err.message),
  });

  const isWorking = isCreating || isEditing;

  // functions that handleSubmit will call when we submit form (onSubmit or onError)
  function onSubmit(data) {
    // if data.image is a string, user did not edit image (will reuse image path that has supabase URL)
    // otherwise, user uploaded new image and data.image will contain a FileList that will be at position [0] in list
    const image = typeof data.image === 'string' ? data.image : data.image[0];
    console.log('image', image);
    console.log('data.image', data.image);
    console.log('data.image[0]', data.image[0]);

    if (isEditSession)
      editCabin({ newCabinData: { ...data, image }, id: editId });
    else createCabin({ ...data, image: image });
  }

  function onError(errors) {
    console.log(errors);
    // no need for this function in this app since we are displaying the error messages right on the UI in FormRow
    // just leaving it here for future reference to know that it exists, if needed
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: { value: 1, message: 'Capacity should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required',
            min: { value: 1, message: 'Capacity should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register('discount', {
            required: 'This field is required',
            validate: (value, formValues) =>
              +value <= +formValues.regularPrice ||
              'Discount should be less than the regular price',
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! Reset will clear form */}
        <Button variation="secondary" type="reset" disabled={isWorking}>
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
