import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import {
	addPost, deletePost, editPostDetails, editPostImage, editPostAltText, editPostCategory, editPostTimestamp, editPostTitle
} from "../api/posts";
import { uploadFile } from "../api/clouder";

const useAddPost = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddPost, setLoadingAddPost] = useState(false);
	const [removeAddPostModal, setRemoveAddPostModal] = useState(null);
	const [categoryUniqueId, setCategoryUniqueId] = useState("");
	const [title, setTitle] = useState("");
	const [altText, setAltText] = useState("");
	const [details, setDetails] = useState("");
	const [selectedAddPost, setSelectedAddPost] = useState("");
	const [uploadingAddPostPercentage, setUploadingAddPostPercentage] = useState(0);

	const [errorAddPost, setErrorAddPost] = useState(null);
	const [successAddPost, setSuccessAddPost] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleCategoryUniqueId = (e) => { e.preventDefault(); setCategoryUniqueId(e.target.value); };
	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleAltText = (e) => { e.preventDefault(); setAltText(e.target.value); };
	const handleDetails = (contents) => { setDetails(contents); };

	const handleAddPost = (e) => {
		e.preventDefault();

		if (!loadingAddPost) {
			if (!categoryUniqueId) {
				setErrorAddPost(null);
				setSuccessAddPost(null);
				setErrorAddPost("Category is required");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (!title) {
				setErrorAddPost("Title is required");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddPost("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (!altText) {
				setErrorAddPost("Alt Text is required");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (altText.length > 500) {
				setErrorAddPost("Alt Text maximum characters - 500");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (details.length < 3) {
				setErrorAddPost("Details is required | Min character - 3");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (details.length > 65535) {
				setErrorAddPost("Invalid Details | Max length reached");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (selectedAddPost.length < 1) {
				setErrorAddPost("Image is required");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2500)
			} else if (!allowed_extensions.includes(selectedAddPost.type)) {
				setErrorAddPost("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2000)
			} else if (selectedAddPost.size > maximum_file_size) {
				setErrorAddPost("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddPost(null);
				}, 2000)
			} else {
				setLoadingAddPost(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/media/posts");
				formdata.append("file", selectedAddPost);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingAddPost(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddPost(error);
							setTimeout(function () {
								setErrorAddPost(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddPost(error);
							setTimeout(function () {
								setErrorAddPost(null);
							}, 2000)
						}
					} else {
						setErrorAddPost(null);
						setUploadingAddPostPercentage(0);
						setSuccessAddPost(`Post Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const addPostRes = addPost(cookie, {
							category_unique_id: categoryUniqueId,
							title: title.trim(),
							alt_text: altText.trim(),
							details: details,
							image,
							image_public_id
						})

						addPostRes.then(res => {
							setLoadingAddPost(false);
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setErrorAddPost(error);
									setTimeout(function () {
										setErrorAddPost(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setErrorAddPost(error);
									setTimeout(function () {
										setErrorAddPost(null);
									}, 2000)
								}
							} else {
								setErrorAddPost(null);
								setUploadingAddPostPercentage(0);
								setSuccessAddPost(`Post added successfully!`);

								setTimeout(function () {
									setSuccessAddPost(null);
									setRemoveAddPostModal(true);
								}, 2500)
							}
						}).catch(err => {
							setUploadingAddPostPercentage(0);
							setLoadingAddPost(false);
						})

					}
				}).catch(err => {
					setUploadingAddPostPercentage(0);
					setLoadingAddPost(false);
				})
			}
		}
	};

	return {
		cookie, categoryUniqueId, title, details, altText, loadingAddPost, setRemoveAddPostModal, errorAddPost, successAddPost, removeAddPostModal, setSelectedAddPost,
		handleAddPost, handleCategoryUniqueId, handleTitle, handleDetails, handleAltText, setCategoryUniqueId, setTitle, setDetails, setAltText, uploadingAddPostPercentage, selectedAddPost,
	};
};

const useUpdatePostCategory = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePostCategory, setLoadingUpdatePostCategory] = useState(false);
	const [removeUpdatePostCategoryModal, setRemoveUpdatePostCategoryModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [categoryUniqueId, setCategoryUniqueId] = useState("");

	const [errorUpdatePostCategory, setErrorUpdatePostCategory] = useState(null);
	const [successUpdatePostCategory, setSuccessUpdatePostCategory] = useState(null);

	const handleCategoryUniqueId = (e) => { e.preventDefault(); setCategoryUniqueId(e.target.value); };

	const handleUpdatePostCategory = (e) => {
		e.preventDefault();

		if (!loadingUpdatePostCategory) {
			if (!uniqueId) {
				setErrorUpdatePostCategory(null);
				setSuccessUpdatePostCategory(null);
				setErrorUpdatePostCategory("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePostCategory(null);
				}, 2500)
			} else if (!categoryUniqueId) {
				setErrorUpdatePostCategory("Category is required");
				setTimeout(function () {
					setErrorUpdatePostCategory(null);
				}, 2500)
			} else {
				setLoadingUpdatePostCategory(true);

				const editPostCategoryRes = editPostCategory(cookie, {
					unique_id: uniqueId,
					category_unique_id: categoryUniqueId,
				})

				editPostCategoryRes.then(res => {
					setLoadingUpdatePostCategory(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePostCategory(error);
							setTimeout(function () {
								setErrorUpdatePostCategory(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePostCategory(error);
							setTimeout(function () {
								setErrorUpdatePostCategory(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePostCategory(null);
						setSuccessUpdatePostCategory(`Post category edited!`);

						setTimeout(function () {
							setSuccessUpdatePostCategory(null);
							setRemoveUpdatePostCategoryModal(true);
							// setUniqueId(null);
							// setCategoryUniqueId("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePostCategory(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePostCategory, removeUpdatePostCategoryModal, errorUpdatePostCategory, successUpdatePostCategory, handleUpdatePostCategory,
		setRemoveUpdatePostCategoryModal, setUniqueId, setCategoryUniqueId, categoryUniqueId, handleCategoryUniqueId
	};
};

const useUpdatePostTitle = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePostTitle, setLoadingUpdatePostTitle] = useState(false);
	const [removeUpdatePostTitleModal, setRemoveUpdatePostTitleModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");

	const [errorUpdatePostTitle, setErrorUpdatePostTitle] = useState(null);
	const [successUpdatePostTitle, setSuccessUpdatePostTitle] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };

	const handleUpdatePostTitle = (e) => {
		e.preventDefault();

		if (!loadingUpdatePostTitle) {
			if (!uniqueId) {
				setErrorUpdatePostTitle(null);
				setSuccessUpdatePostTitle(null);
				setErrorUpdatePostTitle("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePostTitle(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdatePostTitle("Title is required");
				setTimeout(function () {
					setErrorUpdatePostTitle(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorUpdatePostTitle("Title maximum characters - 500");
				setTimeout(function () {
					setErrorUpdatePostTitle(null);
				}, 2500)
			} else {
				setLoadingUpdatePostTitle(true);

				const editPostTitleRes = editPostTitle(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
				})

				editPostTitleRes.then(res => {
					setLoadingUpdatePostTitle(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePostTitle(error);
							setTimeout(function () {
								setErrorUpdatePostTitle(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePostTitle(error);
							setTimeout(function () {
								setErrorUpdatePostTitle(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePostTitle(null);
						setSuccessUpdatePostTitle(`Post title edited!`);

						setTimeout(function () {
							setSuccessUpdatePostTitle(null);
							setRemoveUpdatePostTitleModal(true);
							// setUniqueId(null);
							// setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePostTitle(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePostTitle, removeUpdatePostTitleModal, errorUpdatePostTitle, successUpdatePostTitle, handleUpdatePostTitle,
		setRemoveUpdatePostTitleModal, setUniqueId, setTitle, title, handleTitle,
	};
};

const useUpdatePostAltText = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePostAltText, setLoadingUpdatePostAltText] = useState(false);
	const [removeUpdatePostAltTextModal, setRemoveUpdatePostAltTextModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [altText, setAltText] = useState("");

	const [errorUpdatePostAltText, setErrorUpdatePostAltText] = useState(null);
	const [successUpdatePostAltText, setSuccessUpdatePostAltText] = useState(null);

	const handleAltText = (e) => { e.preventDefault(); setAltText(e.target.value); };

	const handleUpdatePostAltText = (e) => {
		e.preventDefault();

		if (!loadingUpdatePostAltText) {
			if (!uniqueId) {
				setErrorUpdatePostAltText(null);
				setSuccessUpdatePostAltText(null);
				setErrorUpdatePostAltText("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePostAltText(null);
				}, 2500)
			} else if (!altText) {
				setErrorUpdatePostAltText("Alt Text is required");
				setTimeout(function () {
					setErrorUpdatePostAltText(null);
				}, 2500)
			} else if (altText.length > 500) {
				setErrorUpdatePostAltText("Alt Text maximum characters - 500");
				setTimeout(function () {
					setErrorUpdatePostAltText(null);
				}, 2500)
			} else {
				setLoadingUpdatePostAltText(true);

				const editPostAltTextRes = editPostAltText(cookie, {
					unique_id: uniqueId,
					alt_text: altText.trim(),
				})

				editPostAltTextRes.then(res => {
					setLoadingUpdatePostAltText(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePostAltText(error);
							setTimeout(function () {
								setErrorUpdatePostAltText(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePostAltText(error);
							setTimeout(function () {
								setErrorUpdatePostAltText(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePostAltText(null);
						setSuccessUpdatePostAltText(`Post alt text edited!`);

						setTimeout(function () {
							setSuccessUpdatePostAltText(null);
							setRemoveUpdatePostAltTextModal(true);
							// setUniqueId(null);
							// setAltText("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePostAltText(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePostAltText, removeUpdatePostAltTextModal, errorUpdatePostAltText, successUpdatePostAltText, handleUpdatePostAltText,
		setRemoveUpdatePostAltTextModal, setUniqueId, setAltText, altText, handleAltText,
	};
};

const useUpdatePostTimestamp = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePostTimestamp, setLoadingUpdatePostTimestamp] = useState(false);
	const [removeUpdatePostTimestampModal, setRemoveUpdatePostTimestampModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [createdAt, setCreatedAt] = useState("");

	const [errorUpdatePostTimestamp, setErrorUpdatePostTimestamp] = useState(null);
	const [successUpdatePostTimestamp, setSuccessUpdatePostTimestamp] = useState(null);

	const handleCreatedAt = (e) => { e.preventDefault(); setCreatedAt(e.target.value); };

	const return_date = (date) => {
		if (date === "") return undefined;
		let _date = date.split("T");
		return _date[0] + " " + _date[1].split(":")[0] + ":" + _date[1].split(":")[1];
	};

	const handleUpdatePostTimestamp = (e) => {
		e.preventDefault();

		if (!loadingUpdatePostTimestamp) {
			if (!uniqueId) {
				setErrorUpdatePostTimestamp(null);
				setSuccessUpdatePostTimestamp(null);
				setErrorUpdatePostTimestamp("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePostTimestamp(null);
				}, 2500)
			} else if (!createdAt) {
				setErrorUpdatePostTimestamp("Created At is required");
				setTimeout(function () {
					setErrorUpdatePostTimestamp(null);
				}, 2500)
			} else {
				setLoadingUpdatePostTimestamp(true);

				const editPostTimestampRes = editPostTimestamp(cookie, {
					unique_id: uniqueId,
					createdAt: return_date(createdAt),
				})

				editPostTimestampRes.then(res => {
					setLoadingUpdatePostTimestamp(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePostTimestamp(error);
							setTimeout(function () {
								setErrorUpdatePostTimestamp(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePostTimestamp(error);
							setTimeout(function () {
								setErrorUpdatePostTimestamp(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePostTimestamp(null);
						setSuccessUpdatePostTimestamp(`Post timestamp edited!`);

						setTimeout(function () {
							setSuccessUpdatePostTimestamp(null);
							setRemoveUpdatePostTimestampModal(true);
							// setUniqueId(null);
							// setCreatedAt("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePostTimestamp(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePostTimestamp, removeUpdatePostTimestampModal, errorUpdatePostTimestamp, successUpdatePostTimestamp, handleUpdatePostTimestamp,
		setRemoveUpdatePostTimestampModal, setUniqueId, setCreatedAt, createdAt, handleCreatedAt, 
	};
};

const useUpdatePostDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePostDetails, setLoadingUpdatePostDetails] = useState(false);
	const [removeUpdatePostDetailsModal, setRemoveUpdatePostDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [details, setDetails] = useState("");

	const [errorUpdatePostDetails, setErrorUpdatePostDetails] = useState(null);
	const [successUpdatePostDetails, setSuccessUpdatePostDetails] = useState(null);

	const handleDetails = (contents) => { setDetails(contents); };

	const handleUpdatePostDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdatePostDetails) {
			if (!uniqueId) {
				setErrorUpdatePostDetails(null);
				setSuccessUpdatePostDetails(null);
				setErrorUpdatePostDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePostDetails(null);
				}, 2500)
			} else if (details.length < 3) {
				setErrorUpdatePostDetails("Details is required | Min character - 3");
				setTimeout(function () {
					setErrorUpdatePostDetails(null);
				}, 2500)
			} else if (details.length > 65535) {
				setErrorUpdatePostDetails("Invalid Details | Max length reached");
				setTimeout(function () {
					setErrorUpdatePostDetails(null);
				}, 2500)
			} else {
				setLoadingUpdatePostDetails(true);

				const editPostDetailsRes = editPostDetails(cookie, {
					unique_id: uniqueId,
					details: details,
				})

				editPostDetailsRes.then(res => {
					setLoadingUpdatePostDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePostDetails(error);
							setTimeout(function () {
								setErrorUpdatePostDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePostDetails(error);
							setTimeout(function () {
								setErrorUpdatePostDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePostDetails(null);
						setSuccessUpdatePostDetails(`Post details edited!`);

						setTimeout(function () {
							setSuccessUpdatePostDetails(null);
							setRemoveUpdatePostDetailsModal(true);
							// setUniqueId(null);
							// setDetails("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePostDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePostDetails, removeUpdatePostDetailsModal, errorUpdatePostDetails, successUpdatePostDetails, handleUpdatePostDetails,
		setRemoveUpdatePostDetailsModal, setUniqueId, setDetails, details, handleDetails,
	};
};

const useUploadPostImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingPostImage, setLoadingPostImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removePostImageModal, setRemovePostImageModal] = useState(null);
	const [selectedPostImage, setSelectedPostImage] = useState("");
	const [uploadingPostImagePercentage, setUploadingPostImagePercentage] = useState(0);

	const [errorPostImage, setErrorPostImage] = useState(null);
	const [successPostImage, setSuccessPostImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadPostImage = (e) => {
		e.preventDefault();

		if (!loadingPostImage) {
			if (!uniqueId) {
				setErrorPostImage(null);
				setSuccessPostImage(null);
				setErrorPostImage("Unique ID is required");
				setTimeout(function () {
					setErrorPostImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedPostImage.type)) {
				setErrorPostImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorPostImage(null);
				}, 2000)
			} else if (selectedPostImage.size > maximum_file_size) {
				setErrorPostImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorPostImage(null);
				}, 2000)
			} else {
				setLoadingPostImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/media/posts");
				formdata.append("file", selectedPostImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingPostImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorPostImage(error);
							setTimeout(function () {
								setErrorPostImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorPostImage(error);
							setTimeout(function () {
								setErrorPostImage(null);
							}, 2000)
						}
					} else {
						setErrorPostImage(null);
						setUploadingPostImagePercentage(0);
						setSuccessPostImage(`Post Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editPostImageRes = editPostImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editPostImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingPostImagePercentage(0);
									setLoadingPostImage(false);
									setErrorPostImage(error);
									setTimeout(function () {
										setErrorPostImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingPostImagePercentage(0);
									setLoadingPostImage(false);
									setErrorPostImage(error);
									setTimeout(function () {
										setErrorPostImage(null);
									}, 2000)
								}
							} else {
								setErrorPostImage(null);
								setUploadingPostImagePercentage(0);
								setSuccessPostImage(`Post Image edited successfully!`);

								setTimeout(function () {
									setLoadingPostImage(false);
									setSuccessPostImage(null);
									setRemovePostImageModal(true);
									// setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingPostImagePercentage(0);
							setLoadingPostImage(false);
						})
					}
				}).catch(err => {
					setUploadingPostImagePercentage(0);
					setLoadingPostImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingPostImage, errorPostImage, successPostImage, handleUploadPostImage, uniqueId, setSelectedPostImage,
		setUniqueId, uploadingPostImagePercentage, selectedPostImage, removePostImageModal, setRemovePostImageModal
	};
};

const useDeletePost = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeletePost, setLoadingDeletePost] = useState(false);
	const [removeDeletePostModal, setRemoveDeletePostModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeletePost, setErrorDeletePost] = useState(null);
	const [successDeletePost, setSuccessDeletePost] = useState(null);

	const handleDeletePost = () => {

		if (!loadingDeletePost) {
			if (!uniqueId) {
				setErrorDeletePost(null);
				setSuccessDeletePost(null);
				setErrorDeletePost("Unique ID is required");
				setTimeout(function () {
					setErrorDeletePost(null);
				}, 2500)
			} else {
				setLoadingDeletePost(true);

				const deletePostRes = deletePost(cookie, {
					unique_id: uniqueId
				})

				deletePostRes.then(res => {
					setLoadingDeletePost(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeletePost(error);
							setTimeout(function () {
								setErrorDeletePost(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeletePost(error);
							setTimeout(function () {
								setErrorDeletePost(null);
							}, 2000)
						}
					} else {
						setErrorDeletePost(null);
						setSuccessDeletePost(`Post deleted successfully!`);

						setTimeout(function () {
							setSuccessDeletePost(null);
							setRemoveDeletePostModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeletePost(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeletePost, removeDeletePostModal, errorDeletePost, successDeletePost, handleDeletePost,
		setRemoveDeletePostModal, setUniqueId
	};
};

export { useAddPost, useUpdatePostDetails, useUpdatePostCategory, useUpdatePostTitle, useUpdatePostAltText, useUploadPostImage, useUpdatePostTimestamp, useDeletePost };
