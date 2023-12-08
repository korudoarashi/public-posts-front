import { Paper, Box, styled, Button, Stack, Typography } from '@mui/material';
import { theme } from '../globalStyles';

export const PostsContainer = styled(Box)`
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	padding: 1rem;
	box-sizing: border-box;
	flex-direction: column;
`;

export const LargeButton = styled(Button)`
	width: 100%;
	height: 4rem;
	font-size: 1.3rem;
`;

export const PostContainer = styled(Paper)`
	width: 100%;
	max-height: 300px;
	border-radius: 0.4rem;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
`;

export const PostStack = styled(Stack)`

`;

export const PostHeader = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0.4rem;
	margin-left: 0.7rem;
	margin-right: 0.7rem;
`;

export const PostTitle = styled(Typography)`
	font-size: 2rem;
	margin: 0.2rem;
`;

export const PostActions = styled(Box)`

`;

export const PostContent = styled(Box)`
 	padding: 0.4rem 1rem;
	overflow-y: auto;
	background: rgba(0, 0, 0, 0.1);
`;

export const PostFooter = styled(Box)`
	display: flex;
	justify-content: end;
	align-items: center;
	margin: 0.3rem 1rem;
	gap: 0.2rem;
`;

export const PostCreatedDate = styled(Typography)`
	color: ${theme.palette.grey[400]};
`;

export const PostUpdatedLabel = styled(Typography)`
	color: ${theme.palette.grey[600]};
	font-size: ${theme.typography.caption};
`;
