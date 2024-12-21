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
import { getJournals, getJournal } from "../api/journals";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddJournal, useDeleteJournal, useUpdateJournalDetails, useUploadJournalImage, useUploadJournalFile } from "../hooks/useJournals";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Journals() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddJournal, handleAddJournal, handleTitle, handleOther, loadingAddJournal, title, other, removeAddJournalModal, selectedAddJournal, setTitle, setOther,
		setRemoveAddJournalModal, setSelectedAddJournal, successAddJournal, uploadingAddJournalPercentage, selectedAddJournalFile, setSelectedAddJournalFile, uploadingAddJournalFilePercentage
	} = useAddJournal();

	const {
		errorUpdateJournalDetails, handleTitle: handleTitleEdit, handleOther: handleOtherEdit, handleUpdateJournalDetails, loadingUpdateJournalDetails,
		title: titleEdit, other: otherEdit, removeUpdateJournalDetailsModal, setTitle: setTitleEdit, setOther: setOtherEdit, setRemoveUpdateJournalDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateJournalDetails
	} = useUpdateJournalDetails();

	const {
		errorJournalImage, handleUploadJournalImage, loadingJournalImage, removeJournalImageModal, selectedJournalImage, setRemoveJournalImageModal,
		setSelectedJournalImage, setUniqueId: UploadJournalImageUniqueId, successJournalImage, uploadingJournalImagePercentage
	} = useUploadJournalImage();

	const {
		errorJournalFile, handleUploadJournalFile, loadingJournalFile, removeJournalFileModal, selectedJournalFile, setRemoveJournalFileModal,
		setSelectedJournalFile, setUniqueId: UploadJournalFileUniqueId, successJournalFile, uploadingJournalFilePercentage
	} = useUploadJournalFile();

	const {
		errorDeleteJournal, handleDeleteJournal, loadingDeleteJournal, removeDeleteJournalModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteJournalModal, successDeleteJournal
	} = useDeleteJournal();

	const handleSelectAddJournal = (e) => {
		const el = e.target.files[0];
		setSelectedAddJournal("");
		setSelectedAddJournal(el);
	};

	const handleSelectAddJournalFile = (e) => {
		const el = e.target.files[0];
		setSelectedAddJournalFile("");
		setSelectedAddJournalFile(el);
	};

	const handleSelectJournalImage = (e) => {
		const el = e.target.files[0];
		setSelectedJournalImage("");
		setSelectedJournalImage(el);
	};

	const handleSelectJournalFile = (e) => {
		const el = e.target.files[0];
		setSelectedJournalFile("");
		setSelectedJournalFile(el);
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

	const [allJournal, setAllJournal] = useState(null);
	const [errorJournal, setErrorJournal] = useState(null);
	const [loadingAllJournal, setLoadingAllJournal] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllJournals(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllJournals(parseInt(e.target.value), size); };

	async function previousJournal() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllJournals(page - 1, size);
	};

	async function nextJournal() {
		if (page < allJournal.data.pages) setPage(page + 1);
		if (page < allJournal.data.pages) getAllJournals(page + 1, size);
	};

	async function getAllJournals(_page, _size) {
		setAllJournal(null);
		setLoadingAllJournal(true);
		const response = await getJournals(cookie, (_page || page), (_size || size));
		setAllJournal(response.data);
		if (response.error) setErrorJournal(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllJournal(false);
	};

	useEffect(() => {
		if (allJournal === null) {
			getAllJournals();
		}
	}, [allJournal]);

	const [loadingViewJournal, setLoadingViewJournal] = useState(false)
	const [errorViewJournal, setErrorViewJournal] = useState(null)
	const [viewJournal, setViewJournal] = useState(null)

	async function getAJournal(unique_id) {
		setLoadingViewJournal(true)
		const response = await getJournal(cookie, { unique_id });
		if (!response.err) {
			setViewJournal(response.data);
			setTitleEdit(response.data.data.title);
			setOtherEdit(response.data.data.other);
		} else { setErrorViewJournal(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewJournal(false)
	};

	if (removeAddJournalModal) {
		const modalResponse = document.querySelector("#addJournalModal");
		modalResponse.setAttribute("display", false);
		getAllJournals();
		setRemoveAddJournalModal(null);
	}
	if (removeUpdateJournalDetailsModal) {
		const modalResponse = document.querySelector("#editJournalModal");
		modalResponse.setAttribute("display", false);
		getAllJournals();
		setRemoveUpdateJournalDetailsModal(null);
	}
	if (removeJournalImageModal) {
		const modalResponse = document.querySelector("#editJournalModal");
		modalResponse.setAttribute("display", false);
		getAllJournals();
		setRemoveJournalImageModal(null);
	}
	if (removeJournalFileModal) {
		const modalResponse = document.querySelector("#editJournalModal");
		modalResponse.setAttribute("display", false);
		getAllJournals();
		setRemoveJournalFileModal(null);
	}
	if (removeDeleteJournalModal) {
		const modalResponse = document.querySelector("#deleteJournalModal");
		modalResponse.setAttribute("display", false);
		getAllJournals();
		setRemoveDeleteJournalModal(null);
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

	const pageSelectArray = new Array(allJournal ? allJournal.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Journals</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all journals</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addJournalModal">
										<span className="xui-mr-half">Add Journal</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllJournal ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allJournal && allJournal.success && allJournal.data.rows.length !== 0 ?
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
													{allJournal.data.rows.map((data, i) => (
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
																			<img className="xui-img-50" src={data.image} alt="Journal Image" />
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
																	<button title="Edit Journal" onClick={() => { UploadJournalImageUniqueId(data.unique_id); UploadJournalFileUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getAJournal(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editJournalModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Journal" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteJournalModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorJournal || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllJournal ?
								<Loading width="12" height="12" /> :
								(
									allJournal && allJournal.success && allJournal.data.rows.length !== 0 ?
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
												</select></span> of {allJournal ? allJournal.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousJournal}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextJournal}>
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
			<section className='xui-modal' xui-modal="deleteJournalModal" id="deleteJournalModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Journal</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteJournal}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteJournal}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteJournal} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteJournal ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteJournal ? "" : "deleteJournalModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addJournalModal" id="addJournalModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addJournalModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Journal</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddJournal}>
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
							<input onChange={handleSelectAddJournal} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddJournalPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddJournalPercentage} id="uploader" max="100">{uploadingAddJournalPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}
						
						{(loadingAddJournal && selectedAddJournal) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}
						
						<div className="xui-form-box xui-mt-2">
							<label>File</label>
							<input onChange={handleSelectAddJournalFile} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="file" required />
						</div>
						{
							uploadingAddJournalFilePercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddJournalFilePercentage} id="uploader" max="100">{uploadingAddJournalFilePercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddJournal && selectedAddJournalFile) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddJournal} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Journal</span>
								{
									loadingAddJournal ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddJournal}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddJournal}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editJournalModal" id="editJournalModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editJournalModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewJournal ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewJournal && viewJournal.success ?
									<>
										<h1>Edit Journal</h1>
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
													<button onClick={handleUpdateJournalDetails} disabled={loadingUpdateJournalDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateJournalDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateJournalDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateJournalDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewJournal.data.image ?
															getFileExtension(viewJournal.data.image) === "pdf" || getFileExtension(viewJournal.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewJournal.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewJournal.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewJournal.data.image} alt="Journal Image" />
															: null
													}
													<input onChange={handleSelectJournalImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingJournalImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingJournalImagePercentage} id="uploader" max="100">{uploadingJournalImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingJournalImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorJournalImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successJournalImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingJournalImage} onClick={handleUploadJournalImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingJournalImage ?
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
														viewJournal.data.file ?
															getFileExtension(viewJournal.data.file) === "pdf" || getFileExtension(viewJournal.data.file) === "PDF" ||
															getFileExtension(viewJournal.data.file) === "doc" || getFileExtension(viewJournal.data.file) === "DOC" ||
															getFileExtension(viewJournal.data.file) === "docx" || getFileExtension(viewJournal.data.file) === "DOCX" ||
															getFileExtension(viewJournal.data.file) === "ppt" || getFileExtension(viewJournal.data.file) === "PPT" ||
															getFileExtension(viewJournal.data.file) === "pptx" || getFileExtension(viewJournal.data.file) === "PPTX" ||
															getFileExtension(viewJournal.data.file) === "csv" || getFileExtension(viewJournal.data.file) === "CSV" ||
															getFileExtension(viewJournal.data.file) === "zip" || getFileExtension(viewJournal.data.file) === "ZIP" ||
															getFileExtension(viewJournal.data.file) === "txt" || getFileExtension(viewJournal.data.file) === "TXT" ||
															getFileExtension(viewJournal.data.file) === "xls" || getFileExtension(viewJournal.data.file) === "XLS" ||
															getFileExtension(viewJournal.data.file) === "xlsx" || getFileExtension(viewJournal.data.file) === "XLSX" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewJournal.data.file)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewJournal.data.file); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewJournal.data.file} alt="Journal File" />
															: null
													}
													<input onChange={handleSelectJournalFile} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="editFile" required />
												</div>
												{
													uploadingJournalFilePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingJournalFilePercentage} id="uploader" max="100">{uploadingJournalFilePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingJournalFile && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorJournalFile}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successJournalFile}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingJournalFile} onClick={handleUploadJournalFile} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingJournalFile ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewJournal}</h3>
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
