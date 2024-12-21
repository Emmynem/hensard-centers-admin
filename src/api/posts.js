import axios from 'axios';
import { config } from '../config';

const getPosts = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/post/all?page=${page}&size=${size}`,
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getPostsViaCategory = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/posts/via/category?page=${page}&size=${size}&post_category_unique_id=${payload.post_category_unique_id}&post_type_unique_id=${payload.post_type_unique_id}`,
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const searchPosts = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/posts?page=${page}&size=${size}&search=${payload.search}`,
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getPost = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/post?unique_id=${payload.unique_id}`,
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getPostViaStripped = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/post/via/stripped?stripped=${payload.stripped}`,
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const addPost = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/post/add`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editPostDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/post/edit/details`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editPostTitle = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/post/edit/title`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editPostCategory = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/post/edit/category`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editPostAltText = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/post/edit/alt/text`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editPostTimestamp = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/post/edit/timestamp`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editPostImage = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/post/edit/image`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-token': JSON.parse(token).token
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const deletePost = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/post`,
			{
				data: {
					token: JSON.parse(token).token,
					...payload
				}
			},
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

export {
	getPosts, getPostsViaCategory, getPost, getPostViaStripped, addPost, editPostDetails, editPostTitle,
	editPostCategory, editPostAltText, editPostImage, editPostTimestamp, deletePost, searchPosts
};