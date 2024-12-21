import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addPolicy, deletePolicy, editPolicyDetails, editPolicyImage, editPolicyFile } from "../api/policies";
import { uploadFile, uploadDocument } from "../api/clouder";

const useAddPolicy = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddPolicy, setLoadingAddPolicy] = useState(false);
	const [removeAddPolicyModal, setRemoveAddPolicyModal] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");
	const [selectedAddPolicy, setSelectedAddPolicy] = useState("");
	const [selectedAddPolicyFile, setSelectedAddPolicyFile] = useState("");
	const [uploadingAddPolicyPercentage, setUploadingAddPolicyPercentage] = useState(0);
	const [uploadingAddPolicyFilePercentage, setUploadingAddPolicyFilePercentage] = useState(0);

	const [errorAddPolicy, setErrorAddPolicy] = useState(null);
	const [successAddPolicy, setSuccessAddPolicy] = useState(null);

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

	const handleAddPolicy = (e) => {
		e.preventDefault();

		if (!loadingAddPolicy) {
			if (!title) {
				setErrorAddPolicy(null);
				setSuccessAddPolicy(null);
				setErrorAddPolicy("Title is required");
				setTimeout(function () {
					setErrorAddPolicy(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorAddPolicy("Title maximum characters - 500");
				setTimeout(function () {
					setErrorAddPolicy(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorAddPolicy("Other maximum characters - 500");
				setTimeout(function () {
					setErrorAddPolicy(null);
				}, 2500)
			} else if (selectedAddPolicy && !allowed_extensions.includes(selectedAddPolicy.type)) {
				setErrorAddPolicy("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddPolicy(null);
				}, 2000)
			} else if (selectedAddPolicy && selectedAddPolicy.size > maximum_file_size) {
				setErrorAddPolicy("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddPolicy(null);
				}, 2000)
			} else if (selectedAddPolicyFile && !document_allowed_extensions.includes(selectedAddPolicyFile.type)) {
				setErrorAddPolicy("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorAddPolicy(null);
				}, 2000)
			} else if (selectedAddPolicyFile && selectedAddPolicyFile.size > maximum_file_size) {
				setErrorAddPolicy("Policy File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddPolicy(null);
				}, 2000)
			} else {
				setLoadingAddPolicy(true);

				if (selectedAddPolicy && selectedAddPolicyFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/policy/images");
					formdata.append("file", selectedAddPolicy);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddPolicy(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							}
						} else {
							setErrorAddPolicy(null);
							setUploadingAddPolicyPercentage(0);
							setSuccessAddPolicy(`Policy Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const formdata = new FormData();
							formdata.append("file_path", "centers/publications/policy/files");
							formdata.append("file", selectedAddPolicyFile);
							formdata.append("cloudinary_name", config.cloudy_name);
							formdata.append("cloudinary_key", config.cloudy_key);
							formdata.append("cloudinary_secret", config.cloudy_secret);

							const uploadDocumentRes = uploadDocument(formdata)

							uploadDocumentRes.then(res => {
								setLoadingAddPolicy(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddPolicy(error);
										setTimeout(function () {
											setErrorAddPolicy(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddPolicy(error);
										setTimeout(function () {
											setErrorAddPolicy(null);
										}, 2000)
									}
								} else {
									setErrorAddPolicy(null);
									setUploadingAddPolicyFilePercentage(0);
									setSuccessAddPolicy(`Policy File Uploaded!`);

									const file = res.data.data.secure_url;
									const file_type = res.data.data.format;
									const file_public_id = res.data.data.public_id;

									const addPolicyRes = addPolicy(cookie, {
										title: title.trim(),
										other: other ? other.trim() : undefined,
										image, image_public_id,
										file, file_type, file_public_id
									})

									addPolicyRes.then(res => {
										setLoadingAddPolicy(false);
										if (res.err) {
											if (!res.error.response.data.success) {
												const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
												setErrorAddPolicy(error);
												setTimeout(function () {
													setErrorAddPolicy(null);
												}, 2000)
											} else {
												const error = `${res.error.code} - ${res.error.message}`;
												setErrorAddPolicy(error);
												setTimeout(function () {
													setErrorAddPolicy(null);
												}, 2000)
											}
										} else {
											setErrorAddPolicy(null);
											setUploadingAddPolicyPercentage(0);
											setUploadingAddPolicyFilePercentage(0);
											setSuccessAddPolicy(`Policy added successfully!`);

											setTimeout(function () {
												setSuccessAddPolicy(null);
												setRemoveAddPolicyModal(true);
											}, 2500)
										}
									}).catch(err => {
										setUploadingAddPolicyPercentage(0);
										setUploadingAddPolicyFilePercentage(0);
										setLoadingAddPolicy(false);
									})

								}
							}).catch(err => {
								setUploadingAddPolicyFilePercentage(0);
								setLoadingAddPolicy(false);
							})
						}
					}).catch(err => {
						setUploadingAddPolicyPercentage(0);
						setLoadingAddPolicy(false);
					})
				} else if (selectedAddPolicy) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/policy/images");
					formdata.append("file", selectedAddPolicy);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddPolicy(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							}
						} else {
							setErrorAddPolicy(null);
							setUploadingAddPolicyPercentage(0);
							setSuccessAddPolicy(`Policy Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const addPolicyRes = addPolicy(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image, image_public_id,
								file: undefined, file_type: undefined, file_public_id: undefined
							})

							addPolicyRes.then(res => {
								setLoadingAddPolicy(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddPolicy(error);
										setTimeout(function () {
											setErrorAddPolicy(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddPolicy(error);
										setTimeout(function () {
											setErrorAddPolicy(null);
										}, 2000)
									}
								} else {
									setErrorAddPolicy(null);
									setUploadingAddPolicyPercentage(0);
									setSuccessAddPolicy(`Policy added successfully!`);

									setTimeout(function () {
										setSuccessAddPolicy(null);
										setRemoveAddPolicyModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddPolicyPercentage(0);
								setLoadingAddPolicy(false);
							})

						}
					}).catch(err => {
						setUploadingAddPolicyPercentage(0);
						setLoadingAddPolicy(false);
					})
				} else if (selectedAddPolicyFile) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/publications/policy/files");
					formdata.append("file", selectedAddPolicyFile);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadDocumentRes = uploadDocument(formdata)

					uploadDocumentRes.then(res => {
						setLoadingAddPolicy(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							}
						} else {
							setErrorAddPolicy(null);
							setUploadingAddPolicyPercentage(0);
							setSuccessAddPolicy(`Policy File Uploaded!`);

							const file = res.data.data.secure_url;
							const file_type = res.data.data.format;
							const file_public_id = res.data.data.public_id;

							const addPolicyRes = addPolicy(cookie, {
								title: title.trim(),
								other: other ? other.trim() : undefined,
								image: undefined, image_public_id: undefined,
								file, file_type, file_public_id
							})

							addPolicyRes.then(res => {
								setLoadingAddPolicy(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddPolicy(error);
										setTimeout(function () {
											setErrorAddPolicy(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddPolicy(error);
										setTimeout(function () {
											setErrorAddPolicy(null);
										}, 2000)
									}
								} else {
									setErrorAddPolicy(null);
									setUploadingAddPolicyFilePercentage(0);
									setSuccessAddPolicy(`Policy added successfully!`);

									setTimeout(function () {
										setSuccessAddPolicy(null);
										setRemoveAddPolicyModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddPolicyFilePercentage(0);
								setLoadingAddPolicy(false);
							})
						}
					}).catch(err => {
						setUploadingAddPolicyFilePercentage(0);
						setLoadingAddPolicy(false);
					})
				} else {
					const addPolicyRes = addPolicy(cookie, {
						title: title.trim(),
						image: undefined, image_public_id: undefined,
						file: undefined, file_type: undefined, file_public_id: undefined
					})

					addPolicyRes.then(res => {
						setLoadingAddPolicy(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddPolicy(error);
								setTimeout(function () {
									setErrorAddPolicy(null);
								}, 2000)
							}
						} else {
							setErrorAddPolicy(null);
							setSuccessAddPolicy(`Policy added successfully!`);

							setTimeout(function () {
								setSuccessAddPolicy(null);
								setRemoveAddPolicyModal(true);
							}, 2500)
						}
					}).catch(err => {
						setLoadingAddPolicy(false);
					})
				}
			}
		}
	};

	return {
		cookie, title, other, loadingAddPolicy, setRemoveAddPolicyModal, errorAddPolicy, successAddPolicy, removeAddPolicyModal, setSelectedAddPolicy,
		setSelectedAddPolicyFile, handleAddPolicy, handleTitle, handleOther, setTitle, setOther, uploadingAddPolicyPercentage, uploadingAddPolicyFilePercentage, selectedAddPolicy, selectedAddPolicyFile,
	};
};

const useUpdatePolicyDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdatePolicyDetails, setLoadingUpdatePolicyDetails] = useState(false);
	const [removeUpdatePolicyDetailsModal, setRemoveUpdatePolicyDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [other, setOther] = useState("");

	const [errorUpdatePolicyDetails, setErrorUpdatePolicyDetails] = useState(null);
	const [successUpdatePolicyDetails, setSuccessUpdatePolicyDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleOther = (e) => { e.preventDefault(); setOther(e.target.value); };

	const handleUpdatePolicyDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdatePolicyDetails) {
			if (!uniqueId) {
				setErrorUpdatePolicyDetails(null);
				setSuccessUpdatePolicyDetails(null);
				setErrorUpdatePolicyDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdatePolicyDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdatePolicyDetails("Title is required");
				setTimeout(function () {
					setErrorUpdatePolicyDetails(null);
				}, 2500)
			} else if (title.length > 500) {
				setErrorUpdatePolicyDetails("Title maximum characters - 500");
				setTimeout(function () {
					setErrorUpdatePolicyDetails(null);
				}, 2500)
			} else if (other.length > 500) {
				setErrorUpdatePolicyDetails("Other maximum characters - 500");
				setTimeout(function () {
					setErrorUpdatePolicyDetails(null);
				}, 2500)
			} else {
				setLoadingUpdatePolicyDetails(true);

				const editPolicyDetailsRes = editPolicyDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					other: other ? other.trim() : null,
				})

				editPolicyDetailsRes.then(res => {
					setLoadingUpdatePolicyDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdatePolicyDetails(error);
							setTimeout(function () {
								setErrorUpdatePolicyDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdatePolicyDetails(error);
							setTimeout(function () {
								setErrorUpdatePolicyDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdatePolicyDetails(null);
						setSuccessUpdatePolicyDetails(`Policy details edited!`);

						setTimeout(function () {
							setSuccessUpdatePolicyDetails(null);
							setRemoveUpdatePolicyDetailsModal(true);
							setUniqueId(null);
							setTitle("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdatePolicyDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdatePolicyDetails, removeUpdatePolicyDetailsModal, errorUpdatePolicyDetails, successUpdatePolicyDetails, handleUpdatePolicyDetails,
		setRemoveUpdatePolicyDetailsModal, setUniqueId, setTitle, setOther, title, other, handleTitle, handleOther
	};
};

const useUploadPolicyImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingPolicyImage, setLoadingPolicyImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removePolicyImageModal, setRemovePolicyImageModal] = useState(null);
	const [selectedPolicyImage, setSelectedPolicyImage] = useState("");
	const [uploadingPolicyImagePercentage, setUploadingPolicyImagePercentage] = useState(0);

	const [errorPolicyImage, setErrorPolicyImage] = useState(null);
	const [successPolicyImage, setSuccessPolicyImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadPolicyImage = (e) => {
		e.preventDefault();

		if (!loadingPolicyImage) {
			if (!uniqueId) {
				setErrorPolicyImage(null);
				setSuccessPolicyImage(null);
				setErrorPolicyImage("Unique ID is required");
				setTimeout(function () {
					setErrorPolicyImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedPolicyImage.type)) {
				setErrorPolicyImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorPolicyImage(null);
				}, 2000)
			} else if (selectedPolicyImage.size > maximum_file_size) {
				setErrorPolicyImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorPolicyImage(null);
				}, 2000)
			} else {
				setLoadingPolicyImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/policy/images");
				formdata.append("file", selectedPolicyImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingPolicyImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorPolicyImage(error);
							setTimeout(function () {
								setErrorPolicyImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorPolicyImage(error);
							setTimeout(function () {
								setErrorPolicyImage(null);
							}, 2000)
						}
					} else {
						setErrorPolicyImage(null);
						setUploadingPolicyImagePercentage(0);
						setSuccessPolicyImage(`Policy Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editPolicyImageRes = editPolicyImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editPolicyImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingPolicyImagePercentage(0);
									setLoadingPolicyImage(false);
									setErrorPolicyImage(error);
									setTimeout(function () {
										setErrorPolicyImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingPolicyImagePercentage(0);
									setLoadingPolicyImage(false);
									setErrorPolicyImage(error);
									setTimeout(function () {
										setErrorPolicyImage(null);
									}, 2000)
								}
							} else {
								setErrorPolicyImage(null);
								setUploadingPolicyImagePercentage(0);
								setSuccessPolicyImage(`Policy Image edited successfully!`);

								setTimeout(function () {
									setLoadingPolicyImage(false);
									setSuccessPolicyImage(null);
									setRemovePolicyImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingPolicyImagePercentage(0);
							setLoadingPolicyImage(false);
						})
					}
				}).catch(err => {
					setUploadingPolicyImagePercentage(0);
					setLoadingPolicyImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingPolicyImage, errorPolicyImage, successPolicyImage, handleUploadPolicyImage, uniqueId, setSelectedPolicyImage,
		setUniqueId, uploadingPolicyImagePercentage, selectedPolicyImage, removePolicyImageModal, setRemovePolicyImageModal
	};
};

const useUploadPolicyFile = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingPolicyFile, setLoadingPolicyFile] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removePolicyFileModal, setRemovePolicyFileModal] = useState(null);
	const [selectedPolicyFile, setSelectedPolicyFile] = useState("");
	const [uploadingPolicyFilePercentage, setUploadingPolicyFilePercentage] = useState(0);

	const [errorPolicyFile, setErrorPolicyFile] = useState(null);
	const [successPolicyFile, setSuccessPolicyFile] = useState(null);

	const document_allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/jfif", "image/JFIF", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "application/pdf", "application/PDF", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/x-zip-compressed", "text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadPolicyFile = (e) => {
		e.preventDefault();

		if (!loadingPolicyFile) {
			if (!uniqueId) {
				setErrorPolicyFile(null);
				setSuccessPolicyFile(null);
				setErrorPolicyFile("Unique ID is required");
				setTimeout(function () {
					setErrorPolicyFile(null);
				}, 2000)
			} else if (!document_allowed_extensions.includes(selectedPolicyFile.type)) {
				setErrorPolicyFile("Only Images, Texts, Docs, Powerpoint and Excel, PDFs files are allowed");
				setTimeout(function () {
					setErrorPolicyFile(null);
				}, 2000)
			} else if (selectedPolicyFile.size > maximum_file_size) {
				setErrorPolicyFile("Policy File too large (max 10mb)");
				setTimeout(function () {
					setErrorPolicyFile(null);
				}, 2000)
			} else {
				setLoadingPolicyFile(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/publications/policy/files");
				formdata.append("file", selectedPolicyFile);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadDocumentRes = uploadDocument(formdata)

				uploadDocumentRes.then(res => {
					setLoadingPolicyFile(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorPolicyFile(error);
							setTimeout(function () {
								setErrorPolicyFile(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorPolicyFile(error);
							setTimeout(function () {
								setErrorPolicyFile(null);
							}, 2000)
						}
					} else {
						setErrorPolicyFile(null);
						setUploadingPolicyFilePercentage(0);
						setSuccessPolicyFile(`Policy File Uploaded!`);

						const file = res.data.data.secure_url;
						const file_type = res.data.data.format;
						const file_public_id = res.data.data.public_id;

						const editPolicyFileRes = editPolicyFile(cookie, {
							unique_id: uniqueId, file, file_type, file_public_id
						})

						editPolicyFileRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingPolicyFilePercentage(0);
									setLoadingPolicyFile(false);
									setErrorPolicyFile(error);
									setTimeout(function () {
										setErrorPolicyFile(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingPolicyFilePercentage(0);
									setLoadingPolicyFile(false);
									setErrorPolicyFile(error);
									setTimeout(function () {
										setErrorPolicyFile(null);
									}, 2000)
								}
							} else {
								setErrorPolicyFile(null);
								setUploadingPolicyFilePercentage(0);
								setSuccessPolicyFile(`Policy File edited successfully!`);

								setTimeout(function () {
									setLoadingPolicyFile(false);
									setSuccessPolicyFile(null);
									setRemovePolicyFileModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingPolicyFilePercentage(0);
							setLoadingPolicyFile(false);
						})
					}
				}).catch(err => {
					setUploadingPolicyFilePercentage(0);
					setLoadingPolicyFile(false);
				})
			}
		}
	};

	return {
		cookie, loadingPolicyFile, errorPolicyFile, successPolicyFile, handleUploadPolicyFile, uniqueId, setSelectedPolicyFile,
		setUniqueId, uploadingPolicyFilePercentage, selectedPolicyFile, removePolicyFileModal, setRemovePolicyFileModal
	};
};

const useDeletePolicy = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeletePolicy, setLoadingDeletePolicy] = useState(false);
	const [removeDeletePolicyModal, setRemoveDeletePolicyModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeletePolicy, setErrorDeletePolicy] = useState(null);
	const [successDeletePolicy, setSuccessDeletePolicy] = useState(null);

	const handleDeletePolicy = () => {

		if (!loadingDeletePolicy) {
			if (!uniqueId) {
				setErrorDeletePolicy(null);
				setSuccessDeletePolicy(null);
				setErrorDeletePolicy("Unique ID is required");
				setTimeout(function () {
					setErrorDeletePolicy(null);
				}, 2500)
			} else {
				setLoadingDeletePolicy(true);

				const deletePolicyRes = deletePolicy(cookie, {
					unique_id: uniqueId
				})

				deletePolicyRes.then(res => {
					setLoadingDeletePolicy(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeletePolicy(error);
							setTimeout(function () {
								setErrorDeletePolicy(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeletePolicy(error);
							setTimeout(function () {
								setErrorDeletePolicy(null);
							}, 2000)
						}
					} else {
						setErrorDeletePolicy(null);
						setSuccessDeletePolicy(`Policy deleted successfully!`);

						setTimeout(function () {
							setSuccessDeletePolicy(null);
							setRemoveDeletePolicyModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeletePolicy(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeletePolicy, removeDeletePolicyModal, errorDeletePolicy, successDeletePolicy, handleDeletePolicy,
		setRemoveDeletePolicyModal, setUniqueId
	};
};

export { useAddPolicy, useUpdatePolicyDetails, useUploadPolicyImage, useUploadPolicyFile, useDeletePolicy };
