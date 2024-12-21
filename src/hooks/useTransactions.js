import { useState } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import {
	completeDeposit, completeWithdrawal, completeEnrollmentFee
} from "../api/transactions";

const useCompleteDeposit = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCompleteDeposit, setLoadingCompleteDeposit] = useState(false);
	const [removeCompleteDepositModal, setRemoveCompleteDepositModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [userDepositUniqueId, setUserDepositUniqueId] = useState(null);

	const [errorCompleteDeposit, setErrorCompleteDeposit] = useState(null);
	const [successCompleteDeposit, setSuccessCompleteDeposit] = useState(null);

	const handleCompleteDeposit = () => {

		if (!loadingCompleteDeposit) {
			if (!userUniqueId) {
				setErrorCompleteDeposit(null);
				setSuccessCompleteDeposit(null);
				setErrorCompleteDeposit("User Unique ID is required");
				setTimeout(function () {
					setErrorCompleteDeposit(null);
				}, 2500)
			} else if (!userDepositUniqueId) {
				setErrorCompleteDeposit("Unique ID is required");
				setTimeout(function () {
					setErrorCompleteDeposit(null);
				}, 2500)
			} else {
				setLoadingCompleteDeposit(true);

				const completeDepositRes = completeDeposit(cookie, {
					user_unique_id: userUniqueId,
					unique_id: userDepositUniqueId
				})

				completeDepositRes.then(res => {
					setLoadingCompleteDeposit(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCompleteDeposit(error);
							setTimeout(function () {
								setErrorCompleteDeposit(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCompleteDeposit(error);
							setTimeout(function () {
								setErrorCompleteDeposit(null);
							}, 2000)
						}
					} else {
						setErrorCompleteDeposit(null);
						setSuccessCompleteDeposit(`Transaction completed successfully!`);

						setTimeout(function () {
							setSuccessCompleteDeposit(null);
							setRemoveCompleteDepositModal(true);
							setUserUniqueId(null);
							setUserDepositUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingCompleteDeposit(false);
				})

			}
		}
	};

	return {
		cookie, loadingCompleteDeposit, removeCompleteDepositModal, userDepositUniqueId, errorCompleteDeposit, successCompleteDeposit,
		handleCompleteDeposit, setRemoveCompleteDepositModal, setUserDepositUniqueId, setUserUniqueId
	};
};

const useCompleteWithdrawal = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCompleteWithdrawal, setLoadingCompleteWithdrawal] = useState(false);
	const [removeCompleteWithdrawalModal, setRemoveCompleteWithdrawalModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [userWithdrawalUniqueId, setUserWithdrawalUniqueId] = useState(null);

	const [errorCompleteWithdrawal, setErrorCompleteWithdrawal] = useState(null);
	const [successCompleteWithdrawal, setSuccessCompleteWithdrawal] = useState(null);

	const handleCompleteWithdrawal = () => {

		if (!loadingCompleteWithdrawal) {
			if (!userUniqueId) {
				setErrorCompleteWithdrawal(null);
				setSuccessCompleteWithdrawal(null);
				setErrorCompleteWithdrawal("User Unique ID is required");
				setTimeout(function () {
					setErrorCompleteWithdrawal(null);
				}, 2500)
			} else if (!userWithdrawalUniqueId) {
				setErrorCompleteWithdrawal("Unique ID is required");
				setTimeout(function () {
					setErrorCompleteWithdrawal(null);
				}, 2500)
			} else {
				setLoadingCompleteWithdrawal(true);

				const completeWithdrawalRes = completeWithdrawal(cookie, {
					user_unique_id: userUniqueId,
					unique_id: userWithdrawalUniqueId
				})

				completeWithdrawalRes.then(res => {
					setLoadingCompleteWithdrawal(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCompleteWithdrawal(error);
							setTimeout(function () {
								setErrorCompleteWithdrawal(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCompleteWithdrawal(error);
							setTimeout(function () {
								setErrorCompleteWithdrawal(null);
							}, 2000)
						}
					} else {
						setErrorCompleteWithdrawal(null);
						setSuccessCompleteWithdrawal(`Transaction completed successfully!`);

						setTimeout(function () {
							setSuccessCompleteWithdrawal(null);
							setRemoveCompleteWithdrawalModal(true);
							setUserUniqueId(null);
							setUserWithdrawalUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingCompleteWithdrawal(false);
				})

			}
		}
	};

	return {
		cookie, loadingCompleteWithdrawal, removeCompleteWithdrawalModal, userWithdrawalUniqueId, errorCompleteWithdrawal, successCompleteWithdrawal,
		handleCompleteWithdrawal, setRemoveCompleteWithdrawalModal, setUserWithdrawalUniqueId, setUserUniqueId
	};
};

const useCompleteEnrollmentFee = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCompleteEnrollmentFee, setLoadingCompleteEnrollmentFee] = useState(false);
	const [removeCompleteEnrollmentFeeModal, setRemoveCompleteEnrollmentFeeModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [enrollmentFeeReference, setEnrollmentFeeReference] = useState(null);

	const [errorCompleteEnrollmentFee, setErrorCompleteEnrollmentFee] = useState(null);
	const [successCompleteEnrollmentFee, setSuccessCompleteEnrollmentFee] = useState(null);

	const handleCompleteEnrollmentFee = () => {

		if (!loadingCompleteEnrollmentFee) {
			if (!userUniqueId) {
				setErrorCompleteEnrollmentFee(null);
				setSuccessCompleteEnrollmentFee(null);
				setErrorCompleteEnrollmentFee("User Unique ID is required");
				setTimeout(function () {
					setErrorCompleteEnrollmentFee(null);
				}, 2500)
			} else if (!enrollmentFeeReference) {
				setErrorCompleteEnrollmentFee("Enrollment Fee Reference is required");
				setTimeout(function () {
					setErrorCompleteEnrollmentFee(null);
				}, 2500)
			} else {
				setLoadingCompleteEnrollmentFee(true);

				const completeEnrollmentFeeRes = completeEnrollmentFee(cookie, {
					user_unique_id: userUniqueId,
					reference: enrollmentFeeReference
				})

				completeEnrollmentFeeRes.then(res => {
					setLoadingCompleteEnrollmentFee(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCompleteEnrollmentFee(error);
							setTimeout(function () {
								setErrorCompleteEnrollmentFee(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCompleteEnrollmentFee(error);
							setTimeout(function () {
								setErrorCompleteEnrollmentFee(null);
							}, 2000)
						}
					} else {
						setErrorCompleteEnrollmentFee(null);
						setSuccessCompleteEnrollmentFee(`Enrollment Fee completed successfully!`);

						setTimeout(function () {
							setSuccessCompleteEnrollmentFee(null);
							setRemoveCompleteEnrollmentFeeModal(true);
							setUserUniqueId(null);
							setEnrollmentFeeReference(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingCompleteEnrollmentFee(false);
				})

			}
		}
	};

	return {
		cookie, loadingCompleteEnrollmentFee, removeCompleteEnrollmentFeeModal, enrollmentFeeReference, errorCompleteEnrollmentFee, successCompleteEnrollmentFee,
		handleCompleteEnrollmentFee, setRemoveCompleteEnrollmentFeeModal, setEnrollmentFeeReference, setUserUniqueId
	};
};

export {
	useCompleteDeposit, useCompleteWithdrawal, useCompleteEnrollmentFee
};