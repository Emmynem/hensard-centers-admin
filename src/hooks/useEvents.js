import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import {
	addEvent, deleteEvent, editEventImage, editEventDescription, editEventDuration, editEventName, editEventOthers, editEventTimestamp
} from "../api/events";
import { uploadFile } from "../api/clouder";

const useAddEvent = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingAddEvent, setLoadingAddEvent] = useState(false);
	const [removeAddEventModal, setRemoveAddEventModal] = useState(null);
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [selectedAddEvent, setSelectedAddEvent] = useState("");
	const [uploadingAddEventPercentage, setUploadingAddEventPercentage] = useState(0);

	const [errorAddEvent, setErrorAddEvent] = useState(null);
	const [successAddEvent, setSuccessAddEvent] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };
	const handleType = (e) => { e.preventDefault(); setType(e.target.value); };
	const handleLocation = (e) => { e.preventDefault(); setLocation(e.target.value); };
	const handleStart = (e) => { e.preventDefault(); setStart(e.target.value); };
	const handleEnd = (e) => { e.preventDefault(); setEnd(e.target.value); };
	const handleDescription = (contents) => { setDescription(contents); };

	const return_date = (date) => {
		if (date === "") return undefined;
		let _date = date.split("T");
		return _date[0] + " " + _date[1];
	};

	const handleAddEvent = (e) => {
		e.preventDefault();

		if (!loadingAddEvent) {
			if (!name) {
				setErrorAddEvent(null);
				setSuccessAddEvent(null);
				setErrorAddEvent("Name is required");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (name.length > 500) {
				setErrorAddEvent("Name maximum characters - 500");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (!type) {
				setErrorAddEvent("Type is required");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (type.length > 20) {
				setErrorAddEvent("Type maximum characters - 20");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (!location) {
				setErrorAddEvent("Location is required");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (location.length > 300) {
				setErrorAddEvent("Location maximum characters - 300");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (!start) {
				setErrorAddEvent("Start is required");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} 
			// else if (description.length < 3) {
			// 	setErrorAddEvent("Description is required | Min character - 3");
			// 	setTimeout(function () {
			// 		setErrorAddEvent(null);
			// 	}, 2500)
			// } 
			else if (description.length > 65535) {
				setErrorAddEvent("Invalid Description | Max length reached");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (selectedAddEvent.length < 1) {
				setErrorAddEvent("Image is required");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2500)
			} else if (!allowed_extensions.includes(selectedAddEvent.type)) {
				setErrorAddEvent("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2000)
			} else if (selectedAddEvent.size > maximum_file_size) {
				setErrorAddEvent("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddEvent(null);
				}, 2000)
			} else {
				setLoadingAddEvent(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/media/events");
				formdata.append("file", selectedAddEvent);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingAddEvent(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddEvent(error);
							setTimeout(function () {
								setErrorAddEvent(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddEvent(error);
							setTimeout(function () {
								setErrorAddEvent(null);
							}, 2000)
						}
					} else {
						setErrorAddEvent(null);
						setUploadingAddEventPercentage(0);
						setSuccessAddEvent(`Event Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const addEventRes = addEvent(cookie, {
							name: name.trim(),
							type: type.trim(),
							location: location.trim(),
							start: return_date(start),
							end: end ? return_date(end) : undefined,
							description: description ? description : undefined,
							image,
							image_public_id
						})

						addEventRes.then(res => {
							setLoadingAddEvent(false);
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setErrorAddEvent(error);
									setTimeout(function () {
										setErrorAddEvent(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setErrorAddEvent(error);
									setTimeout(function () {
										setErrorAddEvent(null);
									}, 2000)
								}
							} else {
								setErrorAddEvent(null);
								setUploadingAddEventPercentage(0);
								setSuccessAddEvent(`Event added successfully!`);

								setTimeout(function () {
									setSuccessAddEvent(null);
									setRemoveAddEventModal(true);
								}, 2500)
							}
						}).catch(err => {
							setUploadingAddEventPercentage(0);
							setLoadingAddEvent(false);
						})

					}
				}).catch(err => {
					setUploadingAddEventPercentage(0);
					setLoadingAddEvent(false);
				})
			}
		}
	};

	return {
		cookie, name, description, type, location, start, end, loadingAddEvent, setRemoveAddEventModal, errorAddEvent, successAddEvent, removeAddEventModal, setSelectedAddEvent,
		handleAddEvent, handleName, handleDescription, handleType, handleLocation, handleStart, handleEnd, setName, setDescription, setType, setLocation, setStart, setEnd, uploadingAddEventPercentage, selectedAddEvent,
	};
};

const useUpdateEventOthers = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateEventOthers, setLoadingUpdateEventOthers] = useState(false);
	const [removeUpdateEventOthersModal, setRemoveUpdateEventOthersModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [type, setType] = useState("");
	const [location, setLocation] = useState("");

	const [errorUpdateEventOthers, setErrorUpdateEventOthers] = useState(null);
	const [successUpdateEventOthers, setSuccessUpdateEventOthers] = useState(null);

	const handleType = (e) => { e.preventDefault(); setType(e.target.value); };
	const handleLocation = (e) => { e.preventDefault(); setLocation(e.target.value); };

	const handleUpdateEventOthers = (e) => {
		e.preventDefault();

		if (!loadingUpdateEventOthers) {
			if (!uniqueId) {
				setErrorUpdateEventOthers(null);
				setSuccessUpdateEventOthers(null);
				setErrorUpdateEventOthers("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateEventOthers(null);
				}, 2500)
			} else if (!type) {
				setErrorUpdateEventOthers("Type is required");
				setTimeout(function () {
					setErrorUpdateEventOthers(null);
				}, 2500)
			} else if (type.length > 20) {
				setErrorUpdateEventOthers("Type maximum characters - 20");
				setTimeout(function () {
					setErrorUpdateEventOthers(null);
				}, 2500)
			} else if (!location) {
				setErrorUpdateEventOthers("Location is required");
				setTimeout(function () {
					setErrorUpdateEventOthers(null);
				}, 2500)
			} else if (location.length > 300) {
				setErrorUpdateEventOthers("Location maximum characters - 300");
				setTimeout(function () {
					setErrorUpdateEventOthers(null);
				}, 2500)
			} else {
				setLoadingUpdateEventOthers(true);

				const editEventOthersRes = editEventOthers(cookie, {
					unique_id: uniqueId,
					type: type.trim(),
					location: location.trim(),
				})

				editEventOthersRes.then(res => {
					setLoadingUpdateEventOthers(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateEventOthers(error);
							setTimeout(function () {
								setErrorUpdateEventOthers(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateEventOthers(error);
							setTimeout(function () {
								setErrorUpdateEventOthers(null);
							}, 2000)
						}
					} else {
						setErrorUpdateEventOthers(null);
						setSuccessUpdateEventOthers(`Event other details edited!`);

						setTimeout(function () {
							setSuccessUpdateEventOthers(null);
							setRemoveUpdateEventOthersModal(true);
							// setUniqueId(null);
							// setType("");
							// setLocation("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateEventOthers(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateEventOthers, removeUpdateEventOthersModal, errorUpdateEventOthers, successUpdateEventOthers, handleUpdateEventOthers,
		setRemoveUpdateEventOthersModal, setUniqueId, setType, setLocation, type, location, handleType, handleLocation
	};
};

const useUpdateEventName = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateEventName, setLoadingUpdateEventName] = useState(false);
	const [removeUpdateEventNameModal, setRemoveUpdateEventNameModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [name, setName] = useState("");

	const [errorUpdateEventName, setErrorUpdateEventName] = useState(null);
	const [successUpdateEventName, setSuccessUpdateEventName] = useState(null);

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };

	const handleUpdateEventName = (e) => {
		e.preventDefault();

		if (!loadingUpdateEventName) {
			if (!uniqueId) {
				setErrorUpdateEventName(null);
				setSuccessUpdateEventName(null);
				setErrorUpdateEventName("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateEventName(null);
				}, 2500)
			} else if (!name) {
				setErrorUpdateEventName("Name is required");
				setTimeout(function () {
					setErrorUpdateEventName(null);
				}, 2500)
			} else if (name.length > 500) {
				setErrorUpdateEventName("Name maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateEventName(null);
				}, 2500)
			} else {
				setLoadingUpdateEventName(true);

				const editEventNameRes = editEventName(cookie, {
					unique_id: uniqueId,
					name: name.trim(),
				})

				editEventNameRes.then(res => {
					setLoadingUpdateEventName(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateEventName(error);
							setTimeout(function () {
								setErrorUpdateEventName(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateEventName(error);
							setTimeout(function () {
								setErrorUpdateEventName(null);
							}, 2000)
						}
					} else {
						setErrorUpdateEventName(null);
						setSuccessUpdateEventName(`Event name edited!`);

						setTimeout(function () {
							setSuccessUpdateEventName(null);
							setRemoveUpdateEventNameModal(true);
							// setUniqueId(null);
							// setName("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateEventName(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateEventName, removeUpdateEventNameModal, errorUpdateEventName, successUpdateEventName, handleUpdateEventName,
		setRemoveUpdateEventNameModal, setUniqueId, setName, name, handleName,
	};
};

const useUpdateEventDuration = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateEventDuration, setLoadingUpdateEventDuration] = useState(false);
	const [removeUpdateEventDurationModal, setRemoveUpdateEventDurationModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");

	const [errorUpdateEventDuration, setErrorUpdateEventDuration] = useState(null);
	const [successUpdateEventDuration, setSuccessUpdateEventDuration] = useState(null);

	const handleStart = (e) => { e.preventDefault(); setStart(e.target.value); };
	const handleEnd = (e) => { e.preventDefault(); setEnd(e.target.value); };

	const return_date = (date) => {
		if (date === "") return undefined;
		let _date = date.split("T");
		return _date[0] + " " + _date[1];
	};

	const handleUpdateEventDuration = (e) => {
		e.preventDefault();

		if (!loadingUpdateEventDuration) {
			if (!uniqueId) {
				setErrorUpdateEventDuration(null);
				setSuccessUpdateEventDuration(null);
				setErrorUpdateEventDuration("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateEventDuration(null);
				}, 2500)
			} else if (!start) {
				setErrorUpdateEventDuration("Start is required");
				setTimeout(function () {
					setErrorUpdateEventDuration(null);
				}, 2500)
			} else {
				setLoadingUpdateEventDuration(true);

				const editEventDurationRes = editEventDuration(cookie, {
					unique_id: uniqueId,
					start: return_date(start),
					end: end ? return_date(end) : undefined,
				})

				editEventDurationRes.then(res => {
					setLoadingUpdateEventDuration(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateEventDuration(error);
							setTimeout(function () {
								setErrorUpdateEventDuration(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateEventDuration(error);
							setTimeout(function () {
								setErrorUpdateEventDuration(null);
							}, 2000)
						}
					} else {
						setErrorUpdateEventDuration(null);
						setSuccessUpdateEventDuration(`Event duration edited!`);

						setTimeout(function () {
							setSuccessUpdateEventDuration(null);
							setRemoveUpdateEventDurationModal(true);
							// setUniqueId(null);
							// setStart("");
							// setEnd("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateEventDuration(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateEventDuration, removeUpdateEventDurationModal, errorUpdateEventDuration, successUpdateEventDuration, handleUpdateEventDuration,
		setRemoveUpdateEventDurationModal, setUniqueId, setStart, setEnd, start, end, handleStart, handleEnd,
	};
};

const useUpdateEventDescription = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateEventDescription, setLoadingUpdateEventDescription] = useState(false);
	const [removeUpdateEventDescriptionModal, setRemoveUpdateEventDescriptionModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [description, setDescription] = useState("");

	const [errorUpdateEventDescription, setErrorUpdateEventDescription] = useState(null);
	const [successUpdateEventDescription, setSuccessUpdateEventDescription] = useState(null);

	const handleDescription = (contents) => { setDescription(contents); };

	const handleUpdateEventDescription = (e) => {
		e.preventDefault();

		if (!loadingUpdateEventDescription) {
			if (!uniqueId) {
				setErrorUpdateEventDescription(null);
				setSuccessUpdateEventDescription(null);
				setErrorUpdateEventDescription("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateEventDescription(null);
				}, 2500)
			} else if (description.length < 3) {
				setErrorUpdateEventDescription("Description is required | Min character - 3");
				setTimeout(function () {
					setErrorUpdateEventDescription(null);
				}, 2500)
			} else if (description.length > 65535) {
				setErrorUpdateEventDescription("Invalid Description | Max length reached");
				setTimeout(function () {
					setErrorUpdateEventDescription(null);
				}, 2500)
			} else {
				setLoadingUpdateEventDescription(true);

				const editEventDescriptionRes = editEventDescription(cookie, {
					unique_id: uniqueId,
					description: description,
				})

				editEventDescriptionRes.then(res => {
					setLoadingUpdateEventDescription(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateEventDescription(error);
							setTimeout(function () {
								setErrorUpdateEventDescription(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateEventDescription(error);
							setTimeout(function () {
								setErrorUpdateEventDescription(null);
							}, 2000)
						}
					} else {
						setErrorUpdateEventDescription(null);
						setSuccessUpdateEventDescription(`Event description edited!`);

						setTimeout(function () {
							setSuccessUpdateEventDescription(null);
							setRemoveUpdateEventDescriptionModal(true);
							// setUniqueId(null);
							// setDescription("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateEventDescription(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateEventDescription, removeUpdateEventDescriptionModal, errorUpdateEventDescription, successUpdateEventDescription, handleUpdateEventDescription,
		setRemoveUpdateEventDescriptionModal, setUniqueId, setDescription, description, handleDescription,
	};
};

const useUpdateEventTimestamp = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingUpdateEventTimestamp, setLoadingUpdateEventTimestamp] = useState(false);
	const [removeUpdateEventTimestampModal, setRemoveUpdateEventTimestampModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [createdAt, setCreatedAt] = useState("");

	const [errorUpdateEventTimestamp, setErrorUpdateEventTimestamp] = useState(null);
	const [successUpdateEventTimestamp, setSuccessUpdateEventTimestamp] = useState(null);

	const handleCreatedAt = (e) => { e.preventDefault(); setCreatedAt(e.target.value); };

	const return_date = (date) => {
		if (date === "") return undefined;
		let _date = date.split("T");
		return _date[0] + " " + _date[1].split(":")[0] + ":" + _date[1].split(":")[1];
	};

	const handleUpdateEventTimestamp = (e) => {
		e.preventDefault();

		if (!loadingUpdateEventTimestamp) {
			if (!uniqueId) {
				setErrorUpdateEventTimestamp(null);
				setSuccessUpdateEventTimestamp(null);
				setErrorUpdateEventTimestamp("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateEventTimestamp(null);
				}, 2500)
			} else if (!createdAt) {
				setErrorUpdateEventTimestamp("Created At is required");
				setTimeout(function () {
					setErrorUpdateEventTimestamp(null);
				}, 2500)
			} else {
				setLoadingUpdateEventTimestamp(true);

				const editEventTimestampRes = editEventTimestamp(cookie, {
					unique_id: uniqueId,
					createdAt: return_date(createdAt),
				})

				editEventTimestampRes.then(res => {
					setLoadingUpdateEventTimestamp(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateEventTimestamp(error);
							setTimeout(function () {
								setErrorUpdateEventTimestamp(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateEventTimestamp(error);
							setTimeout(function () {
								setErrorUpdateEventTimestamp(null);
							}, 2000)
						}
					} else {
						setErrorUpdateEventTimestamp(null);
						setSuccessUpdateEventTimestamp(`Event timestamp edited!`);

						setTimeout(function () {
							setSuccessUpdateEventTimestamp(null);
							setRemoveUpdateEventTimestampModal(true);
							// setUniqueId(null);
							// setCreatedAt("");
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateEventTimestamp(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateEventTimestamp, removeUpdateEventTimestampModal, errorUpdateEventTimestamp, successUpdateEventTimestamp, handleUpdateEventTimestamp,
		setRemoveUpdateEventTimestampModal, setUniqueId, setCreatedAt, createdAt, handleCreatedAt,
	};
};

const useUploadEventImage = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingEventImage, setLoadingEventImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeEventImageModal, setRemoveEventImageModal] = useState(null);
	const [selectedEventImage, setSelectedEventImage] = useState("");
	const [uploadingEventImagePercentage, setUploadingEventImagePercentage] = useState(0);

	const [errorEventImage, setErrorEventImage] = useState(null);
	const [successEventImage, setSuccessEventImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP", "image/heic", "image/HEIC", "image/avif", "image/AVIF", "image/jfif", "image/JFIF"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadEventImage = (e) => {
		e.preventDefault();

		if (!loadingEventImage) {
			if (!uniqueId) {
				setErrorEventImage(null);
				setSuccessEventImage(null);
				setErrorEventImage("Unique ID is required");
				setTimeout(function () {
					setErrorEventImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedEventImage.type)) {
				setErrorEventImage("Invalid image format (accepted - .png, .jpg, .jpeg, .heic, .avif & .webp)");
				setTimeout(function () {
					setErrorEventImage(null);
				}, 2000)
			} else if (selectedEventImage.size > maximum_file_size) {
				setErrorEventImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorEventImage(null);
				}, 2000)
			} else {
				setLoadingEventImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "centers/media/events");
				formdata.append("file", selectedEventImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingEventImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorEventImage(error);
							setTimeout(function () {
								setErrorEventImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorEventImage(error);
							setTimeout(function () {
								setErrorEventImage(null);
							}, 2000)
						}
					} else {
						setErrorEventImage(null);
						setUploadingEventImagePercentage(0);
						setSuccessEventImage(`Event Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editEventImageRes = editEventImage(cookie, {
							unique_id: uniqueId, image, image_public_id
						})

						editEventImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingEventImagePercentage(0);
									setLoadingEventImage(false);
									setErrorEventImage(error);
									setTimeout(function () {
										setErrorEventImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingEventImagePercentage(0);
									setLoadingEventImage(false);
									setErrorEventImage(error);
									setTimeout(function () {
										setErrorEventImage(null);
									}, 2000)
								}
							} else {
								setErrorEventImage(null);
								setUploadingEventImagePercentage(0);
								setSuccessEventImage(`Event Image edited successfully!`);

								setTimeout(function () {
									setLoadingEventImage(false);
									setSuccessEventImage(null);
									setRemoveEventImageModal(true);
									// setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingEventImagePercentage(0);
							setLoadingEventImage(false);
						})
					}
				}).catch(err => {
					setUploadingEventImagePercentage(0);
					setLoadingEventImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingEventImage, errorEventImage, successEventImage, handleUploadEventImage, uniqueId, setSelectedEventImage,
		setUniqueId, uploadingEventImagePercentage, selectedEventImage, removeEventImageModal, setRemoveEventImageModal
	};
};

const useDeleteEvent = () => {

	const { cookie } = useCookie(config.data, "");

	const [loadingDeleteEvent, setLoadingDeleteEvent] = useState(false);
	const [removeDeleteEventModal, setRemoveDeleteEventModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteEvent, setErrorDeleteEvent] = useState(null);
	const [successDeleteEvent, setSuccessDeleteEvent] = useState(null);

	const handleDeleteEvent = () => {

		if (!loadingDeleteEvent) {
			if (!uniqueId) {
				setErrorDeleteEvent(null);
				setSuccessDeleteEvent(null);
				setErrorDeleteEvent("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteEvent(null);
				}, 2500)
			} else {
				setLoadingDeleteEvent(true);

				const deleteEventRes = deleteEvent(cookie, {
					unique_id: uniqueId
				})

				deleteEventRes.then(res => {
					setLoadingDeleteEvent(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteEvent(error);
							setTimeout(function () {
								setErrorDeleteEvent(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteEvent(error);
							setTimeout(function () {
								setErrorDeleteEvent(null);
							}, 2000)
						}
					} else {
						setErrorDeleteEvent(null);
						setSuccessDeleteEvent(`Event deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteEvent(null);
							setRemoveDeleteEventModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteEvent(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteEvent, removeDeleteEventModal, errorDeleteEvent, successDeleteEvent, handleDeleteEvent,
		setRemoveDeleteEventModal, setUniqueId
	};
};

export { useAddEvent, useUpdateEventDescription, useUpdateEventOthers, useUpdateEventName, useUpdateEventDuration, useUploadEventImage, useUpdateEventTimestamp, useDeleteEvent };
