import CallEndRounded from '@mui/icons-material/CallEndRounded';
import MicRounded from '@mui/icons-material/MicRounded';
import VideoCallRounded from '@mui/icons-material/VideoCallRounded';
import { Box, BoxProps, IconButton, Stack } from '@mui/material';
import { useUserStore } from '@store';
import { authToken } from '@utils/api';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactPlayer from 'react-player';

function Participant({ participantId }: { participantId: string }) {
	const micRef = useRef<HTMLAudioElement>(null);
	const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);

	const videoStream = useMemo(() => {
		if (webcamOn && webcamStream) {
			const mediaStream = new MediaStream();
			mediaStream.addTrack(webcamStream.track);
			return mediaStream;
		}
	}, [webcamStream, webcamOn]);

	useEffect(() => {
		if (micRef.current) {
			if (micOn && micStream) {
				const mediaStream = new MediaStream();
				mediaStream.addTrack(micStream.track);

				micRef.current.srcObject = mediaStream;
				micRef.current.play().catch((error) => console.error('videoElem.current.play() failed', error));
			} else {
				micRef.current.srcObject = null;
			}
		}
	}, [micStream, micOn]);

	return (
		<div key={participantId}>
			<p>
				Participant: {displayName} | Webcam: {webcamOn ? 'ON' : 'OFF'} | Mic: {micOn ? 'ON' : 'OFF'}
			</p>
			<audio ref={micRef} autoPlay muted={isLocal} />
			{webcamOn && (
				<ReactPlayer
					//
					playsinline // very very imp prop
					pip={false}
					light={false}
					controls={false}
					muted={true}
					playing={true}
					//
					url={videoStream}
					//
					height={'200px'}
					width={'300px'}
					onError={(err) => {
						console.log(err, 'participant video error');
					}}
				/>
			)}
		</div>
	);
}

function Controls({ ...props }: BoxProps) {
	const { end, toggleMic, toggleWebcam } = useMeeting();
	return (
		<Box {...props}>
			<Stack
				direction="row"
				spacing={2}
				justifyContent="center"
				p={2}
				sx={{
					'& button': {
						backgroundColor: 'white',
						boxShadow: 1,
					},
				}}
			>
				<IconButton onClick={() => toggleWebcam()}>
					<VideoCallRounded />
				</IconButton>

				<IconButton onClick={() => toggleMic()}>
					<MicRounded />
				</IconButton>

				<IconButton onClick={end} color="error">
					<CallEndRounded />
				</IconButton>
			</Stack>
		</Box>
	);
}

enum JoinState {
	JOINING = 'JOINING',
	JOINED = 'JOINED',
}

function Screen() {
	const [joined, setJoined] = useState<JoinState>(JoinState.JOINING);
	// Get the method which will be used to join the meeting.
	// We will also get the participants list to display all participants
	const { join, participants, leave } = useMeeting({
		// callback for when meeting is joined successfully
		onMeetingJoined: () => {
			setJoined(JoinState.JOINED);
		},
		// callback for when meeting is left
		onMeetingLeft: () => {
			// close popup
			window?.close();
		},
		onError: ({ code, message }) => {
			console.error(code, message);
			toast.error(message);
		},
	});

	useEffect(() => {
		console.log('joining meeting');
		join(); // join the meeting

		return () => {
			console.log('leaving meeting');
			leave(); // leave the meeting
		};
	}, []);

	return (
		<Box width="100vw">
			{joined === JoinState.JOINED ? (
				Array.from(participants.keys()).map((participantId) => (
					<Participant participantId={participantId} key={participantId} />
				))
			) : (
				<p>Joining the meeting...</p>
			)}

			<Controls sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} />
		</Box>
	);
}

export function VideoCallScreen() {
	const router = useRouter();
	const { id } = router.query as { id: string };
	const { user } = useUserStore();

	return (
		<MeetingProvider
			config={{
				meetingId: id,
				micEnabled: true,
				webcamEnabled: true,
				name: user!.fullname,
			}}
			token={authToken}
		>
			<Screen />
		</MeetingProvider>
	);
}
