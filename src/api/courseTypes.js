import axios from 'axios';
import { config } from '../config';

const publicGetCourseTypes = async function (token) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/course/types?center_unique_id=${JSON.parse(token).center_unique_id}`,
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getCourseTypes = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/course/type/all?page=${page}&size=${size}`,
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

const searchCourseTypes = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/course/types?page=${page}&size=${size}&search=${payload.search}`,
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

const getCourseType = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/course/type?unique_id=${payload.unique_id}`,
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

const getCourseTypeViaStripped = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/course/type/via/stripped?stripped=${payload.stripped}`,
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

const addCourseType = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/course/type/add`,
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

const editCourseTypeDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/course/type/edit/details`,
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

const deleteCourseType = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/course/type`,
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

export { publicGetCourseTypes, getCourseTypes, getCourseType, getCourseTypeViaStripped, addCourseType, editCourseTypeDetails, deleteCourseType, searchCourseTypes };