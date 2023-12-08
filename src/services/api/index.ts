const request = (url: string, method: string = "GET", body?: object) => {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
		method,
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}

export const getAllPosts = () => {
	return request('/posts');
};

export const getPostById = (id: string) => {
	return request(`/posts/${id}`);
};

export const createPost = (title: string, content: string) => {
	return request(`/posts/create`, "POST", { title, content });
};

export const updatePost = (id: string, title?: string, content?: string) => {
	return request('/posts/update', "PUT", { id, title, content });
};

export const deletePostById = (id: string) => {
	return request('/posts/delete', "DELETE", { id });
}
