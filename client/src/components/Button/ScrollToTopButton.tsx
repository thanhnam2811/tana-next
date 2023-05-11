import { MyIconButton } from '@components/MUI';
import { Box } from '@mui/material';
import { SCROLL_THRESHOLD } from '@utils/common';
import { useEffect, useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export const ScrollToTopButton = () => {
	const scrollToTopRef = useRef<HTMLDivElement>(null);
	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	const handleScroll = () => {
		if (window.scrollY > SCROLL_THRESHOLD) {
			scrollToTopRef.current?.classList.add('show');
		} else {
			scrollToTopRef.current?.classList.remove('show');
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<Box
			ref={scrollToTopRef}
			position="fixed"
			m="auto"
			right={0}
			bottom={0}
			display="flex"
			justifyContent="center"
			zIndex={1000}
			sx={{
				transition: 'all 0.3s ease',
				transform: 'translate(0, 100%)',
				'&.show': {
					transform: 'translate(0, 0)',
				},
			}}
		>
			<MyIconButton tooltip="Mới nhất" variant="color" Icon={FaArrowUp} onClick={handleScrollToTop} />
		</Box>
	);
};
