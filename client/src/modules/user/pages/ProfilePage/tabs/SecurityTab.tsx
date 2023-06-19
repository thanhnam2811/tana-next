import React from 'react';
import { useAuth } from '@modules/auth/hooks';
import { Card, Space } from 'antd';
import { ChangePasswordForm, SetPasswordForm } from '../forms';

export function SecurityTab() {
	const { authUser } = useAuth();

	return (
		<Card title="Bảo mật">
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				{authUser?.shouldSetPassword ? <SetPasswordForm /> : <ChangePasswordForm />}
			</Space>
		</Card>
	);
}
