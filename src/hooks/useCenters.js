import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addCenter, deleteCenter, editCenterDetails, editCenterImage } from "../api/centers";
import { uploadFile } from "../api/clouder";

const useAddCenter = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddCenter, setLoadingAddCenter] = useState(false);
	const [removeAddCenterModal, setRemoveAddCenterModal] = useState(null);
	const [name, setName] = useState("");
	const [acronym, setAcronym] = useState("");
	const [url, setUrl] = useState("");
	const [selectedAddCenter, setSelectedAddCenter] = useState("");
	const [uploadingAddCenterPercentage, setUploadingAddCenterPercentage] = useState(0);

	const [errorAddCenter, setErrorAddCenter] = useState(null);
	const [successAddCenter, setSuccessAddCenter] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };
	const handleAcronym = (e) => { e.preventDefault(); setAcronym(e.target.value); };
	const handleUrl = (e) => { e.preventDefault(); setUrl(e.target.value); };

	const handleAddCenter = (e) => {
		e.preventDefault();

		if (!loadingAddCenter) {
			if (!name) {
				setErrorAddCenter(null);
				setSuccessAddCenter(null);
				setErrorAddCenter("Name is required");
				setTimeout(function () {
					setErrorAddCenter(null);
				}, 2500)
			} else if (name.length > 200) {
				setErrorAddCenter("Name maximum characters - 200");
				setTimeout(function () {
					setErrorAddCenter(null);
				}, 2500)
			} else if (!acronym) {
				setErrorAddCenter("Acronym is required");
				setTimeout(function () {
					setErrorAddCenter(null);
				}, 2500)
			} else if (acronym.length > 20) {
				setErrorAddCenter("Acronym maximum characters - 20");
				setTimeout(function () {
					setErrorAddCenter(null);
				}, 2500)
			} else if (selectedAddCenter.length > 0 && !allowed_extensions.includes(selectedAddCenter.type)) {
				setErrorAddCenter("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddCenter(null);
				}, 2000)
			} else if (selectedAddCenter.length > 0 && selectedAddCenter.size > maximum_file_size) {
				setErrorAddCenter("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddCenter(null);
				}, 2000)
			} else {
				setLoadingAddCenter(true);

				if (selectedAddCenter.length > 0) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/logos");
					formdata.append("file", selectedAddCenter);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);
	
					const uploadFileRes = uploadFile(formdata)
	
					uploadFileRes.then(res => {
						setLoadingAddCenter(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddCenter(error);
								setTimeout(function () {
									setErrorAddCenter(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddCenter(error);
								setTimeout(function () {
									setErrorAddCenter(null);
								}, 2000)
							}
						} else {
							setErrorAddCenter(null);
							setUploadingAddCenterPercentage(0);
							setSuccessAddCenter(`Center Image Uploaded!`);
	
							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;
	
							const addCenterRes = addCenter(cookie, {
								name: name.trim(), acronym: acronym.trim(), url: url ? url.trim() : undefined, image, image_public_id
							})
	
							addCenterRes.then(res => {
								setLoadingAddCenter(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddCenter(error);
										setTimeout(function () {
											setErrorAddCenter(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddCenter(error);
										setTimeout(function () {
											setErrorAddCenter(null);
										}, 2000)
									}
								} else {
									setErrorAddCenter(null);
									setUploadingAddCenterPercentage(0);
									setSuccessAddCenter(`Center added successfully!`);
	
									setTimeout(function () {
										setSuccessAddCenter(null);
										setRemoveAddCenterModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddCenterPercentage(0);
								setLoadingAddCenter(false);
							})
	
						}
					}).catch(err => {
						setUploadingAddCenterPercentage(0);
						setLoadingAddCenter(false);
					})
				} else {
					const addCenterRes = addCenter(cookie, {
						name: name.trim(), acronym: acronym.trim(), url: url ? url.trim() : undefined, image: undefined, image_public_id: undefined
					})

					addCenterRes.then(res => {
						setLoadingAddCenter(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddCenter(error);
								setTimeout(function () {
									setErrorAddCenter(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddCenter(error);
								setTimeout(function () {
									setErrorAddCenter(null);
								}, 2000)
							}
						} else {
							setErrorAddCenter(null);
							setUploadingAddCenterPercentage(0);
							setSuccessAddCenter(`Center added successfully!`);

							setTimeout(function () {
								setSuccessAddCenter(null);
								setRemoveAddCenterModal(true);
							}, 2500)
						}
					}).catch(err => {
						setUploadingAddCenterPercentage(0);
						setLoadingAddCenter(false);
					})
				}
			}
		}
	};

	return {
		cookie, name, acronym, url, loadingAddCenter, setRemoveAddCenterModal, errorAddCenter, successAddCenter, removeAddCenterModal, setSelectedAddCenter,
		handleAddCenter, handleName, handleAcronym, handleUrl, setName, setAcronym, setUrl, uploadingAddCenterPercentage, selectedAddCenter,
	};
};

const useUpdateCenterDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateCenterDetails, setLoadingUpdateCenterDetails] = useState(false);
	const [removeUpdateCenterDetailsModal, setRemoveUpdateCenterDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [name, setName] = useState("");
	const [acronym, setAcronym] = useState("");
	const [url, setUrl] = useState("");

	const [errorUpdateCenterDetails, setErrorUpdateCenterDetails] = useState(null);
	const [successUpdateCenterDetails, setSuccessUpdateCenterDetails] = useState(null);

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };
	const handleAcronym = (e) => { e.preventDefault(); setAcronym(e.target.value); };
	const handleUrl = (e) => { e.preventDefault(); setUrl(e.target.value); };

	const handleUpdateCenterDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateCenterDetails) {
			if (!uniqueId) {
				setErrorUpdateCenterDetails(null);
				setSuccessUpdateCenterDetails(null);
				setErrorUpdateCenterDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCenterDetails(null);
				}, 2500)
			} else if (!name) {
				setErrorUpdateCenterDetails("Name is required");
				setTimeout(function () {
					setErrorUpdateCenterDetails(null);
				}, 2500)
			} else if (name.length > 200) {
				setErrorUpdateCenterDetails("Name maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateCenterDetails(null);
				}, 2500)
			} else if (!acronym) {
				setErrorUpdateCenterDetails("Acronym is required");
				setTimeout(function () {
					setErrorUpdateCenterDetails(null);
				}, 2500)
			} else if (acronym.length > 20) {
				setErrorUpdateCenterDetails("Acronym maximum characters - 20");
				setTimeout(function () {
					setErrorUpdateCenterDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateCenterDetails(true);

				const editCenterDetailsRes = editCenterDetails(cookie, {
					unique_id: uniqueId,
					name: name.trim(), 
					acronym, 
					url: url ? url : undefined,
				})

				editCenterDetailsRes.then(res => {
					setLoadingUpdateCenterDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCenterDetails(error);
							setTimeout(function () {
								setErrorUpdateCenterDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCenterDetails(error);
							setTimeout(function () {
								setErrorUpdateCenterDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCenterDetails(null);
						setSuccessUpdateCenterDetails(`Center details edited!`);

						setTimeout(function () {
							setSuccessUpdateCenterDetails(null);
							setRemoveUpdateCenterDetailsModal(true);
							setUniqueId(null);
							setName("");
							setAcronym("");
							setUrl("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCenterDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCenterDetails, removeUpdateCenterDetailsModal, errorUpdateCenterDetails, successUpdateCenterDetails, handleUpdateCenterDetails,
		setRemoveUpdateCenterDetailsModal, setUniqueId, setName, setAcronym, setUrl, name, acronym, url, handleName, handleAcronym, handleUrl
	};
};

const useUploadCenterImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCenterImage, setLoadingCenterImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeCenterImageModal, setRemoveCenterImageModal] = useState(null);
	const [selectedCenterImage, setSelectedCenterImage] = useState("");
	const [uploadingCenterImagePercentage, setUploadingCenterImagePercentage] = useState(0);

	const [errorCenterImage, setErrorCenterImage] = useState(null);
	const [successCenterImage, setSuccessCenterImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadCenterImage = (e) => {
		e.preventDefault();

		if (!loadingCenterImage) {
			if (!uniqueId) {
				setErrorCenterImage(null);
				setSuccessCenterImage(null);
				setErrorCenterImage("Unique ID is required");
				setTimeout(function () {
					setErrorCenterImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedCenterImage.type)) {
				setErrorCenterImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorCenterImage(null);
				}, 2000)
			} else if (selectedCenterImage.size > maximum_file_size) {
				setErrorCenterImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorCenterImage(null);
				}, 2000)
			} else {
				setLoadingCenterImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/logos");
				formdata.append("file", selectedCenterImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingCenterImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCenterImage(error);
							setTimeout(function () {
								setErrorCenterImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCenterImage(error);
							setTimeout(function () {
								setErrorCenterImage(null);
							}, 2000)
						}
					} else {
						setErrorCenterImage(null);
						setUploadingCenterImagePercentage(0);
						setSuccessCenterImage(`Center Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editCenterImageRes = editCenterImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editCenterImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingCenterImagePercentage(0);
									setLoadingCenterImage(false);
									setErrorCenterImage(error);
									setTimeout(function () {
										setErrorCenterImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingCenterImagePercentage(0);
									setLoadingCenterImage(false);
									setErrorCenterImage(error);
									setTimeout(function () {
										setErrorCenterImage(null);
									}, 2000)
								}
							} else {
								setErrorCenterImage(null);
								setUploadingCenterImagePercentage(0);
								setSuccessCenterImage(`Center Image edited successfully!`);

								setTimeout(function () {
									setLoadingCenterImage(false);
									setSuccessCenterImage(null);
									setRemoveCenterImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingCenterImagePercentage(0);
							setLoadingCenterImage(false);
						})
					}
				}).catch(err => {
					setUploadingCenterImagePercentage(0);
					setLoadingCenterImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingCenterImage, errorCenterImage, successCenterImage, handleUploadCenterImage, uniqueId, setSelectedCenterImage,
		setUniqueId, uploadingCenterImagePercentage, selectedCenterImage, removeCenterImageModal, setRemoveCenterImageModal
	};
};

const useDeleteCenter = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteCenter, setLoadingDeleteCenter] = useState(false);
	const [removeDeleteCenterModal, setRemoveDeleteCenterModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteCenter, setErrorDeleteCenter] = useState(null);
	const [successDeleteCenter, setSuccessDeleteCenter] = useState(null);

	const handleDeleteCenter = () => {

		if (!loadingDeleteCenter) {
			if (!uniqueId) {
				setErrorDeleteCenter(null);
				setSuccessDeleteCenter(null);
				setErrorDeleteCenter("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteCenter(null);
				}, 2500)
			} else {
				setLoadingDeleteCenter(true);

				const deleteCenterRes = deleteCenter(cookie, {
					unique_id: uniqueId
				})

				deleteCenterRes.then(res => {
					setLoadingDeleteCenter(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteCenter(error);
							setTimeout(function () {
								setErrorDeleteCenter(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteCenter(error);
							setTimeout(function () {
								setErrorDeleteCenter(null);
							}, 2000)
						}
					} else {
						setErrorDeleteCenter(null);
						setSuccessDeleteCenter(`Center deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteCenter(null);
							setRemoveDeleteCenterModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteCenter(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteCenter, removeDeleteCenterModal, errorDeleteCenter, successDeleteCenter, handleDeleteCenter,
		setRemoveDeleteCenterModal, setUniqueId
	};
};

export { useAddCenter, useUpdateCenterDetails, useUploadCenterImage, useDeleteCenter };
