import axios from 'axios';
import { config } from '../config';

const getTransactions = async function (token, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transactions?page=${page}&size=${size}`,
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

const getTransactionsViaUser = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transactions/via/user?page=${page}&size=${size}&user_unique_id=${payload.user_unique_id}`,
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

const getTransactionsViaType = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transactions/via/type?page=${page}&size=${size}&type=${payload.type}`,
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

const getTransactionsViaReference = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transactions/via/reference?page=${page}&size=${size}&reference=${payload.reference}`,
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

const getTransactionsViaGateway = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transactions/via/gateway?page=${page}&size=${size}&gateway=${payload.gateway}`,
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

const getTransactionsViaCurrency = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transactions/via/currency?page=${page}&size=${size}&currency=${payload.currency}`,
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

const getTransactionsViaStatus = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transactions/via/transaction/status?page=${page}&size=${size}&transaction_status=${payload.transaction_status}`,
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

const filterTransactions = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/filter/transactions?page=${page}&size=${size}&start_date=${payload.start_date}&end_date=${payload.end_date}`,
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

const searchTransactions = async function (token, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/search/transactions?page=${page}&size=${size}&search=${payload.search}`,
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

const getTransaction = async function (token, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/internal/transaction?unique_id=${payload.unique_id}`,
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

const completeDeposit = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/transaction/complete/deposit`,
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

const completeWithdrawal = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/transaction/complete/withdrawal`,
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

const completeEnrollmentFee = async function (token, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/internal/transaction/complete/enrollment/fee`,
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

export {
	getTransactions, getTransactionsViaUser, getTransactionsViaType, getTransactionsViaReference, getTransactionsViaGateway, 
	getTransactionsViaCurrency, getTransactionsViaStatus, filterTransactions, searchTransactions, getTransaction, completeDeposit, 
	completeWithdrawal, completeEnrollmentFee
};