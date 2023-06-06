import dynamic from 'next/dynamic';

import { Goal, Mission, Value } from '@assets/images';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Box, Button, Card, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect } from 'react';
import Aos from 'aos';

const Banner = dynamic(() => import('@components/Landing').then((m) => m.Landing), {
	ssr: false,
	loading: (loadingProps) => {
		if (loadingProps.error) {
			return <div>Failed to load</div>;
		}

		return <div style={{ height: 600, background: 'black' }}>Loading...</div>;
	},
});

export default function Landing() {
	const router = useRouter();

	useEffect(() => {
		// init AOS
		Aos.init({
			throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
		});
	}, []);

	return (
		<Box width="100%" overflow="hidden auto">
			{/* Banner */}
			<Box position="relative" height={600} bgcolor="black">
				<Banner />

				{/* Banner content */}
				<Box sx={{ position: 'absolute', top: '50%', left: '60px', transform: 'translateY(-50%)' }}>
					<Typography variant="h2" sx={{ color: '#fff', fontWeight: 700 }} className="typing-text">
						<strong>TaNa</strong> - Kết nối và sáng tạo
					</Typography>

					<Typography variant="h5" sx={{ color: '#fff', fontWeight: 400 }} data-aos="fade-right">
						Sáng tạo và kết nối cùng <strong>Tana</strong> - Nơi gặp gỡ những tài năng đầy tiềm năng!
					</Typography>

					<Button
						variant="contained"
						endIcon={<ArrowForward />}
						sx={{
							mt: 2,
							'& svg': { transition: 'all 0.3s ease-in-out' },
							'&:hover': { '& svg': { transform: 'translateX(5px)' } },
						}}
						onClick={() => router.push('/home')}
						data-aos="fade-right"
					>
						Thử ngay
					</Button>
				</Box>
			</Box>

			{/* Introduction */}
			<Container maxWidth="lg" sx={{ mt: 4 }}>
				{/* Title */}
				<Typography variant="h3" sx={{ fontWeight: 700 }} my={2} textAlign="center" data-aos="fade-up">
					Giới thiệu về <strong>TaNa</strong>
				</Typography>

				{/* Description */}
				<Typography variant="body1" sx={{ fontWeight: 400 }} textAlign="justify" my={2} data-aos="fade-up">
					TaNa là một mạng xã hội mới, dành cho những người yêu thích sáng tạo và muốn chia sẻ kiến thức, kinh
					nghiệm và ý tưởng của mình với cộng đồng. Trên TaNa, người dùng có thể tạo và chia sẻ bài viết, hình
					ảnh, video, tham gia các nhóm chuyên đề, tạo dự án và sản phẩm sáng tạo. Mục tiêu của TaNa là tạo ra
					một cộng đồng sáng tạo, tích cực và mang lại giá trị cho những người tham gia.
				</Typography>

				<Grid container spacing={2}>
					{/* Goal */}
					<Grid item xs={12} md={4}>
						<Card sx={{ height: '100%' }} data-aos="fade-up-right">
							<Box p={2} display="flex" alignItems="center" flexDirection="column" gap={2}>
								<Image src={Goal.src} alt="Mục tiêu" width={200} height={200} />

								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									Mục tiêu
								</Typography>

								<Typography variant="body1">
									Được thành lập từ năm 2021, <strong>TaNa</strong> là một nền tảng kết nối và sáng
									tạo, nơi mọi người có thể tìm kiếm những người có cùng sở thích và sở trường để cùng
									nhau sáng tạo ra những sản phẩm độc đáo và đầy tính sáng tạo.
								</Typography>
							</Box>
						</Card>
					</Grid>

					{/* Value */}
					<Grid item xs={12} md={4}>
						<Card sx={{ height: '100%' }} data-aos="fade-up">
							<Box p={2} display="flex" alignItems="center" flexDirection="column" gap={2}>
								<Image src={Value.src} alt="Mục tiêu" width={200} height={200} />

								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									Giá trị
								</Typography>

								<Typography variant="body1">
									<strong>TaNa</strong> luôn đặt lợi ích của người dùng lên hàng đầu, chúng tôi luôn
									cố gắng để mang đến những trải nghiệm tốt nhất cho người dùng.
								</Typography>
							</Box>
						</Card>
					</Grid>

					{/* Mission */}
					<Grid item xs={12} md={4}>
						<Card sx={{ height: '100%' }} data-aos="fade-up-left">
							<Box p={2} display="flex" alignItems="center" flexDirection="column" gap={2}>
								<Image src={Mission.src} alt="Mục tiêu" width={200} height={200} />

								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									Sứ mệnh
								</Typography>

								<Typography variant="body1">
									<strong>TaNa</strong> mong muốn mang đến cho người dùng một nền tảng kết nối và sáng
									tạo, nơi mọi người có thể tìm kiếm những người có cùng sở thích và sở trường để cùng
									nhau sáng tạo ra những sản phẩm độc đáo và đầy tính sáng tạo.
								</Typography>
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Container>

			{/* Features */}
			<Box sx={{ mt: 4 }}>
				{/* Title */}
				<Typography variant="h3" sx={{ fontWeight: 700 }} my={2} textAlign="center">
					Tính năng nổi bật
				</Typography>

				{/* Features */}
				<Swiper slidesPerView={2} centeredSlides spaceBetween={20}>
					<SwiperSlide style={{ width: 400 }}>
						<Box p={2} display="flex" alignItems="center" flexDirection="column" gap={2} mr={2}>
							<Typography variant="h5" sx={{ fontWeight: 700 }}>
								Bài viết
							</Typography>
						</Box>
					</SwiperSlide>

					<SwiperSlide>
						<Box p={2} display="flex" alignItems="center" flexDirection="column" gap={2}>
							<Typography variant="h5" sx={{ fontWeight: 700 }}>
								Bình luận
							</Typography>
						</Box>
					</SwiperSlide>
					<SwiperSlide>Slide 3</SwiperSlide>
					<SwiperSlide>Slide 4</SwiperSlide>
				</Swiper>
			</Box>
		</Box>
	);
}
