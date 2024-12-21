import axios from 'axios';
import { config } from '../config';

const getEnrollments = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/enrollment/all?page=${page}&size=${size}`,
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

const getEnrollmentsViaCourse = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/enrollments/via/course?page=${page}&size=${size}&course_unique_id=${payload.course_unique_id}`,
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

const getEnrollmentsViaReference = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/enrollments/via/reference?page=${page}&size=${size}&reference=${payload.reference}`,
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

const getEnrollmentsViaEnrollmentStatus = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/enrollments/via/enrollment/status?page=${page}&size=${size}&enrollment_status=${payload.enrollment_status}`,
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

const filterEnrollmentsViaEnrolledDate = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/filter/enrollments/via/enrolled/date?page=${page}&size=${size}&start_date=${payload.start_date}&end_date=${payload.end_date}`,
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

const filterEnrollmentsViaCompletionDate = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/filter/enrollments/via/completion/date?page=${page}&size=${size}&start_date=${payload.start_date}&end_date=${payload.end_date}`,
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

const filterEnrollmentsViaCertificationDate = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/filter/enrollments/via/certification/date?page=${page}&size=${size}&start_date=${payload.start_date}&end_date=${payload.end_date}`,
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

const searchEnrollments = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/enrollments?page=${page}&size=${size}&search=${payload.search}`,
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

const getEnrollment = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/enrollment?unique_id=${payload.unique_id}`,
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

const addEnrollment = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/enrollment/add`,
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

const editEnrollmentDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/enrollment/edit/details`,
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

const completeEnrollment = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/enrollment/complete`,
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

const cancelEnrollment = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/enrollment/cancel`,
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

const issueEnrollmentCertification = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/enrollment/issue/certification`,
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

const deleteEnrollment = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/enrollment`,
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

export {
	getEnrollments, getEnrollmentsViaCourse, getEnrollment, addEnrollment, editEnrollmentDetails, completeEnrollment, getEnrollmentsViaReference, 
	cancelEnrollment, issueEnrollmentCertification, deleteEnrollment, searchEnrollments, getEnrollmentsViaEnrollmentStatus, 
	filterEnrollmentsViaEnrolledDate, filterEnrollmentsViaCompletionDate, filterEnrollmentsViaCertificationDate
};