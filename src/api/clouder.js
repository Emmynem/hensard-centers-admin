import axios from 'axios';
import { config } from '../config';

const uploadDocument = async function (data) {
	try {
		const response = await axios.post(
			`${config.clouderUrl}/upload/document`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					'clouder-access-key': config.cloudy_access_key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const uploadFile = async function (data) {
	try {
		const response = await axios.post(
			`${config.clouderUrl}/upload/image`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					'clouder-access-key': config.cloudy_access_key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const uploadFiles = async function (data) {
	try {
		const response = await axios.post(
			`${config.clouderUrl}/upload/images`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					'clouder-access-key': config.cloudy_access_key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

export { uploadFiles, uploadFile, uploadDocument };