import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addCourseCategory, deleteCourseCategory, editCourseCategoryDetails, editCourseCategoryImage } from "../api/courseCategories";
import { uploadFile } from "../api/clouder";

const useAddCourseCategory = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddCourseCategory, setLoadingAddCourseCategory] = useState(false);
	const [removeAddCourseCategoryModal, setRemoveAddCourseCategoryModal] = useState(null);
	const [title, setTitle] = useState("");
	const [selectedAddCourseCategory, setSelectedAddCourseCategory] = useState("");
	const [uploadingAddCourseCategoryPercentage, setUploadingAddCourseCategoryPercentage] = useState(0);

	const [errorAddCourseCategory, setErrorAddCourseCategory] = useState(null);
	const [successAddCourseCategory, setSuccessAddCourseCategory] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };

	const handleAddCourseCategory = (e) => {
		e.preventDefault();

		if (!loadingAddCourseCategory) {
			if (!title) {
				setErrorAddCourseCategory(null);
				setSuccessAddCourseCategory(null);
				setErrorAddCourseCategory("Title is required");
				setTimeout(function () {
					setErrorAddCourseCategory(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorAddCourseCategory("Title maximum characters - 200");
				setTimeout(function () {
					setErrorAddCourseCategory(null);
				}, 2500)
			} else if (selectedAddCourseCategory.length > 0 && !allowed_extensions.includes(selectedAddCourseCategory.type)) {
				setErrorAddCourseCategory("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddCourseCategory(null);
				}, 2000)
			} else if (selectedAddCourseCategory.length > 0 && selectedAddCourseCategory.size > maximum_file_size) {
				setErrorAddCourseCategory("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddCourseCategory(null);
				}, 2000)
			} else {
				setLoadingAddCourseCategory(true);

				if (selectedAddCourseCategory.length > 0) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/courses/categories");
					formdata.append("file", selectedAddCourseCategory);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddCourseCategory(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddCourseCategory(error);
								setTimeout(function () {
									setErrorAddCourseCategory(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddCourseCategory(error);
								setTimeout(function () {
									setErrorAddCourseCategory(null);
								}, 2000)
							}
						} else {
							setErrorAddCourseCategory(null);
							setUploadingAddCourseCategoryPercentage(0);
							setSuccessAddCourseCategory(`CourseCategory Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const addCourseCategoryRes = addCourseCategory(cookie, {
								title: title.trim(), image, image_public_id
							})

							addCourseCategoryRes.then(res => {
								setLoadingAddCourseCategory(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddCourseCategory(error);
										setTimeout(function () {
											setErrorAddCourseCategory(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddCourseCategory(error);
										setTimeout(function () {
											setErrorAddCourseCategory(null);
										}, 2000)
									}
								} else {
									setErrorAddCourseCategory(null);
									setUploadingAddCourseCategoryPercentage(0);
									setSuccessAddCourseCategory(`Course Category added successfully!`);

									setTimeout(function () {
										setSuccessAddCourseCategory(null);
										setRemoveAddCourseCategoryModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddCourseCategoryPercentage(0);
								setLoadingAddCourseCategory(false);
							})

						}
					}).catch(err => {
						setUploadingAddCourseCategoryPercentage(0);
						setLoadingAddCourseCategory(false);
					})
				} else {
					const addCourseCategoryRes = addCourseCategory(cookie, {
						title: title.trim(), image: undefined, image_public_id: undefined
					})

					addCourseCategoryRes.then(res => {
						setLoadingAddCourseCategory(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddCourseCategory(error);
								setTimeout(function () {
									setErrorAddCourseCategory(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddCourseCategory(error);
								setTimeout(function () {
									setErrorAddCourseCategory(null);
								}, 2000)
							}
						} else {
							setErrorAddCourseCategory(null);
							setUploadingAddCourseCategoryPercentage(0);
							setSuccessAddCourseCategory(`Course Category added successfully!`);

							setTimeout(function () {
								setSuccessAddCourseCategory(null);
								setRemoveAddCourseCategoryModal(true);
							}, 2500)
						}
					}).catch(err => {
						setUploadingAddCourseCategoryPercentage(0);
						setLoadingAddCourseCategory(false);
					})
				}
			}
		}
	};

	return {
		cookie, title, loadingAddCourseCategory, setRemoveAddCourseCategoryModal, errorAddCourseCategory, successAddCourseCategory, removeAddCourseCategoryModal, setSelectedAddCourseCategory,
		handleAddCourseCategory, handleTitle, setTitle, uploadingAddCourseCategoryPercentage, selectedAddCourseCategory,
	};
};

const useUpdateCourseCategoryDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateCourseCategoryDetails, setLoadingUpdateCourseCategoryDetails] = useState(false);
	const [removeUpdateCourseCategoryDetailsModal, setRemoveUpdateCourseCategoryDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");

	const [errorUpdateCourseCategoryDetails, setErrorUpdateCourseCategoryDetails] = useState(null);
	const [successUpdateCourseCategoryDetails, setSuccessUpdateCourseCategoryDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };

	const handleUpdateCourseCategoryDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateCourseCategoryDetails) {
			if (!uniqueId) {
				setErrorUpdateCourseCategoryDetails(null);
				setSuccessUpdateCourseCategoryDetails(null);
				setErrorUpdateCourseCategoryDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCourseCategoryDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateCourseCategoryDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateCourseCategoryDetails(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorUpdateCourseCategoryDetails("Title maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateCourseCategoryDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateCourseCategoryDetails(true);

				const editCourseCategoryDetailsRes = editCourseCategoryDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
				})

				editCourseCategoryDetailsRes.then(res => {
					setLoadingUpdateCourseCategoryDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCourseCategoryDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseCategoryDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCourseCategoryDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseCategoryDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCourseCategoryDetails(null);
						setSuccessUpdateCourseCategoryDetails(`Course Category details edited!`);

						setTimeout(function () {
							setSuccessUpdateCourseCategoryDetails(null);
							setRemoveUpdateCourseCategoryDetailsModal(true);
							setUniqueId(null);
							setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCourseCategoryDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCourseCategoryDetails, removeUpdateCourseCategoryDetailsModal, errorUpdateCourseCategoryDetails, successUpdateCourseCategoryDetails, handleUpdateCourseCategoryDetails,
		setRemoveUpdateCourseCategoryDetailsModal, setUniqueId, setTitle, title, handleTitle
	};
};

const useUploadCourseCategoryImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCourseCategoryImage, setLoadingCourseCategoryImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeCourseCategoryImageModal, setRemoveCourseCategoryImageModal] = useState(null);
	const [selectedCourseCategoryImage, setSelectedCourseCategoryImage] = useState("");
	const [uploadingCourseCategoryImagePercentage, setUploadingCourseCategoryImagePercentage] = useState(0);

	const [errorCourseCategoryImage, setErrorCourseCategoryImage] = useState(null);
	const [successCourseCategoryImage, setSuccessCourseCategoryImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadCourseCategoryImage = (e) => {
		e.preventDefault();

		if (!loadingCourseCategoryImage) {
			if (!uniqueId) {
				setErrorCourseCategoryImage(null);
				setSuccessCourseCategoryImage(null);
				setErrorCourseCategoryImage("Unique ID is required");
				setTimeout(function () {
					setErrorCourseCategoryImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedCourseCategoryImage.type)) {
				setErrorCourseCategoryImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorCourseCategoryImage(null);
				}, 2000)
			} else if (selectedCourseCategoryImage.size > maximum_file_size) {
				setErrorCourseCategoryImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorCourseCategoryImage(null);
				}, 2000)
			} else {
				setLoadingCourseCategoryImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/courses/categories");
				formdata.append("file", selectedCourseCategoryImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingCourseCategoryImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCourseCategoryImage(error);
							setTimeout(function () {
								setErrorCourseCategoryImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCourseCategoryImage(error);
							setTimeout(function () {
								setErrorCourseCategoryImage(null);
							}, 2000)
						}
					} else {
						setErrorCourseCategoryImage(null);
						setUploadingCourseCategoryImagePercentage(0);
						setSuccessCourseCategoryImage(`CourseCategory Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editCourseCategoryImageRes = editCourseCategoryImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editCourseCategoryImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingCourseCategoryImagePercentage(0);
									setLoadingCourseCategoryImage(false);
									setErrorCourseCategoryImage(error);
									setTimeout(function () {
										setErrorCourseCategoryImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingCourseCategoryImagePercentage(0);
									setLoadingCourseCategoryImage(false);
									setErrorCourseCategoryImage(error);
									setTimeout(function () {
										setErrorCourseCategoryImage(null);
									}, 2000)
								}
							} else {
								setErrorCourseCategoryImage(null);
								setUploadingCourseCategoryImagePercentage(0);
								setSuccessCourseCategoryImage(`Course Category Image edited successfully!`);

								setTimeout(function () {
									setLoadingCourseCategoryImage(false);
									setSuccessCourseCategoryImage(null);
									setRemoveCourseCategoryImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingCourseCategoryImagePercentage(0);
							setLoadingCourseCategoryImage(false);
						})
					}
				}).catch(err => {
					setUploadingCourseCategoryImagePercentage(0);
					setLoadingCourseCategoryImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingCourseCategoryImage, errorCourseCategoryImage, successCourseCategoryImage, handleUploadCourseCategoryImage, uniqueId, setSelectedCourseCategoryImage,
		setUniqueId, uploadingCourseCategoryImagePercentage, selectedCourseCategoryImage, removeCourseCategoryImageModal, setRemoveCourseCategoryImageModal
	};
};

const useDeleteCourseCategory = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteCourseCategory, setLoadingDeleteCourseCategory] = useState(false);
	const [removeDeleteCourseCategoryModal, setRemoveDeleteCourseCategoryModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteCourseCategory, setErrorDeleteCourseCategory] = useState(null);
	const [successDeleteCourseCategory, setSuccessDeleteCourseCategory] = useState(null);

	const handleDeleteCourseCategory = () => {

		if (!loadingDeleteCourseCategory) {
			if (!uniqueId) {
				setErrorDeleteCourseCategory(null);
				setSuccessDeleteCourseCategory(null);
				setErrorDeleteCourseCategory("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteCourseCategory(null);
				}, 2500)
			} else {
				setLoadingDeleteCourseCategory(true);

				const deleteCourseCategoryRes = deleteCourseCategory(cookie, {
					unique_id: uniqueId
				})

				deleteCourseCategoryRes.then(res => {
					setLoadingDeleteCourseCategory(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteCourseCategory(error);
							setTimeout(function () {
								setErrorDeleteCourseCategory(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteCourseCategory(error);
							setTimeout(function () {
								setErrorDeleteCourseCategory(null);
							}, 2000)
						}
					} else {
						setErrorDeleteCourseCategory(null);
						setSuccessDeleteCourseCategory(`Course Category deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteCourseCategory(null);
							setRemoveDeleteCourseCategoryModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteCourseCategory(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteCourseCategory, removeDeleteCourseCategoryModal, errorDeleteCourseCategory, successDeleteCourseCategory, handleDeleteCourseCategory,
		setRemoveDeleteCourseCategoryModal, setUniqueId
	};
};

export { useAddCourseCategory, useUpdateCourseCategoryDetails, useUploadCourseCategoryImage, useDeleteCourseCategory };
