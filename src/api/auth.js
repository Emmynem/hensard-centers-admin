import axios from 'axios';
import { config } from '../config';

const staffSignup = async function (payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/auth/staff/signup`,
			{ ...payload }
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};

const resendVerificationEmail = async function (payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/staff/resend/email/verification`,
			{ ...payload }
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};


const staffSignin = async function (payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/auth/staff/signin`,
			{ ...payload }
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};

const resetPassword = async function (payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/staff/password/recover`,
			{ ...payload }
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};

const verifyEmail = async function (payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/user/email/verify`,
			{ ...payload }
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};

export { staffSignup, resendVerificationEmail, staffSignin, resetPassword, verifyEmail };