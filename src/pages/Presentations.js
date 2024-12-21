import { useEffect, useState } from "react";
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
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getPresentations, getPresentation } from "../api/presentations";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddPresentation, useDeletePresentation, useUpdatePresentationDetails, useUploadPresentationImage, useUploadPresentationFile } from "../hooks/usePresentations";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Presentations() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddPresentation, handleAddPresentation, handleTitle, handleOther, loadingAddPresentation, title, other, removeAddPresentationModal, selectedAddPresentation, setTitle, setOther,
		setRemoveAddPresentationModal, setSelectedAddPresentation, successAddPresentation, uploadingAddPresentationPercentage, selectedAddPresentationFile, setSelectedAddPresentationFile, uploadingAddPresentationFilePercentage
	} = useAddPresentation();

	const {
		errorUpdatePresentationDetails, handleTitle: handleTitleEdit, handleOther: handleOtherEdit, handleUpdatePresentationDetails, loadingUpdatePresentationDetails,
		title: titleEdit, other: otherEdit, removeUpdatePresentationDetailsModal, setTitle: setTitleEdit, setOther: setOtherEdit, setRemoveUpdatePresentationDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdatePresentationDetails
	} = useUpdatePresentationDetails();

	const {
		errorPresentationImage, handleUploadPresentationImage, loadingPresentationImage, removePresentationImageModal, selectedPresentationImage, setRemovePresentationImageModal,
		setSelectedPresentationImage, setUniqueId: UploadPresentationImageUniqueId, successPresentationImage, uploadingPresentationImagePercentage
	} = useUploadPresentationImage();

	const {
		errorPresentationFile, handleUploadPresentationFile, loadingPresentationFile, removePresentationFileModal, selectedPresentationFile, setRemovePresentationFileModal,
		setSelectedPresentationFile, setUniqueId: UploadPresentationFileUniqueId, successPresentationFile, uploadingPresentationFilePercentage
	} = useUploadPresentationFile();

	const {
		errorDeletePresentation, handleDeletePresentation, loadingDeletePresentation, removeDeletePresentationModal, setUniqueId: DeleteUniqueId,
		setRemoveDeletePresentationModal, successDeletePresentation
	} = useDeletePresentation();

	const handleSelectAddPresentation = (e) => {
		const el = e.target.files[0];
		setSelectedAddPresentation("");
		setSelectedAddPresentation(el);
	};

	const handleSelectAddPresentationFile = (e) => {
		const el = e.target.files[0];
		setSelectedAddPresentationFile("");
		setSelectedAddPresentationFile(el);
	};

	const handleSelectPresentationImage = (e) => {
		const el = e.target.files[0];
		setSelectedPresentationImage("");
		setSelectedPresentationImage(el);
	};

	const handleSelectPresentationFile = (e) => {
		const el = e.target.files[0];
		setSelectedPresentationFile("");
		setSelectedPresentationFile(el);
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

	const [allPresentation, setAllPresentation] = useState(null);
	const [errorPresentation, setErrorPresentation] = useState(null);
	const [loadingAllPresentation, setLoadingAllPresentation] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllPresentations(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllPresentations(parseInt(e.target.value), size); };

	async function previousPresentation() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllPresentations(page - 1, size);
	};

	async function nextPresentation() {
		if (page < allPresentation.data.pages) setPage(page + 1);
		if (page < allPresentation.data.pages) getAllPresentations(page + 1, size);
	};

	async function getAllPresentations(_page, _size) {
		setAllPresentation(null);
		setLoadingAllPresentation(true);
		const response = await getPresentations(cookie, (_page || page), (_size || size));
		setAllPresentation(response.data);
		if (response.error) setErrorPresentation(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllPresentation(false);
	};

	useEffect(() => {
		if (allPresentation === null) {
			getAllPresentations();
		}
	}, [allPresentation]);

	const [loadingViewPresentation, setLoadingViewPresentation] = useState(false)
	const [errorViewPresentation, setErrorViewPresentation] = useState(null)
	const [viewPresentation, setViewPresentation] = useState(null)

	async function getAPresentation(unique_id) {
		setLoadingViewPresentation(true)
		const response = await getPresentation(cookie, { unique_id });
		if (!response.err) {
			setViewPresentation(response.data);
			setTitleEdit(response.data.data.title);
			setOtherEdit(response.data.data.other);
		} else { setErrorViewPresentation(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewPresentation(false)
	};

	if (removeAddPresentationModal) {
		const modalResponse = document.querySelector("#addPresentationModal");
		modalResponse.setAttribute("display", false);
		getAllPresentations();
		setRemoveAddPresentationModal(null);
	}
	if (removeUpdatePresentationDetailsModal) {
		const modalResponse = document.querySelector("#editPresentationModal");
		modalResponse.setAttribute("display", false);
		getAllPresentations();
		setRemoveUpdatePresentationDetailsModal(null);
	}
	if (removePresentationImageModal) {
		const modalResponse = document.querySelector("#editPresentationModal");
		modalResponse.setAttribute("display", false);
		getAllPresentations();
		setRemovePresentationImageModal(null);
	}
	if (removePresentationFileModal) {
		const modalResponse = document.querySelector("#editPresentationModal");
		modalResponse.setAttribute("display", false);
		getAllPresentations();
		setRemovePresentationFileModal(null);
	}
	if (removeDeletePresentationModal) {
		const modalResponse = document.querySelector("#deletePresentationModal");
		modalResponse.setAttribute("display", false);
		getAllPresentations();
		setRemoveDeletePresentationModal(null);
	}

	const copySomeText = (text) => {
		navigator.clipboard.writeText(text);
	};

	const copyText = (text) => {
		copySomeText(text);
		setCopiedText(true);
		setTimeout(function () {
			setCopiedText(false);
		}, 2000)
	};

	const pageSelectArray = new Array(allPresentation ? allPresentation.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Presentations</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all presentations</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addPresentationModal">
										<span className="xui-mr-half">Add Presentation</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllPresentation ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allPresentation && allPresentation.success && allPresentation.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Title</th>
														<th className='xui-min-w-150'>Stripped</th>
														<th className='xui-min-w-150'>Other</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-150'>Views</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allPresentation.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.title}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.stripped}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.other ? data.other : "No other details"}</span>
															</td>
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="Presentation Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.image); setTextCopied(data.image); }}>
																				{copiedText && textCopied === data.image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.views.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.createdAt).toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.updatedAt).toLocaleString()}</span>
															</td>
															<td className=''>
																<div className="xui-d-flex xui-grid-gap-1">
																	<button title="Edit Presentation" onClick={() => { UploadPresentationImageUniqueId(data.unique_id); UploadPresentationFileUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getAPresentation(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editPresentationModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Presentation" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deletePresentationModal">
																		<Delete width="16" height="16" />
																	</button>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorPresentation || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllPresentation ?
								<Loading width="12" height="12" /> :
								(
									allPresentation && allPresentation.success && allPresentation.data.rows.length !== 0 ?
										<div className='xui-d-flex xui-flex-jc-flex-end xui-py-1 xui-font-sz-85 xui-opacity-5 xui-mt-1'>
											<div className='xui-d-inline-flex xui-flex-ai-center'>
												<span>Rows per page:</span>
												<select value={size} onChange={handleSize} className='psc-select-rows-per-page xui-ml-half'>
													<option value={20}>20</option>
													<option value={50}>50</option>
													<option value={100}>100</option>
													<option value={500}>500</option>
													<option value={1000}>1000</option>
												</select>
											</div>
											<div className='xui-mx-1 xui-lg-mx-2'>
												<span><span className='xui-font-w-bold'><select value={page} onChange={handlePage} className='psc-select-rows-per-page xui-ml-half'>
													{
														pageSelectArray.map((value, index) => {
															return (
																<option key={index + 1} value={index + 1}>{index + 1}</option>
															)
														})
													}
												</select></span> of {allPresentation ? allPresentation.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousPresentation}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextPresentation}>
													<Arrowright width="18" height="18" />
												</div>
											</div>
										</div> :
										""
								)
						}
					</section>
				</Content>
			</Screen>
			<section className='xui-modal' xui-modal="deletePresentationModal" id="deletePresentationModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Presentation</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeletePresentation}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeletePresentation}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeletePresentation} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeletePresentation ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeletePresentation ? "" : "deletePresentationModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addPresentationModal" id="addPresentationModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addPresentationModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Presentation</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddPresentation}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of presentation"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Other (Optional)</label>
							<input className="xui-font-sz-90" type="text" value={other} onChange={handleOther} placeholder="Enter other details of presentation"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddPresentation} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddPresentationPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddPresentationPercentage} id="uploader" max="100">{uploadingAddPresentationPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddPresentation && selectedAddPresentation) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-mt-2">
							<label>File</label>
							<input onChange={handleSelectAddPresentationFile} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="file" required />
						</div>
						{
							uploadingAddPresentationFilePercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddPresentationFilePercentage} id="uploader" max="100">{uploadingAddPresentationFilePercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddPresentation && selectedAddPresentationFile) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddPresentation} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Presentation</span>
								{
									loadingAddPresentation ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddPresentation}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddPresentation}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editPresentationModal" id="editPresentationModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editPresentationModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewPresentation ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewPresentation && viewPresentation.success ?
									<>
										<h1>Edit Presentation</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of presentation"></input>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Other (Optional)</label>
													<input className="xui-font-sz-90" type="text" value={otherEdit} onChange={handleOtherEdit} placeholder="Enter other details of presentation"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdatePresentationDetails} disabled={loadingUpdatePresentationDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdatePresentationDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePresentationDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePresentationDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewPresentation.data.image ?
															getFileExtension(viewPresentation.data.image) === "pdf" || getFileExtension(viewPresentation.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewPresentation.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewPresentation.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewPresentation.data.image} alt="Presentation Image" />
															: null
													}
													<input onChange={handleSelectPresentationImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingPresentationImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingPresentationImagePercentage} id="uploader" max="100">{uploadingPresentationImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingPresentationImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorPresentationImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successPresentationImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingPresentationImage} onClick={handleUploadPresentationImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingPresentationImage ?
															<Loading width="12" height="12" />
															: <Arrowright width="12" height="12" />
													}
												</button>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>File</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewPresentation.data.file ?
															getFileExtension(viewPresentation.data.file) === "pdf" || getFileExtension(viewPresentation.data.file) === "PDF" ||
																getFileExtension(viewPresentation.data.file) === "doc" || getFileExtension(viewPresentation.data.file) === "DOC" ||
																getFileExtension(viewPresentation.data.file) === "docx" || getFileExtension(viewPresentation.data.file) === "DOCX" ||
																getFileExtension(viewPresentation.data.file) === "ppt" || getFileExtension(viewPresentation.data.file) === "PPT" ||
																getFileExtension(viewPresentation.data.file) === "pptx" || getFileExtension(viewPresentation.data.file) === "PPTX" ||
																getFileExtension(viewPresentation.data.file) === "csv" || getFileExtension(viewPresentation.data.file) === "CSV" ||
																getFileExtension(viewPresentation.data.file) === "zip" || getFileExtension(viewPresentation.data.file) === "ZIP" ||
																getFileExtension(viewPresentation.data.file) === "txt" || getFileExtension(viewPresentation.data.file) === "TXT" ||
																getFileExtension(viewPresentation.data.file) === "xls" || getFileExtension(viewPresentation.data.file) === "XLS" ||
																getFileExtension(viewPresentation.data.file) === "xlsx" || getFileExtension(viewPresentation.data.file) === "XLSX" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewPresentation.data.file)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewPresentation.data.file); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewPresentation.data.file} alt="Presentation File" />
															: null
													}
													<input onChange={handleSelectPresentationFile} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="editFile" required />
												</div>
												{
													uploadingPresentationFilePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingPresentationFilePercentage} id="uploader" max="100">{uploadingPresentationFilePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingPresentationFile && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorPresentationFile}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successPresentationFile}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingPresentationFile} onClick={handleUploadPresentationFile} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingPresentationFile ?
															<Loading width="12" height="12" />
															: <Arrowright width="12" height="12" />
													}
												</button>
											</div>
										</form>
									</> :
									<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
										<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
											<center className="xui-text-red">
												<Close width="100" height="100" />
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewPresentation}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
		</>
	);

}
