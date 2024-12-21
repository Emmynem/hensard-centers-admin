import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { deleteGalleryImage, uploadGalleryImages } from "../api/galleries";
import { uploadFiles } from "../api/clouder";

const useUploadGalleryImages = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingGalleryImages, setLoadingGalleryImages] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeGalleryImagesModal, setRemoveGalleryImagesModal] = useState(null);
	const [selectedGalleryImages, setSelectedGalleryImages] = useState([]);
	const [uploadingGalleryImagesPercentage, setUploadingGalleryImagesPercentage] = useState(0);

	const [errorGalleryImages, setErrorGalleryImages] = useState(null);
	const [successGalleryImages, setSuccessGalleryImages] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadGalleryImages = (e) => {
		e.preventDefault();

		if (!loadingGalleryImages) {
			const files = document.getElementById('galleryImages').files;
			
			let fileSizeFlag = 0;
			let fileTypeFlag = 0;
			for (let i = 0; i < files.length; i++) {
				fileSizeFlag = files[i].size > maximum_file_size ? 1 : fileSizeFlag;
				fileTypeFlag = !allowed_extensions.includes(files[i].type) ? 1 : fileTypeFlag;
			}

			if (files.length > 10) {
				setErrorGalleryImages(null);
				setSuccessGalleryImages(null);
				setErrorGalleryImages("Max 10 files");
				setTimeout(function () {
					setErrorGalleryImages(null);
				}, 2000)
			} else if (fileTypeFlag) {
				setErrorGalleryImages("Some images have invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorGalleryImages(null);
				}, 2000)
			} else if (fileSizeFlag) {
				setErrorGalleryImages(null);
				setSuccessGalleryImages(null);
				setErrorGalleryImages("Some images are too large (max 10mb)");
				setTimeout(function () {
					setErrorGalleryImages(null);
				}, 2000)
			} else {
				setLoadingGalleryImages(true);
	
				const formdata = new FormData();
				formdata.append("file_path", "centers/media/galleries");
				for (let i = 0; i < files.length; i++) {
					formdata.append('files', files[i]);
				}
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);
	
				const uploadFilesRes = uploadFiles(formdata)
	
				uploadFilesRes.then(res => {
					setLoadingGalleryImages(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorGalleryImages(error);
							setTimeout(function () {
								setErrorGalleryImages(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorGalleryImages(error);
							setTimeout(function () {
								setErrorGalleryImages(null);
							}, 2000)
						}
					} else {
						setErrorGalleryImages(null);
						setUploadingGalleryImagesPercentage(0);
						setSuccessGalleryImages(`Gallery Images Uploaded!`);
	
						const uploadGalleryImagesRes = uploadGalleryImages(cookie, {
							galleries: res.data.data
						})
	
						uploadGalleryImagesRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingGalleryImagesPercentage(0);
									setLoadingGalleryImages(false);
									setErrorGalleryImages(error);
									setTimeout(function () {
										setErrorGalleryImages(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingGalleryImagesPercentage(0);
									setLoadingGalleryImages(false);
									setErrorGalleryImages(error);
									setTimeout(function () {
										setErrorGalleryImages(null);
									}, 2000)
								}
							} else {
								setErrorGalleryImages(null);
								setUploadingGalleryImagesPercentage(0);
								setSuccessGalleryImages(`Gallery Images saved successfully!`);
	
								setTimeout(function () {
									setLoadingGalleryImages(false);
									setSuccessGalleryImages(null);
									setRemoveGalleryImagesModal(true);
									// setUniqueId(null);
									document.getElementById("galleryImages").value = "";
								}, 3000)
							}
						}).catch(err => {
							setUploadingGalleryImagesPercentage(0);
							setLoadingGalleryImages(false);
						})
					}
				}).catch(err => {
					setUploadingGalleryImagesPercentage(0);
					setLoadingGalleryImages(false);
				})
			}
		}
	};

	return {
		cookie, loadingGalleryImages, errorGalleryImages, successGalleryImages, handleUploadGalleryImages, uniqueId, setSelectedGalleryImages,
		setUniqueId, uploadingGalleryImagesPercentage, selectedGalleryImages, removeGalleryImagesModal, setRemoveGalleryImagesModal
	};
};

const useDeleteGalleryImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteGalleryImage, setLoadingDeleteGalleryImage] = useState(false);
	const [removeDeleteGalleryImageModal, setRemoveDeleteGalleryImageModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteGalleryImage, setErrorDeleteGalleryImage] = useState(null);
	const [successDeleteGalleryImage, setSuccessDeleteGalleryImage] = useState(null);

	const handleDeleteGalleryImage = () => {

		if (!loadingDeleteGalleryImage) {
			if (!uniqueId) {
				setErrorDeleteGalleryImage(null);
				setSuccessDeleteGalleryImage(null);
				setErrorDeleteGalleryImage("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteGalleryImage(null);
				}, 2500)
			} else {
				setLoadingDeleteGalleryImage(true);

				const deleteGalleryImageRes = deleteGalleryImage(cookie, {
					unique_id: uniqueId
				})

				deleteGalleryImageRes.then(res => {
					setLoadingDeleteGalleryImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteGalleryImage(error);
							setTimeout(function () {
								setErrorDeleteGalleryImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteGalleryImage(error);
							setTimeout(function () {
								setErrorDeleteGalleryImage(null);
							}, 2000)
						}
					} else {
						setErrorDeleteGalleryImage(null);
						setSuccessDeleteGalleryImage(`Gallery Image deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteGalleryImage(null);
							setRemoveDeleteGalleryImageModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteGalleryImage(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteGalleryImage, removeDeleteGalleryImageModal, errorDeleteGalleryImage, successDeleteGalleryImage, handleDeleteGalleryImage,
		setRemoveDeleteGalleryImageModal, setUniqueId
	};
};

export { useUploadGalleryImages, useDeleteGalleryImage };
