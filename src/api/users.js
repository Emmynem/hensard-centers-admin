import axios from 'axios';
import { config } from '../config';

const getUsers = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/users?page=${page}&size=${size}`,
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

const searchUsers = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/users?page=${page}&size=${size}&search=${payload.search}`,
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

const getUser = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/user?unique_id=${payload.unique_id}`,
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

const getUserViaEmail = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/user/via/email?email=${payload.email}`,
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

const updateUserEmail = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/user/email`,
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
		return { err: true, error };
	}
};

const grantUserAccess = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/user/access/grant`,
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

const suspendUserAccess = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/user/access/suspend`,
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

const revokeUserAccess = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/user/access/revoke`,
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

export { getUsers, searchUsers, getUser, getUserViaEmail, updateUserEmail, grantUserAccess, suspendUserAccess, revokeUserAccess };