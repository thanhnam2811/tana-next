import { useAuth } from '@modules/auth/hooks';
import { Avatar, Badge, Button } from 'antd';
import Link from 'next/link';
import { HiBell } from 'react-icons/hi2';
import { HeaderRight } from '../Header';

export function NavBarRight() {
	const { authUser } = useAuth();

	if (!authUser)
		return (
			<HeaderRight>
				<Link href="/auth/login" draggable>
					<Button type="primary">Đăng nhập</Button>
				</Link>

				<Link href="/auth/register" draggable>
					<Button>Đăng ký</Button>
				</Link>
			</HeaderRight>
		);

	return (
		<HeaderRight>
			<Badge count={5} offset={[-4, 4]}>
				<Button shape="circle" size="large">
					<HiBell />
				</Button>
			</Badge>

			<Button shape="circle" size="large">
				<Avatar src={authUser?.profilePicture.link} />
			</Button>
		</HeaderRight>
	);
}
