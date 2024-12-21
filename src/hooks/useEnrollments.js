import { useState } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import {
	addEnrollment, cancelEnrollment, completeEnrollment, deleteEnrollment, editEnrollmentDetails, issueEnrollmentCertification
} from "../api/enrollments";

const useAddEnrollment = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddEnrollment, setLoadingAddEnrollment] = useState(false);
	const [removeAddEnrollmentModal, setRemoveAddEnrollmentModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [courseUniqueId, setCourseUniqueId] = useState(null);

	const [errorAddEnrollment, setErrorAddEnrollment] = useState(null);
	const [successAddEnrollment, setSuccessAddEnrollment] = useState(null);

	const handleUserUniqueId = (e) => { e.preventDefault(); setUserUniqueId(e.target.value); };
	const handleCourseUniqueId = (e) => { e.preventDefault(); setCourseUniqueId(e.target.value); };

	const handleAddEnrollment = () => {

		if (!loadingAddEnrollment) {
			if (!userUniqueId) {
				setErrorAddEnrollment(null);
				setSuccessAddEnrollment(null);
				setErrorAddEnrollment("User Unique ID is required");
				setTimeout(function () {
					setErrorAddEnrollment(null);
				}, 2500)
			} else if (!courseUniqueId) {
				setErrorAddEnrollment("Course Unique ID is required");
				setTimeout(function () {
					setErrorAddEnrollment(null);
				}, 2500)
			} else {
				setLoadingAddEnrollment(true);

				const addEnrollmentRes = addEnrollment(cookie, {
					user_unique_id: userUniqueId,
					course_unique_id: courseUniqueId
				})

				addEnrollmentRes.then(res => {
					setLoadingAddEnrollment(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddEnrollment(error);
							setTimeout(function () {
								setErrorAddEnrollment(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddEnrollment(error);
							setTimeout(function () {
								setErrorAddEnrollment(null);
							}, 2000)
						}
					} else {
						setErrorAddEnrollment(null);
						setSuccessAddEnrollment(`Enrollment Added successfully!`);

						setTimeout(function () {
							setSuccessAddEnrollment(null);
							setRemoveAddEnrollmentModal(true);
							setUserUniqueId(null);
							setCourseUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAddEnrollment(false);
				})

			}
		}
	};

	return {
		cookie, loadingAddEnrollment, removeAddEnrollmentModal, courseUniqueId, userUniqueId, errorAddEnrollment, successAddEnrollment,
		handleAddEnrollment, setRemoveAddEnrollmentModal, setCourseUniqueId, setUserUniqueId, handleUserUniqueId, handleCourseUniqueId
	};
};

const useUpdateEnrollmentDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateEnrollmentDetails, setLoadingUpdateEnrollmentDetails] = useState(false);
	const [removeUpdateEnrollmentDetailsModal, setRemoveUpdateEnrollmentDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorUpdateEnrollmentDetails, setErrorUpdateEnrollmentDetails] = useState(null);
	const [successUpdateEnrollmentDetails, setSuccessUpdateEnrollmentDetails] = useState(null);

	const handleUpdateEnrollmentDetails = () => {

		if (!loadingUpdateEnrollmentDetails) {
			if (!uniqueId) {
				setErrorUpdateEnrollmentDetails(null);
				setSuccessUpdateEnrollmentDetails(null);
				setErrorUpdateEnrollmentDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateEnrollmentDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateEnrollmentDetails(true);

				const editEnrollmentDetailsRes = editEnrollmentDetails(cookie, {
					unique_id: uniqueId
				})

				editEnrollmentDetailsRes.then(res => {
					setLoadingUpdateEnrollmentDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateEnrollmentDetails(error);
							setTimeout(function () {
								setErrorUpdateEnrollmentDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateEnrollmentDetails(error);
							setTimeout(function () {
								setErrorUpdateEnrollmentDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateEnrollmentDetails(null);
						setSuccessUpdateEnrollmentDetails(`Enrollment details updated successfully!`);

						setTimeout(function () {
							setSuccessUpdateEnrollmentDetails(null);
							setRemoveUpdateEnrollmentDetailsModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateEnrollmentDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateEnrollmentDetails, removeUpdateEnrollmentDetailsModal, uniqueId, errorUpdateEnrollmentDetails, successUpdateEnrollmentDetails,
		handleUpdateEnrollmentDetails, setRemoveUpdateEnrollmentDetailsModal, setUniqueId
	};
};

const useCompleteEnrollment = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCompleteEnrollment, setLoadingCompleteEnrollment] = useState(false);
	const [removeCompleteEnrollmentModal, setRemoveCompleteEnrollmentModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorCompleteEnrollment, setErrorCompleteEnrollment] = useState(null);
	const [successCompleteEnrollment, setSuccessCompleteEnrollment] = useState(null);

	const handleCompleteEnrollment = () => {

		if (!loadingCompleteEnrollment) {
			if (!uniqueId) {
				setErrorCompleteEnrollment(null);
				setSuccessCompleteEnrollment(null);
				setErrorCompleteEnrollment("Unique ID is required");
				setTimeout(function () {
					setErrorCompleteEnrollment(null);
				}, 2500)
			} else {
				setLoadingCompleteEnrollment(true);

				const completeEnrollmentRes = completeEnrollment(cookie, {
					unique_id: uniqueId
				})

				completeEnrollmentRes.then(res => {
					setLoadingCompleteEnrollment(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCompleteEnrollment(error);
							setTimeout(function () {
								setErrorCompleteEnrollment(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCompleteEnrollment(error);
							setTimeout(function () {
								setErrorCompleteEnrollment(null);
							}, 2000)
						}
					} else {
						setErrorCompleteEnrollment(null);
						setSuccessCompleteEnrollment(`Enrollment completed successfully!`);

						setTimeout(function () {
							setSuccessCompleteEnrollment(null);
							setRemoveCompleteEnrollmentModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingCompleteEnrollment(false);
				})

			}
		}
	};

	return {
		cookie, loadingCompleteEnrollment, removeCompleteEnrollmentModal, uniqueId, errorCompleteEnrollment, successCompleteEnrollment,
		handleCompleteEnrollment, setRemoveCompleteEnrollmentModal, setUniqueId
	};
};

const useCancelEnrollment = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCancelEnrollment, setLoadingCancelEnrollment] = useState(false);
	const [removeCancelEnrollmentModal, setRemoveCancelEnrollmentModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorCancelEnrollment, setErrorCancelEnrollment] = useState(null);
	const [successCancelEnrollment, setSuccessCancelEnrollment] = useState(null);

	const handleCancelEnrollment = () => {

		if (!loadingCancelEnrollment) {
			if (!uniqueId) {
				setErrorCancelEnrollment(null);
				setSuccessCancelEnrollment(null);
				setErrorCancelEnrollment("Unique ID is required");
				setTimeout(function () {
					setErrorCancelEnrollment(null);
				}, 2500)
			} else {
				setLoadingCancelEnrollment(true);

				const cancelEnrollmentRes = cancelEnrollment(cookie, {
					unique_id: uniqueId
				})

				cancelEnrollmentRes.then(res => {
					setLoadingCancelEnrollment(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCancelEnrollment(error);
							setTimeout(function () {
								setErrorCancelEnrollment(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCancelEnrollment(error);
							setTimeout(function () {
								setErrorCancelEnrollment(null);
							}, 2000)
						}
					} else {
						setErrorCancelEnrollment(null);
						setSuccessCancelEnrollment(`Enrollment cancelled successfully!`);

						setTimeout(function () {
							setSuccessCancelEnrollment(null);
							setRemoveCancelEnrollmentModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingCancelEnrollment(false);
				})

			}
		}
	};

	return {
		cookie, loadingCancelEnrollment, removeCancelEnrollmentModal, uniqueId, errorCancelEnrollment, successCancelEnrollment,
		handleCancelEnrollment, setRemoveCancelEnrollmentModal, setUniqueId
	};
};

const useDeleteEnrollment = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteEnrollment, setLoadingDeleteEnrollment] = useState(false);
	const [removeDeleteEnrollmentModal, setRemoveDeleteEnrollmentModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteEnrollment, setErrorDeleteEnrollment] = useState(null);
	const [successDeleteEnrollment, setSuccessDeleteEnrollment] = useState(null);

	const handleDeleteEnrollment = () => {

		if (!loadingDeleteEnrollment) {
			if (!uniqueId) {
				setErrorDeleteEnrollment(null);
				setSuccessDeleteEnrollment(null);
				setErrorDeleteEnrollment("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteEnrollment(null);
				}, 2500)
			} else {
				setLoadingDeleteEnrollment(true);

				const deleteEnrollmentRes = deleteEnrollment(cookie, {
					unique_id: uniqueId
				})

				deleteEnrollmentRes.then(res => {
					setLoadingDeleteEnrollment(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteEnrollment(error);
							setTimeout(function () {
								setErrorDeleteEnrollment(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteEnrollment(error);
							setTimeout(function () {
								setErrorDeleteEnrollment(null);
							}, 2000)
						}
					} else {
						setErrorDeleteEnrollment(null);
						setSuccessDeleteEnrollment(`Enrollment deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteEnrollment(null);
							setRemoveDeleteEnrollmentModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteEnrollment(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteEnrollment, removeDeleteEnrollmentModal, uniqueId, errorDeleteEnrollment, successDeleteEnrollment,
		handleDeleteEnrollment, setRemoveDeleteEnrollmentModal, setUniqueId
	};
};

export {
	useCompleteEnrollment, useCancelEnrollment, useDeleteEnrollment, useAddEnrollment, useUpdateEnrollmentDetails
};