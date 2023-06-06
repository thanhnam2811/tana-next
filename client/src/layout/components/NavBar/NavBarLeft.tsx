import { Logo } from '@assets/logo';
import { useAuth } from '@modules/auth/hooks';
import { Avatar, Button, Input } from 'antd';
import Link from 'next/link';
import { HeaderLeft } from '../Header';

export function NavBarLeft() {
	const { authUser } = useAuth();

	return (
		<HeaderLeft>
			<Link href="/" style={{ display: 'flex' }}>
				<Button shape="circle" size="large">
					<Avatar src={Logo.src} />
				</Button>
			</Link>

			{authUser && <Input.Search placeholder="Tìm kiếm" style={{ width: 300 }} />}
		</HeaderLeft>
	);
}
