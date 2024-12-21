import axios from 'axios';
import { config } from '../config';

const getGalleries = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/gallery/all?page=${page}&size=${size}`,
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

const getGallery = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/gallery?unique_id=${payload.unique_id}`,
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

const uploadGalleryImages = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/gallery/add/images`,
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

const deleteGalleryImage = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/gallery`,
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

export { getGalleries, getGallery, uploadGalleryImages, deleteGalleryImage };