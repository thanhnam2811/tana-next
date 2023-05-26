import { withAuth } from '@components/Auth';
import dynamic from 'next/dynamic';

const VideoCallScreen = dynamic(() => import('@components/Call/Video').then((mod) => mod.VideoCallScreen), {
	ssr: false,
});

export default withAuth(VideoCallScreen);
