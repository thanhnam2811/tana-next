import { UserType } from '@modules/user/types';
import { createContext, useContext } from 'react';
import { useAuth } from '@modules/auth/hooks';

interface IUserContext {
	user: UserType;
	isCurrentUser?: boolean;
}

const UserContext = createContext<IUserContext | null>(null);

export const UserProvider = UserContext.Provider;
export const useUserContext = () => {
	const { authUser } = useAuth();
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('useUserContext must be used within an UserProvider');
	}

	if (authUser?._id === context.user._id) {
		context.user = authUser;
		context.isCurrentUser = true;
	}

	return context;
};
