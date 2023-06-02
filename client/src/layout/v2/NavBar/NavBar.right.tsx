import { Avatar, Badge, Button, Layout } from 'antd';
import React from 'react';
import { HiBell } from 'react-icons/hi2';
import styles from '../Layout.module.scss';
import Link from 'next/link';
import { useAuth } from '@modules/auth/hooks';

export function NavBarRight() {
	const { authUser } = useAuth();

	if (!authUser)
		return (
			<Layout.Sider className={styles.nav_right}>
				<Link href="/auth/login" draggable>
					<Button type="primary">Đăng nhập</Button>
				</Link>

				<Link href="/auth/register" draggable>
					<Button>Đăng ký</Button>
				</Link>
			</Layout.Sider>
		);

	return (
		<Layout.Sider className={styles.nav_right}>
			<Badge count={5} offset={[-4, 4]}>
				<Button shape="circle" size="large">
					<HiBell />
				</Button>
			</Badge>

			<Button shape="circle" size="large">
				<Avatar src={authUser?.profilePicture.link} />
			</Button>
		</Layout.Sider>
	);
}
