import { Button, Card, Form, Select, theme, Typography } from 'antd';
import React from 'react';
import { UserFormType } from '@modules/user/types';

const listHobbies = [
	'Thể thao',
	'Du lịch',
	'Âm nhạc',
	'Đọc sách',
	'Chụp ảnh',
	'Vẽ tranh',
	'Viết lách',
	'Chơi game',
	'Xem phim',
	'Nghe nhạc',
];

export function InfoForm() {
	const { token } = theme.useToken();
	const [form] = Form.useForm<UserFormType>();

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Thêm thông tin
				</Typography.Title>
			}
			style={{ width: 480, margin: 'auto' }}
		>
			<Form layout="vertical" form={form} name="info">
				<Form.Item label="Sở thích" name="hobbies">
					<Select mode="tags" options={listHobbies.map((item) => ({ label: item, value: item }))} />
				</Form.Item>

				<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
					Xác nhận
				</Button>
			</Form>
		</Card>
	);
}
