import { UserType } from '@/types/user.type';
import useSWR from 'swr';

export default function useUserData() {
	return useSWR<UserType>('/user/searchUsers');
}
