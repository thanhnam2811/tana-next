import { withLayout } from '@layout/components';
import { Button, Card } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Lottie from 'react-lottie-player';
import Head from 'next/head';

function NotFoundPage() {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>404 - Không tìm thấy trang</title>
			</Head>

			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Card
					cover={
						<Lottie
							path="https://assets2.lottiefiles.com/packages/lf20_q2pevjuc.json"
							speed={1}
							loop
							play
							style={{
								width: '100%',
								height: '100%',
								margin: 'auto',
							}}
						/>
					}
					style={{ width: '80%', maxWidth: 600 }}
					actions={[
						<Link href="/" key="home">
							<Button>Trang chủ</Button>
						</Link>,
						<Button key="back" type="primary" onClick={router.back}>
							Quay lại
						</Button>,
					]}
				>
					<Card.Meta
						title="404 - Không tìm thấy trang"
						description={
							<>
								Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
								<br />
								Vui lòng kiểm tra lại đường dẫn!
								<br />
								Nếu bạn cảm thấy đây là lỗi, vui lòng liên hệ{' '}
								<Link href="/support">bộ phận hỗ trợ</Link> để được hỗ trợ.
							</>
						}
					/>
				</Card>
			</div>
		</>
	);
}

export default withLayout(NotFoundPage);
