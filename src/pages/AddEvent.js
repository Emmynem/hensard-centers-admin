import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAddEvent } from "../hooks/useEvents";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function AddEvent() {
	const navigate = useNavigate();

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDescriptionRef = useRef(null);

	const [showConfirmAddEvent, setShowConfirmAddEvent] = useState(false);

	const {
		description, end, errorAddEvent, handleAddEvent, handleDescription, handleEnd, handleLocation, handleName, handleStart, handleType, loadingAddEvent, location, 
		name, removeAddEventModal, selectedAddEvent, setDescription, setEnd, setLocation, setName, setRemoveAddEventModal, setSelectedAddEvent, setStart, setType, start, 
		successAddEvent, type, uploadingAddEventPercentage 
	} = useAddEvent();


	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			handleDescription(editorDescriptionRef.current.getContent());
		}
	};

	const handleSelectAddEvent = (e) => {
		const el = e.target.files[0];
		setSelectedAddEvent("");
		setSelectedAddEvent(el);
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

	if (removeAddEventModal) {
		setRemoveAddEventModal(null);
		setTimeout(function () {
			navigate(`/internal/events`);
		}, 1500)
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Create new Event</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						<form className="xui-form" layout="2" onSubmit={(e) => e.preventDefault()}>
							<div className="xui-form-box xui-mt-1">
								<label>Name</label>
								<input className="xui-font-sz-90" type="text" value={name} onChange={handleName} required placeholder="Enter name of event"></input>
							</div>
							<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
								<div className="xui-form-box xui-mt-1">
									<label>Type</label>
									<input className="xui-font-sz-90" type="text" value={type} onChange={handleType} required placeholder="Enter event type"></input>
								</div>
								<div className="xui-form-box xui-mt-1">
									<label>Location</label>
									<input className="xui-font-sz-90" type="text" value={location} onChange={handleLocation} required placeholder="Enter event location"></input>
								</div>
							</div>
							<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
								<div className="xui-form-box xui-mt-1">
									<label>Start</label>
									<input className="xui-font-sz-90" type="datetime-local" value={start} onChange={handleStart} required></input>
								</div>
								<div className="xui-form-box xui-mt-1">
									<label>End (Optional)</label>
									<input className="xui-font-sz-90" type="datetime-local" value={end} onChange={handleEnd}></input>
								</div>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label className="">Description</label>
								<BundledEditor
									onInit={(evt, editor) => editorDescriptionRef.current = editor}
									initialValue={description}
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
							<div className="xui-form-box xui-mt-2">
								<label>Image</label>
								<input onChange={handleSelectAddEvent} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" required />
							</div>
							{
								uploadingAddEventPercentage > 0 ?
									<>
										<label htmlFor="uploader">Uploading</label>
										<progress className="xui-h-30" value={uploadingAddEventPercentage} id="uploader" max="100">{uploadingAddEventPercentage + "%"}</progress><br /><br></br>
									</> :
									""
							}

							{(loadingAddEvent && selectedAddEvent) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

							{
								showConfirmAddEvent ?
									<div className="xui-m-3">
										<center>
											<h4>Confirm Add Event</h4>
											<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
										</center>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddEvent}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddEvent}</span></p>
										<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={handleAddEvent} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Yes</span>
													{
														loadingAddEvent ?
															<Loading width="12" height="12" />
															: <Check width="20" height="20" />
													}
												</button>
											</div>
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={() => setShowConfirmAddEvent(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">No</span>
													<Close width="20" height="20" />
												</button>
											</div>
										</div>
									</div> :
									<div>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddEvent}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddEvent}</span></p>
										<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
											<button disabled={name.length < 2 || type.length < 2 || location.length < 2 || start.length < 2} onClick={() => { setDescriptionContents(); setShowConfirmAddEvent(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
												<span className="xui-mr-half">Save Event</span>
											</button>
										</div>
									</div>
							}
						</form>
					</section>
				</Content>
			</Screen>
		</>
	);

}