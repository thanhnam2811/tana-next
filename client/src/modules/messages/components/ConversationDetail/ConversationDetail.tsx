import { uploadFileApi } from '@common/api';
import { useFetcher } from '@common/hooks';
import { useAuth } from '@modules/auth/hooks';
import { useConversationContext } from '@modules/messages/hooks';
import { getConversationInfo } from '@modules/messages/utils';
import {
	App,
	Badge,
	Button,
	Card,
	Collapse,
	CollapsePanelProps,
	Form,
	Popconfirm,
	Space,
	theme,
	Tooltip,
	Typography,
} from 'antd';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { HiLogout } from 'react-icons/hi';
import {
	HiBellSnooze,
	HiCamera,
	HiChevronDown,
	HiDocument,
	HiExclamationTriangle,
	HiPhoto,
	HiUser,
	HiUserPlus,
	HiUsers,
} from 'react-icons/hi2';
import { TiInfoLarge } from 'react-icons/ti';
import { SelectApi } from 'src/common/components/Input';
import { ConversationAvatar } from '../ConversationAvatar';
import styles from './ConversationDetail.module.scss';
import { InfoMenu, MemberMenu } from './menu';
import { leaveConversationApi } from '@modules/messages/api';
import { useRouter } from 'next/router';
import { UploadImage } from '@common/components/Button';

export function ConversationDetail() {
	const router = useRouter();
	const { conversation, updateConversationForm } = useConversationContext()!;

	const { token } = theme.useToken();
	const { modal } = App.useApp();
	const { authUser } = useAuth();

	const { isDirect, name, description, receiver } = getConversationInfo(conversation, authUser!);
	const friendFetcher = useFetcher({ api: 'users/searchUser/friends' });

	const [addMemberForm] = Form.useForm<{ members: string[] }>();
	const handleAddMember = async (values: { members: string[] }) => {
		console.log(values);
	};

	const onAddMemberClick = () => {
		modal.info({
			title: 'Thêm thành viên',
			content: (
				<Form onFinish={handleAddMember} form={addMemberForm} initialValues={{ members: [] }}>
					<Form.Item name="member">
						<SelectApi
							fetcher={friendFetcher}
							toOption={(user) => ({
								value: user._id,
								label: user.fullname,
								disabled: !!conversation.members.find(({ user: { _id } }) => _id === user._id),
							})}
							mode="multiple"
						/>
					</Form.Item>
				</Form>
			),
			okText: 'Thêm',
			onOk: () => addMemberForm.submit(),
			okCancel: true,
			closable: true,
			maskClosable: true,
		});
	};

	const collapsePanels: CollapsePanelProps[] = [
		{
			key: 'info',
			header: (
				<Space>
					<TiInfoLarge />

					<Typography.Text strong>Thông tin</Typography.Text>
				</Space>
			),
			children: <InfoMenu />,
		},
	];

	if (!isDirect) {
		collapsePanels.push({
			key: 'members',
			header: (
				<Space>
					<HiUsers />

					<Typography.Text strong>Thành viên</Typography.Text>
				</Space>
			),
			extra: (
				<Tooltip title="Thêm thành viên">
					<Button
						size="small"
						shape="circle"
						icon={<HiUserPlus />}
						onClick={(e) => {
							e.stopPropagation();
							onAddMemberClick();
						}}
					/>
				</Tooltip>
			),
			children: <MemberMenu />,
		});
	}

	collapsePanels.push(
		{
			key: 'media',
			header: (
				<Space>
					<HiPhoto />

					<Typography.Text strong>Hình ảnh & Video</Typography.Text>
				</Space>
			),
			children: <div>Hình ảnh & Video</div>,
		},
		{
			key: 'files',
			header: (
				<Space>
					<HiDocument />

					<Typography.Text strong>Tệp</Typography.Text>
				</Space>
			),
			children: <div>Tệp</div>,
		}
	);

	const handleChangeAvatar = async (file: File) => {
		const toastId = toast.loading('Đang tải ảnh lên...');
		try {
			const { files } = await uploadFileApi([file]);
			toast.success('Tải ảnh lên thành công!', { id: toastId });

			await updateConversationForm({ avatar: files[0]._id });
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const handleLeaveConversation = async () => {
		const toastId = toast.loading('Đang rời khỏi nhóm...');
		try {
			await leaveConversationApi(conversation._id);
			await router.replace({ pathname: router.pathname, query: { id: null } });

			toast.success('Rời nhóm thành công!', { id: toastId });
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	return (
		<Card
			className={styles.container}
			headStyle={{ padding: 8 }}
			title={
				<Space direction="vertical" className={styles.header} align="center">
					<UploadImage cropProps={{ zoomSlider: true }} onPickImage={handleChangeAvatar}>
						<Badge
							count={!isDirect ? <Button shape="circle" size="small" icon={<HiCamera />} /> : null}
							offset={[-8, 64 - 8]}
						>
							<ConversationAvatar conversation={conversation} size={64} />
						</Badge>
					</UploadImage>

					<Typography.Title level={5} className={styles.name}>
						{name}
					</Typography.Title>

					<Typography.Text type="secondary">{description}</Typography.Text>

					<Space size={8} split>
						{isDirect ? (
							<Tooltip title="Trang cá nhân">
								<Link href={`/profile?id=${receiver?.user._id}`} passHref>
									<Button shape="circle" icon={<HiUser />} />
								</Link>
							</Tooltip>
						) : (
							<Popconfirm
								title="Bạn có chắc chắn muốn rời khỏi nhóm này không?"
								onConfirm={handleLeaveConversation}
							>
								<Tooltip title="Rời nhóm">
									<Button shape="circle" icon={<HiLogout />} />
								</Tooltip>
							</Popconfirm>
						)}

						<Tooltip title="Tắt thông báo">
							<Button shape="circle" icon={<HiBellSnooze />} />
						</Tooltip>

						<Tooltip title="Báo cáo">
							<Button shape="circle" icon={<HiExclamationTriangle />} />
						</Tooltip>
					</Space>
				</Space>
			}
			bodyStyle={{ padding: 8 }}
		>
			<Collapse
				size="small"
				expandIconPosition="end"
				expandIcon={({ isActive }) => (
					<HiChevronDown
						style={{
							transform: `rotate(${isActive ? 180 : 0}deg)`,
							transition: 'transform 0.2s ease-in-out',
						}}
					/>
				)}
				bordered={false}
				className={styles.collapse_container}
			>
				{collapsePanels.map((panel) => (
					<Collapse.Panel
						{...panel}
						key={panel.key}
						className={styles.collapse_panel}
						style={{ borderColor: token.colorBorder }}
					/>
				))}
			</Collapse>
		</Card>
	);
}
