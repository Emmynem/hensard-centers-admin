import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addPresentation, deletePresentation, editPresentationDetails, editPresentationImage, editPresentationFile } from "../api/presentations";
import { uploadFile, uploadDocument } from "../api/clouder";

const useAddPresentation = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddPresentation, setLoadingAddPresentation] = useState(false);
	const [removeAddPresentationModal, setRemoveAddPresentationModal] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");
	const [selectedAddPresentation, setSelectedAddPresentation] = useState("");
	const [selectedAddPresentationFile, setSelectedAddPresentationFile] = useState("");
	const [uploadingAddPresentationPercentage, setUploadingAddPresentationPercentage] = useState(0);
	const [uploadingAddPresentationFilePercentage, setUploadingAddPresentationFilePercentage] = useState(0);

	const [errorAddPresentation, setErrorAddPresentation] = useState(null);
	const [successAddPresentation, setSuccessAddPresentation] = useState(null);

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

	const handleAddPresentation = (e) => {
		e.preventDefault();

		if (!loadingAddPresentation) {
			if (!title) {
				setErrorAddPresentation(null);
				setSuccessAddPresentation(null);
				setErrorAddPresentation("Title is required");
				setTimeout(function () {
					setErrorAddPresentation(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddPresentation("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddPresentation(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorAddPresentation("Other maximum characters - 500");
				setTimeout(function () {
					setErrorAddPresentation(null);
				}, 2500)
			} else if (selectedAddPresentation && !allowed_extensions.includes(selectedAddPresentation.type)) {
				setErrorAddPresentation("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddPresentation(null);
				}, 2000)
			} else if (selectedAddPresentation && selectedAddPresentation.size > maximum_file_size) {
				setErrorAddPresentation("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddPresentation(null);
				}, 2000)
			} else if (selectedAddPresentationFile && !document_allowed_extensions.includes(selectedAddPresentationFile.type)) {
				setErrorAddPresentation("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorAddPresentation(null);
				}, 2000)
			} else if (selectedAddPresentationFile && selectedAddPresentationFile.size > maximum_file_size) {
				setErrorAddPresentation("Presentation File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddPresentation(null);
				}, 2000)
			} else {
				setLoadingAddPresentation(true);

				if (selectedAddPresentation && selectedAddPresentationFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/presentation/images");
					formdata.append("file", selectedAddPresentation);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddPresentation(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							}
						} else {
							setErrorAddPresentation(null);
							setUploadingAddPresentationPercentage(0);
							setSuccessAddPresentation(`Presentation Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const formdata = new FormData();
							formdata.append("file_path", "centers/publications/presentation/files");
							formdata.append("file", selectedAddPresentationFile);
							formdata.append("cloudinary_name", config.cloudy_name);
							formdata.append("cloudinary_key", config.cloudy_key);
							formdata.append("cloudinary_secret", config.cloudy_secret);

							const uploadDocumentRes = uploadDocument(formdata)

							uploadDocumentRes.then(res => {
								setLoadingAddPresentation(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddPresentation(error);
										setTimeout(function () {
											setErrorAddPresentation(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddPresentation(error);
										setTimeout(function () {
											setErrorAddPresentation(null);
										}, 2000)
									}
								} else {
									setErrorAddPresentation(null);
									setUploadingAddPresentationFilePercentage(0);
									setSuccessAddPresentation(`Presentation File Uploaded!`);

									const file = res.data.data.secure_url;
									const file_type = res.data.data.format;
									const file_public_id = res.data.data.public_id;

									const addPresentationRes = addPresentation(cookie, {
										title: title.trim(),
										other: other ? other.trim() : undefined,
										image, image_public_id,
										file, file_type, file_public_id
									})

									addPresentationRes.then(res => {
										setLoadingAddPresentation(false);
										if (res.err) {
											if (!res.error.response.data.success) {
												const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
												setErrorAddPresentation(error);
												setTimeout(function () {
													setErrorAddPresentation(null);
												}, 2000)
											} else {
												const error = `${res.error.code} - ${res.error.message}`;
												setErrorAddPresentation(error);
												setTimeout(function () {
													setErrorAddPresentation(null);
												}, 2000)
											}
										} else {
											setErrorAddPresentation(null);
											setUploadingAddPresentationPercentage(0);
											setUploadingAddPresentationFilePercentage(0);
											setSuccessAddPresentation(`Presentation added successfully!`);

											setTimeout(function () {
												setSuccessAddPresentation(null);
												setRemoveAddPresentationModal(true);
											}, 2500)
										}
									}).catch(err => {
										setUploadingAddPresentationPercentage(0);
										setUploadingAddPresentationFilePercentage(0);
										setLoadingAddPresentation(false);
									})

								}
							}).catch(err => {
								setUploadingAddPresentationFilePercentage(0);
								setLoadingAddPresentation(false);
							})
						}
					}).catch(err => {
						setUploadingAddPresentationPercentage(0);
						setLoadingAddPresentation(false);
					})
				} else if (selectedAddPresentation) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/presentation/images");
					formdata.append("file", selectedAddPresentation);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddPresentation(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							}
						} else {
							setErrorAddPresentation(null);
							setUploadingAddPresentationPercentage(0);
							setSuccessAddPresentation(`Presentation Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const addPresentationRes = addPresentation(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image, image_public_id,
								file: undefined, file_type: undefined, file_public_id: undefined
							})

							addPresentationRes.then(res => {
								setLoadingAddPresentation(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddPresentation(error);
										setTimeout(function () {
											setErrorAddPresentation(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddPresentation(error);
										setTimeout(function () {
											setErrorAddPresentation(null);
										}, 2000)
									}
								} else {
									setErrorAddPresentation(null);
									setUploadingAddPresentationPercentage(0);
									setSuccessAddPresentation(`Presentation added successfully!`);

									setTimeout(function () {
										setSuccessAddPresentation(null);
										setRemoveAddPresentationModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddPresentationPercentage(0);
								setLoadingAddPresentation(false);
							})

						}
					}).catch(err => {
						setUploadingAddPresentationPercentage(0);
						setLoadingAddPresentation(false);
					})
				} else if (selectedAddPresentationFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/presentation/files");
					formdata.append("file", selectedAddPresentationFile);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadDocumentRes = uploadDocument(formdata)

					uploadDocumentRes.then(res => {
						setLoadingAddPresentation(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							}
						} else {
							setErrorAddPresentation(null);
							setUploadingAddPresentationPercentage(0);
							setSuccessAddPresentation(`Presentation File Uploaded!`);

							const file = res.data.data.secure_url;
							const file_type = res.data.data.format;
							const file_public_id = res.data.data.public_id;

							const addPresentationRes = addPresentation(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image: undefined, image_public_id: undefined,
								file, file_type, file_public_id
							})

							addPresentationRes.then(res => {
								setLoadingAddPresentation(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddPresentation(error);
										setTimeout(function () {
											setErrorAddPresentation(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddPresentation(error);
										setTimeout(function () {
											setErrorAddPresentation(null);
										}, 2000)
									}
								} else {
									setErrorAddPresentation(null);
									setUploadingAddPresentationFilePercentage(0);
									setSuccessAddPresentation(`Presentation added successfully!`);

									setTimeout(function () {
										setSuccessAddPresentation(null);
										setRemoveAddPresentationModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddPresentationFilePercentage(0);
								setLoadingAddPresentation(false);
							})
						}
					}).catch(err => {
						setUploadingAddPresentationFilePercentage(0);
						setLoadingAddPresentation(false);
					})
				} else {
					const addPresentationRes = addPresentation(cookie, {
						title: title.trim(),
						image: undefined, image_public_id: undefined,
						file: undefined, file_type: undefined, file_public_id: undefined
					})

					addPresentationRes.then(res => {
						setLoadingAddPresentation(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPresentation(error);
								setTimeout(function () {
									setErrorAddPresentation(null);
								}, 2000)
							}
						} else {
							setErrorAddPresentation(null);
							setSuccessAddPresentation(`Presentation added successfully!`);

							setTimeout(function () {
								setSuccessAddPresentation(null);
								setRemoveAddPresentationModal(true);
							}, 2500)
						}
					}).catch(err => {
						setLoadingAddPresentation(false);
					})
				}
			}
		}
	};

	return {
		cookie, title, other, loadingAddPresentation, setRemoveAddPresentationModal, errorAddPresentation, successAddPresentation, removeAddPresentationModal, setSelectedAddPresentation,
		setSelectedAddPresentationFile, handleAddPresentation, handleTitle, handleOther, setTitle, setOther, uploadingAddPresentationPercentage, uploadingAddPresentationFilePercentage, selectedAddPresentation, selectedAddPresentationFile,
	};
};

const useUpdatePresentationDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePresentationDetails, setLoadingUpdatePresentationDetails] = useState(false);
	const [removeUpdatePresentationDetailsModal, setRemoveUpdatePresentationDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");

	const [errorUpdatePresentationDetails, setErrorUpdatePresentationDetails] = useState(null);
	const [successUpdatePresentationDetails, setSuccessUpdatePresentationDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleOther = (e) => { e.preventDefault(); setOther(e.target.value); };

	const handleUpdatePresentationDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdatePresentationDetails) {
			if (!uniqueId) {
				setErrorUpdatePresentationDetails(null);
				setSuccessUpdatePresentationDetails(null);
				setErrorUpdatePresentationDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePresentationDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdatePresentationDetails("Title is required");
				setTimeout(function () {
					setErrorUpdatePresentationDetails(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorUpdatePresentationDetails("Title maximum characters - 500");
				setTimeout(function () {
					setErrorUpdatePresentationDetails(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorUpdatePresentationDetails("Other maximum characters - 500");
				setTimeout(function () {
					setErrorUpdatePresentationDetails(null);
				}, 2500)
			} else {
				setLoadingUpdatePresentationDetails(true);

				const editPresentationDetailsRes = editPresentationDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					other: other ? other.trim() : null,
				})

				editPresentationDetailsRes.then(res => {
					setLoadingUpdatePresentationDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePresentationDetails(error);
							setTimeout(function () {
								setErrorUpdatePresentationDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePresentationDetails(error);
							setTimeout(function () {
								setErrorUpdatePresentationDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePresentationDetails(null);
						setSuccessUpdatePresentationDetails(`Presentation details edited!`);

						setTimeout(function () {
							setSuccessUpdatePresentationDetails(null);
							setRemoveUpdatePresentationDetailsModal(true);
							setUniqueId(null);
							setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePresentationDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePresentationDetails, removeUpdatePresentationDetailsModal, errorUpdatePresentationDetails, successUpdatePresentationDetails, handleUpdatePresentationDetails,
		setRemoveUpdatePresentationDetailsModal, setUniqueId, setTitle, setOther, title, other, handleTitle, handleOther
	};
};

const useUploadPresentationImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingPresentationImage, setLoadingPresentationImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removePresentationImageModal, setRemovePresentationImageModal] = useState(null);
	const [selectedPresentationImage, setSelectedPresentationImage] = useState("");
	const [uploadingPresentationImagePercentage, setUploadingPresentationImagePercentage] = useState(0);

	const [errorPresentationImage, setErrorPresentationImage] = useState(null);
	const [successPresentationImage, setSuccessPresentationImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadPresentationImage = (e) => {
		e.preventDefault();

		if (!loadingPresentationImage) {
			if (!uniqueId) {
				setErrorPresentationImage(null);
				setSuccessPresentationImage(null);
				setErrorPresentationImage("Unique ID is required");
				setTimeout(function () {
					setErrorPresentationImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedPresentationImage.type)) {
				setErrorPresentationImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorPresentationImage(null);
				}, 2000)
			} else if (selectedPresentationImage.size > maximum_file_size) {
				setErrorPresentationImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorPresentationImage(null);
				}, 2000)
			} else {
				setLoadingPresentationImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/presentation/images");
				formdata.append("file", selectedPresentationImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingPresentationImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorPresentationImage(error);
							setTimeout(function () {
								setErrorPresentationImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorPresentationImage(error);
							setTimeout(function () {
								setErrorPresentationImage(null);
							}, 2000)
						}
					} else {
						setErrorPresentationImage(null);
						setUploadingPresentationImagePercentage(0);
						setSuccessPresentationImage(`Presentation Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editPresentationImageRes = editPresentationImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editPresentationImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingPresentationImagePercentage(0);
									setLoadingPresentationImage(false);
									setErrorPresentationImage(error);
									setTimeout(function () {
										setErrorPresentationImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingPresentationImagePercentage(0);
									setLoadingPresentationImage(false);
									setErrorPresentationImage(error);
									setTimeout(function () {
										setErrorPresentationImage(null);
									}, 2000)
								}
							} else {
								setErrorPresentationImage(null);
								setUploadingPresentationImagePercentage(0);
								setSuccessPresentationImage(`Presentation Image edited successfully!`);

								setTimeout(function () {
									setLoadingPresentationImage(false);
									setSuccessPresentationImage(null);
									setRemovePresentationImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingPresentationImagePercentage(0);
							setLoadingPresentationImage(false);
						})
					}
				}).catch(err => {
					setUploadingPresentationImagePercentage(0);
					setLoadingPresentationImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingPresentationImage, errorPresentationImage, successPresentationImage, handleUploadPresentationImage, uniqueId, setSelectedPresentationImage,
		setUniqueId, uploadingPresentationImagePercentage, selectedPresentationImage, removePresentationImageModal, setRemovePresentationImageModal
	};
};

const useUploadPresentationFile = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingPresentationFile, setLoadingPresentationFile] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removePresentationFileModal, setRemovePresentationFileModal] = useState(null);
	const [selectedPresentationFile, setSelectedPresentationFile] = useState("");
	const [uploadingPresentationFilePercentage, setUploadingPresentationFilePercentage] = useState(0);

	const [errorPresentationFile, setErrorPresentationFile] = useState(null);
	const [successPresentationFile, setSuccessPresentationFile] = useState(null);

	const document_allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/jfif", "image/JFIF", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "application/pdf", "application/PDF", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/x-zip-compressed", "text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadPresentationFile = (e) => {
		e.preventDefault();

		if (!loadingPresentationFile) {
			if (!uniqueId) {
				setErrorPresentationFile(null);
				setSuccessPresentationFile(null);
				setErrorPresentationFile("Unique ID is required");
				setTimeout(function () {
					setErrorPresentationFile(null);
				}, 2000)
			} else if (!document_allowed_extensions.includes(selectedPresentationFile.type)) {
				setErrorPresentationFile("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorPresentationFile(null);
				}, 2000)
			} else if (selectedPresentationFile.size > maximum_file_size) {
				setErrorPresentationFile("Presentation File too large (max 10mb)");
				setTimeout(function () {
					setErrorPresentationFile(null);
				}, 2000)
			} else {
				setLoadingPresentationFile(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/presentation/files");
				formdata.append("file", selectedPresentationFile);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadDocumentRes = uploadDocument(formdata)

				uploadDocumentRes.then(res => {
					setLoadingPresentationFile(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorPresentationFile(error);
							setTimeout(function () {
								setErrorPresentationFile(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorPresentationFile(error);
							setTimeout(function () {
								setErrorPresentationFile(null);
							}, 2000)
						}
					} else {
						setErrorPresentationFile(null);
						setUploadingPresentationFilePercentage(0);
						setSuccessPresentationFile(`Presentation File Uploaded!`);

						const file = res.data.data.secure_url;
						const file_type = res.data.data.format;
						const file_public_id = res.data.data.public_id;

						const editPresentationFileRes = editPresentationFile(cookie, {
							unique_id: uniqueId, file, file_type, file_public_id
						})

						editPresentationFileRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingPresentationFilePercentage(0);
									setLoadingPresentationFile(false);
									setErrorPresentationFile(error);
									setTimeout(function () {
										setErrorPresentationFile(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingPresentationFilePercentage(0);
									setLoadingPresentationFile(false);
									setErrorPresentationFile(error);
									setTimeout(function () {
										setErrorPresentationFile(null);
									}, 2000)
								}
							} else {
								setErrorPresentationFile(null);
								setUploadingPresentationFilePercentage(0);
								setSuccessPresentationFile(`Presentation File edited successfully!`);

								setTimeout(function () {
									setLoadingPresentationFile(false);
									setSuccessPresentationFile(null);
									setRemovePresentationFileModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingPresentationFilePercentage(0);
							setLoadingPresentationFile(false);
						})
					}
				}).catch(err => {
					setUploadingPresentationFilePercentage(0);
					setLoadingPresentationFile(false);
				})
			}
		}
	};

	return {
		cookie, loadingPresentationFile, errorPresentationFile, successPresentationFile, handleUploadPresentationFile, uniqueId, setSelectedPresentationFile,
		setUniqueId, uploadingPresentationFilePercentage, selectedPresentationFile, removePresentationFileModal, setRemovePresentationFileModal
	};
};

const useDeletePresentation = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeletePresentation, setLoadingDeletePresentation] = useState(false);
	const [removeDeletePresentationModal, setRemoveDeletePresentationModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeletePresentation, setErrorDeletePresentation] = useState(null);
	const [successDeletePresentation, setSuccessDeletePresentation] = useState(null);

	const handleDeletePresentation = () => {

		if (!loadingDeletePresentation) {
			if (!uniqueId) {
				setErrorDeletePresentation(null);
				setSuccessDeletePresentation(null);
				setErrorDeletePresentation("Unique ID is required");
				setTimeout(function () {
					setErrorDeletePresentation(null);
				}, 2500)
			} else {
				setLoadingDeletePresentation(true);

				const deletePresentationRes = deletePresentation(cookie, {
					unique_id: uniqueId
				})

				deletePresentationRes.then(res => {
					setLoadingDeletePresentation(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeletePresentation(error);
							setTimeout(function () {
								setErrorDeletePresentation(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeletePresentation(error);
							setTimeout(function () {
								setErrorDeletePresentation(null);
							}, 2000)
						}
					} else {
						setErrorDeletePresentation(null);
						setSuccessDeletePresentation(`Presentation deleted successfully!`);

						setTimeout(function () {
							setSuccessDeletePresentation(null);
							setRemoveDeletePresentationModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeletePresentation(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeletePresentation, removeDeletePresentationModal, errorDeletePresentation, successDeletePresentation, handleDeletePresentation,
		setRemoveDeletePresentationModal, setUniqueId
	};
};

export { useAddPresentation, useUpdatePresentationDetails, useUploadPresentationImage, useUploadPresentationFile, useDeletePresentation };
