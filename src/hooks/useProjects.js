import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import {
	addProject, deleteProject, editProjectDetails, editProjectImage, editProjectAltText, editProjectType, editProjectTimestamp, editProjectTitle
} from "../api/projects";
import { uploadFile } from "../api/clouder";

const useAddProject = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddProject, setLoadingAddProject] = useState(false);
	const [removeAddProjectModal, setRemoveAddProjectModal] = useState(null);
	const [type, setType] = useState("");
	const [title, setTitle] = useState("");
	const [altText, setAltText] = useState("");
	const [details, setDetails] = useState("");
	const [selectedAddProject, setSelectedAddProject] = useState("");
	const [uploadingAddProjectPercentage, setUploadingAddProjectPercentage] = useState(0);

	const [errorAddProject, setErrorAddProject] = useState(null);
	const [successAddProject, setSuccessAddProject] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleType = (e) => { e.preventDefault(); setType(e.target.value); };
	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleAltText = (e) => { e.preventDefault(); setAltText(e.target.value); };
	const handleDetails = (contents) => { setDetails(contents); };

	const handleAddProject = (e) => {
		e.preventDefault();

		if (!loadingAddProject) {
			if (!title) {
				setErrorAddProject(null);
				setSuccessAddProject(null);
				setErrorAddProject("Type is required");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddProject("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (!altText) {
				setErrorAddProject("Alt Text is required");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (altText.length > 500) {
				setErrorAddProject("Alt Text maximum characters - 500");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (type.length > 500) {
				setErrorAddProject("Type maximum characters - 500");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (details.length < 3) {
				setErrorAddProject("Details is required | Min character - 3");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (details.length > 65535) {
				setErrorAddProject("Invalid Details | Max length reached");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (selectedAddProject.length < 1) {
				setErrorAddProject("Image is required");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2500)
			} else if (!allowed_extensions.includes(selectedAddProject.type)) {
				setErrorAddProject("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2000)
			} else if (selectedAddProject.size > maximum_file_size) {
				setErrorAddProject("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddProject(null);
				}, 2000)
			} else {
				setLoadingAddProject(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/projects");
				formdata.append("file", selectedAddProject);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingAddProject(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddProject(error);
							setTimeout(function () {
								setErrorAddProject(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddProject(error);
							setTimeout(function () {
								setErrorAddProject(null);
							}, 2000)
						}
					} else {
						setErrorAddProject(null);
						setUploadingAddProjectPercentage(0);
						setSuccessAddProject(`Project Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const addProjectRes = addProject(cookie, {
							title: title.trim(),
							alt_text: altText.trim(),
							type: type ? type.trim() : undefined,
							details: details,
							image,
							image_public_id
						})

						addProjectRes.then(res => {
							setLoadingAddProject(false);
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setErrorAddProject(error);
									setTimeout(function () {
										setErrorAddProject(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setErrorAddProject(error);
									setTimeout(function () {
										setErrorAddProject(null);
									}, 2000)
								}
							} else {
								setErrorAddProject(null);
								setUploadingAddProjectPercentage(0);
								setSuccessAddProject(`Project added successfully!`);

								setTimeout(function () {
									setSuccessAddProject(null);
									setRemoveAddProjectModal(true);
								}, 2500)
							}
						}).catch(err => {
							setUploadingAddProjectPercentage(0);
							setLoadingAddProject(false);
						})

					}
				}).catch(err => {
					setUploadingAddProjectPercentage(0);
					setLoadingAddProject(false);
				})
			}
		}
	};

	return {
		cookie, type, title, details, altText, loadingAddProject, setRemoveAddProjectModal, errorAddProject, successAddProject, removeAddProjectModal, setSelectedAddProject,
		handleAddProject, handleType, handleTitle, handleDetails, handleAltText, setType, setTitle, setDetails, setAltText, uploadingAddProjectPercentage, selectedAddProject,
	};
};

const useUpdateProjectType = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateProjectType, setLoadingUpdateProjectType] = useState(false);
	const [removeUpdateProjectTypeModal, setRemoveUpdateProjectTypeModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [type, setType] = useState("");

	const [errorUpdateProjectType, setErrorUpdateProjectType] = useState(null);
	const [successUpdateProjectType, setSuccessUpdateProjectType] = useState(null);

	const handleType = (e) => { e.preventDefault(); setType(e.target.value); };

	const handleUpdateProjectType = (e) => {
		e.preventDefault();

		if (!loadingUpdateProjectType) {
			if (!uniqueId) {
				setErrorUpdateProjectType(null);
				setSuccessUpdateProjectType(null);
				setErrorUpdateProjectType("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProjectType(null);
				}, 2500)
			} else if (type.length > 500) {
				setErrorUpdateProjectType("Type maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateProjectType(null);
				}, 2500)
			} else {
				setLoadingUpdateProjectType(true);

				const editProjectTypeRes = editProjectType(cookie, {
					unique_id: uniqueId,
					type: type ? type.trim() : undefined,
				})

				editProjectTypeRes.then(res => {
					setLoadingUpdateProjectType(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProjectType(error);
							setTimeout(function () {
								setErrorUpdateProjectType(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProjectType(error);
							setTimeout(function () {
								setErrorUpdateProjectType(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProjectType(null);
						setSuccessUpdateProjectType(`Project type edited!`);

						setTimeout(function () {
							setSuccessUpdateProjectType(null);
							setRemoveUpdateProjectTypeModal(true);
							// setUniqueId(null);
							// setType("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProjectType(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProjectType, removeUpdateProjectTypeModal, errorUpdateProjectType, successUpdateProjectType, handleUpdateProjectType,
		setRemoveUpdateProjectTypeModal, setUniqueId, setType, type, handleType
	};
};

const useUpdateProjectTitle = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateProjectTitle, setLoadingUpdateProjectTitle] = useState(false);
	const [removeUpdateProjectTitleModal, setRemoveUpdateProjectTitleModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");

	const [errorUpdateProjectTitle, setErrorUpdateProjectTitle] = useState(null);
	const [successUpdateProjectTitle, setSuccessUpdateProjectTitle] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };

	const handleUpdateProjectTitle = (e) => {
		e.preventDefault();

		if (!loadingUpdateProjectTitle) {
			if (!uniqueId) {
				setErrorUpdateProjectTitle(null);
				setSuccessUpdateProjectTitle(null);
				setErrorUpdateProjectTitle("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProjectTitle(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateProjectTitle("Title is required");
				setTimeout(function () {
					setErrorUpdateProjectTitle(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorUpdateProjectTitle("Title maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateProjectTitle(null);
				}, 2500)
			} else {
				setLoadingUpdateProjectTitle(true);

				const editProjectTitleRes = editProjectTitle(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
				})

				editProjectTitleRes.then(res => {
					setLoadingUpdateProjectTitle(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProjectTitle(error);
							setTimeout(function () {
								setErrorUpdateProjectTitle(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProjectTitle(error);
							setTimeout(function () {
								setErrorUpdateProjectTitle(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProjectTitle(null);
						setSuccessUpdateProjectTitle(`Project title edited!`);

						setTimeout(function () {
							setSuccessUpdateProjectTitle(null);
							setRemoveUpdateProjectTitleModal(true);
							// setUniqueId(null);
							// setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProjectTitle(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProjectTitle, removeUpdateProjectTitleModal, errorUpdateProjectTitle, successUpdateProjectTitle, handleUpdateProjectTitle,
		setRemoveUpdateProjectTitleModal, setUniqueId, setTitle, title, handleTitle,
	};
};

const useUpdateProjectAltText = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateProjectAltText, setLoadingUpdateProjectAltText] = useState(false);
	const [removeUpdateProjectAltTextModal, setRemoveUpdateProjectAltTextModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [altText, setAltText] = useState("");

	const [errorUpdateProjectAltText, setErrorUpdateProjectAltText] = useState(null);
	const [successUpdateProjectAltText, setSuccessUpdateProjectAltText] = useState(null);

	const handleAltText = (e) => { e.preventDefault(); setAltText(e.target.value); };

	const handleUpdateProjectAltText = (e) => {
		e.preventDefault();

		if (!loadingUpdateProjectAltText) {
			if (!uniqueId) {
				setErrorUpdateProjectAltText(null);
				setSuccessUpdateProjectAltText(null);
				setErrorUpdateProjectAltText("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProjectAltText(null);
				}, 2500)
			} else if (!altText) {
				setErrorUpdateProjectAltText("Alt Text is required");
				setTimeout(function () {
					setErrorUpdateProjectAltText(null);
				}, 2500)
			} else if (altText.length > 500) {
				setErrorUpdateProjectAltText("Alt Text maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateProjectAltText(null);
				}, 2500)
			} else {
				setLoadingUpdateProjectAltText(true);

				const editProjectAltTextRes = editProjectAltText(cookie, {
					unique_id: uniqueId,
					alt_text: altText.trim(),
				})

				editProjectAltTextRes.then(res => {
					setLoadingUpdateProjectAltText(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProjectAltText(error);
							setTimeout(function () {
								setErrorUpdateProjectAltText(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProjectAltText(error);
							setTimeout(function () {
								setErrorUpdateProjectAltText(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProjectAltText(null);
						setSuccessUpdateProjectAltText(`Project alt text edited!`);

						setTimeout(function () {
							setSuccessUpdateProjectAltText(null);
							setRemoveUpdateProjectAltTextModal(true);
							// setUniqueId(null);
							// setAltText("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProjectAltText(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProjectAltText, removeUpdateProjectAltTextModal, errorUpdateProjectAltText, successUpdateProjectAltText, handleUpdateProjectAltText,
		setRemoveUpdateProjectAltTextModal, setUniqueId, setAltText, altText, handleAltText,
	};
};

const useUpdateProjectTimestamp = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateProjectTimestamp, setLoadingUpdateProjectTimestamp] = useState(false);
	const [removeUpdateProjectTimestampModal, setRemoveUpdateProjectTimestampModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [createdAt, setCreatedAt] = useState("");

	const [errorUpdateProjectTimestamp, setErrorUpdateProjectTimestamp] = useState(null);
	const [successUpdateProjectTimestamp, setSuccessUpdateProjectTimestamp] = useState(null);

	const handleCreatedAt = (e) => { e.preventDefault(); setCreatedAt(e.target.value); };

	const return_date = (date) => {
		if (date === "") return undefined;
		let _date = date.split("T");
		return _date[0] + " " + _date[1].split(":")[0] + ":" + _date[1].split(":")[1];
	};

	const handleUpdateProjectTimestamp = (e) => {
		e.preventDefault();

		if (!loadingUpdateProjectTimestamp) {
			if (!uniqueId) {
				setErrorUpdateProjectTimestamp(null);
				setSuccessUpdateProjectTimestamp(null);
				setErrorUpdateProjectTimestamp("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProjectTimestamp(null);
				}, 2500)
			} else if (!createdAt) {
				setErrorUpdateProjectTimestamp("Created At is required");
				setTimeout(function () {
					setErrorUpdateProjectTimestamp(null);
				}, 2500)
			} else {
				setLoadingUpdateProjectTimestamp(true);

				const editProjectTimestampRes = editProjectTimestamp(cookie, {
					unique_id: uniqueId,
					createdAt: return_date(createdAt),
				})

				editProjectTimestampRes.then(res => {
					setLoadingUpdateProjectTimestamp(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProjectTimestamp(error);
							setTimeout(function () {
								setErrorUpdateProjectTimestamp(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProjectTimestamp(error);
							setTimeout(function () {
								setErrorUpdateProjectTimestamp(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProjectTimestamp(null);
						setSuccessUpdateProjectTimestamp(`Project timestamp edited!`);

						setTimeout(function () {
							setSuccessUpdateProjectTimestamp(null);
							setRemoveUpdateProjectTimestampModal(true);
							// setUniqueId(null);
							// setCreatedAt("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProjectTimestamp(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProjectTimestamp, removeUpdateProjectTimestampModal, errorUpdateProjectTimestamp, successUpdateProjectTimestamp, handleUpdateProjectTimestamp,
		setRemoveUpdateProjectTimestampModal, setUniqueId, setCreatedAt, createdAt, handleCreatedAt,
	};
};

const useUpdateProjectDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateProjectDetails, setLoadingUpdateProjectDetails] = useState(false);
	const [removeUpdateProjectDetailsModal, setRemoveUpdateProjectDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [details, setDetails] = useState("");

	const [errorUpdateProjectDetails, setErrorUpdateProjectDetails] = useState(null);
	const [successUpdateProjectDetails, setSuccessUpdateProjectDetails] = useState(null);

	const handleDetails = (contents) => { setDetails(contents); };

	const handleUpdateProjectDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateProjectDetails) {
			if (!uniqueId) {
				setErrorUpdateProjectDetails(null);
				setSuccessUpdateProjectDetails(null);
				setErrorUpdateProjectDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProjectDetails(null);
				}, 2500)
			} else if (details.length < 3) {
				setErrorUpdateProjectDetails("Details is required | Min character - 3");
				setTimeout(function () {
					setErrorUpdateProjectDetails(null);
				}, 2500)
			} else if (details.length > 65535) {
				setErrorUpdateProjectDetails("Invalid Details | Max length reached");
				setTimeout(function () {
					setErrorUpdateProjectDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateProjectDetails(true);

				const editProjectDetailsRes = editProjectDetails(cookie, {
					unique_id: uniqueId,
					details: details,
				})

				editProjectDetailsRes.then(res => {
					setLoadingUpdateProjectDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProjectDetails(error);
							setTimeout(function () {
								setErrorUpdateProjectDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProjectDetails(error);
							setTimeout(function () {
								setErrorUpdateProjectDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProjectDetails(null);
						setSuccessUpdateProjectDetails(`Project details edited!`);

						setTimeout(function () {
							setSuccessUpdateProjectDetails(null);
							setRemoveUpdateProjectDetailsModal(true);
							// setUniqueId(null);
							// setDetails("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProjectDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProjectDetails, removeUpdateProjectDetailsModal, errorUpdateProjectDetails, successUpdateProjectDetails, handleUpdateProjectDetails,
		setRemoveUpdateProjectDetailsModal, setUniqueId, setDetails, details, handleDetails,
	};
};

const useUploadProjectImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingProjectImage, setLoadingProjectImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeProjectImageModal, setRemoveProjectImageModal] = useState(null);
	const [selectedProjectImage, setSelectedProjectImage] = useState("");
	const [uploadingProjectImagePercentage, setUploadingProjectImagePercentage] = useState(0);

	const [errorProjectImage, setErrorProjectImage] = useState(null);
	const [successProjectImage, setSuccessProjectImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadProjectImage = (e) => {
		e.preventDefault();

		if (!loadingProjectImage) {
			if (!uniqueId) {
				setErrorProjectImage(null);
				setSuccessProjectImage(null);
				setErrorProjectImage("Unique ID is required");
				setTimeout(function () {
					setErrorProjectImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedProjectImage.type)) {
				setErrorProjectImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorProjectImage(null);
				}, 2000)
			} else if (selectedProjectImage.size > maximum_file_size) {
				setErrorProjectImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorProjectImage(null);
				}, 2000)
			} else {
				setLoadingProjectImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/projects");
				formdata.append("file", selectedProjectImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingProjectImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorProjectImage(error);
							setTimeout(function () {
								setErrorProjectImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorProjectImage(error);
							setTimeout(function () {
								setErrorProjectImage(null);
							}, 2000)
						}
					} else {
						setErrorProjectImage(null);
						setUploadingProjectImagePercentage(0);
						setSuccessProjectImage(`Project Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editProjectImageRes = editProjectImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editProjectImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingProjectImagePercentage(0);
									setLoadingProjectImage(false);
									setErrorProjectImage(error);
									setTimeout(function () {
										setErrorProjectImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingProjectImagePercentage(0);
									setLoadingProjectImage(false);
									setErrorProjectImage(error);
									setTimeout(function () {
										setErrorProjectImage(null);
									}, 2000)
								}
							} else {
								setErrorProjectImage(null);
								setUploadingProjectImagePercentage(0);
								setSuccessProjectImage(`Project Image edited successfully!`);

								setTimeout(function () {
									setLoadingProjectImage(false);
									setSuccessProjectImage(null);
									setRemoveProjectImageModal(true);
									// setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingProjectImagePercentage(0);
							setLoadingProjectImage(false);
						})
					}
				}).catch(err => {
					setUploadingProjectImagePercentage(0);
					setLoadingProjectImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingProjectImage, errorProjectImage, successProjectImage, handleUploadProjectImage, uniqueId, setSelectedProjectImage,
		setUniqueId, uploadingProjectImagePercentage, selectedProjectImage, removeProjectImageModal, setRemoveProjectImageModal
	};
};

const useDeleteProject = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteProject, setLoadingDeleteProject] = useState(false);
	const [removeDeleteProjectModal, setRemoveDeleteProjectModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteProject, setErrorDeleteProject] = useState(null);
	const [successDeleteProject, setSuccessDeleteProject] = useState(null);

	const handleDeleteProject = () => {

		if (!loadingDeleteProject) {
			if (!uniqueId) {
				setErrorDeleteProject(null);
				setSuccessDeleteProject(null);
				setErrorDeleteProject("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteProject(null);
				}, 2500)
			} else {
				setLoadingDeleteProject(true);

				const deleteProjectRes = deleteProject(cookie, {
					unique_id: uniqueId
				})

				deleteProjectRes.then(res => {
					setLoadingDeleteProject(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteProject(error);
							setTimeout(function () {
								setErrorDeleteProject(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteProject(error);
							setTimeout(function () {
								setErrorDeleteProject(null);
							}, 2000)
						}
					} else {
						setErrorDeleteProject(null);
						setSuccessDeleteProject(`Project deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteProject(null);
							setRemoveDeleteProjectModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteProject(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteProject, removeDeleteProjectModal, errorDeleteProject, successDeleteProject, handleDeleteProject,
		setRemoveDeleteProjectModal, setUniqueId
	};
};

export { useAddProject, useUpdateProjectDetails, useUpdateProjectType, useUpdateProjectTitle, useUpdateProjectAltText, useUploadProjectImage, useUpdateProjectTimestamp, useDeleteProject };
