import axios from 'axios';
import { config } from '../config';

const getApiKeys = async function (key, page, size) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/api/keys`,
			{
				page,
				size
			},
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const addApiKey = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/api/key/add`,
			{
				...payload
			},
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const disableApiKey = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/api/key/disable`,
			{
				...payload
			},
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const enableApiKey = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/api/key/enable`,
			{
				...payload
			},
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const deleteApiKey = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/api/key`,
			{
				data: {
					key,
					...payload
				}
			},
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

export { getApiKeys, addApiKey, disableApiKey, enableApiKey, deleteApiKey };