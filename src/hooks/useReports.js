import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addReport, deleteReport, editReportDetails, editReportImage, editReportFile } from "../api/reports";
import { uploadFile, uploadDocument } from "../api/clouder";

const useAddReport = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddReport, setLoadingAddReport] = useState(false);
	const [removeAddReportModal, setRemoveAddReportModal] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");
	const [selectedAddReport, setSelectedAddReport] = useState("");
	const [selectedAddReportFile, setSelectedAddReportFile] = useState("");
	const [uploadingAddReportPercentage, setUploadingAddReportPercentage] = useState(0);
	const [uploadingAddReportFilePercentage, setUploadingAddReportFilePercentage] = useState(0);

	const [errorAddReport, setErrorAddReport] = useState(null);
	const [successAddReport, setSuccessAddReport] = useState(null);

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

	const handleAddReport = (e) => {
		e.preventDefault();

		if (!loadingAddReport) {
			if (!title) {
				setErrorAddReport(null);
				setSuccessAddReport(null);
				setErrorAddReport("Title is required");
				setTimeout(function () {
					setErrorAddReport(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddReport("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddReport(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorAddReport("Other maximum characters - 500");
				setTimeout(function () {
					setErrorAddReport(null);
				}, 2500)
			} else if (selectedAddReport && !allowed_extensions.includes(selectedAddReport.type)) {
				setErrorAddReport("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddReport(null);
				}, 2000)
			} else if (selectedAddReport && selectedAddReport.size > maximum_file_size) {
				setErrorAddReport("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddReport(null);
				}, 2000)
			} else if (selectedAddReportFile && !document_allowed_extensions.includes(selectedAddReportFile.type)) {
				setErrorAddReport("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorAddReport(null);
				}, 2000)
			} else if (selectedAddReportFile && selectedAddReportFile.size > maximum_file_size) {
				setErrorAddReport("Report File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddReport(null);
				}, 2000)
			} else {
				setLoadingAddReport(true);

				if (selectedAddReport && selectedAddReportFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/report/images");
					formdata.append("file", selectedAddReport);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddReport(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							}
						} else {
							setErrorAddReport(null);
							setUploadingAddReportPercentage(0);
							setSuccessAddReport(`Report Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const formdata = new FormData();
							formdata.append("file_path", "centers/publications/report/files");
							formdata.append("file", selectedAddReportFile);
							formdata.append("cloudinary_name", config.cloudy_name);
							formdata.append("cloudinary_key", config.cloudy_key);
							formdata.append("cloudinary_secret", config.cloudy_secret);

							const uploadDocumentRes = uploadDocument(formdata)

							uploadDocumentRes.then(res => {
								setLoadingAddReport(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddReport(error);
										setTimeout(function () {
											setErrorAddReport(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddReport(error);
										setTimeout(function () {
											setErrorAddReport(null);
										}, 2000)
									}
								} else {
									setErrorAddReport(null);
									setUploadingAddReportFilePercentage(0);
									setSuccessAddReport(`Report File Uploaded!`);

									const file = res.data.data.secure_url;
									const file_type = res.data.data.format;
									const file_public_id = res.data.data.public_id;

									const addReportRes = addReport(cookie, {
										title: title.trim(),
										other: other ? other.trim() : undefined,
										image, image_public_id,
										file, file_type, file_public_id
									})

									addReportRes.then(res => {
										setLoadingAddReport(false);
										if (res.err) {
											if (!res.error.response.data.success) {
												const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
												setErrorAddReport(error);
												setTimeout(function () {
													setErrorAddReport(null);
												}, 2000)
											} else {
												const error = `${res.error.code} - ${res.error.message}`;
												setErrorAddReport(error);
												setTimeout(function () {
													setErrorAddReport(null);
												}, 2000)
											}
										} else {
											setErrorAddReport(null);
											setUploadingAddReportPercentage(0);
											setUploadingAddReportFilePercentage(0);
											setSuccessAddReport(`Report added successfully!`);

											setTimeout(function () {
												setSuccessAddReport(null);
												setRemoveAddReportModal(true);
											}, 2500)
										}
									}).catch(err => {
										setUploadingAddReportPercentage(0);
										setUploadingAddReportFilePercentage(0);
										setLoadingAddReport(false);
									})

								}
							}).catch(err => {
								setUploadingAddReportFilePercentage(0);
								setLoadingAddReport(false);
							})
						}
					}).catch(err => {
						setUploadingAddReportPercentage(0);
						setLoadingAddReport(false);
					})
				} else if (selectedAddReport) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/report/images");
					formdata.append("file", selectedAddReport);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddReport(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							}
						} else {
							setErrorAddReport(null);
							setUploadingAddReportPercentage(0);
							setSuccessAddReport(`Report Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const addReportRes = addReport(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image, image_public_id,
								file: undefined, file_type: undefined, file_public_id: undefined
							})

							addReportRes.then(res => {
								setLoadingAddReport(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddReport(error);
										setTimeout(function () {
											setErrorAddReport(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddReport(error);
										setTimeout(function () {
											setErrorAddReport(null);
										}, 2000)
									}
								} else {
									setErrorAddReport(null);
									setUploadingAddReportPercentage(0);
									setSuccessAddReport(`Report added successfully!`);

									setTimeout(function () {
										setSuccessAddReport(null);
										setRemoveAddReportModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddReportPercentage(0);
								setLoadingAddReport(false);
							})

						}
					}).catch(err => {
						setUploadingAddReportPercentage(0);
						setLoadingAddReport(false);
					})
				} else if (selectedAddReportFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/report/files");
					formdata.append("file", selectedAddReportFile);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadDocumentRes = uploadDocument(formdata)

					uploadDocumentRes.then(res => {
						setLoadingAddReport(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							}
						} else {
							setErrorAddReport(null);
							setUploadingAddReportPercentage(0);
							setSuccessAddReport(`Report File Uploaded!`);

							const file = res.data.data.secure_url;
							const file_type = res.data.data.format;
							const file_public_id = res.data.data.public_id;

							const addReportRes = addReport(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image: undefined, image_public_id: undefined,
								file, file_type, file_public_id
							})

							addReportRes.then(res => {
								setLoadingAddReport(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddReport(error);
										setTimeout(function () {
											setErrorAddReport(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddReport(error);
										setTimeout(function () {
											setErrorAddReport(null);
										}, 2000)
									}
								} else {
									setErrorAddReport(null);
									setUploadingAddReportFilePercentage(0);
									setSuccessAddReport(`Report added successfully!`);

									setTimeout(function () {
										setSuccessAddReport(null);
										setRemoveAddReportModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddReportFilePercentage(0);
								setLoadingAddReport(false);
							})
						}
					}).catch(err => {
						setUploadingAddReportFilePercentage(0);
						setLoadingAddReport(false);
					})
				} else {
					const addReportRes = addReport(cookie, {
						title: title.trim(),
						image: undefined, image_public_id: undefined,
						file: undefined, file_type: undefined, file_public_id: undefined
					})

					addReportRes.then(res => {
						setLoadingAddReport(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddReport(error);
								setTimeout(function () {
									setErrorAddReport(null);
								}, 2000)
							}
						} else {
							setErrorAddReport(null);
							setSuccessAddReport(`Report added successfully!`);

							setTimeout(function () {
								setSuccessAddReport(null);
								setRemoveAddReportModal(true);
							}, 2500)
						}
					}).catch(err => {
						setLoadingAddReport(false);
					})
				}
			}
		}
	};

	return {
		cookie, title, other, loadingAddReport, setRemoveAddReportModal, errorAddReport, successAddReport, removeAddReportModal, setSelectedAddReport,
		setSelectedAddReportFile, handleAddReport, handleTitle, handleOther, setTitle, setOther, uploadingAddReportPercentage, uploadingAddReportFilePercentage, selectedAddReport, selectedAddReportFile,
	};
};

const useUpdateReportDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateReportDetails, setLoadingUpdateReportDetails] = useState(false);
	const [removeUpdateReportDetailsModal, setRemoveUpdateReportDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");

	const [errorUpdateReportDetails, setErrorUpdateReportDetails] = useState(null);
	const [successUpdateReportDetails, setSuccessUpdateReportDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleOther = (e) => { e.preventDefault(); setOther(e.target.value); };

	const handleUpdateReportDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateReportDetails) {
			if (!uniqueId) {
				setErrorUpdateReportDetails(null);
				setSuccessUpdateReportDetails(null);
				setErrorUpdateReportDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateReportDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateReportDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateReportDetails(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorUpdateReportDetails("Title maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateReportDetails(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorUpdateReportDetails("Other maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateReportDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateReportDetails(true);

				const editReportDetailsRes = editReportDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					other: other ? other.trim() : null,
				})

				editReportDetailsRes.then(res => {
					setLoadingUpdateReportDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateReportDetails(error);
							setTimeout(function () {
								setErrorUpdateReportDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateReportDetails(error);
							setTimeout(function () {
								setErrorUpdateReportDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateReportDetails(null);
						setSuccessUpdateReportDetails(`Report details edited!`);

						setTimeout(function () {
							setSuccessUpdateReportDetails(null);
							setRemoveUpdateReportDetailsModal(true);
							setUniqueId(null);
							setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateReportDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateReportDetails, removeUpdateReportDetailsModal, errorUpdateReportDetails, successUpdateReportDetails, handleUpdateReportDetails,
		setRemoveUpdateReportDetailsModal, setUniqueId, setTitle, setOther, title, other, handleTitle, handleOther
	};
};

const useUploadReportImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingReportImage, setLoadingReportImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeReportImageModal, setRemoveReportImageModal] = useState(null);
	const [selectedReportImage, setSelectedReportImage] = useState("");
	const [uploadingReportImagePercentage, setUploadingReportImagePercentage] = useState(0);

	const [errorReportImage, setErrorReportImage] = useState(null);
	const [successReportImage, setSuccessReportImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadReportImage = (e) => {
		e.preventDefault();

		if (!loadingReportImage) {
			if (!uniqueId) {
				setErrorReportImage(null);
				setSuccessReportImage(null);
				setErrorReportImage("Unique ID is required");
				setTimeout(function () {
					setErrorReportImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedReportImage.type)) {
				setErrorReportImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorReportImage(null);
				}, 2000)
			} else if (selectedReportImage.size > maximum_file_size) {
				setErrorReportImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorReportImage(null);
				}, 2000)
			} else {
				setLoadingReportImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/report/images");
				formdata.append("file", selectedReportImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingReportImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorReportImage(error);
							setTimeout(function () {
								setErrorReportImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorReportImage(error);
							setTimeout(function () {
								setErrorReportImage(null);
							}, 2000)
						}
					} else {
						setErrorReportImage(null);
						setUploadingReportImagePercentage(0);
						setSuccessReportImage(`Report Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editReportImageRes = editReportImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editReportImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingReportImagePercentage(0);
									setLoadingReportImage(false);
									setErrorReportImage(error);
									setTimeout(function () {
										setErrorReportImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingReportImagePercentage(0);
									setLoadingReportImage(false);
									setErrorReportImage(error);
									setTimeout(function () {
										setErrorReportImage(null);
									}, 2000)
								}
							} else {
								setErrorReportImage(null);
								setUploadingReportImagePercentage(0);
								setSuccessReportImage(`Report Image edited successfully!`);

								setTimeout(function () {
									setLoadingReportImage(false);
									setSuccessReportImage(null);
									setRemoveReportImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingReportImagePercentage(0);
							setLoadingReportImage(false);
						})
					}
				}).catch(err => {
					setUploadingReportImagePercentage(0);
					setLoadingReportImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingReportImage, errorReportImage, successReportImage, handleUploadReportImage, uniqueId, setSelectedReportImage,
		setUniqueId, uploadingReportImagePercentage, selectedReportImage, removeReportImageModal, setRemoveReportImageModal
	};
};

const useUploadReportFile = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingReportFile, setLoadingReportFile] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeReportFileModal, setRemoveReportFileModal] = useState(null);
	const [selectedReportFile, setSelectedReportFile] = useState("");
	const [uploadingReportFilePercentage, setUploadingReportFilePercentage] = useState(0);

	const [errorReportFile, setErrorReportFile] = useState(null);
	const [successReportFile, setSuccessReportFile] = useState(null);

	const document_allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/jfif", "image/JFIF", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "application/pdf", "application/PDF", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/x-zip-compressed", "text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadReportFile = (e) => {
		e.preventDefault();

		if (!loadingReportFile) {
			if (!uniqueId) {
				setErrorReportFile(null);
				setSuccessReportFile(null);
				setErrorReportFile("Unique ID is required");
				setTimeout(function () {
					setErrorReportFile(null);
				}, 2000)
			} else if (!document_allowed_extensions.includes(selectedReportFile.type)) {
				setErrorReportFile("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorReportFile(null);
				}, 2000)
			} else if (selectedReportFile.size > maximum_file_size) {
				setErrorReportFile("Report File too large (max 10mb)");
				setTimeout(function () {
					setErrorReportFile(null);
				}, 2000)
			} else {
				setLoadingReportFile(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/report/files");
				formdata.append("file", selectedReportFile);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadDocumentRes = uploadDocument(formdata)

				uploadDocumentRes.then(res => {
					setLoadingReportFile(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorReportFile(error);
							setTimeout(function () {
								setErrorReportFile(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorReportFile(error);
							setTimeout(function () {
								setErrorReportFile(null);
							}, 2000)
						}
					} else {
						setErrorReportFile(null);
						setUploadingReportFilePercentage(0);
						setSuccessReportFile(`Report File Uploaded!`);

						const file = res.data.data.secure_url;
						const file_type = res.data.data.format;
						const file_public_id = res.data.data.public_id;

						const editReportFileRes = editReportFile(cookie, {
							unique_id: uniqueId, file, file_type, file_public_id
						})

						editReportFileRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingReportFilePercentage(0);
									setLoadingReportFile(false);
									setErrorReportFile(error);
									setTimeout(function () {
										setErrorReportFile(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingReportFilePercentage(0);
									setLoadingReportFile(false);
									setErrorReportFile(error);
									setTimeout(function () {
										setErrorReportFile(null);
									}, 2000)
								}
							} else {
								setErrorReportFile(null);
								setUploadingReportFilePercentage(0);
								setSuccessReportFile(`Report File edited successfully!`);

								setTimeout(function () {
									setLoadingReportFile(false);
									setSuccessReportFile(null);
									setRemoveReportFileModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingReportFilePercentage(0);
							setLoadingReportFile(false);
						})
					}
				}).catch(err => {
					setUploadingReportFilePercentage(0);
					setLoadingReportFile(false);
				})
			}
		}
	};

	return {
		cookie, loadingReportFile, errorReportFile, successReportFile, handleUploadReportFile, uniqueId, setSelectedReportFile,
		setUniqueId, uploadingReportFilePercentage, selectedReportFile, removeReportFileModal, setRemoveReportFileModal
	};
};

const useDeleteReport = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteReport, setLoadingDeleteReport] = useState(false);
	const [removeDeleteReportModal, setRemoveDeleteReportModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteReport, setErrorDeleteReport] = useState(null);
	const [successDeleteReport, setSuccessDeleteReport] = useState(null);

	const handleDeleteReport = () => {

		if (!loadingDeleteReport) {
			if (!uniqueId) {
				setErrorDeleteReport(null);
				setSuccessDeleteReport(null);
				setErrorDeleteReport("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteReport(null);
				}, 2500)
			} else {
				setLoadingDeleteReport(true);

				const deleteReportRes = deleteReport(cookie, {
					unique_id: uniqueId
				})

				deleteReportRes.then(res => {
					setLoadingDeleteReport(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteReport(error);
							setTimeout(function () {
								setErrorDeleteReport(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteReport(error);
							setTimeout(function () {
								setErrorDeleteReport(null);
							}, 2000)
						}
					} else {
						setErrorDeleteReport(null);
						setSuccessDeleteReport(`Report deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteReport(null);
							setRemoveDeleteReportModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteReport(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteReport, removeDeleteReportModal, errorDeleteReport, successDeleteReport, handleDeleteReport,
		setRemoveDeleteReportModal, setUniqueId
	};
};

export { useAddReport, useUpdateReportDetails, useUploadReportImage, useUploadReportFile, useDeleteReport };
