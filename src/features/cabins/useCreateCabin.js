import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useCreateCabin() {
  // get access to queryClient
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
    },
    onError: err => toast.error(err.message),
  });

  return { createCabin, isCreating };
}
