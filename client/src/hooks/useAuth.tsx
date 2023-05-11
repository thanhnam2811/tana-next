import { RootState } from '@redux/store';
import { useAppSelector } from './redux';

export const useAuth = () => {
	const { data: user } = useAppSelector((state: RootState) => state.user);

	return { user };
};
