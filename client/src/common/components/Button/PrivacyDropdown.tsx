import { getPrivacyOption, privacyOptions, PrivacyOptionType } from '@assets/data';
import { SelectApi } from 'src/common/components/Input';
import { useFetcher } from '@common/hooks';
import { IPrivacy, PrivacyValueType } from '@common/types';
import { Button, Dropdown, DropDownProps, Form, Input, Modal, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { UserType } from '@modules/user/types';

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

	const friendFetcher = useFetcher<UserType>({ api: `/users/searchUser/friends` });

	return (
		<Form form={form} onFinish={onSubmit} onClick={(e) => e.stopPropagation()}>
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
	);
}
