import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin as deleteCabinApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useDeleteCabin() {
  // get access to queryClient
  const queryClient = useQueryClient();

  // Delete cabin row
  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: id => deleteCabinApi(id),
    onSuccess: () => {
      // toast pop-up notification
      toast.success('Cabin successfully deleted');

      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
