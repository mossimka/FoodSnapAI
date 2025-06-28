import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useUserStore } from '@/stores/userStore';

export function useUserQuery() {
  const setUser = useUserStore((s) => s.setUser);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/auth/me');
      setUser(res.data);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}