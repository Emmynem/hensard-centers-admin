import axios from 'axios';
import { config } from '../config';

const publicGetCourses = async function (token) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/courses?center_unique_id=${JSON.parse(token).center_unique_id}`,
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getCourses = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/course/all?page=${page}&size=${size}`,
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

const getCoursesViaAll = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/courses/via/all?page=${page}&size=${size}&course_category_unique_id=${payload.course_category_unique_id}&course_type_unique_id=${payload.course_type_unique_id}`,
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

const searchCourses = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/courses?page=${page}&size=${size}&search=${payload.search}`,
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

const getCourse = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/course?unique_id=${payload.unique_id}`,
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

const getCourseViaStripped = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/course/via/stripped?stripped=${payload.stripped}`,
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

const addCourse = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/course/add`,
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

const editCourseDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/course/edit/details`,
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

const editCourseEnrollmentDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/course/edit/enrollment/details`,
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

const editCourseCertificateTemplate = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/course/edit/certificate_template`,
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

const editCourseOtherDetails = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/course/edit/other/details`,
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

const editCourseImage = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/course/edit/image`,
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

const toggleCourseActiveEnrollment = async function (token, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/internal/toggle/course/active/enrollment`,
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

const deleteCourse = async function (token, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/internal/course`,
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
	getCourses, getCoursesViaAll, getCourse, getCourseViaStripped, addCourse, editCourseDetails, editCourseEnrollmentDetails, publicGetCourses, 
	editCourseCertificateTemplate, editCourseOtherDetails, editCourseImage, toggleCourseActiveEnrollment, deleteCourse, searchCourses 
};