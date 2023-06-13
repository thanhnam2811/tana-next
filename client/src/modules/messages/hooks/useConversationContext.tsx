import { createContext, useContext } from 'react';
import { ConversationFormType, ConversationType } from '../types';

interface IConversationContext {
	conversation: ConversationType;
	updateConversation: (data: ConversationType) => void;
	updateConversationForm: (data: ConversationFormType) => Promise<void>;
}

const ConversationContext = createContext<IConversationContext | null>(null);

export const ConversationProvider = ConversationContext.Provider;
export const ConversationConsumer = ConversationContext.Consumer;
export const useConversationContext = () => useContext(ConversationContext);
