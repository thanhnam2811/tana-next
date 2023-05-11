import { Goal, Mission, Value } from '@assets/images';
import { CommentCard, PostCard } from '@components/Card';
import { ArrowForward } from '@mui/icons-material';
import { Box, Button, Card, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';

export default function Home() {
	const router = useRouter();
	const [vanta, setVanta] = useState<any>(null);
	const bannerRef = useRef(null);

	useEffect(() => {
		setVanta(
			NET({
				el: bannerRef.current,
				mouseControls: true,
				touchControls: true,
				gyroControls: false,
				minHeight: 600,
				scale: 1.0,
				scaleMobile: 1.0,
				color: 0x3fe8ff,
				backgroundColor: 0x0,
			})
		);

		return () => {
			vanta?.destroy();
		};
	}, []);

	return (
		<Box width="100%" overflow="hidden auto">
			{/* Banner */}
			<Box ref={bannerRef} width="100%" height={600}>
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

							<PostCard
								post={{
									_id: '64c3fb145b16e2fc8b45c6fc',
									author: {
										_id: '123',
										fullname: 'John Doe',
										profilePicture: {
											link: 'https://example.com/john-doe-profile-picture.png',
										},
									},
									content: 'This is an example post.',
									createdAt: '2022-05-05T08:30:00.000Z',
									reactions: {
										like: 10,
										love: 5,
										haha: 2,
									},
									comments: [
										{
											_id: '64c3fb145b16e2fc8b45c6fc',
											author: {
												_id: '456',
												fullname: 'Jane Smith',
												profilePicture: {
													link: 'https://example.com/jane-smith-profile-picture.png',
												},
											},
											content: 'Nice post!',
										},
										{
											_id: '64f20e8af28a2c3f67daf564',
											author: {
												_id: '789',
												fullname: 'Bob Johnson',
												profilePicture: {
													link: 'https://example.com/bob-johnson-profile-picture.png',
												},
											},
											content: 'Thanks for sharing!',
										},
									],
								}}
								handleReact={console.log}
								width="100%"
							/>
						</Box>
					</SwiperSlide>

					<SwiperSlide>
						<Box p={2} display="flex" alignItems="center" flexDirection="column" gap={2}>
							<Typography variant="h5" sx={{ fontWeight: 700 }}>
								Bình luận
							</Typography>

							<CommentCard
								post={{
									_id: '64f20e8af28a2c3f67daf564',
									author: {
										_id: '123',
										fullname: 'John Doe',
										profilePicture: { link: 'https://example.com/johndoe.jpg' },
									},
									createdAt: '2022-05-05T13:30:00.000Z',
									content: 'This is a post.',
								}}
								comment={{
									_id: '64f20e8af28a2c3f67daf564',
									author: {
										_id: '456',
										fullname: 'Jane Doe',
										profilePicture: { link: 'https://example.com/janedoe.jpg' },
									},
									createdAt: '2022-05-06T09:45:00.000Z',
									content: 'This is a comment.',
								}}
								isReply={false}
								handleDelete={(commentId) => console.log('Deleting comment with ID:', commentId)}
								handleReact={(commentId, reaction) =>
									console.log('Reacting to comment with ID:', commentId, 'with reaction:', reaction)
								}
								sx={{ backgroundColor: 'white', width: '100%' }}
							/>
						</Box>
					</SwiperSlide>
					<SwiperSlide>Slide 3</SwiperSlide>
					<SwiperSlide>Slide 4</SwiperSlide>
				</Swiper>
			</Box>
		</Box>
	);
}
