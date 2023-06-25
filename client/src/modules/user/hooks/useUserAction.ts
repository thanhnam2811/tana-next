import { UserType } from '@modules/user/types';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { acceptFriendApi, rejectFriendApi, requestFriendApi, unFriendApi } from '@modules/friend/api';
import { useRouter } from 'next/router';
import { createConversationApi } from '@modules/messages/api';

export const useUserAction = (user: UserType) => {
	const [relationship, setRelationship] = useState(user.relationship || 'none');
	const [loading, setLoadingState] = useState<{ [key: string]: boolean }>({});
	const setLoading = (key: string, value: boolean) => setLoadingState((prev) => ({ ...prev, [key]: value }));

	const handleRequestFriend = async () => {
		const toastId = toast.loading('Đang gửi lời mời kết bạn...');
		setLoading('request', true);

		try {
			await requestFriendApi(user._id);
			toast.success('Gửi lời mời kết bạn thành công!', { id: toastId });
			setRelationship('sent');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('request', false);
	};

	const handleUnfriend = async () => {
		const toastId = toast.loading('Đang hủy kết bạn...');
		setLoading('unfriend', true);

		try {
			await unFriendApi(user._id);
			toast.success('Hủy kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('unfriend', false);
	};

	const router = useRouter();
	const handleChat = async () => {
		const toastId = toast.loading('Đang chuyển hướng đến trang nhắn tin...');
		setLoading('chat', true);

		try {
			const created = await createConversationApi({ members: [{ user: user._id }] });
			await router.push(`/messages?id=${created._id}`);

			toast.dismiss(toastId);
		} catch (error) {
			toast('Có lỗi xảy ra, vui lòng thử lại sau', { id: toastId });
		}

		setLoading('chat', false);
	};

	const handleAcceptFriend = async () => {
		const toastId = toast.loading('Đang xác nhận lời mời kết bạn...');
		setLoading('accept', true);

		try {
			await acceptFriendApi(user._id);
			toast.success('Xác nhận lời mời kết bạn thành công! Bạn bè với nhau rồi đó!', { id: toastId });
			setRelationship('friend');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('accept', false);
	};

	const handleRejectFriend = async () => {
		const toastId = toast.loading('Đang từ chối lời mời kết bạn...');
		setLoading('reject', true);

		try {
			await rejectFriendApi(user._id);
			toast.success('Từ chối lời mời kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('reject', false);
	};

	const handleCancelRequestFriend = async () => {
		const toastId = toast.loading('Đang hủy lời mời kết bạn...');
		setLoading('cancel', true);

		try {
			await requestFriendApi(user._id); // Request friend again to cancel
			toast.success('Hủy lời mời kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('cancel', false);
	};

	return {
		relationship,
		loading,
		handleRequestFriend,
		handleUnfriend,
		handleChat,
		handleAcceptFriend,
		handleRejectFriend,
		handleCancelRequestFriend,
	};
};
