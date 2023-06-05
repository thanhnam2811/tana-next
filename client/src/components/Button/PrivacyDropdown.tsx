import { PrivacyOptionType, getPrivacyOption, privacyOptions } from '@assets/data';
import { SelectApi } from '@components/v2/Input';
import { useFetcher } from '@common/hooks';
import { IPrivacy, UserType, PrivacyValueType } from '@common/types';
import { useAuth } from '@modules/auth/hooks';
import { Button, DropDownProps, Dropdown, Form, Input, Modal, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
interface Props {
	value?: IPrivacy;
	onChange?: (value: IPrivacy) => any;
	render?: (privacy: PrivacyOptionType) => JSX.Element;
}

export function PrivacyDropdown({
	value: privacy = { value: 'public' },
	onChange,
	render,
	...props
}: Props & DropDownProps) {
	const [form] = Form.useForm<IPrivacy>();

	useEffect(() => {
		form.setFieldsValue(privacy);
	}, [privacy]);

	const privacyOption = getPrivacyOption(privacy.value)!;

	const onSubmit = (data: IPrivacy) => {
		// Save change
		onChange?.(data);
		hideModal();
	};

	const handleChange = (val: PrivacyValueType) => {
		form.setFieldValue('value', val);

		if (val !== 'includes' && val !== 'excludes') {
			form.submit();
		} else {
			showModal();
		}
	};

	const [openModal, setOpenModal] = useState(false);
	const showModal = () => setOpenModal(true);
	const hideModal = () => setOpenModal(false);

	const { authUser } = useAuth();
	const friendFetcher = useFetcher<UserType>({ api: `/users/${authUser!._id}/friends` });

	return (
		<>
			<Form form={form} onFinish={onSubmit}>
				<Modal
					title={
						form.getFieldValue('value') === 'includes'
							? 'Những ai có thể xem?'
							: form.getFieldValue('value') === 'excludes'
							? 'Những ai không thể xem?'
							: ''
					}
					open={openModal}
					onCancel={hideModal}
					onOk={form.submit}
					closable={!form.getFieldsError().length}
				>
					<Form.Item
						name="includes"
						label="Bao gồm"
						hidden={form.getFieldValue('value') !== 'includes'}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									if (getFieldValue('value') === 'includes' && value?.length === 0) {
										return Promise.reject(new Error('Vui lòng chọn người dùng'));
									}
									return Promise.resolve();
								},
							}),
						]}
					>
						<SelectApi
							mode="multiple"
							fetcher={friendFetcher}
							toOption={(u) => ({ label: u.fullname, value: u._id })}
						/>
					</Form.Item>

					<Form.Item
						name="excludes"
						label="Trừ ra"
						hidden={form.getFieldValue('value') !== 'excludes'}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									if (getFieldValue('value') === 'excludes' && value?.length === 0) {
										return Promise.reject(new Error('Vui lòng chọn người dùng'));
									}
									return Promise.resolve();
								},
							}),
						]}
					>
						<SelectApi
							mode="multiple"
							fetcher={friendFetcher}
							toOption={(u) => ({ label: u.fullname, value: u._id })}
						/>
					</Form.Item>
				</Modal>

				<Dropdown
					menu={{
						onClick: ({ key }) => handleChange(key as PrivacyValueType),
						items: privacyOptions.map(({ value, label, RIcon }) => ({
							key: value,
							label: label,
							icon: <RIcon />,
						})),
					}}
					arrow
					trigger={['click']}
					{...props}
				>
					<Tooltip title={privacyOption.label}>
						<Form.Item
							name="value"
							hidden
							rules={[
								{
									required: true,
									message: 'Vui lòng chọn quyền riêng tư',
								},
							]}
						>
							<Input />
						</Form.Item>
						{render?.(privacyOption) || <Button type="text" icon={<privacyOption.RIcon />} />}
					</Tooltip>
				</Dropdown>
			</Form>
		</>
	);
}
