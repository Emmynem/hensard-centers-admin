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
import { getCenters, getCenter } from "../api/centers";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddCenter, useDeleteCenter, useUpdateCenterDetails, useUploadCenterImage } from "../hooks/useCenters";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Centers() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddCenter, handleAddCenter, handleName, handleAcronym, handleUrl, loadingAddCenter, name, acronym, url, removeAddCenterModal, selectedAddCenter, setName,
		setAcronym, setUrl, setRemoveAddCenterModal, setSelectedAddCenter, successAddCenter, uploadingAddCenterPercentage,
	} = useAddCenter();

	const {
		errorUpdateCenterDetails, handleName: handleNameEdit, handleAcronym: handleAcronymEdit, handleUrl: handleUrlEdit, handleUpdateCenterDetails, loadingUpdateCenterDetails,
		name: nameEdit, acronym: acronymEdit, url: urlEdit, removeUpdateCenterDetailsModal, setName: setNameEdit, setAcronym: setAcronymEdit, setUrl: setUrlEdit, setRemoveUpdateCenterDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateCenterDetails
	} = useUpdateCenterDetails();

	const {
		errorCenterImage, handleUploadCenterImage, loadingCenterImage, removeCenterImageModal, selectedCenterImage, setRemoveCenterImageModal,
		setSelectedCenterImage, setUniqueId: UploadCenterImageUniqueId, successCenterImage, uploadingCenterImagePercentage
	} = useUploadCenterImage();

	const {
		errorDeleteCenter, handleDeleteCenter, loadingDeleteCenter, removeDeleteCenterModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteCenterModal, successDeleteCenter
	} = useDeleteCenter();

	const handleSelectAddCenter = (e) => {
		const el = e.target.files[0];
		setSelectedAddCenter("");
		setSelectedAddCenter(el);
	};

	const handleSelectCenterImage = (e) => {
		const el = e.target.files[0];
		setSelectedCenterImage("");
		setSelectedCenterImage(el);
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

	const [allCenter, setAllCenter] = useState(null);
	const [errorCenter, setErrorCenter] = useState(null);
	const [loadingAllCenter, setLoadingAllCenter] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllCenters(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllCenters(parseInt(e.target.value), size); };

	async function previousCenter() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllCenters(page - 1, size);
	};

	async function nextCenter() {
		if (page < allCenter.data.pages) setPage(page + 1);
		if (page < allCenter.data.pages) getAllCenters(page + 1, size);
	};

	async function getAllCenters(_page, _size) {
		setAllCenter(null);
		setLoadingAllCenter(true);
		const response = await getCenters(cookie, (_page || page), (_size || size));
		setAllCenter(response.data);
		if (response.error) setErrorCenter(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllCenter(false);
	};

	useEffect(() => {
		if (allCenter === null) {
			getAllCenters();
		}
	}, [allCenter]);

	const [loadingViewCenter, setLoadingViewCenter] = useState(false)
	const [errorViewCenter, setErrorViewCenter] = useState(null)
	const [viewCenter, setViewCenter] = useState(null)

	async function getACenter(unique_id) {
		setLoadingViewCenter(true)
		const response = await getCenter(cookie, { unique_id });
		if (!response.err) {
			setViewCenter(response.data);
			setNameEdit(response.data.data.name);
			setAcronymEdit(response.data.data.acronym);
			setUrlEdit(response.data.data.url);
		} else { setErrorViewCenter(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewCenter(false)
	};

	if (removeAddCenterModal) {
		const modalResponse = document.querySelector("#addCenterModal");
		modalResponse.setAttribute("display", false);
		getAllCenters();
		setRemoveAddCenterModal(null);
	}
	if (removeUpdateCenterDetailsModal) {
		const modalResponse = document.querySelector("#editCenterModal");
		modalResponse.setAttribute("display", false);
		getAllCenters();
		setRemoveUpdateCenterDetailsModal(null);
	}
	if (removeCenterImageModal) {
		const modalResponse = document.querySelector("#editCenterModal");
		modalResponse.setAttribute("display", false);
		getAllCenters();
		setRemoveCenterImageModal(null);
	}
	if (removeDeleteCenterModal) {
		const modalResponse = document.querySelector("#deleteCenterModal");
		modalResponse.setAttribute("display", false);
		getAllCenters();
		setRemoveDeleteCenterModal(null);
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

	const pageSelectArray = new Array(allCenter ? allCenter.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Centers</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all centers</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addCenterModal">
										<span className="xui-mr-half">Add Center</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllCenter ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allCenter && allCenter.success && allCenter.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Name</th>
														<th className='xui-min-w-150'>Stripped</th>
														<th className='xui-min-w-100'>Acronym</th>
														<th className='xui-min-w-150'>URL</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allCenter.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.name}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.stripped}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.acronym}</span>
															</td>
															<td className='xui-opacity-5'>
																{
																	data.url ? 
																	<div className='xui-d-inline-flex xui-flex-ai-center'>
																		<span>{data.url}</span>
																		<span title="View Page" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.url); }}>
																			<EyeOpen width="16" height="16" />
																		</span>
																	</div> : 
																	<span>No URL</span>
																}
															</td>
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="Center Image" />
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
																<span>{new Date(data.createdAt).toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.updatedAt).toLocaleString()}</span>
															</td>
															<td className=''>
																<div className="xui-d-flex xui-grid-gap-1">
																	<button title="Edit Center" onClick={() => { UploadCenterImageUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getACenter(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editCenterModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Center" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteCenterModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorCenter || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{/* {
							loadingAllCenter ?
								<Loading width="12" height="12" /> :
								(
									allCenter && allCenter.success && allCenter.data.rows.length !== 0 ?
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
												</select></span> of {allCenter ? allCenter.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousCenter}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextCenter}>
													<Arrowright width="18" height="18" />
												</div>
											</div>
										</div> :
										""
								)
						} */}
					</section>
				</Content>
			</Screen>
			<section className='xui-modal' xui-modal="deleteCenterModal" id="deleteCenterModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Center</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteCenter}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteCenter}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteCenter} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteCenter ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteCenter ? "" : "deleteCenterModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addCenterModal" id="addCenterModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addCenterModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Center</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddCenter}>
						<div className="xui-form-box xui-mt-2">
							<label>Name</label>
							<input className="xui-font-sz-90" type="text" value={name} onChange={handleName} required placeholder="Enter name of center"></input>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Acronym</label>
								<input className="xui-font-sz-90" type="text" value={acronym} onChange={handleAcronym} required placeholder="Enter acronym of center"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>URL (Optional)</label>
								<input className="xui-font-sz-90" type="url" value={url} onChange={handleUrl} placeholder="Enter url of center"></input>
							</div>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddCenter} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddCenterPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddCenterPercentage} id="uploader" max="100">{uploadingAddCenterPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddCenter} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Center</span>
								{
									loadingAddCenter ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					{loadingAddCenter && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddCenter}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddCenter}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editCenterModal" id="editCenterModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editCenterModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewCenter ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewCenter && viewCenter.success ?
									<>
										<h1>Edit Center</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Name</label>
													<input className="xui-font-sz-90" type="text" value={nameEdit} onChange={handleNameEdit} required placeholder="Enter name of center"></input>
												</div>
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
													<div className="xui-form-box xui-mt-2">
														<label>Acronym</label>
														<input className="xui-font-sz-90" type="text" value={acronymEdit} onChange={handleAcronymEdit} required placeholder="Enter acronym of center"></input>
													</div>
													<div className="xui-form-box xui-mt-2">
														<label>URL (Optional)</label>
														<input className="xui-font-sz-90" type="url" value={urlEdit} onChange={handleUrlEdit} placeholder="Enter url of center"></input>
													</div>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateCenterDetails} disabled={loadingUpdateCenterDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateCenterDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCenterDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCenterDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewCenter.data.image ?
															getFileExtension(viewCenter.data.image) === "pdf" || getFileExtension(viewCenter.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewCenter.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewCenter.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewCenter.data.image} alt="Center Image" />
															: null
													}
													<input onChange={handleSelectCenterImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingCenterImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingCenterImagePercentage} id="uploader" max="100">{uploadingCenterImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingCenterImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCenterImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCenterImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingCenterImage} onClick={handleUploadCenterImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingCenterImage ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewCenter}</h3>
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
