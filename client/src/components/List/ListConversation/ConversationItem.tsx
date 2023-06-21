import { GroupAvatar, UserAvatar } from '@components/MUI';
import { Button, ButtonProps, Grid, Skeleton, Typography } from '@mui/material';
import { useAuth } from '@modules/auth/hooks';
import { getTimeAgo, stringUtil } from '@utils/common';
import { useRouter } from 'next/router';

type Props = {
	conversation: any;
	isActived: boolean;
};

export function ConversationItem({ conversation, isActived, ...props }: Props & ButtonProps) {
	const { authUser } = useAuth();
	const router = useRouter();

	let { avatar, name } = conversation;
	const { _id, members, lastest_message, updatedAt } = conversation;

	const isDirect = members?.length === 2;
	const receiver = isDirect && members?.find((member: any) => member.user._id !== authUser?._id);
	if (isDirect) {
		console.log('receiver', receiver);

		avatar = receiver?.user?.profilePicture;
		name = receiver?.nickname || receiver?.user?.fullname;
	}

	const handleClick = () => {
		if (isActived) return; // do nothing if click on actived conversation

		router.push(`/messages/${_id}`); // navigate to conversation
	};

	return (
		<Button
			variant={isActived ? 'contained' : 'text'}
			fullWidth
			startIcon={
				isDirect ? (
					<UserAvatar user={receiver?.user} size={40} src={avatar?.link} sx={{ bgcolor: 'white' }} />
				) : (
					<GroupAvatar listMember={members} size={40} />
				)
			}
			onClick={handleClick}
			{...props}
			sx={{
				transition: 'all .3s ease',
				'&:hover': {
					backgroundColor: isActived ? 'primary.main' : 'primary.light',
					color: 'white',
					'& *': {
						color: 'white !important',
					},
				},
				...props.sx,
			}}
		>
			<Grid container width="100%" overflow="hidden">
				<Typography
					component={Grid}
					item
					overflow="hidden"
					noWrap
					textOverflow="ellipsis"
					xs
					align="left"
					variant="button"
				>
					{name}
				</Typography>

				<Typography
					component={Grid}
					item
					xs="auto"
					align="right"
					color={isActived ? 'white' : 'text.secondary'}
					variant="caption"
				>
					{getTimeAgo(lastest_message?.createAt || updatedAt)}
				</Typography>

				<Typography
					component={Grid}
					item
					xs={12}
					overflow="hidden"
					noWrap
					textOverflow="ellipsis"
					align="left"
					color={isActived ? 'white' : 'text.secondary'}
					variant="body2"
				>
					<strong>{lastest_message?.sender?.fullname?.concat(': ')}</strong>
					{stringUtil.renderHTML(lastest_message?.text || '<i>Chưa có tin nhắn</i>')}
				</Typography>
			</Grid>
		</Button>
	);
}

export const ConversationItemSkeleton = () => (
	<Button variant="text" fullWidth startIcon={<Skeleton variant="circular" width={40} height={40} />}>
		<Grid container width="100%" overflow="hidden">
			<Typography component={Grid} item overflow="hidden" noWrap textOverflow="ellipsis" xs align="left">
				<Skeleton width="100%" />
			</Typography>

			<Typography component={Grid} item xs="auto" align="right" ml={1}>
				<Skeleton width={60} />
			</Typography>

			<Typography component={Grid} item xs={12} overflow="hidden" noWrap textOverflow="ellipsis" align="left">
				<Skeleton width="100%" />
			</Typography>
		</Grid>
	</Button>
);