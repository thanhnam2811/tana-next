import { useEffect, useRef, useState } from 'react';
import styles from './LandingPage.module.scss';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';

export default function LandingBanner() {
	const [vanta, setVanta] = useState<any>(null);
	const bannerRef = useRef(null);

	useEffect(() => {
		setVanta(
			NET({
				el: bannerRef.current,
				mouseControls: true,
				touchControls: true,
				gyroControls: false,
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

	return <div ref={bannerRef} className={styles.banner_bg} />;
}
