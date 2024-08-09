import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useEditCabin() {
  // get access to queryClient
  const queryClient = useQueryClient();

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
    },
    onError: err => toast.error(err.message),
  });

  return { isEditing, editCabin };
}
