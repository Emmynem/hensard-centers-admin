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
import { getProjects, getProject } from "../api/projects";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUpdateProjectDetails, useUpdateProjectAltText, useUpdateProjectType, useUpdateProjectTimestamp, useUpdateProjectTitle, useUploadProjectImage } from "../hooks/useProjects";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditProjectDetails() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDetailsRef = useRef(null);

	const [showConfirmUpdateProjectDetails, setShowConfirmUpdateProjectDetails] = useState(false);

	const {
		title: titleEdit, errorUpdateProjectTitle, handleTitle: handleTitleEdit, handleUpdateProjectTitle, loadingUpdateProjectTitle, removeUpdateProjectTitleModal,
		setTitle: setTitleEdit, setRemoveUpdateProjectTitleModal, setUniqueId: EditUniqueIdTitle, successUpdateProjectTitle
	} = useUpdateProjectTitle();

	const {
		details: detailsEdit, errorUpdateProjectDetails, handleDetails: handleDetailsEdit, handleUpdateProjectDetails, loadingUpdateProjectDetails, removeUpdateProjectDetailsModal,
		setDetails: setDetailsEdit, setRemoveUpdateProjectDetailsModal, setUniqueId: EditUniqueIdDetails, successUpdateProjectDetails
	} = useUpdateProjectDetails();

	const {
		altText: altTextEdit, errorUpdateProjectAltText, handleAltText: handleAltTextEdit, handleUpdateProjectAltText, loadingUpdateProjectAltText, removeUpdateProjectAltTextModal,
		setAltText: setAltTextEdit, setRemoveUpdateProjectAltTextModal, setUniqueId: EditUniqueIdAltText, successUpdateProjectAltText
	} = useUpdateProjectAltText();

	const {
		type: typeEdit, errorUpdateProjectType, handleType: handleTypeEdit, handleUpdateProjectType, loadingUpdateProjectType, removeUpdateProjectTypeModal,
		setType: setTypeEdit, setRemoveUpdateProjectTypeModal, setUniqueId: EditUniqueIdType, successUpdateProjectType
	} = useUpdateProjectType();

	const {
		createdAt: createdAtEdit, errorUpdateProjectTimestamp, handleCreatedAt: handleCreatedAtEdit, handleUpdateProjectTimestamp, loadingUpdateProjectTimestamp, removeUpdateProjectTimestampModal,
		setCreatedAt: setCreatedAtEdit, setRemoveUpdateProjectTimestampModal, setUniqueId: EditUniqueIdTimestamp, successUpdateProjectTimestamp
	} = useUpdateProjectTimestamp();

	const {
		errorProjectImage, handleUploadProjectImage, loadingProjectImage, removeProjectImageModal, selectedProjectImage, setRemoveProjectImageModal,
		setSelectedProjectImage, setUniqueId: UploadProjectImageUniqueId, successProjectImage, uploadingProjectImagePercentage
	} = useUploadProjectImage();

	const setDetailsContents = () => {
		if (editorDetailsRef.current) {
			handleDetailsEdit(editorDetailsRef.current.getContent());
		}
	};

	const handleSelectProjectImage = (e) => {
		const el = e.target.files[0];
		setSelectedProjectImage("");
		setSelectedProjectImage(el);
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

	const [loadingViewProject, setLoadingViewProject] = useState(false)
	const [errorViewProject, setErrorViewProject] = useState(null)
	const [viewProject, setViewProject] = useState(null)

	async function getAProject(unique_id) {
		setLoadingViewProject(true)
		const response = await getProject(cookie, { unique_id });
		if (!response.err) {
			setViewProject(response.data);
			EditUniqueIdDetails(unique_id); EditUniqueIdAltText(unique_id); EditUniqueIdType(unique_id); EditUniqueIdTimestamp(unique_id); EditUniqueIdTitle(unique_id); UploadProjectImageUniqueId(unique_id);
			setTitleEdit(response.data.data.title);
			setDetailsEdit(response.data.data.details);
			setAltTextEdit(response.data.data.alt_text);
			setTypeEdit(response.data.data.type);
			setCreatedAtEdit(response.data.data.createdAt);
		} else { setErrorViewProject(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewProject(false)
	};

	useEffect(() => {
		if (viewProject === null) {
			getAProject(unique_id);
		}
	}, [viewProject]);

	if (removeUpdateProjectDetailsModal) {
		setRemoveUpdateProjectDetailsModal(null);
		window.location.reload(true);
		// setTimeout(function () {
		// 	navigate(`/internal/projects`);
		// }, 1500)
	}
	if (removeUpdateProjectAltTextModal) {
		setRemoveUpdateProjectAltTextModal(null);
		window.location.reload(true);
	}
	if (removeUpdateProjectTitleModal) {
		setRemoveUpdateProjectTitleModal(null);
		window.location.reload(true);
	}
	if (removeUpdateProjectTypeModal) {
		setRemoveUpdateProjectTypeModal(null);
		window.location.reload(true);
	}
	if (removeUpdateProjectTimestampModal) {
		setRemoveUpdateProjectTimestampModal(null);
		window.location.reload(true);
	}
	if (removeProjectImageModal) {
		setRemoveProjectImageModal(null);
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
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Edit Project</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						{
							loadingViewProject ?
								<center>
									<Loading width="12" height="12" />
								</center> : (
									viewProject && viewProject.success ?
										<>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className="xui-form-box xui-mt-1">
														<label>Title</label>
														<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of project"></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProjectTitle}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProjectTitle}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateProjectTitle} disabled={loadingUpdateProjectTitle} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateProjectTitle ?
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
														<label>Alt Text</label>
														<input className="xui-font-sz-90" type="text" value={altTextEdit} onChange={handleAltTextEdit} required placeholder="Enter alt text for project"></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProjectAltText}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProjectAltText}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateProjectAltText} disabled={loadingUpdateProjectAltText} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateProjectAltText ?
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
														<label>Type (Optional)</label>
														<input className="xui-font-sz-90" type="text" value={typeEdit} onChange={handleTypeEdit} placeholder="Enter type of project"></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProjectType}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProjectType}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateProjectType} disabled={loadingUpdateProjectType} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateProjectType ?
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
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProjectTimestamp}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProjectTimestamp}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateProjectTimestamp} disabled={loadingUpdateProjectTimestamp} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateProjectTimestamp ?
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
															viewProject.data.image ?
																getFileExtension(viewProject.data.image) === "pdf" || getFileExtension(viewProject.data.image) === "PDF" ?
																	<div className='xui-d-inline-flex xui-flex-ai-center'>
																		<span className="xui-font-sz-120 xui-text-project xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewProject.data.image)}</span>
																		<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewProject.data.image); }}>
																			<EyeOpen width="20" height="20" />
																		</span>
																	</div> :
																	<img className="xui-img-200" src={viewProject.data.image} alt="Project Image" />
																: null
														}
														<input onChange={handleSelectProjectImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" required />
													</div>
													{
														uploadingProjectImagePercentage > 0 ?
															<>
																<label htmlFor="uploader">Uploading</label>
																<progress className="xui-h-30" value={uploadingProjectImagePercentage} id="uploader" max="100">{uploadingProjectImagePercentage + "%"}</progress><br /><br></br>
															</> :
															""
													}

													{loadingProjectImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorProjectImage}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successProjectImage}</span></p>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button disabled={loadingProjectImage} onClick={handleUploadProjectImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingProjectImage ?
																<Loading width="12" height="12" />
																: <Arrowright width="12" height="12" />
														}
													</button>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-form-box xui-mt-2">
													<label className="">Details</label>
													<BundledEditor
														onInit={(evt, editor) => editorDetailsRef.current = editor}
														initialValue={detailsEdit}
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
													showConfirmUpdateProjectDetails ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit Project Details</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProjectDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProjectDetails}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUpdateProjectDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUpdateProjectDetails ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdateProjectDetails(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> :
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProjectDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProjectDetails}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																<button onClick={() => { setDetailsContents(); setShowConfirmUpdateProjectDetails(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewProject}</h3>
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