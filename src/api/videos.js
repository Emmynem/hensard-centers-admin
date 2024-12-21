import axios from 'axios';
import { config } from '../config';

const getVideos = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/video/all?page=${page}&size=${size}`,
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

const getVideo = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/video?unique_id=${payload.unique_id}`,
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

const addVideo = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/video/add`,
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

const editVideoDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/video/edit/details`,
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

const deleteVideo = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/video`,
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

export { getVideos, getVideo, addVideo, editVideoDetails, deleteVideo };