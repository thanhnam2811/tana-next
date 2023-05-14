import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';

export function Landing() {
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

	return <Box ref={bannerRef} width="100%" />;
}
