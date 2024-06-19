import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createCabin } from '../../services/apiCabins';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';

function CreateCabinForm() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState; // get access to form validation error

  const queryClient = useQueryClient(); // get access to queryClient

  // Add new cabin
  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: newCabin => createCabin(newCabin),
    onSuccess: () => {
      // toast pop-up notification
      toast.success('Cabin was successfuly created.');

      // force re-fetch to display new cabin in UI
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });

      // clear form
      reset();
    },
    onError: err => toast.error(err.message),
  });

  // functions that handleSubmit will call when we submit form (onSubmit or onError)
  function onSubmit(data) {
    mutate({ ...data, image: data.image[0] });
    console.log(data.image[0]);
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
          disabled={isCreating}
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          disabled={isCreating}
          {...register('image', { required: 'THis field is required' })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! Reset will clear form */}
        <Button variation="secondary" type="reset" disabled={isCreating}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
