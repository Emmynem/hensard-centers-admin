import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SuccessTick from "../assets/images/success-tick.png";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Screen from '../components/Screen';
import Arrowright from '../icons/Arrowright';
import Arrowleft from '../icons/Arrowleft';
import Close from "../icons/Close";
import Plus from "../icons/Plus";
import Reset from "../icons/Reset";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";
import Copy from "../icons/Copy";
import BundledEditor from '../BundledEditor';
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getEvents, getEvent } from "../api/events";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUpdateEventDescription, useUpdateEventOthers, useUpdateEventDuration, useUpdateEventTimestamp, useUpdateEventName, useUploadEventImage } from "../hooks/useEvents";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditEventDetails() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDescriptionRef = useRef(null);

	const [showConfirmUpdateEventDescription, setShowConfirmUpdateEventDescription] = useState(false);

	const {
		name: nameEdit, errorUpdateEventName, handleName: handleNameEdit, handleUpdateEventName, loadingUpdateEventName, removeUpdateEventNameModal,
		setName: setNameEdit, setRemoveUpdateEventNameModal, setUniqueId: EditUniqueIdName, successUpdateEventName
	} = useUpdateEventName();

	const {
		description: descriptionEdit, errorUpdateEventDescription, handleDescription: handleDescriptionEdit, handleUpdateEventDescription, loadingUpdateEventDescription, removeUpdateEventDescriptionModal,
		setDescription: setDescriptionEdit, setRemoveUpdateEventDescriptionModal, setUniqueId: EditUniqueIdDescription, successUpdateEventDescription
	} = useUpdateEventDescription();

	const {
		type: typeEdit, location: locationEdit, errorUpdateEventOthers, handleType: handleTypeEdit, handleLocation: handleLocationEdit, handleUpdateEventOthers, loadingUpdateEventOthers, 
		removeUpdateEventOthersModal, setType: setTypeEdit, setLocation: setLocationEdit, setRemoveUpdateEventOthersModal, setUniqueId: EditUniqueIdOthers, successUpdateEventOthers
	} = useUpdateEventOthers();

	const {
		start: startEdit, end: endEdit, errorUpdateEventDuration, handleStart: handleStartEdit, handleEnd: handleEndEdit, handleUpdateEventDuration, loadingUpdateEventDuration, removeUpdateEventDurationModal,
		setStart: setStartEdit, setEnd: setEndEdit, setRemoveUpdateEventDurationModal, setUniqueId: EditUniqueIdDuration, successUpdateEventDuration
	} = useUpdateEventDuration();

	const {
		createdAt: createdAtEdit, errorUpdateEventTimestamp, handleCreatedAt: handleCreatedAtEdit, handleUpdateEventTimestamp, loadingUpdateEventTimestamp, removeUpdateEventTimestampModal,
		setCreatedAt: setCreatedAtEdit, setRemoveUpdateEventTimestampModal, setUniqueId: EditUniqueIdTimestamp, successUpdateEventTimestamp
	} = useUpdateEventTimestamp();

	const {
		errorEventImage, handleUploadEventImage, loadingEventImage, removeEventImageModal, selectedEventImage, setRemoveEventImageModal,
		setSelectedEventImage, setUniqueId: UploadEventImageUniqueId, successEventImage, uploadingEventImagePercentage
	} = useUploadEventImage();

	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			handleDescriptionEdit(editorDescriptionRef.current.getContent());
		}
	};

	const handleSelectEventImage = (e) => {
		const el = e.target.files[0];
		setSelectedEventImage("");
		setSelectedEventImage(el);
	};

	const getFileExtension = (filename) => {
		let lastDot = filename.lastIndexOf('.');
		let ext = filename.substring(lastDot + 1);
		return ext;
	};

	const getFileNameAlone = (filename) => {
		let _filename = filename.split("/");
		return _filename[_filename.length - 1];
	};

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [loadingViewEvent, setLoadingViewEvent] = useState(false)
	const [errorViewEvent, setErrorViewEvent] = useState(null)
	const [viewEvent, setViewEvent] = useState(null)

	async function getAEvent(unique_id) {
		setLoadingViewEvent(true)
		const response = await getEvent(cookie, { unique_id });
		if (!response.err) {
			setViewEvent(response.data);
			EditUniqueIdDescription(unique_id); EditUniqueIdOthers(unique_id); EditUniqueIdDuration(unique_id); EditUniqueIdTimestamp(unique_id); EditUniqueIdName(unique_id); UploadEventImageUniqueId(unique_id);
			setNameEdit(response.data.data.name);
			setDescriptionEdit(response.data.data.description);
			setTypeEdit(response.data.data.type);
			setLocationEdit(response.data.data.location);
			setStartEdit(response.data.data.start);
			setEndEdit(response.data.data.end);
			setCreatedAtEdit(response.data.data.createdAt);
		} else { setErrorViewEvent(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewEvent(false)
	};

	useEffect(() => {
		if (viewEvent === null) {
			getAEvent(unique_id);
		}
	}, [viewEvent]);

	if (removeUpdateEventDescriptionModal) {
		setRemoveUpdateEventDescriptionModal(null);
		window.location.reload(true);
		// setTimeout(function () {
		// 	navigate(`/internal/events`);
		// }, 1500)
	}
	if (removeUpdateEventOthersModal) {
		setRemoveUpdateEventOthersModal(null);
		window.location.reload(true);
	}
	if (removeUpdateEventNameModal) {
		setRemoveUpdateEventNameModal(null);
		window.location.reload(true);
	}
	if (removeUpdateEventDurationModal) {
		setRemoveUpdateEventDurationModal(null);
		window.location.reload(true);
	}
	if (removeUpdateEventTimestampModal) {
		setRemoveUpdateEventTimestampModal(null);
		window.location.reload(true);
	}
	if (removeEventImageModal) {
		setRemoveEventImageModal(null);
		window.location.reload(true);
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Edit Event</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						{
							loadingViewEvent ?
								<center>
									<Loading width="12" height="12" />
								</center> : (
									viewEvent && viewEvent.success ?
										<>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className="xui-form-box xui-mt-1">
														<label>Name</label>
														<input className="xui-font-sz-90" type="text" value={nameEdit} onChange={handleNameEdit} required placeholder="Enter name of event"></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateEventName}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateEventName}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateEventName} disabled={loadingUpdateEventName} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateEventName ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
														<div className="xui-form-box xui-mt-1">
															<label>Type</label>
															<input className="xui-font-sz-90" type="text" value={typeEdit} onChange={handleTypeEdit} required placeholder="Enter event type"></input>
														</div>
														<div className="xui-form-box xui-mt-1">
															<label>Location</label>
															<input className="xui-font-sz-90" type="text" value={locationEdit} onChange={handleLocationEdit} required placeholder="Enter event location"></input>
														</div>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateEventOthers}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateEventOthers}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateEventOthers} disabled={loadingUpdateEventOthers} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateEventOthers ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
														<div className="xui-form-box xui-mt-1">
															<label>Start</label>
															<input className="xui-font-sz-90" type="datetime-local" value={startEdit} onChange={handleStartEdit} required></input>
														</div>
														<div className="xui-form-box xui-mt-1">
															<label>End (Optional)</label>
															<input className="xui-font-sz-90" type="datetime-local" value={endEdit} onChange={handleEndEdit}></input>
														</div>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateEventDuration}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateEventDuration}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateEventDuration} disabled={loadingUpdateEventDuration} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateEventDuration ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className="xui-form-box xui-mt-1">
														<label>Timestamp</label>
														<input className="xui-font-sz-90" type="datetime-local" value={createdAtEdit} onChange={handleCreatedAtEdit} required></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateEventTimestamp}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateEventTimestamp}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateEventTimestamp} disabled={loadingUpdateEventTimestamp} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateEventTimestamp ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<label>Image</label>
													<div className="xui-d-flex xui-flex-ai-center">
														{
															viewEvent.data.image ?
																getFileExtension(viewEvent.data.image) === "pdf" || getFileExtension(viewEvent.data.image) === "PDF" ?
																	<div className='xui-d-inline-flex xui-flex-ai-center'>
																		<span className="xui-font-sz-120 xui-text-event xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewEvent.data.image)}</span>
																		<span name="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewEvent.data.image); }}>
																			<EyeOpen width="20" height="20" />
																		</span>
																	</div> :
																	<img className="xui-img-200" src={viewEvent.data.image} alt="Event Image" />
																: null
														}
														<input onChange={handleSelectEventImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" required />
													</div>
													{
														uploadingEventImagePercentage > 0 ?
															<>
																<label htmlFor="uploader">Uploading</label>
																<progress className="xui-h-30" value={uploadingEventImagePercentage} id="uploader" max="100">{uploadingEventImagePercentage + "%"}</progress><br /><br></br>
															</> :
															""
													}

													{loadingEventImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorEventImage}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successEventImage}</span></p>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button disabled={loadingEventImage} onClick={handleUploadEventImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingEventImage ?
																<Loading width="12" height="12" />
																: <Arrowright width="12" height="12" />
														}
													</button>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-form-box xui-mt-2">
													<label className="">Description</label>
													<BundledEditor
														onInit={(evt, editor) => editorDescriptionRef.current = editor}
														initialValue={descriptionEdit}
														init={{
															height: 500,
															font_size_input_default_unit: "pt",
															menubar: false,
															plugins: [
																'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
																'searchreplace', 'table', 'wordcount', 'code',
															],
															toolbar: [
																'undo redo | styles | bold italic forecolor fontsizeinput | bullist numlist outdent indent | link image | alignleft aligncenter alignright alignjustify | removeformat | table | code',
															],
															toolbar_mode: 'floating',
															content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
														}}
													/>
												</div>

												{
													showConfirmUpdateEventDescription ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit Event Description</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateEventDescription}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateEventDescription}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUpdateEventDescription} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUpdateEventDescription ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdateEventDescription(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> :
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateEventDescription}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateEventDescription}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																<button onClick={() => { setDescriptionContents(); setShowConfirmUpdateEventDescription(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
																	<span className="xui-mr-half">Save Changes</span>
																	<Arrowright width="12" height="12" />
																</button>
															</div>
														</div>

												}
											</form>
										</> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewEvent}</h3>
												</center>
											</div>
										</div>
								)
						}
					</section>
				</Content>
			</Screen>
		</>
	);

}