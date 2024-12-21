import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addResearch, deleteResearch, editResearchDetails, editResearchImage, editResearchFile } from "../api/research";
import { uploadFile, uploadDocument } from "../api/clouder";

const useAddResearch = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddResearch, setLoadingAddResearch] = useState(false);
	const [removeAddResearchModal, setRemoveAddResearchModal] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");
	const [selectedAddResearch, setSelectedAddResearch] = useState("");
	const [selectedAddResearchFile, setSelectedAddResearchFile] = useState("");
	const [uploadingAddResearchPercentage, setUploadingAddResearchPercentage] = useState(0);
	const [uploadingAddResearchFilePercentage, setUploadingAddResearchFilePercentage] = useState(0);

	const [errorAddResearch, setErrorAddResearch] = useState(null);
	const [successAddResearch, setSuccessAddResearch] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const document_allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/jfif", "image/JFIF", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "application/pdf", "application/PDF", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/x-zip-compressed", "text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleOther = (e) => { e.preventDefault(); setOther(e.target.value); };

	const handleAddResearch = (e) => {
		e.preventDefault();

		if (!loadingAddResearch) {
			if (!title) {
				setErrorAddResearch(null);
				setSuccessAddResearch(null);
				setErrorAddResearch("Title is required");
				setTimeout(function () {
					setErrorAddResearch(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddResearch("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddResearch(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorAddResearch("Other maximum characters - 500");
				setTimeout(function () {
					setErrorAddResearch(null);
				}, 2500)
			} else if (selectedAddResearch && !allowed_extensions.includes(selectedAddResearch.type)) {
				setErrorAddResearch("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddResearch(null);
				}, 2000)
			} else if (selectedAddResearch && selectedAddResearch.size > maximum_file_size) {
				setErrorAddResearch("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddResearch(null);
				}, 2000)
			} else if (selectedAddResearchFile && !document_allowed_extensions.includes(selectedAddResearchFile.type)) {
				setErrorAddResearch("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorAddResearch(null);
				}, 2000)
			} else if (selectedAddResearchFile && selectedAddResearchFile.size > maximum_file_size) {
				setErrorAddResearch("Research File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddResearch(null);
				}, 2000)
			} else {
				setLoadingAddResearch(true);

				if (selectedAddResearch && selectedAddResearchFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/research/images");
					formdata.append("file", selectedAddResearch);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddResearch(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							}
						} else {
							setErrorAddResearch(null);
							setUploadingAddResearchPercentage(0);
							setSuccessAddResearch(`Research Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const formdata = new FormData();
							formdata.append("file_path", "centers/publications/research/files");
							formdata.append("file", selectedAddResearchFile);
							formdata.append("cloudinary_name", config.cloudy_name);
							formdata.append("cloudinary_key", config.cloudy_key);
							formdata.append("cloudinary_secret", config.cloudy_secret);

							const uploadDocumentRes = uploadDocument(formdata)

							uploadDocumentRes.then(res => {
								setLoadingAddResearch(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddResearch(error);
										setTimeout(function () {
											setErrorAddResearch(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddResearch(error);
										setTimeout(function () {
											setErrorAddResearch(null);
										}, 2000)
									}
								} else {
									setErrorAddResearch(null);
									setUploadingAddResearchFilePercentage(0);
									setSuccessAddResearch(`Research File Uploaded!`);

									const file = res.data.data.secure_url;
									const file_type = res.data.data.format;
									const file_public_id = res.data.data.public_id;

									const addResearchRes = addResearch(cookie, {
										title: title.trim(),
										other: other ? other.trim() : undefined,
										image, image_public_id,
										file, file_type, file_public_id
									})

									addResearchRes.then(res => {
										setLoadingAddResearch(false);
										if (res.err) {
											if (!res.error.response.data.success) {
												const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
												setErrorAddResearch(error);
												setTimeout(function () {
													setErrorAddResearch(null);
												}, 2000)
											} else {
												const error = `${res.error.code} - ${res.error.message}`;
												setErrorAddResearch(error);
												setTimeout(function () {
													setErrorAddResearch(null);
												}, 2000)
											}
										} else {
											setErrorAddResearch(null);
											setUploadingAddResearchPercentage(0);
											setUploadingAddResearchFilePercentage(0);
											setSuccessAddResearch(`Research added successfully!`);

											setTimeout(function () {
												setSuccessAddResearch(null);
												setRemoveAddResearchModal(true);
											}, 2500)
										}
									}).catch(err => {
										setUploadingAddResearchPercentage(0);
										setUploadingAddResearchFilePercentage(0);
										setLoadingAddResearch(false);
									})

								}
							}).catch(err => {
								setUploadingAddResearchFilePercentage(0);
								setLoadingAddResearch(false);
							})
						}
					}).catch(err => {
						setUploadingAddResearchPercentage(0);
						setLoadingAddResearch(false);
					})
				} else if (selectedAddResearch) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/research/images");
					formdata.append("file", selectedAddResearch);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddResearch(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							}
						} else {
							setErrorAddResearch(null);
							setUploadingAddResearchPercentage(0);
							setSuccessAddResearch(`Research Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const addResearchRes = addResearch(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image, image_public_id,
								file: undefined, file_type: undefined, file_public_id: undefined
							})

							addResearchRes.then(res => {
								setLoadingAddResearch(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddResearch(error);
										setTimeout(function () {
											setErrorAddResearch(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddResearch(error);
										setTimeout(function () {
											setErrorAddResearch(null);
										}, 2000)
									}
								} else {
									setErrorAddResearch(null);
									setUploadingAddResearchPercentage(0);
									setSuccessAddResearch(`Research added successfully!`);

									setTimeout(function () {
										setSuccessAddResearch(null);
										setRemoveAddResearchModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddResearchPercentage(0);
								setLoadingAddResearch(false);
							})

						}
					}).catch(err => {
						setUploadingAddResearchPercentage(0);
						setLoadingAddResearch(false);
					})
				} else if (selectedAddResearchFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/research/files");
					formdata.append("file", selectedAddResearchFile);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadDocumentRes = uploadDocument(formdata)

					uploadDocumentRes.then(res => {
						setLoadingAddResearch(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							}
						} else {
							setErrorAddResearch(null);
							setUploadingAddResearchPercentage(0);
							setSuccessAddResearch(`Research File Uploaded!`);

							const file = res.data.data.secure_url;
							const file_type = res.data.data.format;
							const file_public_id = res.data.data.public_id;

							const addResearchRes = addResearch(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image: undefined, image_public_id: undefined,
								file, file_type, file_public_id
							})

							addResearchRes.then(res => {
								setLoadingAddResearch(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddResearch(error);
										setTimeout(function () {
											setErrorAddResearch(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddResearch(error);
										setTimeout(function () {
											setErrorAddResearch(null);
										}, 2000)
									}
								} else {
									setErrorAddResearch(null);
									setUploadingAddResearchFilePercentage(0);
									setSuccessAddResearch(`Research added successfully!`);

									setTimeout(function () {
										setSuccessAddResearch(null);
										setRemoveAddResearchModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddResearchFilePercentage(0);
								setLoadingAddResearch(false);
							})
						}
					}).catch(err => {
						setUploadingAddResearchFilePercentage(0);
						setLoadingAddResearch(false);
					})
				} else {
					const addResearchRes = addResearch(cookie, {
						title: title.trim(),
						image: undefined, image_public_id: undefined,
						file: undefined, file_type: undefined, file_public_id: undefined
					})

					addResearchRes.then(res => {
						setLoadingAddResearch(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddResearch(error);
								setTimeout(function () {
									setErrorAddResearch(null);
								}, 2000)
							}
						} else {
							setErrorAddResearch(null);
							setSuccessAddResearch(`Research added successfully!`);

							setTimeout(function () {
								setSuccessAddResearch(null);
								setRemoveAddResearchModal(true);
							}, 2500)
						}
					}).catch(err => {
						setLoadingAddResearch(false);
					})
				}
			}
		}
	};

	return {
		cookie, title, other, loadingAddResearch, setRemoveAddResearchModal, errorAddResearch, successAddResearch, removeAddResearchModal, setSelectedAddResearch,
		setSelectedAddResearchFile, handleAddResearch, handleTitle, handleOther, setTitle, setOther, uploadingAddResearchPercentage, uploadingAddResearchFilePercentage, selectedAddResearch, selectedAddResearchFile,
	};
};

const useUpdateResearchDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateResearchDetails, setLoadingUpdateResearchDetails] = useState(false);
	const [removeUpdateResearchDetailsModal, setRemoveUpdateResearchDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");

	const [errorUpdateResearchDetails, setErrorUpdateResearchDetails] = useState(null);
	const [successUpdateResearchDetails, setSuccessUpdateResearchDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleOther = (e) => { e.preventDefault(); setOther(e.target.value); };

	const handleUpdateResearchDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateResearchDetails) {
			if (!uniqueId) {
				setErrorUpdateResearchDetails(null);
				setSuccessUpdateResearchDetails(null);
				setErrorUpdateResearchDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateResearchDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateResearchDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateResearchDetails(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorUpdateResearchDetails("Title maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateResearchDetails(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorUpdateResearchDetails("Other maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateResearchDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateResearchDetails(true);

				const editResearchDetailsRes = editResearchDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					other: other ? other.trim() : null,
				})

				editResearchDetailsRes.then(res => {
					setLoadingUpdateResearchDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateResearchDetails(error);
							setTimeout(function () {
								setErrorUpdateResearchDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateResearchDetails(error);
							setTimeout(function () {
								setErrorUpdateResearchDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateResearchDetails(null);
						setSuccessUpdateResearchDetails(`Research details edited!`);

						setTimeout(function () {
							setSuccessUpdateResearchDetails(null);
							setRemoveUpdateResearchDetailsModal(true);
							setUniqueId(null);
							setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateResearchDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateResearchDetails, removeUpdateResearchDetailsModal, errorUpdateResearchDetails, successUpdateResearchDetails, handleUpdateResearchDetails,
		setRemoveUpdateResearchDetailsModal, setUniqueId, setTitle, setOther, title, other, handleTitle, handleOther
	};
};

const useUploadResearchImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingResearchImage, setLoadingResearchImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeResearchImageModal, setRemoveResearchImageModal] = useState(null);
	const [selectedResearchImage, setSelectedResearchImage] = useState("");
	const [uploadingResearchImagePercentage, setUploadingResearchImagePercentage] = useState(0);

	const [errorResearchImage, setErrorResearchImage] = useState(null);
	const [successResearchImage, setSuccessResearchImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadResearchImage = (e) => {
		e.preventDefault();

		if (!loadingResearchImage) {
			if (!uniqueId) {
				setErrorResearchImage(null);
				setSuccessResearchImage(null);
				setErrorResearchImage("Unique ID is required");
				setTimeout(function () {
					setErrorResearchImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedResearchImage.type)) {
				setErrorResearchImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorResearchImage(null);
				}, 2000)
			} else if (selectedResearchImage.size > maximum_file_size) {
				setErrorResearchImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorResearchImage(null);
				}, 2000)
			} else {
				setLoadingResearchImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/research/images");
				formdata.append("file", selectedResearchImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingResearchImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorResearchImage(error);
							setTimeout(function () {
								setErrorResearchImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorResearchImage(error);
							setTimeout(function () {
								setErrorResearchImage(null);
							}, 2000)
						}
					} else {
						setErrorResearchImage(null);
						setUploadingResearchImagePercentage(0);
						setSuccessResearchImage(`Research Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editResearchImageRes = editResearchImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editResearchImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingResearchImagePercentage(0);
									setLoadingResearchImage(false);
									setErrorResearchImage(error);
									setTimeout(function () {
										setErrorResearchImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingResearchImagePercentage(0);
									setLoadingResearchImage(false);
									setErrorResearchImage(error);
									setTimeout(function () {
										setErrorResearchImage(null);
									}, 2000)
								}
							} else {
								setErrorResearchImage(null);
								setUploadingResearchImagePercentage(0);
								setSuccessResearchImage(`Research Image edited successfully!`);

								setTimeout(function () {
									setLoadingResearchImage(false);
									setSuccessResearchImage(null);
									setRemoveResearchImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingResearchImagePercentage(0);
							setLoadingResearchImage(false);
						})
					}
				}).catch(err => {
					setUploadingResearchImagePercentage(0);
					setLoadingResearchImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingResearchImage, errorResearchImage, successResearchImage, handleUploadResearchImage, uniqueId, setSelectedResearchImage,
		setUniqueId, uploadingResearchImagePercentage, selectedResearchImage, removeResearchImageModal, setRemoveResearchImageModal
	};
};

const useUploadResearchFile = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingResearchFile, setLoadingResearchFile] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeResearchFileModal, setRemoveResearchFileModal] = useState(null);
	const [selectedResearchFile, setSelectedResearchFile] = useState("");
	const [uploadingResearchFilePercentage, setUploadingResearchFilePercentage] = useState(0);

	const [errorResearchFile, setErrorResearchFile] = useState(null);
	const [successResearchFile, setSuccessResearchFile] = useState(null);

	const document_allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/jfif", "image/JFIF", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "application/pdf", "application/PDF", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/x-zip-compressed", "text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadResearchFile = (e) => {
		e.preventDefault();

		if (!loadingResearchFile) {
			if (!uniqueId) {
				setErrorResearchFile(null);
				setSuccessResearchFile(null);
				setErrorResearchFile("Unique ID is required");
				setTimeout(function () {
					setErrorResearchFile(null);
				}, 2000)
			} else if (!document_allowed_extensions.includes(selectedResearchFile.type)) {
				setErrorResearchFile("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorResearchFile(null);
				}, 2000)
			} else if (selectedResearchFile.size > maximum_file_size) {
				setErrorResearchFile("Research File too large (max 10mb)");
				setTimeout(function () {
					setErrorResearchFile(null);
				}, 2000)
			} else {
				setLoadingResearchFile(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/research/files");
				formdata.append("file", selectedResearchFile);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadDocumentRes = uploadDocument(formdata)

				uploadDocumentRes.then(res => {
					setLoadingResearchFile(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorResearchFile(error);
							setTimeout(function () {
								setErrorResearchFile(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorResearchFile(error);
							setTimeout(function () {
								setErrorResearchFile(null);
							}, 2000)
						}
					} else {
						setErrorResearchFile(null);
						setUploadingResearchFilePercentage(0);
						setSuccessResearchFile(`Research File Uploaded!`);

						const file = res.data.data.secure_url;
						const file_type = res.data.data.format;
						const file_public_id = res.data.data.public_id;

						const editResearchFileRes = editResearchFile(cookie, {
							unique_id: uniqueId, file, file_type, file_public_id
						})

						editResearchFileRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingResearchFilePercentage(0);
									setLoadingResearchFile(false);
									setErrorResearchFile(error);
									setTimeout(function () {
										setErrorResearchFile(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingResearchFilePercentage(0);
									setLoadingResearchFile(false);
									setErrorResearchFile(error);
									setTimeout(function () {
										setErrorResearchFile(null);
									}, 2000)
								}
							} else {
								setErrorResearchFile(null);
								setUploadingResearchFilePercentage(0);
								setSuccessResearchFile(`Research File edited successfully!`);

								setTimeout(function () {
									setLoadingResearchFile(false);
									setSuccessResearchFile(null);
									setRemoveResearchFileModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingResearchFilePercentage(0);
							setLoadingResearchFile(false);
						})
					}
				}).catch(err => {
					setUploadingResearchFilePercentage(0);
					setLoadingResearchFile(false);
				})
			}
		}
	};

	return {
		cookie, loadingResearchFile, errorResearchFile, successResearchFile, handleUploadResearchFile, uniqueId, setSelectedResearchFile,
		setUniqueId, uploadingResearchFilePercentage, selectedResearchFile, removeResearchFileModal, setRemoveResearchFileModal
	};
};

const useDeleteResearch = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteResearch, setLoadingDeleteResearch] = useState(false);
	const [removeDeleteResearchModal, setRemoveDeleteResearchModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteResearch, setErrorDeleteResearch] = useState(null);
	const [successDeleteResearch, setSuccessDeleteResearch] = useState(null);

	const handleDeleteResearch = () => {

		if (!loadingDeleteResearch) {
			if (!uniqueId) {
				setErrorDeleteResearch(null);
				setSuccessDeleteResearch(null);
				setErrorDeleteResearch("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteResearch(null);
				}, 2500)
			} else {
				setLoadingDeleteResearch(true);

				const deleteResearchRes = deleteResearch(cookie, {
					unique_id: uniqueId
				})

				deleteResearchRes.then(res => {
					setLoadingDeleteResearch(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteResearch(error);
							setTimeout(function () {
								setErrorDeleteResearch(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteResearch(error);
							setTimeout(function () {
								setErrorDeleteResearch(null);
							}, 2000)
						}
					} else {
						setErrorDeleteResearch(null);
						setSuccessDeleteResearch(`Research deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteResearch(null);
							setRemoveDeleteResearchModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteResearch(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteResearch, removeDeleteResearchModal, errorDeleteResearch, successDeleteResearch, handleDeleteResearch,
		setRemoveDeleteResearchModal, setUniqueId
	};
};

export { useAddResearch, useUpdateResearchDetails, useUploadResearchImage, useUploadResearchFile, useDeleteResearch };
