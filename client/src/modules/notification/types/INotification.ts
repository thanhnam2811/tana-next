import { IData } from '@common/types';
import { UserType } from '@modules/user/types';

interface INotification extends IData {
	type: string;
	content: string;
	link: string;
	sender: UserType;
	receiver: UserType[];
}

// For use
export type NotificationType = INotification;

// For form
export type NotificationFormType = Partial<INotification>;
