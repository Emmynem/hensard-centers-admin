import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addCourseType, deleteCourseType, editCourseTypeDetails } from "../api/courseTypes";
import { uploadFile } from "../api/clouder";

const useAddCourseType = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddCourseType, setLoadingAddCourseType] = useState(false);
	const [removeAddCourseTypeModal, setRemoveAddCourseTypeModal] = useState(null);
	const [title, setTitle] = useState("");

	const [errorAddCourseType, setErrorAddCourseType] = useState(null);
	const [successAddCourseType, setSuccessAddCourseType] = useState(null);
	
	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };

	const handleAddCourseType = (e) => {
		e.preventDefault();

		if (!loadingAddCourseType) {
			if (!title) {
				setErrorAddCourseType(null);
				setSuccessAddCourseType(null);
				setErrorAddCourseType("Title is required");
				setTimeout(function () {
					setErrorAddCourseType(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorAddCourseType("Title maximum characters - 200");
				setTimeout(function () {
					setErrorAddCourseType(null);
				}, 2500)
			} else {
				setLoadingAddCourseType(true);

				const addCourseTypeRes = addCourseType(cookie, {
					title: title.trim(),
				})

				addCourseTypeRes.then(res => {
					setLoadingAddCourseType(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddCourseType(error);
							setTimeout(function () {
								setErrorAddCourseType(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddCourseType(error);
							setTimeout(function () {
								setErrorAddCourseType(null);
							}, 2000)
						}
					} else {
						setErrorAddCourseType(null);
						setSuccessAddCourseType(`Course Type added successfully!`);

						setTimeout(function () {
							setSuccessAddCourseType(null);
							setRemoveAddCourseTypeModal(true);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAddCourseType(false);
				})
			}
		}
	};

	return {
		cookie, title, loadingAddCourseType, setRemoveAddCourseTypeModal, errorAddCourseType, successAddCourseType, removeAddCourseTypeModal, 
		handleAddCourseType, handleTitle, setTitle,
	};
};

const useUpdateCourseTypeDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateCourseTypeDetails, setLoadingUpdateCourseTypeDetails] = useState(false);
	const [removeUpdateCourseTypeDetailsModal, setRemoveUpdateCourseTypeDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");

	const [errorUpdateCourseTypeDetails, setErrorUpdateCourseTypeDetails] = useState(null);
	const [successUpdateCourseTypeDetails, setSuccessUpdateCourseTypeDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };

	const handleUpdateCourseTypeDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateCourseTypeDetails) {
			if (!uniqueId) {
				setErrorUpdateCourseTypeDetails(null);
				setSuccessUpdateCourseTypeDetails(null);
				setErrorUpdateCourseTypeDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCourseTypeDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateCourseTypeDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateCourseTypeDetails(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorUpdateCourseTypeDetails("Title maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateCourseTypeDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateCourseTypeDetails(true);

				const editCourseTypeDetailsRes = editCourseTypeDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
				})

				editCourseTypeDetailsRes.then(res => {
					setLoadingUpdateCourseTypeDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCourseTypeDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseTypeDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCourseTypeDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseTypeDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCourseTypeDetails(null);
						setSuccessUpdateCourseTypeDetails(`Course Type details edited!`);

						setTimeout(function () {
							setSuccessUpdateCourseTypeDetails(null);
							setRemoveUpdateCourseTypeDetailsModal(true);
							setUniqueId(null);
							setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCourseTypeDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCourseTypeDetails, removeUpdateCourseTypeDetailsModal, errorUpdateCourseTypeDetails, successUpdateCourseTypeDetails, handleUpdateCourseTypeDetails,
		setRemoveUpdateCourseTypeDetailsModal, setUniqueId, setTitle, title, handleTitle
	};
};

const useDeleteCourseType = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteCourseType, setLoadingDeleteCourseType] = useState(false);
	const [removeDeleteCourseTypeModal, setRemoveDeleteCourseTypeModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteCourseType, setErrorDeleteCourseType] = useState(null);
	const [successDeleteCourseType, setSuccessDeleteCourseType] = useState(null);

	const handleDeleteCourseType = () => {

		if (!loadingDeleteCourseType) {
			if (!uniqueId) {
				setErrorDeleteCourseType(null);
				setSuccessDeleteCourseType(null);
				setErrorDeleteCourseType("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteCourseType(null);
				}, 2500)
			} else {
				setLoadingDeleteCourseType(true);

				const deleteCourseTypeRes = deleteCourseType(cookie, {
					unique_id: uniqueId
				})

				deleteCourseTypeRes.then(res => {
					setLoadingDeleteCourseType(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteCourseType(error);
							setTimeout(function () {
								setErrorDeleteCourseType(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteCourseType(error);
							setTimeout(function () {
								setErrorDeleteCourseType(null);
							}, 2000)
						}
					} else {
						setErrorDeleteCourseType(null);
						setSuccessDeleteCourseType(`Course Type deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteCourseType(null);
							setRemoveDeleteCourseTypeModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteCourseType(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteCourseType, removeDeleteCourseTypeModal, errorDeleteCourseType, successDeleteCourseType, handleDeleteCourseType,
		setRemoveDeleteCourseTypeModal, setUniqueId
	};
};

export { useAddCourseType, useUpdateCourseTypeDetails, useDeleteCourseType };
