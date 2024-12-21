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
import { getAllResearch as getResearchAll, getResearch } from "../api/research";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddResearch, useDeleteResearch, useUpdateResearchDetails, useUploadResearchImage, useUploadResearchFile } from "../hooks/useResearch";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Research() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddResearch, handleAddResearch, handleTitle, handleOther, loadingAddResearch, title, other, removeAddResearchModal, selectedAddResearch, setTitle, setOther,
		setRemoveAddResearchModal, setSelectedAddResearch, successAddResearch, uploadingAddResearchPercentage, selectedAddResearchFile, setSelectedAddResearchFile, uploadingAddResearchFilePercentage
	} = useAddResearch();

	const {
		errorUpdateResearchDetails, handleTitle: handleTitleEdit, handleOther: handleOtherEdit, handleUpdateResearchDetails, loadingUpdateResearchDetails,
		title: titleEdit, other: otherEdit, removeUpdateResearchDetailsModal, setTitle: setTitleEdit, setOther: setOtherEdit, setRemoveUpdateResearchDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateResearchDetails
	} = useUpdateResearchDetails();

	const {
		errorResearchImage, handleUploadResearchImage, loadingResearchImage, removeResearchImageModal, selectedResearchImage, setRemoveResearchImageModal,
		setSelectedResearchImage, setUniqueId: UploadResearchImageUniqueId, successResearchImage, uploadingResearchImagePercentage
	} = useUploadResearchImage();

	const {
		errorResearchFile, handleUploadResearchFile, loadingResearchFile, removeResearchFileModal, selectedResearchFile, setRemoveResearchFileModal,
		setSelectedResearchFile, setUniqueId: UploadResearchFileUniqueId, successResearchFile, uploadingResearchFilePercentage
	} = useUploadResearchFile();

	const {
		errorDeleteResearch, handleDeleteResearch, loadingDeleteResearch, removeDeleteResearchModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteResearchModal, successDeleteResearch
	} = useDeleteResearch();

	const handleSelectAddResearch = (e) => {
		const el = e.target.files[0];
		setSelectedAddResearch("");
		setSelectedAddResearch(el);
	};

	const handleSelectAddResearchFile = (e) => {
		const el = e.target.files[0];
		setSelectedAddResearchFile("");
		setSelectedAddResearchFile(el);
	};

	const handleSelectResearchImage = (e) => {
		const el = e.target.files[0];
		setSelectedResearchImage("");
		setSelectedResearchImage(el);
	};

	const handleSelectResearchFile = (e) => {
		const el = e.target.files[0];
		setSelectedResearchFile("");
		setSelectedResearchFile(el);
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

	const [allResearch, setAllResearch] = useState(null);
	const [errorResearch, setErrorResearch] = useState(null);
	const [loadingAllResearch, setLoadingAllResearch] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllResearch(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllResearch(parseInt(e.target.value), size); };

	async function previousResearch() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllResearch(page - 1, size);
	};

	async function nextResearch() {
		if (page < allResearch.data.pages) setPage(page + 1);
		if (page < allResearch.data.pages) getAllResearch(page + 1, size);
	};

	async function getAllResearch(_page, _size) {
		setAllResearch(null);
		setLoadingAllResearch(true);
		const response = await getResearchAll(cookie, (_page || page), (_size || size));
		setAllResearch(response.data);
		if (response.error) setErrorResearch(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllResearch(false);
	};

	useEffect(() => {
		if (allResearch === null) {
			getAllResearch();
		}
	}, [allResearch]);

	const [loadingViewResearch, setLoadingViewResearch] = useState(false)
	const [errorViewResearch, setErrorViewResearch] = useState(null)
	const [viewResearch, setViewResearch] = useState(null)

	async function getAResearch(unique_id) {
		setLoadingViewResearch(true)
		const response = await getResearch(cookie, { unique_id });
		if (!response.err) {
			setViewResearch(response.data);
			setTitleEdit(response.data.data.title);
			setOtherEdit(response.data.data.other);
		} else { setErrorViewResearch(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewResearch(false)
	};

	if (removeAddResearchModal) {
		const modalResponse = document.querySelector("#addResearchModal");
		modalResponse.setAttribute("display", false);
		getAllResearch();
		setRemoveAddResearchModal(null);
	}
	if (removeUpdateResearchDetailsModal) {
		const modalResponse = document.querySelector("#editResearchModal");
		modalResponse.setAttribute("display", false);
		getAllResearch();
		setRemoveUpdateResearchDetailsModal(null);
	}
	if (removeResearchImageModal) {
		const modalResponse = document.querySelector("#editResearchModal");
		modalResponse.setAttribute("display", false);
		getAllResearch();
		setRemoveResearchImageModal(null);
	}
	if (removeResearchFileModal) {
		const modalResponse = document.querySelector("#editResearchModal");
		modalResponse.setAttribute("display", false);
		getAllResearch();
		setRemoveResearchFileModal(null);
	}
	if (removeDeleteResearchModal) {
		const modalResponse = document.querySelector("#deleteResearchModal");
		modalResponse.setAttribute("display", false);
		getAllResearch();
		setRemoveDeleteResearchModal(null);
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

	const pageSelectArray = new Array(allResearch ? allResearch.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Research</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all research</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addResearchModal">
										<span className="xui-mr-half">Add Research</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllResearch ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allResearch && allResearch.success && allResearch.data.rows.length !== 0 ?
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
													{allResearch.data.rows.map((data, i) => (
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
																			<img className="xui-img-50" src={data.image} alt="Research Image" />
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
																	<button title="Edit Research" onClick={() => { UploadResearchImageUniqueId(data.unique_id); UploadResearchFileUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getAResearch(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editResearchModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Research" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteResearchModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorResearch || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllResearch ?
								<Loading width="12" height="12" /> :
								(
									allResearch && allResearch.success && allResearch.data.rows.length !== 0 ?
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
												</select></span> of {allResearch ? allResearch.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousResearch}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextResearch}>
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
			<section className='xui-modal' xui-modal="deleteResearchModal" id="deleteResearchModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Research</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteResearch}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteResearch}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteResearch} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteResearch ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteResearch ? "" : "deleteResearchModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addResearchModal" id="addResearchModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addResearchModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Research</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddResearch}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of journal"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Other (Optional)</label>
							<input className="xui-font-sz-90" type="text" value={other} onChange={handleOther} placeholder="Enter other details of journal"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddResearch} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddResearchPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddResearchPercentage} id="uploader" max="100">{uploadingAddResearchPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddResearch && selectedAddResearch) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-mt-2">
							<label>File</label>
							<input onChange={handleSelectAddResearchFile} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="file" required />
						</div>
						{
							uploadingAddResearchFilePercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddResearchFilePercentage} id="uploader" max="100">{uploadingAddResearchFilePercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddResearch && selectedAddResearchFile) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddResearch} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Research</span>
								{
									loadingAddResearch ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddResearch}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddResearch}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editResearchModal" id="editResearchModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editResearchModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewResearch ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewResearch && viewResearch.success ?
									<>
										<h1>Edit Research</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of journal"></input>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Other (Optional)</label>
													<input className="xui-font-sz-90" type="text" value={otherEdit} onChange={handleOtherEdit} placeholder="Enter other details of journal"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateResearchDetails} disabled={loadingUpdateResearchDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateResearchDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateResearchDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateResearchDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewResearch.data.image ?
															getFileExtension(viewResearch.data.image) === "pdf" || getFileExtension(viewResearch.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewResearch.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewResearch.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewResearch.data.image} alt="Research Image" />
															: null
													}
													<input onChange={handleSelectResearchImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingResearchImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingResearchImagePercentage} id="uploader" max="100">{uploadingResearchImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingResearchImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorResearchImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successResearchImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingResearchImage} onClick={handleUploadResearchImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingResearchImage ?
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
														viewResearch.data.file ?
															getFileExtension(viewResearch.data.file) === "pdf" || getFileExtension(viewResearch.data.file) === "PDF" ||
																getFileExtension(viewResearch.data.file) === "doc" || getFileExtension(viewResearch.data.file) === "DOC" ||
																getFileExtension(viewResearch.data.file) === "docx" || getFileExtension(viewResearch.data.file) === "DOCX" ||
																getFileExtension(viewResearch.data.file) === "ppt" || getFileExtension(viewResearch.data.file) === "PPT" ||
																getFileExtension(viewResearch.data.file) === "pptx" || getFileExtension(viewResearch.data.file) === "PPTX" ||
																getFileExtension(viewResearch.data.file) === "csv" || getFileExtension(viewResearch.data.file) === "CSV" ||
																getFileExtension(viewResearch.data.file) === "zip" || getFileExtension(viewResearch.data.file) === "ZIP" ||
																getFileExtension(viewResearch.data.file) === "txt" || getFileExtension(viewResearch.data.file) === "TXT" ||
																getFileExtension(viewResearch.data.file) === "xls" || getFileExtension(viewResearch.data.file) === "XLS" ||
																getFileExtension(viewResearch.data.file) === "xlsx" || getFileExtension(viewResearch.data.file) === "XLSX" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewResearch.data.file)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewResearch.data.file); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewResearch.data.file} alt="Research File" />
															: null
													}
													<input onChange={handleSelectResearchFile} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="editFile" required />
												</div>
												{
													uploadingResearchFilePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingResearchFilePercentage} id="uploader" max="100">{uploadingResearchFilePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingResearchFile && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorResearchFile}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successResearchFile}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingResearchFile} onClick={handleUploadResearchFile} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingResearchFile ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewResearch}</h3>
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
