import useSWR from 'swr';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { swrFetcher } from '@common/api';
import { Alert, App, Avatar, Button, Card, Form, Input } from 'antd';
import { UserType } from '@modules/user/types';
import { FullscreenSpin } from '@common/components/Loading';
import { CardTabListType } from 'antd/lib/card';
import React, { useState } from 'react';

import ProfileTab from '@modules/user/pages/UserDetail/tabs/ProfileTab.tsx';
import HistoryTab from '@modules/user/pages/UserDetail/tabs/HistoryTab.tsx';
import dayjs from 'dayjs';
import { IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/io5';
import { lockUserApi, unlockUserApi } from '@modules/user/api';

export default function UserDetail() {
	const { id } = useParams();
	const { data: user, isLoading, error, mutate } = useSWR<UserType, string>(`users/${id}`, swrFetcher);

	const [params, setParams] = useSearchParams({ tab: 'profile' });
	const tab = params.get('tab');

	const { modal, message } = App.useApp();
	const [locking, setLocking] = useState(false);

	if (isLoading) return <FullscreenSpin />;

	if (error) return <div>{error}</div>;

	if (!user) return <Navigate to="/404" />;

	const tabList: (CardTabListType & { content: React.ReactNode })[] = [
		{
			key: 'profile',
			tab: 'Thông tin',
			content: <ProfileTab user={user} />,
		},
		{
			key: 'history',
			tab: 'Lịch sử hoạt động',
			content: <HistoryTab user={user} />,
		},
	];
	const currentTab = tabList.find((t) => t.key === tab);

	const isLocked = !!user.isPermanentlyLocked || dayjs().isBefore(user.lockTime);
	const handleLock = async (reason: string) => {
		const key = 'lock';
		message.loading({ content: 'Đang khóa tài khoản...', key });

		setLocking(true);

		try {
			const locked = await lockUserApi(user._id, reason);
			await mutate(locked, false);
			message.success({ content: 'Khóa tài khoản thành công', key });

			setLocking(false);
		} catch (error) {
			message.error({ content: `Khóa tài khoản thất bại! Lỗi: ${error}`, key });
		}

		setLocking(false);
	};

	const handleUnlock = async () => {
		const key = 'unlock';
		message.loading({ content: 'Đang mở khóa tài khoản...', key });

		setLocking(true);

		try {
			const unlocked = await unlockUserApi(user._id);
			await mutate(unlocked, false);
			message.success({ content: 'Mở khóa tài khoản thành công', key });

			setLocking(false);
		} catch (error) {
			message.error({ content: `Mở khóa tài khoản thất bại! Lỗi: ${error}`, key });
		}

		setLocking(false);
	};

	const showLockModal = () => {
		modal.confirm({
			title: 'Nhập lý do khóa tài khoản',
			content: (
				<Form<{ reason: string }> name="lock-reason" onFinish={({ reason }) => handleLock(reason)}>
					<Form.Item
						name="reason"
						rules={[{ required: true, message: 'Vui lòng nhập lý do khóa tài khoản' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			),
			okText: 'Khóa',
			okType: 'danger',
			cancelText: 'Hủy',
			okButtonProps: { htmlType: 'submit', form: 'lock-reason' },
		});
	};

	return (
		<Card
			title={
				<Card.Meta
					avatar={<Avatar src={user.profilePicture.link} alt={user.fullname} />}
					title={user.fullname}
					description={user.email}
				/>
			}
			extra={
				isLocked ? (
					<Button icon={<IoLockOpenOutline />} onClick={handleUnlock} loading={locking}>
						Mở khóa
					</Button>
				) : (
					<Button
						type="primary"
						danger
						icon={<IoLockClosedOutline />}
						loading={locking}
						onClick={showLockModal}
					>
						Khóa
					</Button>
				)
			}
			loading={isLoading}
			tabList={tabList}
			activeTabKey={currentTab?.key}
			onTabChange={(key) => setParams({ tab: key })}
		>
			{isLocked && user.reasonLock && (
				<Alert
					message={`Tài khoản đã bị khóa. Lý do: ${user.reasonLock}`}
					type="warning"
					showIcon
					style={{ marginBottom: 16 }}
				/>
			)}

			{currentTab?.content}
		</Card>
	);
}
