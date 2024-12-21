import axios from 'axios';
import { config } from '../config';

const publicGetCategories = async function (token) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/categories?center_unique_id=${JSON.parse(token).center_unique_id}`,
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getCategories = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/category/all?page=${page}&size=${size}`,
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

const searchCategories = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/categories?page=${page}&size=${size}&search=${payload.search}`,
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

const getCategory = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/category?unique_id=${payload.unique_id}`,
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

const getCategoryViaStripped = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/category/via/stripped?stripped=${payload.stripped}`,
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

const addCategory = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/category/add`,
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

const editCategoryDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/category/edit/details`,
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

const editCategoryImage = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/category/edit/image`,
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

const deleteCategory = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/category`,
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

export { publicGetCategories, getCategories, getCategory, getCategoryViaStripped, addCategory, editCategoryDetails, editCategoryImage, deleteCategory, searchCategories };