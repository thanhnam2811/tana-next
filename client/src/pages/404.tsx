import { withLayout } from '@layout/components';
import { Button, Card } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEO from '@common/components/SEO';
import dynamic from 'next/dynamic';
import { notFoundJson } from '@assets/data/json';

const Lottie = dynamic(() => import('lottie-react'));

function NotFoundPage() {
	const router = useRouter();
	return (
		<>
			<SEO title="404 - Không tìm thấy trang" />

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
						<Lottie animationData={notFoundJson} loop autoplay style={{ width: '100%', height: '100%' }} />
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
