import { useState } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import {
	grantUserAccess, revokeUserAccess, suspendUserAccess, updateUserEmail
} from "../api/users";

const useGrantUserAccess = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingGrantUserAccess, setLoadingGrantUserAccess] = useState(false);
	const [removeGrantUserAccessModal, setRemoveGrantUserAccessModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);

	const [errorGrantUserAccess, setErrorGrantUserAccess] = useState(null);
	const [successGrantUserAccess, setSuccessGrantUserAccess] = useState(null);

	const handleGrantUserAccess = () => {

		if (!loadingGrantUserAccess) {
			if (!userUniqueId) {
				setErrorGrantUserAccess(null);
				setSuccessGrantUserAccess(null);
				setErrorGrantUserAccess("User Unique Id is required");
				setTimeout(function () {
					setErrorGrantUserAccess(null);
				}, 2500)
			} else {
				setLoadingGrantUserAccess(true);

				const grantUserAccessRes = grantUserAccess(cookie, {
					unique_id: userUniqueId
				})

				grantUserAccessRes.then(res => {
					setLoadingGrantUserAccess(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorGrantUserAccess(error);
							setTimeout(function () {
								setErrorGrantUserAccess(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorGrantUserAccess(error);
							setTimeout(function () {
								setErrorGrantUserAccess(null);
							}, 2000)
						}
					} else {
						setErrorGrantUserAccess(null);
						setSuccessGrantUserAccess(`User access granted!`);

						setTimeout(function () {
							setSuccessGrantUserAccess(null);
							setRemoveGrantUserAccessModal(true);
							setUserUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingGrantUserAccess(false);
				})

			}
		}
	};

	return {
		cookie, loadingGrantUserAccess, removeGrantUserAccessModal, errorGrantUserAccess, successGrantUserAccess, handleGrantUserAccess,
		setRemoveGrantUserAccessModal, setUserUniqueId
	};
};

const useSuspendUserAccess = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingSuspendUserAccess, setLoadingSuspendUserAccess] = useState(false);
	const [removeSuspendUserAccessModal, setRemoveSuspendUserAccessModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);

	const [errorSuspendUserAccess, setErrorSuspendUserAccess] = useState(null);
	const [successSuspendUserAccess, setSuccessSuspendUserAccess] = useState(null);

	const handleSuspendUserAccess = () => {

		if (!loadingSuspendUserAccess) {
			if (!userUniqueId) {
				setErrorSuspendUserAccess(null);
				setSuccessSuspendUserAccess(null);
				setErrorSuspendUserAccess("User Unique Id is required");
				setTimeout(function () {
					setErrorSuspendUserAccess(null);
				}, 2500)
			} else {
				setLoadingSuspendUserAccess(true);

				const suspendUserAccessRes = suspendUserAccess(cookie, {
					unique_id: userUniqueId
				})

				suspendUserAccessRes.then(res => {
					setLoadingSuspendUserAccess(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorSuspendUserAccess(error);
							setTimeout(function () {
								setErrorSuspendUserAccess(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorSuspendUserAccess(error);
							setTimeout(function () {
								setErrorSuspendUserAccess(null);
							}, 2000)
						}
					} else {
						setErrorSuspendUserAccess(null);
						setSuccessSuspendUserAccess(`User access suspended!`);

						setTimeout(function () {
							setSuccessSuspendUserAccess(null);
							setRemoveSuspendUserAccessModal(true);
							setUserUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingSuspendUserAccess(false);
				})

			}
		}
	};

	return {
		cookie, loadingSuspendUserAccess, removeSuspendUserAccessModal, errorSuspendUserAccess, successSuspendUserAccess, handleSuspendUserAccess,
		setRemoveSuspendUserAccessModal, setUserUniqueId
	};
};

const useRevokeUserAccess = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingRevokeUserAccess, setLoadingRevokeUserAccess] = useState(false);
	const [removeRevokeUserAccessModal, setRemoveRevokeUserAccessModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);

	const [errorRevokeUserAccess, setErrorRevokeUserAccess] = useState(null);
	const [successRevokeUserAccess, setSuccessRevokeUserAccess] = useState(null);

	const handleRevokeUserAccess = () => {

		if (!loadingRevokeUserAccess) {
			if (!userUniqueId) {
				setErrorRevokeUserAccess(null);
				setSuccessRevokeUserAccess(null);
				setErrorRevokeUserAccess("User Unique Id is required");
				setTimeout(function () {
					setErrorRevokeUserAccess(null);
				}, 2500)
			} else {
				setLoadingRevokeUserAccess(true);

				const revokeUserAccessRes = revokeUserAccess(cookie, {
					unique_id: userUniqueId
				})

				revokeUserAccessRes.then(res => {
					setLoadingRevokeUserAccess(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorRevokeUserAccess(error);
							setTimeout(function () {
								setErrorRevokeUserAccess(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorRevokeUserAccess(error);
							setTimeout(function () {
								setErrorRevokeUserAccess(null);
							}, 2000)
						}
					} else {
						setErrorRevokeUserAccess(null);
						setSuccessRevokeUserAccess(`User access revoked!`);

						setTimeout(function () {
							setSuccessRevokeUserAccess(null);
							setRemoveRevokeUserAccessModal(true);
							setUserUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingRevokeUserAccess(false);
				})

			}
		}
	};

	return {
		cookie, loadingRevokeUserAccess, removeRevokeUserAccessModal, errorRevokeUserAccess, successRevokeUserAccess, handleRevokeUserAccess,
		setRemoveRevokeUserAccessModal, setUserUniqueId
	};
};

const useUpdateEmail = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateEmail, setLoadingUpdateEmail] = useState(false);
	const [removeUpdateEmailModal, setRemoveUpdateEmailModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [email, setEmail] = useState("");

	const [errorUpdateEmail, setErrorUpdateEmail] = useState(null);
	const [successUpdateEmail, setSuccessUpdateEmail] = useState(null);

	const handleEmail = (e) => { e.preventDefault(); setEmail(parseInt(e.target.value)); };

	const handleUpdateEmail = () => {

		if (!loadingUpdateEmail) {
			if (!userUniqueId) {
				setErrorUpdateEmail(null);
				setSuccessUpdateEmail(null);
				setErrorUpdateEmail("User Unique Id is required");
				setTimeout(function () {
					setErrorUpdateEmail(null);
				}, 2500)
			} else if (email.length < 0) {
				setErrorUpdateEmail("Email is required");
				setTimeout(function () {
					setErrorUpdateEmail(null);
				}, 2500)
			} else {
				setLoadingUpdateEmail(true);

				const updateUserEmailRes = updateUserEmail(cookie, {
					unique_id: userUniqueId,
					email
				})

				updateUserEmailRes.then(res => {
					setLoadingUpdateEmail(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateEmail(error);
							setTimeout(function () {
								setErrorUpdateEmail(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateEmail(error);
							setTimeout(function () {
								setErrorUpdateEmail(null);
							}, 2000)
						}
					} else {
						setErrorUpdateEmail(null);
						setSuccessUpdateEmail(`User email updated!`);

						setTimeout(function () {
							setSuccessUpdateEmail(null);
							setRemoveUpdateEmailModal(true);
							setUserUniqueId(null);
							setEmail(0);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateEmail(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateEmail, removeUpdateEmailModal, errorUpdateEmail, successUpdateEmail, handleUpdateEmail,
		setRemoveUpdateEmailModal, setUserUniqueId, setEmail, email, handleEmail
	};
};

export { useGrantUserAccess, useSuspendUserAccess, useRevokeUserAccess, useUpdateEmail };
