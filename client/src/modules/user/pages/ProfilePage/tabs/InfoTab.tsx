import { PrivacyDropdown } from '@common/components/Button';
import { useAuth } from '@modules/auth/hooks';
import { genderOptions } from '@modules/user/data';
import { useUserContext } from '@modules/user/hooks';
import { IGender, UserType } from '@modules/user/types';
import { Button, Card, Dropdown, List, Space, Typography } from 'antd';
import { toast } from 'react-hot-toast';
import { HiPencil } from 'react-icons/hi2';
import { ContactList, EducationList, WorkList } from '../lists';
import { capitalize } from 'lodash';

export const InfoTab = () => {
	const { user, isCurrentUser } = useUserContext();
	const { updateAuthUser } = useAuth();

	const handleChangeField = (field: keyof UserType) => (value: any) => {
		if (value === user[field]) return; // No change

		updateAuthUser({ [field]: value })
			.then(() => toast.success('Cập nhật thành công!'))
			.catch(() => toast.error('Cập nhật thất bại!'));
	};

	const gender = genderOptions.find((item) => item.value === user.gender?.value);
	const updateGender = (data: Partial<IGender>) => handleChangeField('gender')({ ...user.gender, ...data });

	return (
		<Card>
			<List header={<Typography.Title level={3}>Thông tin cá nhân</Typography.Title>}>
				<List.Item>
					<List.Item.Meta
						title="Họ và tên"
						description={
							<Typography.Text
								editable={
									isCurrentUser && {
										icon: <HiPencil />,
										tooltip: 'Chỉnh sửa',
										onChange: handleChangeField('fullname'),
										triggerType: ['icon', 'text'],
									}
								}
							>
								{user.fullname}
							</Typography.Text>
						}
					/>
				</List.Item>

				{gender && (
					<List.Item
						actions={
							isCurrentUser
								? [
										<PrivacyDropdown
											key="privacy"
											value={user.gender?.privacy}
											onChange={(privacy) => updateGender({ privacy })}
										/>,
										<Dropdown
											key="edit"
											menu={{
												items: genderOptions.map(({ Icon, label, value }) => ({
													key: value,
													label: (
														<Space>
															<Icon /> {capitalize(label)}
														</Space>
													),
													value,
													disabled: value === gender.value,
													onClick: () => updateGender({ value }),
												})),
											}}
											arrow
											trigger={['click']}
										>
											<Button type="text" icon={<HiPencil />} />
										</Dropdown>,
								  ]
								: []
						}
					>
						<List.Item.Meta
							title="Giới tính"
							description={
								<Space>
									<gender.Icon />

									<Typography.Text>{capitalize(gender.label)}</Typography.Text>
								</Space>
							}
						/>
					</List.Item>
				)}

				<List.Item>
					<List.Item.Meta title="Email" description={<Typography.Text>{user.email}</Typography.Text>} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Liên hệ" description={<ContactList />} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Công việc" description={<WorkList />} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Học vấn" description={<EducationList />} />
				</List.Item>
			</List>
		</Card>
	);
};
