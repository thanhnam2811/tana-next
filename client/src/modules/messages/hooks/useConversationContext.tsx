import { createContext, useContext } from 'react';
import { ConversationFormType, ConversationType } from '../types';
import { getConversationInfo } from '../utils';
import { useAuth } from '@modules/auth/hooks';

interface IConversationContext {
	conversation: ConversationType;
	updateConversation: (data: ConversationType) => void;
	updateConversationForm: (data: ConversationFormType) => Promise<void>;
	deleteConversation: () => Promise<void>;
}

const ConversationContext = createContext<IConversationContext | null>(null);

export const ConversationProvider = ConversationContext.Provider;
export const useConversationContext = () => {
	const context = useContext(ConversationContext);
	const { authUser } = useAuth();

	if (!context) {
		throw new Error('useConversationContext must be used within an ConversationProvider');
	}

	return { ...context, info: getConversationInfo(context.conversation, authUser!) };
};
