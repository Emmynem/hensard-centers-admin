import axios from 'axios';
import { config } from '../config';

const getReports = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/report/all?page=${page}&size=${size}`,
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

const searchReports = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/reports?page=${page}&size=${size}&search=${payload.search}`,
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

const getReport = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/report?unique_id=${payload.unique_id}`,
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

const getReportViaStripped = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/report/via/stripped?stripped=${payload.stripped}`,
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

const addReport = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/report/add`,
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

const editReportDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/report/edit/details`,
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

const editReportImage = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/report/edit/image`,
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

const editReportFile = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/report/edit/file`,
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

const deleteReport = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/report`,
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

export { getReports, getReport, getReportViaStripped, addReport, editReportDetails, editReportImage, editReportFile, deleteReport, searchReports };