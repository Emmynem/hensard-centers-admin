import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addJournal, deleteJournal, editJournalDetails, editJournalImage, editJournalFile } from "../api/journals";
import { uploadFile, uploadDocument } from "../api/clouder";

const useAddJournal = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddJournal, setLoadingAddJournal] = useState(false);
	const [removeAddJournalModal, setRemoveAddJournalModal] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");
	const [selectedAddJournal, setSelectedAddJournal] = useState("");
	const [selectedAddJournalFile, setSelectedAddJournalFile] = useState("");
	const [uploadingAddJournalPercentage, setUploadingAddJournalPercentage] = useState(0);
	const [uploadingAddJournalFilePercentage, setUploadingAddJournalFilePercentage] = useState(0);

	const [errorAddJournal, setErrorAddJournal] = useState(null);
	const [successAddJournal, setSuccessAddJournal] = useState(null);

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

	const handleAddJournal = (e) => {
		e.preventDefault();

		if (!loadingAddJournal) {
			if (!title) {
				setErrorAddJournal(null);
				setSuccessAddJournal(null);
				setErrorAddJournal("Title is required");
				setTimeout(function () {
					setErrorAddJournal(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddJournal("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddJournal(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorAddJournal("Other maximum characters - 500");
				setTimeout(function () {
					setErrorAddJournal(null);
				}, 2500)
			} else if (selectedAddJournal && !allowed_extensions.includes(selectedAddJournal.type)) {
				setErrorAddJournal("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddJournal(null);
				}, 2000)
			} else if (selectedAddJournal && selectedAddJournal.size > maximum_file_size) {
				setErrorAddJournal("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddJournal(null);
				}, 2000)
			} else if (selectedAddJournalFile && !document_allowed_extensions.includes(selectedAddJournalFile.type)) {
				setErrorAddJournal("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorAddJournal(null);
				}, 2000)
			} else if (selectedAddJournalFile && selectedAddJournalFile.size > maximum_file_size) {
				setErrorAddJournal("Journal File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddJournal(null);
				}, 2000)
			} else {
				setLoadingAddJournal(true);

				if (selectedAddJournal && selectedAddJournalFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/journal/images");
					formdata.append("file", selectedAddJournal);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddJournal(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							}
						} else {
							setErrorAddJournal(null);
							setUploadingAddJournalPercentage(0);
							setSuccessAddJournal(`Journal Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const formdata = new FormData();
							formdata.append("file_path", "centers/publications/journal/files");
							formdata.append("file", selectedAddJournalFile);
							formdata.append("cloudinary_name", config.cloudy_name);
							formdata.append("cloudinary_key", config.cloudy_key);
							formdata.append("cloudinary_secret", config.cloudy_secret);

							const uploadDocumentRes = uploadDocument(formdata)

							uploadDocumentRes.then(res => {
								setLoadingAddJournal(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddJournal(error);
										setTimeout(function () {
											setErrorAddJournal(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddJournal(error);
										setTimeout(function () {
											setErrorAddJournal(null);
										}, 2000)
									}
								} else {
									setErrorAddJournal(null);
									setUploadingAddJournalFilePercentage(0);
									setSuccessAddJournal(`Journal File Uploaded!`);

									const file = res.data.data.secure_url;
									const file_type = res.data.data.format;
									const file_public_id = res.data.data.public_id;

									const addJournalRes = addJournal(cookie, {
										title: title.trim(), 
										other: other ? other.trim() : undefined,
										image, image_public_id,
										file, file_type, file_public_id
									})

									addJournalRes.then(res => {
										setLoadingAddJournal(false);
										if (res.err) {
											if (!res.error.response.data.success) {
												const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
												setErrorAddJournal(error);
												setTimeout(function () {
													setErrorAddJournal(null);
												}, 2000)
											} else {
												const error = `${res.error.code} - ${res.error.message}`;
												setErrorAddJournal(error);
												setTimeout(function () {
													setErrorAddJournal(null);
												}, 2000)
											}
										} else {
											setErrorAddJournal(null);
											setUploadingAddJournalPercentage(0);
											setUploadingAddJournalFilePercentage(0);
											setSuccessAddJournal(`Journal added successfully!`);

											setTimeout(function () {
												setSuccessAddJournal(null);
												setRemoveAddJournalModal(true);
											}, 2500)
										}
									}).catch(err => {
										setUploadingAddJournalPercentage(0);
										setUploadingAddJournalFilePercentage(0);
										setLoadingAddJournal(false);
									})
									
								}
							}).catch(err => {
								setUploadingAddJournalFilePercentage(0);
								setLoadingAddJournal(false);
							})
						}
					}).catch(err => {
						setUploadingAddJournalPercentage(0);
						setLoadingAddJournal(false);
					})
				} else if (selectedAddJournal) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/journal/images");
					formdata.append("file", selectedAddJournal);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddJournal(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							}
						} else {
							setErrorAddJournal(null);
							setUploadingAddJournalPercentage(0);
							setSuccessAddJournal(`Journal Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const addJournalRes = addJournal(cookie, {
								title: title.trim(), 
								other: other ? other.trim() : undefined,
								image, image_public_id,
								file: undefined, file_type: undefined, file_public_id: undefined
							})

							addJournalRes.then(res => {
								setLoadingAddJournal(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddJournal(error);
										setTimeout(function () {
											setErrorAddJournal(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddJournal(error);
										setTimeout(function () {
											setErrorAddJournal(null);
										}, 2000)
									}
								} else {
									setErrorAddJournal(null);
									setUploadingAddJournalPercentage(0);
									setSuccessAddJournal(`Journal added successfully!`);

									setTimeout(function () {
										setSuccessAddJournal(null);
										setRemoveAddJournalModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddJournalPercentage(0);
								setLoadingAddJournal(false);
							})

						}
					}).catch(err => {
						setUploadingAddJournalPercentage(0);
						setLoadingAddJournal(false);
					})
				} else if (selectedAddJournalFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/journal/files");
					formdata.append("file", selectedAddJournalFile);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadDocumentRes = uploadDocument(formdata)

					uploadDocumentRes.then(res => {
						setLoadingAddJournal(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							}
						} else {
							setErrorAddJournal(null);
							setUploadingAddJournalPercentage(0);
							setSuccessAddJournal(`Journal File Uploaded!`);

							const file = res.data.data.secure_url;
							const file_type = res.data.data.format;
							const file_public_id = res.data.data.public_id;

							const addJournalRes = addJournal(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image: undefined, image_public_id: undefined,
								file, file_type, file_public_id
							})

							addJournalRes.then(res => {
								setLoadingAddJournal(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddJournal(error);
										setTimeout(function () {
											setErrorAddJournal(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddJournal(error);
										setTimeout(function () {
											setErrorAddJournal(null);
										}, 2000)
									}
								} else {
									setErrorAddJournal(null);
									setUploadingAddJournalFilePercentage(0);
									setSuccessAddJournal(`Journal added successfully!`);

									setTimeout(function () {
										setSuccessAddJournal(null);
										setRemoveAddJournalModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddJournalFilePercentage(0);
								setLoadingAddJournal(false);
							})
						}
					}).catch(err => {
						setUploadingAddJournalFilePercentage(0);
						setLoadingAddJournal(false);
					})
				} else {
					const addJournalRes = addJournal(cookie, {
						title: title.trim(), 
						image: undefined, image_public_id: undefined,
						file: undefined, file_type: undefined, file_public_id: undefined
					})

					addJournalRes.then(res => {
						setLoadingAddJournal(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddJournal(error);
								setTimeout(function () {
									setErrorAddJournal(null);
								}, 2000)
							}
						} else {
							setErrorAddJournal(null);
							setSuccessAddJournal(`Journal added successfully!`);

							setTimeout(function () {
								setSuccessAddJournal(null);
								setRemoveAddJournalModal(true);
							}, 2500)
						}
					}).catch(err => {
						setLoadingAddJournal(false);
					})
				}
			}
		}
	};

	return {
		cookie, title, other, loadingAddJournal, setRemoveAddJournalModal, errorAddJournal, successAddJournal, removeAddJournalModal, setSelectedAddJournal,
		setSelectedAddJournalFile, handleAddJournal, handleTitle, handleOther, setTitle, setOther, uploadingAddJournalPercentage, uploadingAddJournalFilePercentage, selectedAddJournal, selectedAddJournalFile,
	};
};

const useUpdateJournalDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateJournalDetails, setLoadingUpdateJournalDetails] = useState(false);
	const [removeUpdateJournalDetailsModal, setRemoveUpdateJournalDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");

	const [errorUpdateJournalDetails, setErrorUpdateJournalDetails] = useState(null);
	const [successUpdateJournalDetails, setSuccessUpdateJournalDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleOther = (e) => { e.preventDefault(); setOther(e.target.value); };

	const handleUpdateJournalDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateJournalDetails) {
			if (!uniqueId) {
				setErrorUpdateJournalDetails(null);
				setSuccessUpdateJournalDetails(null);
				setErrorUpdateJournalDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateJournalDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateJournalDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateJournalDetails(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorUpdateJournalDetails("Title maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateJournalDetails(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorUpdateJournalDetails("Other maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateJournalDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateJournalDetails(true);

				const editJournalDetailsRes = editJournalDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					other: other ? other.trim() : null,
				})

				editJournalDetailsRes.then(res => {
					setLoadingUpdateJournalDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateJournalDetails(error);
							setTimeout(function () {
								setErrorUpdateJournalDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateJournalDetails(error);
							setTimeout(function () {
								setErrorUpdateJournalDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateJournalDetails(null);
						setSuccessUpdateJournalDetails(`Journal details edited!`);

						setTimeout(function () {
							setSuccessUpdateJournalDetails(null);
							setRemoveUpdateJournalDetailsModal(true);
							setUniqueId(null);
							setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateJournalDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateJournalDetails, removeUpdateJournalDetailsModal, errorUpdateJournalDetails, successUpdateJournalDetails, handleUpdateJournalDetails,
		setRemoveUpdateJournalDetailsModal, setUniqueId, setTitle, setOther, title, other, handleTitle, handleOther
	};
};

const useUploadJournalImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingJournalImage, setLoadingJournalImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeJournalImageModal, setRemoveJournalImageModal] = useState(null);
	const [selectedJournalImage, setSelectedJournalImage] = useState("");
	const [uploadingJournalImagePercentage, setUploadingJournalImagePercentage] = useState(0);

	const [errorJournalImage, setErrorJournalImage] = useState(null);
	const [successJournalImage, setSuccessJournalImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadJournalImage = (e) => {
		e.preventDefault();

		if (!loadingJournalImage) {
			if (!uniqueId) {
				setErrorJournalImage(null);
				setSuccessJournalImage(null);
				setErrorJournalImage("Unique ID is required");
				setTimeout(function () {
					setErrorJournalImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedJournalImage.type)) {
				setErrorJournalImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorJournalImage(null);
				}, 2000)
			} else if (selectedJournalImage.size > maximum_file_size) {
				setErrorJournalImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorJournalImage(null);
				}, 2000)
			} else {
				setLoadingJournalImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/journal/images");
				formdata.append("file", selectedJournalImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingJournalImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorJournalImage(error);
							setTimeout(function () {
								setErrorJournalImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorJournalImage(error);
							setTimeout(function () {
								setErrorJournalImage(null);
							}, 2000)
						}
					} else {
						setErrorJournalImage(null);
						setUploadingJournalImagePercentage(0);
						setSuccessJournalImage(`Journal Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editJournalImageRes = editJournalImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editJournalImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingJournalImagePercentage(0);
									setLoadingJournalImage(false);
									setErrorJournalImage(error);
									setTimeout(function () {
										setErrorJournalImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingJournalImagePercentage(0);
									setLoadingJournalImage(false);
									setErrorJournalImage(error);
									setTimeout(function () {
										setErrorJournalImage(null);
									}, 2000)
								}
							} else {
								setErrorJournalImage(null);
								setUploadingJournalImagePercentage(0);
								setSuccessJournalImage(`Journal Image edited successfully!`);

								setTimeout(function () {
									setLoadingJournalImage(false);
									setSuccessJournalImage(null);
									setRemoveJournalImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingJournalImagePercentage(0);
							setLoadingJournalImage(false);
						})
					}
				}).catch(err => {
					setUploadingJournalImagePercentage(0);
					setLoadingJournalImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingJournalImage, errorJournalImage, successJournalImage, handleUploadJournalImage, uniqueId, setSelectedJournalImage,
		setUniqueId, uploadingJournalImagePercentage, selectedJournalImage, removeJournalImageModal, setRemoveJournalImageModal
	};
};

const useUploadJournalFile = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingJournalFile, setLoadingJournalFile] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeJournalFileModal, setRemoveJournalFileModal] = useState(null);
	const [selectedJournalFile, setSelectedJournalFile] = useState("");
	const [uploadingJournalFilePercentage, setUploadingJournalFilePercentage] = useState(0);

	const [errorJournalFile, setErrorJournalFile] = useState(null);
	const [successJournalFile, setSuccessJournalFile] = useState(null);

	const document_allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/jfif", "image/JFIF", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "application/pdf", "application/PDF", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/x-zip-compressed", "text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadJournalFile = (e) => {
		e.preventDefault();

		if (!loadingJournalFile) {
			if (!uniqueId) {
				setErrorJournalFile(null);
				setSuccessJournalFile(null);
				setErrorJournalFile("Unique ID is required");
				setTimeout(function () {
					setErrorJournalFile(null);
				}, 2000)
			} else if (!document_allowed_extensions.includes(selectedJournalFile.type)) {
				setErrorJournalFile("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorJournalFile(null);
				}, 2000)
			} else if (selectedJournalFile.size > maximum_file_size) {
				setErrorJournalFile("Journal File too large (max 10mb)");
				setTimeout(function () {
					setErrorJournalFile(null);
				}, 2000)
			} else {
				setLoadingJournalFile(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/journal/files");
				formdata.append("file", selectedJournalFile);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadDocumentRes = uploadDocument(formdata)

				uploadDocumentRes.then(res => {
					setLoadingJournalFile(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorJournalFile(error);
							setTimeout(function () {
								setErrorJournalFile(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorJournalFile(error);
							setTimeout(function () {
								setErrorJournalFile(null);
							}, 2000)
						}
					} else {
						setErrorJournalFile(null);
						setUploadingJournalFilePercentage(0);
						setSuccessJournalFile(`Journal File Uploaded!`);

						const file = res.data.data.secure_url;
						const file_type = res.data.data.format;
						const file_public_id = res.data.data.public_id;

						const editJournalFileRes = editJournalFile(cookie, {
							unique_id: uniqueId, file, file_type, file_public_id
						})

						editJournalFileRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingJournalFilePercentage(0);
									setLoadingJournalFile(false);
									setErrorJournalFile(error);
									setTimeout(function () {
										setErrorJournalFile(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingJournalFilePercentage(0);
									setLoadingJournalFile(false);
									setErrorJournalFile(error);
									setTimeout(function () {
										setErrorJournalFile(null);
									}, 2000)
								}
							} else {
								setErrorJournalFile(null);
								setUploadingJournalFilePercentage(0);
								setSuccessJournalFile(`Journal File edited successfully!`);

								setTimeout(function () {
									setLoadingJournalFile(false);
									setSuccessJournalFile(null);
									setRemoveJournalFileModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingJournalFilePercentage(0);
							setLoadingJournalFile(false);
						})
					}
				}).catch(err => {
					setUploadingJournalFilePercentage(0);
					setLoadingJournalFile(false);
				})
			}
		}
	};

	return {
		cookie, loadingJournalFile, errorJournalFile, successJournalFile, handleUploadJournalFile, uniqueId, setSelectedJournalFile,
		setUniqueId, uploadingJournalFilePercentage, selectedJournalFile, removeJournalFileModal, setRemoveJournalFileModal
	};
};

const useDeleteJournal = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteJournal, setLoadingDeleteJournal] = useState(false);
	const [removeDeleteJournalModal, setRemoveDeleteJournalModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteJournal, setErrorDeleteJournal] = useState(null);
	const [successDeleteJournal, setSuccessDeleteJournal] = useState(null);

	const handleDeleteJournal = () => {

		if (!loadingDeleteJournal) {
			if (!uniqueId) {
				setErrorDeleteJournal(null);
				setSuccessDeleteJournal(null);
				setErrorDeleteJournal("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteJournal(null);
				}, 2500)
			} else {
				setLoadingDeleteJournal(true);

				const deleteJournalRes = deleteJournal(cookie, {
					unique_id: uniqueId
				})

				deleteJournalRes.then(res => {
					setLoadingDeleteJournal(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteJournal(error);
							setTimeout(function () {
								setErrorDeleteJournal(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteJournal(error);
							setTimeout(function () {
								setErrorDeleteJournal(null);
							}, 2000)
						}
					} else {
						setErrorDeleteJournal(null);
						setSuccessDeleteJournal(`Journal deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteJournal(null);
							setRemoveDeleteJournalModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteJournal(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteJournal, removeDeleteJournalModal, errorDeleteJournal, successDeleteJournal, handleDeleteJournal,
		setRemoveDeleteJournalModal, setUniqueId
	};
};

export { useAddJournal, useUpdateJournalDetails, useUploadJournalImage, useUploadJournalFile, useDeleteJournal };
