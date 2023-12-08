'use client';

import { createPost, deletePostById, getAllPosts, updatePost } from '@/services/api';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { LargeButton, PostActions, PostContainer, PostContent, PostCreatedDate, PostFooter, PostHeader, PostsContainer, PostStack, PostTitle, PostUpdatedLabel } from './styles';
import { IconButton, Divider, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Backdrop, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

type Post = {
	id: string
	title: string
	content: string
	createdAt: Date
	updatedAt: Date
	updated: boolean
}

type PostProps = {
	post: Post
	onEdit: (post: Post) => void
	onDelete: (post: Post) => void
}

function PostItem({ post, onEdit, onDelete }: PostProps) {
	const formatDate = useCallback((dateString: Date) => {
		const date = new Date(dateString);

		const dateText = date.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
		const timeText = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

		return `${dateText} ${timeText}`;
	}, []);

	return (
		<PostContainer elevation={5}>
			<PostHeader>
				<PostTitle>{post.title}</PostTitle>
				<PostActions>
					<Tooltip title='edit'><IconButton onClick={() => onEdit(post)}><Edit /></IconButton></Tooltip>
					<Tooltip title='delete'><IconButton onClick={() => onDelete(post)}><Delete /></IconButton></Tooltip>
				</PostActions>
			</PostHeader>
			<Divider variant='middle' />
			<PostContent>{post.content}</PostContent>
			<Divider variant='middle' />
			<PostFooter>
				<PostCreatedDate>{formatDate(post.createdAt)}</PostCreatedDate>
				{post.updated &&
					<Tooltip placement='bottom-start' title={formatDate(post.updatedAt)}>
						<PostUpdatedLabel>(edited)</PostUpdatedLabel>
					</Tooltip>
				}
			</PostFooter>
		</PostContainer>
	);
}

type DialogProps = {
	open: boolean
	onAction: () => void
	onClose: () => void
}

type DialogWithPostProps = DialogProps & {
	post: Post | null
}

function CreatePostDialog({ open, onAction, onClose }: DialogProps) {
	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const { title, content } = e.target as any;

		createPost(title.value, content.value)
			.then(onClose)
			.then(onAction);

		return false;
	}

	return (
		<Dialog component={'form'} onSubmit={onSubmit} open={open} onClose={onClose}>
			<DialogTitle>Create Post</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{`To create a Post, please enter the "Title" and "Content" of the post`}
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="title"
					label="Post Title"
					type="title"
					fullWidth
					required={true}
					variant="standard"
				/>
				<TextField
					autoFocus
					multiline={true}
					margin="dense"
					id="content"
					label="Post Content"
					type="content"
					fullWidth
					required={true}
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button type='submit'>Create</Button>
			</DialogActions>
		</Dialog>
	);
}

function EditPostDialog({ open, onAction, onClose, post }: DialogWithPostProps) {
	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const { title, content } = e.target as any;

		updatePost(post?.id || '', title.value || post?.title, content.value || post?.content)
			.then(onClose)
			.then(onAction);

		return false;
	}

	return (
		<Dialog component={'form'} onSubmit={onSubmit} open={open} onClose={onClose}>
			<DialogTitle>Edit Post</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="title"
					label="Post Title"
					type="title"
					fullWidth
					defaultValue={post?.title}
					required={true}
					variant="standard"
				/>
				<TextField
					autoFocus
					multiline={true}
					margin="dense"
					id="content"
					label="Post Content"
					type="content"
					fullWidth
					defaultValue={post?.content}
					required={true}
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button type='submit'>Edit</Button>
			</DialogActions>
		</Dialog>
	);
}

function DeletePostDialog({ open, post, onAction, onClose }: DialogWithPostProps) {
	const onSubmit = (e: React.FormEvent) => {

		deletePostById(post?.id || '')
			.then(onClose)
			.then(onAction);
		
		e.preventDefault();
	};

	return (
		<Dialog component={'form'} onSubmit={onSubmit} open={open} onClose={onClose}>
			<DialogTitle>Delete Post?</DialogTitle>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button type='submit'>Delete</Button>
			</DialogActions>
		</Dialog>
	);
}

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
	const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [targetPost, setTargetPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchPostData = useCallback(async () => {
		setLoading(true);
		const response = await getAllPosts();
		if(!response.ok) return;
		
		const data = await response.json();

		await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
		
		setPosts(data.posts);
		setLoading(false);
	}, []);

	useEffect(() => {
		if(!posts.length)
			fetchPostData();
	}, [posts.length, fetchPostData]);

	const onEdit = useCallback((post: Post) => {
		setTargetPost(post);
		setOpenEditDialog(true);
	}, []);
	const onDelete = useCallback((post: Post) => {
		setTargetPost(post);
		setOpenDeleteDialog(true);
	}, []);

	const MemoPostItem = useMemo(() => PostItem, []);

  return (
    <PostsContainer>
			<Backdrop
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}
			>
				<CircularProgress />
			</Backdrop>
			<CreatePostDialog open={openCreateDialog} onAction={fetchPostData} onClose={() => setOpenCreateDialog(false)} />
			<EditPostDialog open={openEditDialog} onAction={fetchPostData} onClose={() => setOpenEditDialog(false)} post={targetPost} />
			<DeletePostDialog open={openDeleteDialog} onAction={fetchPostData} onClose={() => setOpenDeleteDialog(false)} post={targetPost}/>
			<LargeButton onClick={() => setOpenCreateDialog(true)} size='large' variant='contained'>Create Post</LargeButton>
			<PostStack width={'100%'} margin={2} spacing={2}>
				{posts.map((post, key) => 
					<MemoPostItem key={key} post={post} onEdit={onEdit} onDelete={onDelete}/>
				)}
			</PostStack>
    </PostsContainer>
  )
}
