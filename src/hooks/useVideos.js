import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addVideo, deleteVideo, editVideoDetails } from "../api/videos";

const useAddVideo = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddVideo, setLoadingAddVideo] = useState(false);
	const [removeAddVideoModal, setRemoveAddVideoModal] = useState(null);
	const [title, setTitle] = useState("");
	const [watchCode, setWatchCode] = useState("");

	const [errorAddVideo, setErrorAddVideo] = useState(null);
	const [successAddVideo, setSuccessAddVideo] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleWatchCode = (e) => { e.preventDefault(); setWatchCode(e.target.value); };

	const handleAddVideo = (e) => {
		e.preventDefault();

		if (!loadingAddVideo) {
			if (!title) {
				setErrorAddVideo(null);
				setSuccessAddVideo(null);
				setErrorAddVideo("Title is required");
				setTimeout(function () {
					setErrorAddVideo(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddVideo("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddVideo(null);
				}, 2500)
			} else if (watchCode.length < 6 || watchCode.length > 11) {
				setErrorAddVideo("Watch Code characters (6 - 11)");
				setTimeout(function () {
					setErrorAddVideo(null);
				}, 2500)
			} else {
				setLoadingAddVideo(true);

				const addVideoRes = addVideo(cookie, {
					title: title.trim(),
					watchCode: watchCode.trim(),
				})

				addVideoRes.then(res => {
					setLoadingAddVideo(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddVideo(error);
							setTimeout(function () {
								setErrorAddVideo(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddVideo(error);
							setTimeout(function () {
								setErrorAddVideo(null);
							}, 2000)
						}
					} else {
						setErrorAddVideo(null);
						setSuccessAddVideo(`Video added successfully!`);

						setTimeout(function () {
							setSuccessAddVideo(null);
							setRemoveAddVideoModal(true);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAddVideo(false);
				})
			}
		}
	};

	return {
		cookie, title, watchCode, loadingAddVideo, setRemoveAddVideoModal, errorAddVideo, successAddVideo, removeAddVideoModal, 
		handleAddVideo, handleTitle, handleWatchCode, setTitle, setWatchCode,
	};
};

const useUpdateVideoDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateVideoDetails, setLoadingUpdateVideoDetails] = useState(false);
	const [removeUpdateVideoDetailsModal, setRemoveUpdateVideoDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [watchCode, setWatchCode] = useState("");

	const [errorUpdateVideoDetails, setErrorUpdateVideoDetails] = useState(null);
	const [successUpdateVideoDetails, setSuccessUpdateVideoDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleWatchCode = (e) => { e.preventDefault(); setWatchCode(e.target.value); };

	const handleUpdateVideoDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateVideoDetails) {
			if (!uniqueId) {
				setErrorUpdateVideoDetails(null);
				setSuccessUpdateVideoDetails(null);
				setErrorUpdateVideoDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateVideoDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateVideoDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateVideoDetails(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorUpdateVideoDetails("Title maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateVideoDetails(null);
				}, 2500)
			} else if (watchCode.length < 6 || watchCode.length > 11) {
				setErrorUpdateVideoDetails("Watch Code characters (6 - 11)");
				setTimeout(function () {
					setErrorUpdateVideoDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateVideoDetails(true);

				const editVideoDetailsRes = editVideoDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					watchCode: watchCode.trim(),
				})

				editVideoDetailsRes.then(res => {
					setLoadingUpdateVideoDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateVideoDetails(error);
							setTimeout(function () {
								setErrorUpdateVideoDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateVideoDetails(error);
							setTimeout(function () {
								setErrorUpdateVideoDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateVideoDetails(null);
						setSuccessUpdateVideoDetails(`Video details edited!`);

						setTimeout(function () {
							setSuccessUpdateVideoDetails(null);
							setRemoveUpdateVideoDetailsModal(true);
							setUniqueId(null);
							setTitle("");
							setWatchCode("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateVideoDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateVideoDetails, removeUpdateVideoDetailsModal, errorUpdateVideoDetails, successUpdateVideoDetails, handleUpdateVideoDetails,
		setRemoveUpdateVideoDetailsModal, setUniqueId, setTitle, setWatchCode, title, watchCode, handleTitle, handleWatchCode
	};
};

const useDeleteVideo = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteVideo, setLoadingDeleteVideo] = useState(false);
	const [removeDeleteVideoModal, setRemoveDeleteVideoModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteVideo, setErrorDeleteVideo] = useState(null);
	const [successDeleteVideo, setSuccessDeleteVideo] = useState(null);

	const handleDeleteVideo = () => {

		if (!loadingDeleteVideo) {
			if (!uniqueId) {
				setErrorDeleteVideo(null);
				setSuccessDeleteVideo(null);
				setErrorDeleteVideo("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteVideo(null);
				}, 2500)
			} else {
				setLoadingDeleteVideo(true);

				const deleteVideoRes = deleteVideo(cookie, {
					unique_id: uniqueId
				})

				deleteVideoRes.then(res => {
					setLoadingDeleteVideo(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteVideo(error);
							setTimeout(function () {
								setErrorDeleteVideo(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteVideo(error);
							setTimeout(function () {
								setErrorDeleteVideo(null);
							}, 2000)
						}
					} else {
						setErrorDeleteVideo(null);
						setSuccessDeleteVideo(`Video deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteVideo(null);
							setRemoveDeleteVideoModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteVideo(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteVideo, removeDeleteVideoModal, errorDeleteVideo, successDeleteVideo, handleDeleteVideo,
		setRemoveDeleteVideoModal, setUniqueId
	};
};

export { useAddVideo, useUpdateVideoDetails, useDeleteVideo };
