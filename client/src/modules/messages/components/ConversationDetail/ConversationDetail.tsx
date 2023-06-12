import { useAuth } from '@modules/auth/hooks';
import { ConversationFormType, ConversationType } from '@modules/messages/types';
import { getConversationInfo } from '@modules/messages/utils';
import { Badge, Button, Card, Collapse, CollapsePanelProps, Space, Tooltip, Typography, Upload, theme } from 'antd';
import ImgCrop from 'antd-img-crop';
import { HiLogout } from 'react-icons/hi';
import {
	HiBellSnooze,
	HiCamera,
	HiChevronDown,
	HiDocument,
	HiExclamationTriangle,
	HiPhoto,
	HiUserPlus,
	HiUsers,
} from 'react-icons/hi2';
import { TiInfoLarge } from 'react-icons/ti';
import { ConversationAvatar } from '../ConversationAvatar';
import styles from './ConversationDetail.module.scss';
import { toast } from 'react-hot-toast';
import { uploadFileApi } from '@common/api';
import { InfoMenu } from './menu';

interface Props {
	conversation: ConversationType;
	onUpdate: (conversation: ConversationFormType) => Promise<void>;
}

export function ConversationDetail({ conversation, onUpdate }: Props) {
	const { token } = theme.useToken();
	const { authUser } = useAuth();

	const { isDirect, name, description } = getConversationInfo(conversation, authUser!);

	const collapsePanels: CollapsePanelProps[] = [
		{
			key: 'info',
			header: (
				<Space>
					<TiInfoLarge />

					<Typography.Text strong>Thông tin</Typography.Text>
				</Space>
			),
			children: <InfoMenu conversation={conversation} onUpdate={onUpdate} />,
		},
		{
			key: 'members',
			header: (
				<Space>
					<HiUsers />

					<Typography.Text strong>Thành viên</Typography.Text>
				</Space>
			),
			extra: (
				<Tooltip title="Thêm thành viên">
					<Button size="small" shape="circle" icon={<HiUserPlus />} />
				</Tooltip>
			),
			children: <div>Thành viên</div>,
		},
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
		},
		{
			key: 'others',
			header: (
				<Space>
					<HiExclamationTriangle />

					<Typography.Text strong>Khác</Typography.Text>
				</Space>
			),
			children: <div>Khác</div>,
		},
	];

	const handleChangeAvatar = async (file: File) => {
		const toastId = toast.loading('Đang tải ảnh lên...');
		try {
			const { files } = await uploadFileApi([file]);
			toast.success('Tải ảnh lên thành công!', { id: toastId });

			await onUpdate({ avatar: files[0]._id });
		} catch (error: any) {
			toast.error(error.message || error.toString());
		}
	};

	return (
		<Card
			className={styles.container}
			headStyle={{ padding: 8 }}
			title={
				<Space direction="vertical" className={styles.header} align="center">
					<ImgCrop zoomSlider>
						<Upload
							fileList={[]}
							// onChange={({ file }) => {
							// 	if (!file.originFileObj) return;
							// 	handleChangeAvatar(file.originFileObj);
							// }}
							beforeUpload={(file) => {
								handleChangeAvatar(file);
								return false;
							}}
						>
							<Badge
								count={!isDirect ? <Button shape="circle" size="small" icon={<HiCamera />} /> : null}
								offset={[-8, 64 - 8]}
							>
								<ConversationAvatar conversation={conversation} size={64} />
							</Badge>
						</Upload>
					</ImgCrop>

					<Typography.Title level={5} className={styles.name}>
						{name}
					</Typography.Title>

					<Typography.Text type="secondary">{description}</Typography.Text>

					<Space size={8} split>
						{isDirect ? (
							<Tooltip title="Tạo nhóm">
								<Button shape="circle" icon={<HiUserPlus />} />
							</Tooltip>
						) : (
							<Tooltip title="Rời nhóm">
								<Button shape="circle" icon={<HiLogout />} />
							</Tooltip>
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
