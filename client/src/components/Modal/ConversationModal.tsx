import React, { useEffect, useState } from 'react';
import { useInfiniteFetcher } from '@hooks';
import { LoadingButton } from '@mui/lab';
import {
	Avatar,
	Badge,
	Box,
	Button,
	CircularProgress,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grow,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { getShortName } from '@utils/common';
import { AiFillCloseCircle } from 'react-icons/ai';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TransitionGroup } from 'react-transition-group';
import Swal from 'sweetalert2';
import { SearchInput } from '@components/MUI';

const Transition = React.forwardRef(function Transition(props: { children: JSX.Element }, ref) {
	return (
		<Grow ref={ref} {...props}>
			{props.children}
		</Grow>
	);
});

interface Props {
	open: boolean;
	handleClose: () => void;
	// eslint-disable-next-line no-unused-vars
	handleSubmit: (data: any) => Promise<void>;
	mode?: 'create' | 'edit';
	listMemberInConversation?: any[];
}

export function ConversationModal({
	open,
	handleClose,
	handleSubmit: onSubmit,
	mode = 'create',
	listMemberInConversation = [],
}: Props) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const searchFetcher = useInfiniteFetcher('users/searchUser/friends');
	const searchResults = searchFetcher.data;

	useEffect(() => {
		searchFetcher.reload();
	}, []);

	const handleSearch = (value: string) => searchFetcher.filter({ key: value });

	const handleSubmit = async () => {
		if (listMember.length === 0) {
			return Swal.fire({
				icon: 'warning',
				title: 'Vui lòng chọn thành viên',
			});
		} else {
			setIsSubmitting(true);

			await onSubmit(listMember);

			setListMember([]);
			searchFetcher.reload();
			handleClose();
			setIsSubmitting(false);
		}
	};

	const [listMember, setListMember] = useState<any[]>([]);

	const renderListResult = () =>
		searchResults
			// Filter selected member
			?.filter((mem: any) => !listMember.find((selectedMem: any) => selectedMem._id === mem._id))
			// Filter member in conversation
			?.filter((user: any) => {
				const isExist = listMemberInConversation.find((mem) => mem.user._id === user._id);
				return !isExist;
			})
			.map((member: any) => (
				<Collapse key={member._id}>
					<Box
						display="flex"
						alignItems="center"
						sx={{
							p: '8px',
							cursor: 'pointer',
							'&:hover': {
								backgroundColor: '#1877f22f',
							},
							borderRadius: '8px',
						}}
						onClick={() => setListMember((prev) => [...prev, member])}
					>
						<Avatar src={member.profilePicture?.link} alt={member.fullname} sx={{ marginRight: '16px' }}>
							{getShortName(member.fullname)}
						</Avatar>

						<Typography fontSize={16} fontWeight={600}>
							{member.fullname}
						</Typography>
					</Box>
				</Collapse>
			));

	const renderListMember = () =>
		listMember.length > 0 && (
			<Box width="100%" overflow={'auto'} px={1}>
				<Typography fontWeight="bold" fontSize={14}>
					Đã chọn:
				</Typography>
				<Box display={'flex'} gap={2} flexWrap="wrap" my={1}>
					{listMember.map((member: any) => (
						<Badge
							key={member._id}
							anchorOrigin={{
								horizontal: 'right',
								vertical: 'top',
							}}
							overlap="circular"
							badgeContent={
								<Box
									borderRadius={'50%'}
									bgcolor="white"
									sx={{ cursor: 'pointer' }}
									onClick={() => {
										const newListMember = listMember.filter(
											(mem: any) => mem.email !== member.email
										);
										setListMember(newListMember);
									}}
								>
									<AiFillCloseCircle size={20} color="red" />
								</Box>
							}
						>
							<Tooltip title={member.fullname}>
								<Avatar src={member.profilePicture?.link} alt={member.fullname}>
									{getShortName(member.fullname)}
								</Avatar>
							</Tooltip>
						</Badge>
					))}
				</Box>
			</Box>
		);

	return (
		<Dialog
			TransitionComponent={Transition}
			open={open}
			onClose={handleClose}
			PaperProps={{
				sx: {
					borderRadius: '16px',
					height: {
						md: '600px',
						xs: '100%',
					},
				},
			}}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>{mode === 'create' ? 'Tạo cuộc trò chuyện mới' : 'Thêm thành viên'}</DialogTitle>

			<Box sx={{ mx: 2, p: 0, mb: 1 }}>
				<SearchInput placeholder="Tìm kiếm người dùng" onSearch={handleSearch} fullWidth />
			</Box>
			<DialogContent sx={{ mx: 2, p: 0 }}>
				<Box display={'flex'} flexDirection={'column'}>
					<Box
						display={'flex'}
						flexDirection={'column'}
						flex={'0 0 auto'}
						gap={'4px'}
						height={'100%'}
						overflow="hidden auto"
						id="search-result"
					>
						<InfiniteScroll
							scrollableTarget="search-result"
							dataLength={searchResults.length}
							next={searchFetcher.loadMore}
							hasMore={searchFetcher.hasMore}
							loader={
								<Box key="next-loader" display="flex" justifyContent="center" alignItems="center" m={2}>
									<CircularProgress />
								</Box>
							}
							endMessage={
								!searchFetcher.fetching && (
									<Box key="end-message" display="flex" justifyContent="center" m={2}>
										{searchResults.length === 0
											? 'Không tìm thấy kết quả phù hợp'
											: 'Đã tải hết kết quả'}
									</Box>
								)
							}
						>
							<TransitionGroup component={null}>{renderListResult()}</TransitionGroup>
						</InfiniteScroll>
					</Box>
				</Box>
			</DialogContent>
			<DialogActions
				sx={{
					flexDirection: 'column',
					p: 2,
					pt: 0,
					alignItems: 'flex-end',
				}}
			>
				{renderListMember()}
				<Stack direction="row" spacing={2} sx={{ mt: 1 }} justifyContent="flex-end">
					<Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
						Hủy
					</Button>
					<LoadingButton variant="contained" onClick={handleSubmit} loading={isSubmitting}>
						{mode === 'create' ? 'Tạo' : 'Thêm'}
					</LoadingButton>
				</Stack>
			</DialogActions>
		</Dialog>
	);
}
