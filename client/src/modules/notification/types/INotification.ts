import { IData } from '@common/types';
import { UserType } from '@modules/user/types';

enum NotificationTypeValue {
	SEND_REQUEST_FRIEND = 'sendRequestFriend',
	ACCEPT_REQUEST_FRIEND = 'acceptRequestFriend',
	NEW_POST = 'newPost',
	REACT_POST = 'reactPost',
	COMMENT_POST = 'commentPost',
	SHARE_POST = 'sharePost',
	TAG_POST = 'tagPost',
	REACT_COMMENT = 'reactComment',
	REPLY_COMMENT = 'replyComment',
	TAG_COMMENT = 'tagComment',
}

interface INotification extends IData {
	type: NotificationTypeValue;
	content: string;
	link: string;
	sender: UserType;
	receiver: UserType[];
	isRead: boolean;
}

// For use
export type NotificationType = INotification;

// For form
export type NotificationFormType = Partial<INotification>;
