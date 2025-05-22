import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addTeam, deleteTeam, editTeamDetails, editTeamImage } from "../api/teams";
import { uploadFile } from "../api/clouder";

const useAddTeam = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddTeam, setLoadingAddTeam] = useState(false);
	const [removeAddTeamModal, setRemoveAddTeamModal] = useState(null);
	const [title, setTitle] = useState("");
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [altEmail, setAltEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [altPhoneNumber, setAltPhoneNumber] = useState("");
	const [qualifications, setQualifications] = useState("");
	const [profileLink, setProfileLink] = useState("");
	const [details, setDetails] = useState("");
	const [selectedAddTeam, setSelectedAddTeam] = useState("");
	const [uploadingAddTeamPercentage, setUploadingAddTeamPercentage] = useState(0);

	const [errorAddTeam, setErrorAddTeam] = useState(null);
	const [successAddTeam, setSuccessAddTeam] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const test_all_regex = (data, regex) => {
		if (!data) {
			return false;
		}

		const valid = regex.test(data);
		if (!valid) {
			return false;
		}

		return true;
	};

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleFullname = (e) => { e.preventDefault(); setFullname(e.target.value); };
	const handleEmail = (e) => { e.preventDefault(); setEmail(e.target.value); };
	const handleAltEmail = (e) => { e.preventDefault(); setAltEmail(e.target.value); };
	const handlePhoneNumber = (e) => { e.preventDefault(); setPhoneNumber(e.target.value); };
	const handleAltPhoneNumber = (e) => { e.preventDefault(); setAltPhoneNumber(e.target.value); };
	const handleQualifications = (e) => { e.preventDefault(); setQualifications(e.target.value); };
	const handleProfileLink = (e) => { e.preventDefault(); setProfileLink(e.target.value); };
	const handleDetails = (e) => { e.preventDefault(); setDetails(e.target.value); };

	const handleAddTeam = (e) => {
		e.preventDefault();

		if (!loadingAddTeam) {
			if (!title) {
				setErrorAddTeam(null);
				setSuccessAddTeam(null);
				setErrorAddTeam("Title is required");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorAddTeam("Title maximum characters - 200");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (!fullname) {
				setErrorAddTeam("Fullname is required");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (fullname.length > 300) {
				setErrorAddTeam("Fullname maximum characters - 300");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (phoneNumber && !test_all_regex(phoneNumber, config.PHONE_NUMBER_REGEX)) {
				setErrorAddTeam("Invalid phone number, include country code");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (altPhoneNumber && !test_all_regex(altPhoneNumber, config.PHONE_NUMBER_REGEX)) {
				setErrorAddTeam("Invalid phone number, include country code");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (qualifications && qualifications.length > 500) {
				setErrorAddTeam("Qualifications maximum characters - 500");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (profileLink && profileLink.length > 500) {
				setErrorAddTeam("Profile Link maximum characters - 500");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (details && details.length > 5000) {
				setErrorAddTeam("Details maximum characters - 5000");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2500)
			} else if (selectedAddTeam && !allowed_extensions.includes(selectedAddTeam.type)) {
				setErrorAddTeam("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2000)
			} else if (selectedAddTeam && selectedAddTeam.size > maximum_file_size) {
				setErrorAddTeam("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddTeam(null);
				}, 2000)
			} else {
				setLoadingAddTeam(true);

				if (selectedAddTeam) {
					const formdata = new FormData();
					formdata.append("file_path", "centers/teams");
					formdata.append("file", selectedAddTeam);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);
	
					const uploadFileRes = uploadFile(formdata)
	
					uploadFileRes.then(res => {
						setLoadingAddTeam(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddTeam(error);
								setTimeout(function () {
									setErrorAddTeam(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddTeam(error);
								setTimeout(function () {
									setErrorAddTeam(null);
								}, 2000)
							}
						} else {
							setErrorAddTeam(null);
							setUploadingAddTeamPercentage(0);
							setSuccessAddTeam(`Team Image Uploaded!`);
	
							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;
	
							const addTeamRes = addTeam(cookie, {
								title: title.trim(),
								fullname: fullname.trim(),
								email: email ? email.trim() : undefined,
								alt_email: altEmail ? altEmail.trim() : undefined,
								phone_number: phoneNumber ? phoneNumber.trim() : undefined,
								alt_phone_number: altPhoneNumber ? altPhoneNumber.trim() : undefined,
								qualifications: qualifications ? qualifications.trim() : undefined,
								profile_link: profileLink ? profileLink.trim() : undefined,
								details: details ? details.trim() : undefined,
								image, image_public_id
							})
	
							addTeamRes.then(res => {
								setLoadingAddTeam(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddTeam(error);
										setTimeout(function () {
											setErrorAddTeam(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddTeam(error);
										setTimeout(function () {
											setErrorAddTeam(null);
										}, 2000)
									}
								} else {
									setErrorAddTeam(null);
									setUploadingAddTeamPercentage(0);
									setSuccessAddTeam(`Team added successfully!`);
	
									setTimeout(function () {
										setSuccessAddTeam(null);
										setRemoveAddTeamModal(true);
									}, 2500)
								}
							}).catch(err => {
								setUploadingAddTeamPercentage(0);
								setLoadingAddTeam(false);
							})
	
						}
					}).catch(err => {
						setUploadingAddTeamPercentage(0);
						setLoadingAddTeam(false);
					})
				} else {
					const addTeamRes = addTeam(cookie, {
						title: title.trim(),
						fullname: fullname.trim(),
						email: email ? email.trim() : undefined,
						alt_email: altEmail ? altEmail.trim() : undefined,
						phone_number: phoneNumber ? phoneNumber.trim() : undefined,
						alt_phone_number: altPhoneNumber ? altPhoneNumber.trim() : undefined,
						qualifications: qualifications ? qualifications.trim() : undefined,
						profile_link: profileLink ? profileLink.trim() : undefined,
						details: details ? details.trim() : undefined,
						image: undefined, image_public_id: undefined
					})

					addTeamRes.then(res => {
						setLoadingAddTeam(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddTeam(error);
								setTimeout(function () {
									setErrorAddTeam(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddTeam(error);
								setTimeout(function () {
									setErrorAddTeam(null);
								}, 2000)
							}
						} else {
							setErrorAddTeam(null);
							setSuccessAddTeam(`Team added successfully!`);

							setTimeout(function () {
								setSuccessAddTeam(null);
								setRemoveAddTeamModal(true);
							}, 2500)
						}
					}).catch(err => {
						setLoadingAddTeam(false);
					})
				}
			}
		}
	};

	return {
		cookie, title, fullname, email, altEmail, phoneNumber, altPhoneNumber, qualifications, profileLink, details, loadingAddTeam, setRemoveAddTeamModal, 
		errorAddTeam, successAddTeam, removeAddTeamModal, setSelectedAddTeam, handleAddTeam, handleTitle, handleFullname, handleEmail, handleAltEmail, handlePhoneNumber, 
		handleAltPhoneNumber, handleQualifications, handleProfileLink, handleDetails, setTitle, setFullname, setEmail, setAltEmail, setPhoneNumber, setAltPhoneNumber, 
		setQualifications, setProfileLink, setDetails, uploadingAddTeamPercentage, selectedAddTeam,
	};
};

const useUpdateTeamDetails = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateTeamDetails, setLoadingUpdateTeamDetails] = useState(false);
	const [removeUpdateTeamDetailsModal, setRemoveUpdateTeamDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [title, setTitle] = useState("");
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [altEmail, setAltEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [altPhoneNumber, setAltPhoneNumber] = useState("");
	const [qualifications, setQualifications] = useState("");
	const [profileLink, setProfileLink] = useState("");
	const [details, setDetails] = useState("");

	const [errorUpdateTeamDetails, setErrorUpdateTeamDetails] = useState(null);
	const [successUpdateTeamDetails, setSuccessUpdateTeamDetails] = useState(null);

	const test_all_regex = (data, regex) => {
		if (!data) {
			return false;
		}

		const valid = regex.test(data);
		if (!valid) {
			return false;
		}

		return true;
	};

	const handleTitle = (e) => { e.preventDefault(); setTitle(e.target.value); };
	const handleFullname = (e) => { e.preventDefault(); setFullname(e.target.value); };
	const handleEmail = (e) => { e.preventDefault(); setEmail(e.target.value); };
	const handleAltEmail = (e) => { e.preventDefault(); setAltEmail(e.target.value); };
	const handlePhoneNumber = (e) => { e.preventDefault(); setPhoneNumber(e.target.value); };
	const handleAltPhoneNumber = (e) => { e.preventDefault(); setAltPhoneNumber(e.target.value); };
	const handleQualifications = (e) => { e.preventDefault(); setQualifications(e.target.value); };
	const handleProfileLink = (e) => { e.preventDefault(); setProfileLink(e.target.value); };
	const handleDetails = (e) => { e.preventDefault(); setDetails(e.target.value); };

	const handleUpdateTeamDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateTeamDetails) {
			if (!uniqueId) {
				setErrorUpdateTeamDetails(null);
				setSuccessUpdateTeamDetails(null);
				setErrorUpdateTeamDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (!title) {
				setErrorUpdateTeamDetails("Title is required");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (title.length > 200) {
				setErrorUpdateTeamDetails("Title maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (!fullname) {
				setErrorUpdateTeamDetails("Fullname is required");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (fullname.length > 300) {
				setErrorUpdateTeamDetails("Fullname maximum characters - 300");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (phoneNumber && !test_all_regex(phoneNumber, config.PHONE_NUMBER_REGEX)) {
				setErrorUpdateTeamDetails("Invalid phone number, include country code");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (altPhoneNumber && !test_all_regex(altPhoneNumber, config.PHONE_NUMBER_REGEX)) {
				setErrorUpdateTeamDetails("Invalid phone number, include country code");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (qualifications && qualifications.length > 500) {
				setErrorUpdateTeamDetails("Qualifications maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (profileLink && profileLink.length > 500) {
				setErrorUpdateTeamDetails("Profile Link maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else if (details && details.length > 5000) {
				setErrorUpdateTeamDetails("Details maximum characters - 5000");
				setTimeout(function () {
					setErrorUpdateTeamDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateTeamDetails(true);

				const editTeamDetailsRes = editTeamDetails(cookie, {
					unique_id: uniqueId,
					title: title.trim(),
					fullname: fullname.trim(),
					email: email ? email.trim() : undefined,
					alt_email: altEmail ? altEmail.trim() : undefined,
					phone_number: phoneNumber ? phoneNumber.trim() : undefined,
					alt_phone_number: altPhoneNumber ? altPhoneNumber.trim() : undefined,
					qualifications: qualifications ? qualifications.trim() : undefined,
					profile_link: profileLink ? profileLink.trim() : undefined,
					details: details ? details.trim() : undefined,
				})

				editTeamDetailsRes.then(res => {
					setLoadingUpdateTeamDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateTeamDetails(error);
							setTimeout(function () {
								setErrorUpdateTeamDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateTeamDetails(error);
							setTimeout(function () {
								setErrorUpdateTeamDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateTeamDetails(null);
						setSuccessUpdateTeamDetails(`Team details edited!`);

						setTimeout(function () {
							setSuccessUpdateTeamDetails(null);
							setRemoveUpdateTeamDetailsModal(true);
							setUniqueId(null);
							setTitle("");
							setFullname("");
							setEmail("");
							setAltEmail("");
							setPhoneNumber("");
							setAltPhoneNumber("");
							setQualifications("");
							setProfileLink("");
							setDetails("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateTeamDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateTeamDetails, removeUpdateTeamDetailsModal, errorUpdateTeamDetails, successUpdateTeamDetails, handleUpdateTeamDetails,
		setRemoveUpdateTeamDetailsModal, setUniqueId, setTitle, setFullname, setEmail, setAltEmail, setPhoneNumber, setAltPhoneNumber, setQualifications, 
		setProfileLink, setDetails, title, fullname, email, altEmail, phoneNumber, altPhoneNumber, qualifications, profileLink, details, handleTitle, 
		handleFullname, handleEmail, handleAltEmail, handlePhoneNumber, handleAltPhoneNumber, handleQualifications, handleProfileLink, handleDetails
	};
};

const useUploadTeamImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingTeamImage, setLoadingTeamImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeTeamImageModal, setRemoveTeamImageModal] = useState(null);
	const [selectedTeamImage, setSelectedTeamImage] = useState("");
	const [uploadingTeamImagePercentage, setUploadingTeamImagePercentage] = useState(0);

	const [errorTeamImage, setErrorTeamImage] = useState(null);
	const [successTeamImage, setSuccessTeamImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadTeamImage = (e) => {
		e.preventDefault();

		if (!loadingTeamImage) {
			if (!uniqueId) {
				setErrorTeamImage(null);
				setSuccessTeamImage(null);
				setErrorTeamImage("Unique ID is required");
				setTimeout(function () {
					setErrorTeamImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedTeamImage.type)) {
				setErrorTeamImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorTeamImage(null);
				}, 2000)
			} else if (selectedTeamImage.size > maximum_file_size) {
				setErrorTeamImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorTeamImage(null);
				}, 2000)
			} else {
				setLoadingTeamImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/teams");
				formdata.append("file", selectedTeamImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingTeamImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorTeamImage(error);
							setTimeout(function () {
								setErrorTeamImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorTeamImage(error);
							setTimeout(function () {
								setErrorTeamImage(null);
							}, 2000)
						}
					} else {
						setErrorTeamImage(null);
						setUploadingTeamImagePercentage(0);
						setSuccessTeamImage(`Team Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editTeamImageRes = editTeamImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editTeamImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingTeamImagePercentage(0);
									setLoadingTeamImage(false);
									setErrorTeamImage(error);
									setTimeout(function () {
										setErrorTeamImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingTeamImagePercentage(0);
									setLoadingTeamImage(false);
									setErrorTeamImage(error);
									setTimeout(function () {
										setErrorTeamImage(null);
									}, 2000)
								}
							} else {
								setErrorTeamImage(null);
								setUploadingTeamImagePercentage(0);
								setSuccessTeamImage(`Team Image edited successfully!`);

								setTimeout(function () {
									setLoadingTeamImage(false);
									setSuccessTeamImage(null);
									setRemoveTeamImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingTeamImagePercentage(0);
							setLoadingTeamImage(false);
						})
					}
				}).catch(err => {
					setUploadingTeamImagePercentage(0);
					setLoadingTeamImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingTeamImage, errorTeamImage, successTeamImage, handleUploadTeamImage, uniqueId, setSelectedTeamImage,
		setUniqueId, uploadingTeamImagePercentage, selectedTeamImage, removeTeamImageModal, setRemoveTeamImageModal
	};
};

const useDeleteTeam = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteTeam, setLoadingDeleteTeam] = useState(false);
	const [removeDeleteTeamModal, setRemoveDeleteTeamModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteTeam, setErrorDeleteTeam] = useState(null);
	const [successDeleteTeam, setSuccessDeleteTeam] = useState(null);

	const handleDeleteTeam = () => {

		if (!loadingDeleteTeam) {
			if (!uniqueId) {
				setErrorDeleteTeam(null);
				setSuccessDeleteTeam(null);
				setErrorDeleteTeam("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteTeam(null);
				}, 2500)
			} else {
				setLoadingDeleteTeam(true);

				const deleteTeamRes = deleteTeam(cookie, {
					unique_id: uniqueId
				})

				deleteTeamRes.then(res => {
					setLoadingDeleteTeam(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteTeam(error);
							setTimeout(function () {
								setErrorDeleteTeam(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteTeam(error);
							setTimeout(function () {
								setErrorDeleteTeam(null);
							}, 2000)
						}
					} else {
						setErrorDeleteTeam(null);
						setSuccessDeleteTeam(`Team deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteTeam(null);
							setRemoveDeleteTeamModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteTeam(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteTeam, removeDeleteTeamModal, errorDeleteTeam, successDeleteTeam, handleDeleteTeam,
		setRemoveDeleteTeamModal, setUniqueId
	};
};

export { useAddTeam, useUpdateTeamDetails, useUploadTeamImage, useDeleteTeam };
