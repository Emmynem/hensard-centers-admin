import axios from 'axios';
import { config } from '../config';

const getStaffProfile = async function (token) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/staff/profile`,
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

const updateProfilePhoto = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/staff/profile/image`,
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

const updateProfileNames = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/staff/profile/names`,
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

const updateProfileDetails = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/staff/profile/details`,
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

const updateProfileAddressDetails = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/staff/profile/address/details`,
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

const changePassword = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/staff/password/change`,
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

export { getStaffProfile, updateProfilePhoto, updateProfileNames, updateProfileDetails, updateProfileAddressDetails, changePassword };