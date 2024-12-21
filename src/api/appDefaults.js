import axios from 'axios';
import { config } from '../config';

const getAllAppDefault = async function (key, page, size) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/app/default/all`,
			{
				page,
				size
			},
			{
				headers: {
					'hsdc-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getAppDefault = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/app/default`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const addAppDefault = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/app/default/add`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editAppDefault = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/app/default/edit`,
			{
				...payload
			},
			{
				headers: {
					'hsdc-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const deleteAppDefault = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/app/default`,
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

export { getAllAppDefault, getAppDefault, addAppDefault, editAppDefault, deleteAppDefault };