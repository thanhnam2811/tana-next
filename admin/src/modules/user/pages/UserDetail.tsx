import useSWR from 'swr';
import { Navigate, useParams } from 'react-router-dom';
import { swrFetcher } from '@common/api';
import { Avatar, Badge, Card, Descriptions, Space } from 'antd';
import { UserType } from '@modules/user/types';
import { timeUtil } from '@common/utils';
import { capitalize } from 'lodash';
import { FullscreenSpin } from '@common/components/Loading';

export default function UserDetail() {
	const { id } = useParams();
	const { data: user, isLoading, error } = useSWR<UserType, string>(`users/${id}`, swrFetcher);

	if (isLoading) return <FullscreenSpin />;

	if (error) return <div>{error}</div>;

	if (!user) return <Navigate to="/404" />;

	return (
		<Card
			title={
				<Card.Meta
					avatar={<Avatar src={user.profilePicture.link} alt={user.fullname} />}
					title={user.fullname}
					description={user.email}
				/>
			}
			loading={isLoading}
			tabList={[
				{
					key: 'profile',
					tab: 'Thông tin',
				},
				{
					key: 'advanced',
					tab: 'Nâng cao',
				},
				{
					key: 'history',
					tab: 'Lịch sử hoạt động',
				},
			]}
		>
			<Descriptions>
				<Descriptions.Item label="Tên">{user.fullname}</Descriptions.Item>
				<Descriptions.Item label="Email">{user.email}</Descriptions.Item>
				<Descriptions.Item label="Giới tính">{capitalize(user.gender?.label)}</Descriptions.Item>

				<Descriptions.Item label="Trạng thái">
					{user.isOnline ? (
						<Badge status="success" text="Đang hoạt động" />
					) : (
						<Badge
							status="default"
							text={
								user.lastAccess
									? `Hoạt động ${timeUtil.getTimeAgo(user.lastAccess)}`
									: 'Không hoạt động'
							}
						/>
					)}
				</Descriptions.Item>
				<Descriptions.Item label="Ngày tạo">{timeUtil.formatDate(user.createdAt)}</Descriptions.Item>
				<Descriptions.Item label="Ngày cập nhật">{timeUtil.formatDate(user.updatedAt)}</Descriptions.Item>

				<Descriptions.Item label="Liên hệ">
					<Space direction="vertical">{user.contact.map((contact) => contact.value)}</Space>
				</Descriptions.Item>
				<Descriptions.Item label="Học vấn">
					<Space direction="vertical">{user.education.map((edu) => edu.school)}</Space>
				</Descriptions.Item>
				<Descriptions.Item label="Công việc">
					<Space direction="vertical">{user.work.map((work) => work.company)}</Space>
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
}
