import React, { useEffect } from 'react';
import Layout from '@layout/components';
import dynamic from 'next/dynamic';
import styles from './LandingPage.module.scss';
import Aos from 'aos';
import { Button, Card, Typography } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { HiArrowRight } from 'react-icons/hi2';

const LandingBanner = dynamic(() => import('./LandingBanner'), { ssr: false });

function LandingPage() {
	useEffect(() => {
		// init AOS
		Aos.init({
			throttleDelay: 200, // the delay on throttle used while scrolling the page (advanced)
			delay: 200,
			duration: 800,
		});
	}, []);

	return (
		<Layout.Container className={styles.container}>
			{/*	Banner */}
			<section className={styles.banner} id="banner">
				<LandingBanner />

				<div className={styles.content}>
					<Typography.Title level={1} className={styles.title} data-aos="fade-down">
						<strong>TaNa</strong> - Kết nối và sáng tạo
					</Typography.Title>

					<Typography.Text className={styles.description} data-aos="fade-down">
						Sáng tạo và kết nối cùng <strong>TaNa</strong> - Nơi gặp gỡ những tài năng đầy tiềm năng!
					</Typography.Text>

					<Button type="primary" className={styles.button} data-aos="fade-up">
						<span>Bắt đầu</span>

						<HiArrowRight />
					</Button>
				</div>
			</section>

			{/*	Intro */}
			<section className={styles.intro} id="intro">
				<Typography.Title level={2} className={styles.title} data-aos="zoom-in-up">
					Giới thiệu về <strong>TaNa</strong>
				</Typography.Title>

				<Typography.Text className={styles.description} data-aos="zoom-in-up">
					<strong>TaNa</strong> là một mạng xã hội mới, dành cho những người yêu thích sáng tạo và muốn chia
					sẻ kiến thức, kinh nghiệm và ý tưởng của mình với cộng đồng. Trên TaNa, người dùng có thể tạo và
					chia sẻ bài viết, hình ảnh, video, tham gia các nhóm chuyên đề, tạo dự án và sản phẩm sáng tạo. Mục
					tiêu của TaNa là tạo ra một cộng đồng sáng tạo, tích cực và mang lại giá trị cho những người tham
					gia.
				</Typography.Text>

				<div className={styles.content}>
					<Card className={styles.card} data-aos="flip-up" title="Mục tiêu">
						<Typography.Text>
							Được thành lập từ năm 2021, <strong>TaNa</strong> là một nền tảng kết nối và sáng tạo, nơi
							mọi người có thể tìm kiếm những người có cùng sở thích và sở trường để cùng nhau sáng tạo ra
							những sản phẩm độc đáo và đầy tính sáng tạo.
						</Typography.Text>
					</Card>

					<Card className={styles.card} data-aos="flip-up" title="Giá trị" data-aos-delay="400">
						<Typography.Text>
							<strong>TaNa</strong> luôn đặt lợi ích của người dùng lên hàng đầu, chúng tôi luôn cố gắng
							để mang đến những trải nghiệm tốt nhất cho người dùng.
						</Typography.Text>
					</Card>

					<Card className={styles.card} data-aos="flip-up" title="Sứ mệnh" data-aos-delay="800">
						<Typography.Text>
							<strong>TaNa</strong> mong muốn mang đến cho người dùng một nền tảng kết nối và sáng tạo,
							nơi mọi người có thể tìm kiếm những người có cùng sở thích và sở trường để cùng nhau sáng
							tạo ra những sản phẩm độc đáo và đầy tính sáng tạo.
						</Typography.Text>
					</Card>
				</div>
			</section>

			{/*	Features */}
			<section className={styles.features} id="features">
				<Typography.Title level={2} className={styles.title} data-aos="fade-down">
					Tính năng
				</Typography.Title>

				<Swiper slidesPerView={3} centeredSlides spaceBetween={20}>
					<SwiperSlide>Slide 1</SwiperSlide>
					<SwiperSlide>Slide 2</SwiperSlide>
					<SwiperSlide>Slide 3</SwiperSlide>
					<SwiperSlide>Slide 4</SwiperSlide>
				</Swiper>
			</section>
		</Layout.Container>
	);
}

export default LandingPage;
