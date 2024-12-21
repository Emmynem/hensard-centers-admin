import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addPublicGallery, deletePublicGallery, editPublicGalleryDetails, editPublicGalleryImage } from "../api/publicGallery";
import { uploadFile } from "../api/clouder";

const useAddPublicGallery = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddPublicGallery, setLoadingAddPublicGallery] = useState(false);
	const [removeAddPublicGalleryModal, setRemoveAddPublicGalleryModal] = useState(null);
	const [title, setTitle] = useState("");
	const [details, setDetails] = useState("");
	const [selectedAddPublicGallery, setSelectedAddPublicGallery] = useState("");
	const [uploadingAddPublicGalleryPercentage, setUploadingAddPublicGalleryPercentage] = useState(0);

	const [errorAddPublicGallery, setErrorAddPublicGallery] = useState(null);
	const [successAddPublicGallery, setSuccessAddPublicGallery] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleDetails = (e) => { e.preventDefault(); setDetails(e.target.value); };

	const handleAddPublicGallery = (e) => {
		e.preventDefault();

		if (!loadingAddPublicGallery) {
			if (!title) {
				setErrorAddPublicGallery(null);
				setSuccessAddPublicGallery(null);
				setErrorAddPublicGallery("Title is required");
				setTimeout(function () {
					setErrorAddPublicGallery(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorAddPublicGallery("Title maximum characters - 200");
				setTimeout(function () {
					setErrorAddPublicGallery(null);
				}, 2500)
			} else if (details && details.length > 3000) {
				setErrorAddPublicGallery("Details maximum characters - 3000");
				setTimeout(function () {
					setErrorAddPublicGallery(null);
				}, 2500)
			} else if (!allowed_extensions.includes(selectedAddPublicGallery.type)) {
				setErrorAddPublicGallery("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddPublicGallery(null);
				}, 2000)
			} else if (selectedAddPublicGallery.size > maximum_file_size) {
				setErrorAddPublicGallery("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddPublicGallery(null);
				}, 2000)
			} else {
				setLoadingAddPublicGallery(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/media/galleries/public");
				formdata.append("file", selectedAddPublicGallery);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingAddPublicGallery(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddPublicGallery(error);
							setTimeout(function () {
								setErrorAddPublicGallery(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddPublicGallery(error);
							setTimeout(function () {
								setErrorAddPublicGallery(null);
							}, 2000)
						}
					} else {
						setErrorAddPublicGallery(null);
						setUploadingAddPublicGalleryPercentage(0);
						setSuccessAddPublicGallery(`Public Gallery Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const addPublicGalleryRes = addPublicGallery(cookie, {
							title: title.trim(), 
							details: details ? details.trim() : undefined,
							image, image_public_id
						})

						addPublicGalleryRes.then(res => {
							setLoadingAddPublicGallery(false);
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setErrorAddPublicGallery(error);
									setTimeout(function () {
										setErrorAddPublicGallery(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setErrorAddPublicGallery(error);
									setTimeout(function () {
										setErrorAddPublicGallery(null);
									}, 2000)
								}
							} else {
								setErrorAddPublicGallery(null);
								setUploadingAddPublicGalleryPercentage(0);
								setSuccessAddPublicGallery(`Public Gallery added successfully!`);

								setTimeout(function () {
									setSuccessAddPublicGallery(null);
									setRemoveAddPublicGalleryModal(true);
								}, 2500)
							}
						}).catch(err => {
							setUploadingAddPublicGalleryPercentage(0);
							setLoadingAddPublicGallery(false);
						})

					}
				}).catch(err => {
					setUploadingAddPublicGalleryPercentage(0);
					setLoadingAddPublicGallery(false);
				})
			}
		}
	};

	return {
		cookie, title, details, loadingAddPublicGallery, setRemoveAddPublicGalleryModal, errorAddPublicGallery, successAddPublicGallery, removeAddPublicGalleryModal, setSelectedAddPublicGallery,
		handleAddPublicGallery, handleTitle, handleDetails, setTitle, setDetails, uploadingAddPublicGalleryPercentage, selectedAddPublicGallery,
	};
};

const useUpdatePublicGalleryDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePublicGalleryDetails, setLoadingUpdatePublicGalleryDetails] = useState(false);
	const [removeUpdatePublicGalleryDetailsModal, setRemoveUpdatePublicGalleryDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [details, setDetails] = useState("");

	const [errorUpdatePublicGalleryDetails, setErrorUpdatePublicGalleryDetails] = useState(null);
	const [successUpdatePublicGalleryDetails, setSuccessUpdatePublicGalleryDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleDetails = (e) => { e.preventDefault(); setDetails(e.target.value); };

	const handleUpdatePublicGalleryDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdatePublicGalleryDetails) {
			if (!uniqueId) {
				setErrorUpdatePublicGalleryDetails(null);
				setSuccessUpdatePublicGalleryDetails(null);
				setErrorUpdatePublicGalleryDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePublicGalleryDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdatePublicGalleryDetails("Title is required");
				setTimeout(function () {
					setErrorUpdatePublicGalleryDetails(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorUpdatePublicGalleryDetails("Title maximum characters - 200");
				setTimeout(function () {
					setErrorUpdatePublicGalleryDetails(null);
				}, 2500)
			} else if (details && details.length > 3000) {
				setErrorUpdatePublicGalleryDetails("Details maximum characters - 3000");
				setTimeout(function () {
					setErrorUpdatePublicGalleryDetails(null);
				}, 2500)
			} else {
				setLoadingUpdatePublicGalleryDetails(true);

				const editPublicGalleryDetailsRes = editPublicGalleryDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					details: details ? details.trim() : undefined,
				})

				editPublicGalleryDetailsRes.then(res => {
					setLoadingUpdatePublicGalleryDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePublicGalleryDetails(error);
							setTimeout(function () {
								setErrorUpdatePublicGalleryDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePublicGalleryDetails(error);
							setTimeout(function () {
								setErrorUpdatePublicGalleryDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePublicGalleryDetails(null);
						setSuccessUpdatePublicGalleryDetails(`Public Gallery details edited!`);

						setTimeout(function () {
							setSuccessUpdatePublicGalleryDetails(null);
							setRemoveUpdatePublicGalleryDetailsModal(true);
							setUniqueId(null);
							setTitle("");
							setDetails("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePublicGalleryDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePublicGalleryDetails, removeUpdatePublicGalleryDetailsModal, errorUpdatePublicGalleryDetails, successUpdatePublicGalleryDetails, handleUpdatePublicGalleryDetails,
		setRemoveUpdatePublicGalleryDetailsModal, setUniqueId, setTitle, setDetails, title, details, handleTitle, handleDetails
	};
};

const useUploadPublicGalleryImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingPublicGalleryImage, setLoadingPublicGalleryImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removePublicGalleryImageModal, setRemovePublicGalleryImageModal] = useState(null);
	const [selectedPublicGalleryImage, setSelectedPublicGalleryImage] = useState("");
	const [uploadingPublicGalleryImagePercentage, setUploadingPublicGalleryImagePercentage] = useState(0);

	const [errorPublicGalleryImage, setErrorPublicGalleryImage] = useState(null);
	const [successPublicGalleryImage, setSuccessPublicGalleryImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadPublicGalleryImage = (e) => {
		e.preventDefault();

		if (!loadingPublicGalleryImage) {
			if (!uniqueId) {
				setErrorPublicGalleryImage(null);
				setSuccessPublicGalleryImage(null);
				setErrorPublicGalleryImage("Unique ID is required");
				setTimeout(function () {
					setErrorPublicGalleryImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedPublicGalleryImage.type)) {
				setErrorPublicGalleryImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorPublicGalleryImage(null);
				}, 2000)
			} else if (selectedPublicGalleryImage.size > maximum_file_size) {
				setErrorPublicGalleryImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorPublicGalleryImage(null);
				}, 2000)
			} else {
				setLoadingPublicGalleryImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/media/galleries/public");
				formdata.append("file", selectedPublicGalleryImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingPublicGalleryImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorPublicGalleryImage(error);
							setTimeout(function () {
								setErrorPublicGalleryImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorPublicGalleryImage(error);
							setTimeout(function () {
								setErrorPublicGalleryImage(null);
							}, 2000)
						}
					} else {
						setErrorPublicGalleryImage(null);
						setUploadingPublicGalleryImagePercentage(0);
						setSuccessPublicGalleryImage(`Public Gallery Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editPublicGalleryImageRes = editPublicGalleryImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editPublicGalleryImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingPublicGalleryImagePercentage(0);
									setLoadingPublicGalleryImage(false);
									setErrorPublicGalleryImage(error);
									setTimeout(function () {
										setErrorPublicGalleryImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingPublicGalleryImagePercentage(0);
									setLoadingPublicGalleryImage(false);
									setErrorPublicGalleryImage(error);
									setTimeout(function () {
										setErrorPublicGalleryImage(null);
									}, 2000)
								}
							} else {
								setErrorPublicGalleryImage(null);
								setUploadingPublicGalleryImagePercentage(0);
								setSuccessPublicGalleryImage(`Public Gallery Image edited successfully!`);

								setTimeout(function () {
									setLoadingPublicGalleryImage(false);
									setSuccessPublicGalleryImage(null);
									setRemovePublicGalleryImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingPublicGalleryImagePercentage(0);
							setLoadingPublicGalleryImage(false);
						})
					}
				}).catch(err => {
					setUploadingPublicGalleryImagePercentage(0);
					setLoadingPublicGalleryImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingPublicGalleryImage, errorPublicGalleryImage, successPublicGalleryImage, handleUploadPublicGalleryImage, uniqueId, setSelectedPublicGalleryImage,
		setUniqueId, uploadingPublicGalleryImagePercentage, selectedPublicGalleryImage, removePublicGalleryImageModal, setRemovePublicGalleryImageModal
	};
};

const useDeletePublicGallery = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeletePublicGallery, setLoadingDeletePublicGallery] = useState(false);
	const [removeDeletePublicGalleryModal, setRemoveDeletePublicGalleryModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeletePublicGallery, setErrorDeletePublicGallery] = useState(null);
	const [successDeletePublicGallery, setSuccessDeletePublicGallery] = useState(null);

	const handleDeletePublicGallery = () => {

		if (!loadingDeletePublicGallery) {
			if (!uniqueId) {
				setErrorDeletePublicGallery(null);
				setSuccessDeletePublicGallery(null);
				setErrorDeletePublicGallery("Unique ID is required");
				setTimeout(function () {
					setErrorDeletePublicGallery(null);
				}, 2500)
			} else {
				setLoadingDeletePublicGallery(true);

				const deletePublicGalleryRes = deletePublicGallery(cookie, {
					unique_id: uniqueId
				})

				deletePublicGalleryRes.then(res => {
					setLoadingDeletePublicGallery(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeletePublicGallery(error);
							setTimeout(function () {
								setErrorDeletePublicGallery(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeletePublicGallery(error);
							setTimeout(function () {
								setErrorDeletePublicGallery(null);
							}, 2000)
						}
					} else {
						setErrorDeletePublicGallery(null);
						setSuccessDeletePublicGallery(`Public Gallery deleted successfully!`);

						setTimeout(function () {
							setSuccessDeletePublicGallery(null);
							setRemoveDeletePublicGalleryModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeletePublicGallery(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeletePublicGallery, removeDeletePublicGalleryModal, errorDeletePublicGallery, successDeletePublicGallery, handleDeletePublicGallery,
		setRemoveDeletePublicGalleryModal, setUniqueId
	};
};

export { useAddPublicGallery, useUpdatePublicGalleryDetails, useUploadPublicGalleryImage, useDeletePublicGallery };
