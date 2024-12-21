import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { 
	addCourse, deleteCourse, editCourseDetails, editCourseImage, editCourseCertificateTemplate, editCourseEnrollmentDetails, 
	editCourseOtherDetails, toggleCourseActiveEnrollment
} from "../api/courses";
import { uploadFile } from "../api/clouder";

const useAddCourse = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddCourse, setLoadingAddCourse] = useState(false);
	const [removeAddCourseModal, setRemoveAddCourseModal] = useState(null);
	const [courseCategoryUniqueId, setCourseCategoryUniqueId] = useState("");
	const [courseTypeUniqueId, setCourseTypeUniqueId] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [currency, setCurrency] = useState("");
	const [amount, setAmount] = useState("");
	const [certificate, setCertificate] = useState("");
	const [selectedAddCourse, setSelectedAddCourse] = useState("");
	const [uploadingAddCoursePercentage, setUploadingAddCoursePercentage] = useState(0);

	const [errorAddCourse, setErrorAddCourse] = useState(null);
	const [successAddCourse, setSuccessAddCourse] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleCourseCategoryUniqueId = (e) => { e.preventDefault(); setCourseCategoryUniqueId(e.target.value); };
	const handleCourseTypeUniqueId = (e) => { e.preventDefault(); setCourseTypeUniqueId(e.target.value); };
	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleDescription = (contents) => { setDescription(contents); };
	const handleCurrency = (e) => { e.preventDefault(); setCurrency(e.target.value); };
	const handleAmount = (e) => { e.preventDefault(); setAmount(e.target.value); };
	const handleCertificate = (e) => { e.preventDefault(); setCertificate(e.target.value); };

	const handleAddCourse = (e) => {
		e.preventDefault();

		if (!loadingAddCourse) {
			if (!courseCategoryUniqueId) {
				setErrorAddCourse(null);
				setSuccessAddCourse(null);
				setErrorAddCourse("Course Category is required");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (!courseTypeUniqueId) {
				setErrorAddCourse("Course Type is required");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (!title) {
				setErrorAddCourse("Title is required");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorAddCourse("Title maximum characters - 200");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (description.length < 3) {
				setErrorAddCourse("Description is required | Min character - 3");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (description.length > 65535) {
				setErrorAddCourse("Invalid Description | Max length reached");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (!currency) {
				setErrorAddCourse("Currency is required");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (currency.length > 10) {
				setErrorAddCourse("Currency maximum characters - 10");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (!amount) {
				setErrorAddCourse("Amount is required");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (certificate.length > 100) {
				setErrorAddCourse("Certificate maximum characters - 100");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2500)
			} else if (selectedAddCourse.length > 0 && !allowed_extensions.includes(selectedAddCourse.type)) {
				setErrorAddCourse("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2000)
			} else if (selectedAddCourse.length > 0 && selectedAddCourse.size > maximum_file_size) {
				setErrorAddCourse("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddCourse(null);
				}, 2000)
			} else {
				setLoadingAddCourse(true);

				if (selectedAddCourse.length > 0) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/courses");
					formdata.append("file", selectedAddCourse);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);

					const uploadFileRes = uploadFile(formdata)

					uploadFileRes.then(res => {
						setLoadingAddCourse(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddCourse(error);
								setTimeout(function () {
									setErrorAddCourse(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddCourse(error);
								setTimeout(function () {
									setErrorAddCourse(null);
								}, 2000)
							}
						} else {
							setErrorAddCourse(null);
							setUploadingAddCoursePercentage(0);
							setSuccessAddCourse(`Course Image Uploaded!`);

							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;

							const addCourseRes = addCourse(cookie, {
								course_category_unique_id: courseCategoryUniqueId,
								course_type_unique_id: courseTypeUniqueId,
								title: title.trim(), 
								description: description, 
								currency: currency ? currency : undefined, 
								amount: parseFloat(amount), 
								certificate: certificate ? certificate.trim() : undefined, 
								image, 
								image_public_id
							})

							addCourseRes.then(res => {
								setLoadingAddCourse(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddCourse(error);
										setTimeout(function () {
											setErrorAddCourse(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddCourse(error);
										setTimeout(function () {
											setErrorAddCourse(null);
										}, 2000)
									}
								} else {
									setErrorAddCourse(null);
									setUploadingAddCoursePercentage(0);
									setSuccessAddCourse(`Course added successfully!`);

									setTimeout(function () {
										setSuccessAddCourse(null);
										setRemoveAddCourseModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddCoursePercentage(0);
								setLoadingAddCourse(false);
							})

						}
					}).catch(err => {
						setUploadingAddCoursePercentage(0);
						setLoadingAddCourse(false);
					})
				} else {
					const addCourseRes = addCourse(cookie, {
						course_category_unique_id: courseCategoryUniqueId,
						course_type_unique_id: courseTypeUniqueId,
						title: title.trim(),
						description: description,
						currency: currency ? currency : undefined,
						amount: parseFloat(amount),
						certificate: certificate ? certificate.trim() : undefined, 
						image: undefined, image_public_id: undefined
					})

					addCourseRes.then(res => {
						setLoadingAddCourse(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddCourse(error);
								setTimeout(function () {
									setErrorAddCourse(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddCourse(error);
								setTimeout(function () {
									setErrorAddCourse(null);
								}, 2000)
							}
						} else {
							setErrorAddCourse(null);
							setUploadingAddCoursePercentage(0);
							setSuccessAddCourse(`Course added successfully!`);

							setTimeout(function () {
								setSuccessAddCourse(null);
								setRemoveAddCourseModal(true);
							}, 2500)
						}
					}).catch(err => {
						setUploadingAddCoursePercentage(0);
						setLoadingAddCourse(false);
					})
				}
			}
		}
	};

	return {
		cookie, courseCategoryUniqueId, courseTypeUniqueId, title, description, currency, amount, certificate, loadingAddCourse, setRemoveAddCourseModal, errorAddCourse, successAddCourse, removeAddCourseModal, setSelectedAddCourse,
		handleAddCourse, handleCourseCategoryUniqueId, handleCourseTypeUniqueId, handleTitle, handleDescription, handleCurrency, handleAmount, handleCertificate, setCourseCategoryUniqueId, setCourseTypeUniqueId, setTitle, setDescription, 
		setCurrency, setAmount, setCertificate, uploadingAddCoursePercentage, selectedAddCourse,
	};
};

const useUpdateCourseDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateCourseDetails, setLoadingUpdateCourseDetails] = useState(false);
	const [removeUpdateCourseDetailsModal, setRemoveUpdateCourseDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [currency, setCurrency] = useState("");
	const [amount, setAmount] = useState("");
	const [certificate, setCertificate] = useState("");

	const [errorUpdateCourseDetails, setErrorUpdateCourseDetails] = useState(null);
	const [successUpdateCourseDetails, setSuccessUpdateCourseDetails] = useState(null);

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleDescription = (contents) => { setDescription(contents); };
	const handleCurrency = (e) => { e.preventDefault(); setCurrency(e.target.value); };
	const handleAmount = (e) => { e.preventDefault(); setAmount(e.target.value); };
	const handleCertificate = (e) => { e.preventDefault(); setCertificate(e.target.value); };

	const handleUpdateCourseDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateCourseDetails) {
			if (!uniqueId) {
				setErrorUpdateCourseDetails(null);
				setSuccessUpdateCourseDetails(null);
				setErrorUpdateCourseDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateCourseDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorUpdateCourseDetails("Title maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (description.length < 3) {
				setErrorUpdateCourseDetails("Description is required | Min character - 3");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (description.length > 65535) {
				setErrorUpdateCourseDetails("Invalid Description | Max length reached");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (!currency) {
				setErrorUpdateCourseDetails("Currency is required");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (currency.length > 10) {
				setErrorUpdateCourseDetails("Currency maximum characters - 10");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (!amount) {
				setErrorUpdateCourseDetails("Amount is required");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else if (certificate.length > 100) {
				setErrorUpdateCourseDetails("Certificate maximum characters - 100");
				setTimeout(function () {
					setErrorUpdateCourseDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateCourseDetails(true);

				const editCourseDetailsRes = editCourseDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					description: description,
					currency: currency ? currency : undefined,
					amount: parseFloat(amount),
					certificate: certificate ? certificate.trim() : undefined, 
				})

				editCourseDetailsRes.then(res => {
					setLoadingUpdateCourseDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCourseDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCourseDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCourseDetails(null);
						setSuccessUpdateCourseDetails(`Course details edited!`);

						setTimeout(function () {
							setSuccessUpdateCourseDetails(null);
							setRemoveUpdateCourseDetailsModal(true);
							// setUniqueId(null);
							// setTitle("");
							// setDescription("");
							// setCurrency("");
							// setAmount("");
							// setCertificate("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCourseDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCourseDetails, removeUpdateCourseDetailsModal, errorUpdateCourseDetails, successUpdateCourseDetails, handleUpdateCourseDetails,
		setRemoveUpdateCourseDetailsModal, setUniqueId, setTitle, setDescription, setCurrency, setAmount, setCertificate, title, description, currency, amount, certificate, 
		handleTitle, handleDescription, handleCurrency, handleAmount, handleCertificate
	};
};

const useUpdateCourseOtherDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateCourseOtherDetails, setLoadingUpdateCourseOtherDetails] = useState(false);
	const [removeUpdateCourseOtherDetailsModal, setRemoveUpdateCourseOtherDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [courseCategoryUniqueId, setCourseCategoryUniqueId] = useState("");
	const [courseTypeUniqueId, setCourseTypeUniqueId] = useState("");

	const [errorUpdateCourseOtherDetails, setErrorUpdateCourseOtherDetails] = useState(null);
	const [successUpdateCourseOtherDetails, setSuccessUpdateCourseOtherDetails] = useState(null);

	const handleCourseCategoryUniqueId = (e) => { e.preventDefault(); setCourseCategoryUniqueId(e.target.value); };
	const handleCourseTypeUniqueId = (e) => { e.preventDefault(); setCourseTypeUniqueId(e.target.value); };

	const handleUpdateCourseOtherDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateCourseOtherDetails) {
			if (!uniqueId) {
				setErrorUpdateCourseOtherDetails(null);
				setSuccessUpdateCourseOtherDetails(null);
				setErrorUpdateCourseOtherDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCourseOtherDetails(null);
				}, 2500)
			} else if (!courseCategoryUniqueId) {
				setErrorUpdateCourseOtherDetails("Course Category is required");
				setTimeout(function () {
					setErrorUpdateCourseOtherDetails(null);
				}, 2500)
			} else if (!courseTypeUniqueId) {
				setErrorUpdateCourseOtherDetails("Course Type is required");
				setTimeout(function () {
					setErrorUpdateCourseOtherDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateCourseOtherDetails(true);

				const editCourseOtherDetailsRes = editCourseOtherDetails(cookie, {
					unique_id: uniqueId,
					course_category_unique_id: courseCategoryUniqueId,
					course_type_unique_id: courseTypeUniqueId,
				})

				editCourseOtherDetailsRes.then(res => {
					setLoadingUpdateCourseOtherDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCourseOtherDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseOtherDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCourseOtherDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseOtherDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCourseOtherDetails(null);
						setSuccessUpdateCourseOtherDetails(`Course other details edited!`);

						setTimeout(function () {
							setSuccessUpdateCourseOtherDetails(null);
							setRemoveUpdateCourseOtherDetailsModal(true);
							// setUniqueId(null);
							// setCourseCategoryUniqueId("");
							// setCourseTypeUniqueId("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCourseOtherDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCourseOtherDetails, removeUpdateCourseOtherDetailsModal, errorUpdateCourseOtherDetails, successUpdateCourseOtherDetails, handleUpdateCourseOtherDetails,
		setRemoveUpdateCourseOtherDetailsModal, setUniqueId, setCourseCategoryUniqueId, setCourseTypeUniqueId, courseCategoryUniqueId, courseTypeUniqueId, 
		handleCourseCategoryUniqueId, handleCourseTypeUniqueId
	};
};

const useUpdateCourseEnrollmentDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateCourseEnrollmentDetails, setLoadingUpdateCourseEnrollmentDetails] = useState(false);
	const [removeUpdateCourseEnrollmentDetailsModal, setRemoveUpdateCourseEnrollmentDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [enrollmentDetails, setEnrollmentDetails] = useState("");

	const [errorUpdateCourseEnrollmentDetails, setErrorUpdateCourseEnrollmentDetails] = useState(null);
	const [successUpdateCourseEnrollmentDetails, setSuccessUpdateCourseEnrollmentDetails] = useState(null);

	const handleEnrollmentDetails = (contents) => { setEnrollmentDetails(contents); };

	const handleUpdateCourseEnrollmentDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateCourseEnrollmentDetails) {
			if (!uniqueId) {
				setErrorUpdateCourseEnrollmentDetails(null);
				setSuccessUpdateCourseEnrollmentDetails(null);
				setErrorUpdateCourseEnrollmentDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCourseEnrollmentDetails(null);
				}, 2500)
			} else if (enrollmentDetails.length < 3) {
				setErrorUpdateCourseEnrollmentDetails("Enrollment Details is required | Min character - 3");
				setTimeout(function () {
					setErrorUpdateCourseEnrollmentDetails(null);
				}, 2500)
			} else if (enrollmentDetails.length > 65535) {
				setErrorUpdateCourseEnrollmentDetails("Invalid Enrollment Details | Max length reached");
				setTimeout(function () {
					setErrorUpdateCourseEnrollmentDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateCourseEnrollmentDetails(true);

				const editCourseEnrollmentDetailsRes = editCourseEnrollmentDetails(cookie, {
					unique_id: uniqueId,
					enrollment_details: enrollmentDetails,
				})

				editCourseEnrollmentDetailsRes.then(res => {
					setLoadingUpdateCourseEnrollmentDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCourseEnrollmentDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseEnrollmentDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCourseEnrollmentDetails(error);
							setTimeout(function () {
								setErrorUpdateCourseEnrollmentDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCourseEnrollmentDetails(null);
						setSuccessUpdateCourseEnrollmentDetails(`Course enrollment details edited!`);

						setTimeout(function () {
							setSuccessUpdateCourseEnrollmentDetails(null);
							setRemoveUpdateCourseEnrollmentDetailsModal(true);
							// setUniqueId(null);
							// setEnrollmentDetails("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCourseEnrollmentDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCourseEnrollmentDetails, removeUpdateCourseEnrollmentDetailsModal, errorUpdateCourseEnrollmentDetails, successUpdateCourseEnrollmentDetails, handleUpdateCourseEnrollmentDetails,
		setRemoveUpdateCourseEnrollmentDetailsModal, setUniqueId, setEnrollmentDetails, enrollmentDetails, 
		handleEnrollmentDetails, 
	};
};

const useUpdateCourseCertificateTemplate = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateCourseCertificateTemplate, setLoadingUpdateCourseCertificateTemplate] = useState(false);
	const [removeUpdateCourseCertificateTemplateModal, setRemoveUpdateCourseCertificateTemplateModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [certificateTemplate, setCertificateTemplate] = useState("");

	const [errorUpdateCourseCertificateTemplate, setErrorUpdateCourseCertificateTemplate] = useState(null);
	const [successUpdateCourseCertificateTemplate, setSuccessUpdateCourseCertificateTemplate] = useState(null);

	const handleCertificateTemplate = (contents) => { setCertificateTemplate(contents); };

	const handleUpdateCourseCertificateTemplate = (e) => {
		e.preventDefault();

		if (!loadingUpdateCourseCertificateTemplate) {
			if (!uniqueId) {
				setErrorUpdateCourseCertificateTemplate(null);
				setSuccessUpdateCourseCertificateTemplate(null);
				setErrorUpdateCourseCertificateTemplate("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCourseCertificateTemplate(null);
				}, 2500)
			} else if (certificateTemplate.length < 3) {
				setErrorUpdateCourseCertificateTemplate("Certificate Template is required | Min character - 3");
				setTimeout(function () {
					setErrorUpdateCourseCertificateTemplate(null);
				}, 2500)
			} else if (certificateTemplate.length > 65535) {
				setErrorUpdateCourseCertificateTemplate("Invalid Certificate Template | Max length reached");
				setTimeout(function () {
					setErrorUpdateCourseCertificateTemplate(null);
				}, 2500)
			} else {
				setLoadingUpdateCourseCertificateTemplate(true);

				const editCourseCertificateTemplateRes = editCourseCertificateTemplate(cookie, {
					unique_id: uniqueId,
					certificate_template: certificateTemplate,
				})

				editCourseCertificateTemplateRes.then(res => {
					setLoadingUpdateCourseCertificateTemplate(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCourseCertificateTemplate(error);
							setTimeout(function () {
								setErrorUpdateCourseCertificateTemplate(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCourseCertificateTemplate(error);
							setTimeout(function () {
								setErrorUpdateCourseCertificateTemplate(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCourseCertificateTemplate(null);
						setSuccessUpdateCourseCertificateTemplate(`Course certificate template edited!`);

						setTimeout(function () {
							setSuccessUpdateCourseCertificateTemplate(null);
							setRemoveUpdateCourseCertificateTemplateModal(true);
							// setUniqueId(null);
							// setCertificateTemplate("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCourseCertificateTemplate(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCourseCertificateTemplate, removeUpdateCourseCertificateTemplateModal, errorUpdateCourseCertificateTemplate, successUpdateCourseCertificateTemplate, handleUpdateCourseCertificateTemplate,
		setRemoveUpdateCourseCertificateTemplateModal, setUniqueId, setCertificateTemplate, certificateTemplate, 
		handleCertificateTemplate, 
	};
};

const useUploadCourseImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingCourseImage, setLoadingCourseImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeCourseImageModal, setRemoveCourseImageModal] = useState(null);
	const [selectedCourseImage, setSelectedCourseImage] = useState("");
	const [uploadingCourseImagePercentage, setUploadingCourseImagePercentage] = useState(0);

	const [errorCourseImage, setErrorCourseImage] = useState(null);
	const [successCourseImage, setSuccessCourseImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadCourseImage = (e) => {
		e.preventDefault();

		if (!loadingCourseImage) {
			if (!uniqueId) {
				setErrorCourseImage(null);
				setSuccessCourseImage(null);
				setErrorCourseImage("Unique ID is required");
				setTimeout(function () {
					setErrorCourseImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedCourseImage.type)) {
				setErrorCourseImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorCourseImage(null);
				}, 2000)
			} else if (selectedCourseImage.size > maximum_file_size) {
				setErrorCourseImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorCourseImage(null);
				}, 2000)
			} else {
				setLoadingCourseImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/courses");
				formdata.append("file", selectedCourseImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingCourseImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCourseImage(error);
							setTimeout(function () {
								setErrorCourseImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCourseImage(error);
							setTimeout(function () {
								setErrorCourseImage(null);
							}, 2000)
						}
					} else {
						setErrorCourseImage(null);
						setUploadingCourseImagePercentage(0);
						setSuccessCourseImage(`Course Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editCourseImageRes = editCourseImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editCourseImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingCourseImagePercentage(0);
									setLoadingCourseImage(false);
									setErrorCourseImage(error);
									setTimeout(function () {
										setErrorCourseImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingCourseImagePercentage(0);
									setLoadingCourseImage(false);
									setErrorCourseImage(error);
									setTimeout(function () {
										setErrorCourseImage(null);
									}, 2000)
								}
							} else {
								setErrorCourseImage(null);
								setUploadingCourseImagePercentage(0);
								setSuccessCourseImage(`Course Image edited successfully!`);

								setTimeout(function () {
									setLoadingCourseImage(false);
									setSuccessCourseImage(null);
									setRemoveCourseImageModal(true);
									// setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingCourseImagePercentage(0);
							setLoadingCourseImage(false);
						})
					}
				}).catch(err => {
					setUploadingCourseImagePercentage(0);
					setLoadingCourseImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingCourseImage, errorCourseImage, successCourseImage, handleUploadCourseImage, uniqueId, setSelectedCourseImage,
		setUniqueId, uploadingCourseImagePercentage, selectedCourseImage, removeCourseImageModal, setRemoveCourseImageModal
	};
};

const useToggleCourseActiveEnrollment = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingToggleCourseActiveEnrollment, setLoadingToggleCourseActiveEnrollment] = useState(false);
	const [removeToggleCourseActiveEnrollmentModal, setRemoveToggleCourseActiveEnrollmentModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorToggleCourseActiveEnrollment, setErrorToggleCourseActiveEnrollment] = useState(null);
	const [successToggleCourseActiveEnrollment, setSuccessToggleCourseActiveEnrollment] = useState(null);

	const handleToggleCourseActiveEnrollment = () => {

		if (!loadingToggleCourseActiveEnrollment) {
			if (!uniqueId) {
				setErrorToggleCourseActiveEnrollment(null);
				setSuccessToggleCourseActiveEnrollment(null);
				setErrorToggleCourseActiveEnrollment("Unique ID is required");
				setTimeout(function () {
					setErrorToggleCourseActiveEnrollment(null);
				}, 2500)
			} else {
				setLoadingToggleCourseActiveEnrollment(true);

				const toggleCourseActiveEnrollmentRes = toggleCourseActiveEnrollment(cookie, {
					unique_id: uniqueId
				})

				toggleCourseActiveEnrollmentRes.then(res => {
					setLoadingToggleCourseActiveEnrollment(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorToggleCourseActiveEnrollment(error);
							setTimeout(function () {
								setErrorToggleCourseActiveEnrollment(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorToggleCourseActiveEnrollment(error);
							setTimeout(function () {
								setErrorToggleCourseActiveEnrollment(null);
							}, 2000)
						}
					} else {
						setErrorToggleCourseActiveEnrollment(null);
						setSuccessToggleCourseActiveEnrollment(`${res.data.message}`);

						setTimeout(function () {
							setSuccessToggleCourseActiveEnrollment(null);
							setRemoveToggleCourseActiveEnrollmentModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingToggleCourseActiveEnrollment(false);
				})

			}
		}
	};

	return {
		cookie, loadingToggleCourseActiveEnrollment, removeToggleCourseActiveEnrollmentModal, errorToggleCourseActiveEnrollment, successToggleCourseActiveEnrollment, handleToggleCourseActiveEnrollment,
		setRemoveToggleCourseActiveEnrollmentModal, setUniqueId
	};
};

const useDeleteCourse = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteCourse, setLoadingDeleteCourse] = useState(false);
	const [removeDeleteCourseModal, setRemoveDeleteCourseModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteCourse, setErrorDeleteCourse] = useState(null);
	const [successDeleteCourse, setSuccessDeleteCourse] = useState(null);

	const handleDeleteCourse = () => {

		if (!loadingDeleteCourse) {
			if (!uniqueId) {
				setErrorDeleteCourse(null);
				setSuccessDeleteCourse(null);
				setErrorDeleteCourse("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteCourse(null);
				}, 2500)
			} else {
				setLoadingDeleteCourse(true);

				const deleteCourseRes = deleteCourse(cookie, {
					unique_id: uniqueId
				})

				deleteCourseRes.then(res => {
					setLoadingDeleteCourse(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteCourse(error);
							setTimeout(function () {
								setErrorDeleteCourse(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteCourse(error);
							setTimeout(function () {
								setErrorDeleteCourse(null);
							}, 2000)
						}
					} else {
						setErrorDeleteCourse(null);
						setSuccessDeleteCourse(`Course deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteCourse(null);
							setRemoveDeleteCourseModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteCourse(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteCourse, removeDeleteCourseModal, errorDeleteCourse, successDeleteCourse, handleDeleteCourse,
		setRemoveDeleteCourseModal, setUniqueId
	};
};

export { useAddCourse, useUpdateCourseDetails, useUpdateCourseOtherDetails, useUpdateCourseEnrollmentDetails, useUpdateCourseCertificateTemplate, useUploadCourseImage, useToggleCourseActiveEnrollment, useDeleteCourse };
