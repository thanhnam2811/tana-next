import { UserType } from '@modules/user/types';
import { ConversationType } from '../types';
import { dateUtil } from '@common/utils';

export const getConversationInfo = (conversation: ConversationType, authUser: UserType) => {
	const isDirect = conversation.type === 'direct';
	const receiver = isDirect ? conversation.members.find((member) => member.user._id !== authUser._id) : null;

	const name = isDirect ? receiver?.nickname || receiver?.user.fullname : conversation.name;
	const description = isDirect
		? receiver?.user.isOnline
			? 'Đang hoạt động'
			: receiver?.user.lastAccess
			? `Hoạt động ${dateUtil.getTimeAgo(receiver?.user.lastAccess)}`
			: 'Không hoạt động'
		: `${conversation.members.length} thành viên`;

	return { isDirect, receiver, name, description };
};
