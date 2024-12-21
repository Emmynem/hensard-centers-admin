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
import { getPolicies, getPolicy } from "../api/policies";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddPolicy, useDeletePolicy, useUpdatePolicyDetails, useUploadPolicyImage, useUploadPolicyFile } from "../hooks/usePolicies";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Policies() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddPolicy, handleAddPolicy, handleTitle, handleOther, loadingAddPolicy, title, other, removeAddPolicyModal, selectedAddPolicy, setTitle, setOther,
		setRemoveAddPolicyModal, setSelectedAddPolicy, successAddPolicy, uploadingAddPolicyPercentage, selectedAddPolicyFile, setSelectedAddPolicyFile, uploadingAddPolicyFilePercentage
	} = useAddPolicy();

	const {
		errorUpdatePolicyDetails, handleTitle: handleTitleEdit, handleOther: handleOtherEdit, handleUpdatePolicyDetails, loadingUpdatePolicyDetails,
		title: titleEdit, other: otherEdit, removeUpdatePolicyDetailsModal, setTitle: setTitleEdit, setOther: setOtherEdit, setRemoveUpdatePolicyDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdatePolicyDetails
	} = useUpdatePolicyDetails();

	const {
		errorPolicyImage, handleUploadPolicyImage, loadingPolicyImage, removePolicyImageModal, selectedPolicyImage, setRemovePolicyImageModal,
		setSelectedPolicyImage, setUniqueId: UploadPolicyImageUniqueId, successPolicyImage, uploadingPolicyImagePercentage
	} = useUploadPolicyImage();

	const {
		errorPolicyFile, handleUploadPolicyFile, loadingPolicyFile, removePolicyFileModal, selectedPolicyFile, setRemovePolicyFileModal,
		setSelectedPolicyFile, setUniqueId: UploadPolicyFileUniqueId, successPolicyFile, uploadingPolicyFilePercentage
	} = useUploadPolicyFile();

	const {
		errorDeletePolicy, handleDeletePolicy, loadingDeletePolicy, removeDeletePolicyModal, setUniqueId: DeleteUniqueId,
		setRemoveDeletePolicyModal, successDeletePolicy
	} = useDeletePolicy();

	const handleSelectAddPolicy = (e) => {
		const el = e.target.files[0];
		setSelectedAddPolicy("");
		setSelectedAddPolicy(el);
	};

	const handleSelectAddPolicyFile = (e) => {
		const el = e.target.files[0];
		setSelectedAddPolicyFile("");
		setSelectedAddPolicyFile(el);
	};

	const handleSelectPolicyImage = (e) => {
		const el = e.target.files[0];
		setSelectedPolicyImage("");
		setSelectedPolicyImage(el);
	};

	const handleSelectPolicyFile = (e) => {
		const el = e.target.files[0];
		setSelectedPolicyFile("");
		setSelectedPolicyFile(el);
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

	const [allPolicy, setAllPolicy] = useState(null);
	const [errorPolicy, setErrorPolicy] = useState(null);
	const [loadingAllPolicy, setLoadingAllPolicy] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllPolicies(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllPolicies(parseInt(e.target.value), size); };

	async function previousPolicy() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllPolicies(page - 1, size);
	};

	async function nextPolicy() {
		if (page < allPolicy.data.pages) setPage(page + 1);
		if (page < allPolicy.data.pages) getAllPolicies(page + 1, size);
	};

	async function getAllPolicies(_page, _size) {
		setAllPolicy(null);
		setLoadingAllPolicy(true);
		const response = await getPolicies(cookie, (_page || page), (_size || size));
		setAllPolicy(response.data);
		if (response.error) setErrorPolicy(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllPolicy(false);
	};

	useEffect(() => {
		if (allPolicy === null) {
			getAllPolicies();
		}
	}, [allPolicy]);

	const [loadingViewPolicy, setLoadingViewPolicy] = useState(false)
	const [errorViewPolicy, setErrorViewPolicy] = useState(null)
	const [viewPolicy, setViewPolicy] = useState(null)

	async function getAPolicy(unique_id) {
		setLoadingViewPolicy(true)
		const response = await getPolicy(cookie, { unique_id });
		if (!response.err) {
			setViewPolicy(response.data);
			setTitleEdit(response.data.data.title);
			setOtherEdit(response.data.data.other);
		} else { setErrorViewPolicy(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewPolicy(false)
	};

	if (removeAddPolicyModal) {
		const modalResponse = document.querySelector("#addPolicyModal");
		modalResponse.setAttribute("display", false);
		getAllPolicies();
		setRemoveAddPolicyModal(null);
	}
	if (removeUpdatePolicyDetailsModal) {
		const modalResponse = document.querySelector("#editPolicyModal");
		modalResponse.setAttribute("display", false);
		getAllPolicies();
		setRemoveUpdatePolicyDetailsModal(null);
	}
	if (removePolicyImageModal) {
		const modalResponse = document.querySelector("#editPolicyModal");
		modalResponse.setAttribute("display", false);
		getAllPolicies();
		setRemovePolicyImageModal(null);
	}
	if (removePolicyFileModal) {
		const modalResponse = document.querySelector("#editPolicyModal");
		modalResponse.setAttribute("display", false);
		getAllPolicies();
		setRemovePolicyFileModal(null);
	}
	if (removeDeletePolicyModal) {
		const modalResponse = document.querySelector("#deletePolicyModal");
		modalResponse.setAttribute("display", false);
		getAllPolicies();
		setRemoveDeletePolicyModal(null);
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

	const pageSelectArray = new Array(allPolicy ? allPolicy.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Policies</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all policies</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addPolicyModal">
										<span className="xui-mr-half">Add Policy</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllPolicy ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allPolicy && allPolicy.success && allPolicy.data.rows.length !== 0 ?
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
													{allPolicy.data.rows.map((data, i) => (
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
																			<img className="xui-img-50" src={data.image} alt="Policy Image" />
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
																	<button title="Edit Policy" onClick={() => { UploadPolicyImageUniqueId(data.unique_id); UploadPolicyFileUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getAPolicy(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editPolicyModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Policy" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deletePolicyModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorPolicy || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllPolicy ?
								<Loading width="12" height="12" /> :
								(
									allPolicy && allPolicy.success && allPolicy.data.rows.length !== 0 ?
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
												</select></span> of {allPolicy ? allPolicy.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousPolicy}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextPolicy}>
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
			<section className='xui-modal' xui-modal="deletePolicyModal" id="deletePolicyModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Policy</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeletePolicy}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeletePolicy}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeletePolicy} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeletePolicy ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeletePolicy ? "" : "deletePolicyModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addPolicyModal" id="addPolicyModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addPolicyModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Policy</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddPolicy}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of policy"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Other (Optional)</label>
							<input className="xui-font-sz-90" type="text" value={other} onChange={handleOther} placeholder="Enter other details of policy"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddPolicy} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddPolicyPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddPolicyPercentage} id="uploader" max="100">{uploadingAddPolicyPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddPolicy && selectedAddPolicy) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-mt-2">
							<label>File</label>
							<input onChange={handleSelectAddPolicyFile} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="file" required />
						</div>
						{
							uploadingAddPolicyFilePercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddPolicyFilePercentage} id="uploader" max="100">{uploadingAddPolicyFilePercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{(loadingAddPolicy && selectedAddPolicyFile) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddPolicy} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Policy</span>
								{
									loadingAddPolicy ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddPolicy}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddPolicy}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editPolicyModal" id="editPolicyModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editPolicyModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewPolicy ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewPolicy && viewPolicy.success ?
									<>
										<h1>Edit Policy</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of policy"></input>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Other (Optional)</label>
													<input className="xui-font-sz-90" type="text" value={otherEdit} onChange={handleOtherEdit} placeholder="Enter other details of policy"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdatePolicyDetails} disabled={loadingUpdatePolicyDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdatePolicyDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePolicyDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePolicyDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewPolicy.data.image ?
															getFileExtension(viewPolicy.data.image) === "pdf" || getFileExtension(viewPolicy.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewPolicy.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewPolicy.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewPolicy.data.image} alt="Policy Image" />
															: null
													}
													<input onChange={handleSelectPolicyImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingPolicyImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingPolicyImagePercentage} id="uploader" max="100">{uploadingPolicyImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingPolicyImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorPolicyImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successPolicyImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingPolicyImage} onClick={handleUploadPolicyImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingPolicyImage ?
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
														viewPolicy.data.file ?
															getFileExtension(viewPolicy.data.file) === "pdf" || getFileExtension(viewPolicy.data.file) === "PDF" ||
																getFileExtension(viewPolicy.data.file) === "doc" || getFileExtension(viewPolicy.data.file) === "DOC" ||
																getFileExtension(viewPolicy.data.file) === "docx" || getFileExtension(viewPolicy.data.file) === "DOCX" ||
																getFileExtension(viewPolicy.data.file) === "ppt" || getFileExtension(viewPolicy.data.file) === "PPT" ||
																getFileExtension(viewPolicy.data.file) === "pptx" || getFileExtension(viewPolicy.data.file) === "PPTX" ||
																getFileExtension(viewPolicy.data.file) === "csv" || getFileExtension(viewPolicy.data.file) === "CSV" ||
																getFileExtension(viewPolicy.data.file) === "zip" || getFileExtension(viewPolicy.data.file) === "ZIP" ||
																getFileExtension(viewPolicy.data.file) === "txt" || getFileExtension(viewPolicy.data.file) === "TXT" ||
																getFileExtension(viewPolicy.data.file) === "xls" || getFileExtension(viewPolicy.data.file) === "XLS" ||
																getFileExtension(viewPolicy.data.file) === "xlsx" || getFileExtension(viewPolicy.data.file) === "XLSX" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewPolicy.data.file)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewPolicy.data.file); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewPolicy.data.file} alt="Policy File" />
															: null
													}
													<input onChange={handleSelectPolicyFile} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp, .pdf, .doc, .docx, .pptx, .ppt, .csv, .xlsx, .xls, .zip, .txt" id="editFile" required />
												</div>
												{
													uploadingPolicyFilePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingPolicyFilePercentage} id="uploader" max="100">{uploadingPolicyFilePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingPolicyFile && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorPolicyFile}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successPolicyFile}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingPolicyFile} onClick={handleUploadPolicyFile} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingPolicyFile ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewPolicy}</h3>
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
