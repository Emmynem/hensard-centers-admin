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
import { getReports, getReport } from "../api/reports";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddReport, useDeleteReport, useUpdateReportDetails, useUploadReportImage, useUploadReportFile } from "../hooks/useReports";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Reports() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddReport, handleAddReport, handleTitle, handleOther, loadingAddReport, title, other, removeAddReportModal, selectedAddReport, setTitle, setOther,
		setRemoveAddReportModal, setSelectedAddReport, successAddReport, uploadingAddReportPercentage, selectedAddReportFile, setSelectedAddReportFile, uploadingAddReportFilePercentage
	} = useAddReport();

	const {
		errorUpdateReportDetails, handleTitle: handleTitleEdit, handleOther: handleOtherEdit, handleUpdateReportDetails, loadingUpdateReportDetails,
		title: titleEdit, other: otherEdit, removeUpdateReportDetailsModal, setTitle: setTitleEdit, setOther: setOtherEdit, setRemoveUpdateReportDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateReportDetails
	} = useUpdateReportDetails();

	const {
		errorReportImage, handleUploadReportImage, loadingReportImage, removeReportImageModal, selectedReportImage, setRemoveReportImageModal,
		setSelectedReportImage, setUniqueId: UploadReportImageUniqueId, successReportImage, uploadingReportImagePercentage
	} = useUploadReportImage();

	const {
		errorReportFile, handleUploadReportFile, loadingReportFile, removeReportFileModal, selectedReportFile, setRemoveReportFileModal,
		setSelectedReportFile, setUniqueId: UploadReportFileUniqueId, successReportFile, uploadingReportFilePercentage
	} = useUploadReportFile();

	const {
		errorDeleteReport, handleDeleteReport, loadingDeleteReport, removeDeleteReportModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteReportModal, successDeleteReport
	} = useDeleteReport();

	const handleSelectAddReport = (e) => {
		const el = e.target.files[0];
		setSelectedAddReport("");
		setSelectedAddReport(el);
	};

	const handleSelectAddReportFile = (e) => {
		const el = e.target.files[0];
		setSelectedAddReportFile("");
		setSelectedAddReportFile(el);
	};

	const handleSelectReportImage = (e) => {
		const el = e.target.files[0];
		setSelectedReportImage("");
		setSelectedReportImage(el);
	};

	const handleSelectReportFile = (e) => {
		const el = e.target.files[0];
		setSelectedReportFile("");
		setSelectedReportFile(el);
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

	const [allReport, setAllReport] = useState(null);
	const [errorReport, setErrorReport] = useState(null);
	const [loadingAllReport, setLoadingAllReport] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllReports(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllReports(parseInt(e.target.value), size); };

	async function previousReport() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllReports(page - 1, size);
	};

	async function nextReport() {
		if (page < allReport.data.pages) setPage(page + 1);
		if (page < allReport.data.pages) getAllReports(page + 1, size);
	};

	async function getAllReports(_page, _size) {
		setAllReport(null);
		setLoadingAllReport(true);
		const response = await getReports(cookie, (_page || page), (_size || size));
		setAllReport(response.data);
		if (response.error) setErrorReport(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllReport(false);
	};

	useEffect(() => {
		if (allReport === null) {
			getAllReports();
		}
	}, [allReport]);

	const [loadingViewReport, setLoadingViewReport] = useState(false)
	const [errorViewReport, setErrorViewReport] = useState(null)
	const [viewReport, setViewReport] = useState(null)

	async function getAReport(unique_id) {
		setLoadingViewReport(true)
		const response = await getReport(cookie, { unique_id });
		if (!response.err) {
			setViewReport(response.data);
			setTitleEdit(response.data.data.title);
			setOtherEdit(response.data.data.other);
		} else { setErrorViewReport(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewReport(false)
	};

	if (removeAddReportModal) {
		const modalResponse = document.querySelector("#addReportModal");
		modalResponse.setAttribute("display", false);
		getAllReports();
		setRemoveAddReportModal(null);
	}
	if (removeUpdateReportDetailsModal) {
		const modalResponse = document.querySelector("#editReportModal");
		modalResponse.setAttribute("display", false);
		getAllReports();
		setRemoveUpdateReportDetailsModal(null);
	}
	if (removeReportImageModal) {
		const modalResponse = document.querySelector("#editReportModal");
		modalResponse.setAttribute("display", false);
		getAllReports();
		setRemoveReportImageModal(null);
	}
	if (removeReportFileModal) {
		const modalResponse = document.querySelector("#editReportModal");
		modalResponse.setAttribute("display", false);
		getAllReports();
		setRemoveReportFileModal(null);
	}
	if (removeDeleteReportModal) {
		const modalResponse = document.querySelector("#deleteReportModal");
		modalResponse.setAttribute("display", false);
		getAllReports();
		setRemoveDeleteReportModal(null);
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

	const pageSelectArray = new Array(allReport ? allReport.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Reports</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all reports</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addReportModal">
										<span className="xui-mr-half">Add Report</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllReport ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allReport && allReport.success && allReport.data.rows.length !== 0 ?
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
													{allReport.data.rows.map((data, i) => (
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
																			<img className="xui-img-50" src={data.image} alt="Report Image" />
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
																	<button title="Edit Report" onClick={() => { UploadReportImageUniqueId(data.unique_id); UploadReportFileUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getAReport(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editReportModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Report" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteReportModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorReport || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllReport ?
								<Loading width="12" height="12" /> :
								(
									allReport && allReport.success && allReport.data.rows.length !== 0 ?
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
												</select></span> of {allReport ? allReport.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousReport}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextReport}>
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
			<section className='xui-modal' xui-modal="deleteReportModal" id="deleteReportModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Report</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteReport}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteReport}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteReport} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteReport ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteReport ? "" : "deleteReportModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addReportModal" id="addReportModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addReportModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Report</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddReport}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of report"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Other (Optional)</label>
							<input className="xui-font-sz-90" type="text" value={other} onChange={handleOther} placeholder="Enter other details of report"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddReport} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddReportPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddReportPercentage} id="uploader" max="100">{uploadingAddReportPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddReport && selectedAddReport) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-mt-2">
							<label>File</label>
							<input onChange={handleSelectAddReportFile} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="file" required />
						</div>
						{
							uploadingAddReportFilePercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddReportFilePercentage} id="uploader" max="100">{uploadingAddReportFilePercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddReport && selectedAddReportFile) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddReport} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Report</span>
								{
									loadingAddReport ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddReport}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddReport}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editReportModal" id="editReportModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editReportModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewReport ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewReport && viewReport.success ?
									<>
										<h1>Edit Report</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of report"></input>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Other (Optional)</label>
													<input className="xui-font-sz-90" type="text" value={otherEdit} onChange={handleOtherEdit} placeholder="Enter other details of report"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateReportDetails} disabled={loadingUpdateReportDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateReportDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateReportDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateReportDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewReport.data.image ?
															getFileExtension(viewReport.data.image) === "pdf" || getFileExtension(viewReport.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewReport.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewReport.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewReport.data.image} alt="Report Image" />
															: null
													}
													<input onChange={handleSelectReportImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingReportImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingReportImagePercentage} id="uploader" max="100">{uploadingReportImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingReportImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorReportImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successReportImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingReportImage} onClick={handleUploadReportImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingReportImage ?
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
														viewReport.data.file ?
															getFileExtension(viewReport.data.file) === "pdf" || getFileExtension(viewReport.data.file) === "PDF" ||
																getFileExtension(viewReport.data.file) === "doc" || getFileExtension(viewReport.data.file) === "DOC" ||
																getFileExtension(viewReport.data.file) === "docx" || getFileExtension(viewReport.data.file) === "DOCX" ||
																getFileExtension(viewReport.data.file) === "ppt" || getFileExtension(viewReport.data.file) === "PPT" ||
																getFileExtension(viewReport.data.file) === "pptx" || getFileExtension(viewReport.data.file) === "PPTX" ||
																getFileExtension(viewReport.data.file) === "csv" || getFileExtension(viewReport.data.file) === "CSV" ||
																getFileExtension(viewReport.data.file) === "zip" || getFileExtension(viewReport.data.file) === "ZIP" ||
																getFileExtension(viewReport.data.file) === "txt" || getFileExtension(viewReport.data.file) === "TXT" ||
																getFileExtension(viewReport.data.file) === "xls" || getFileExtension(viewReport.data.file) === "XLS" ||
																getFileExtension(viewReport.data.file) === "xlsx" || getFileExtension(viewReport.data.file) === "XLSX" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewReport.data.file)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewReport.data.file); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewReport.data.file} alt="Report File" />
															: null
													}
													<input onChange={handleSelectReportFile} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="editFile" required />
												</div>
												{
													uploadingReportFilePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingReportFilePercentage} id="uploader" max="100">{uploadingReportFilePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingReportFile && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorReportFile}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successReportFile}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingReportFile} onClick={handleUploadReportFile} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingReportFile ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewReport}</h3>
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
