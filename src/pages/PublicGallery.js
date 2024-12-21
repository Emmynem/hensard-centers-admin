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
import { getAllPublicGallery as getPublicGalleryAll, getPublicGallery } from "../api/publicGallery";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddPublicGallery, useDeletePublicGallery, useUpdatePublicGalleryDetails, useUploadPublicGalleryImage } from "../hooks/usePublicGallery";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function PublicGallery() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddPublicGallery, handleAddPublicGallery, handleTitle, handleDetails, loadingAddPublicGallery, title, details, removeAddPublicGalleryModal, selectedAddPublicGallery, setTitle, setDetails,
		setRemoveAddPublicGalleryModal, setSelectedAddPublicGallery, successAddPublicGallery, uploadingAddPublicGalleryPercentage,
	} = useAddPublicGallery();

	const {
		errorUpdatePublicGalleryDetails, handleTitle: handleTitleEdit, handleDetails: handleDetailsEdit, handleUpdatePublicGalleryDetails, loadingUpdatePublicGalleryDetails,
		title: titleEdit, details: detailsEdit, removeUpdatePublicGalleryDetailsModal, setTitle: setTitleEdit, setDetails: setDetailsEdit, setRemoveUpdatePublicGalleryDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdatePublicGalleryDetails
	} = useUpdatePublicGalleryDetails();

	const {
		errorPublicGalleryImage, handleUploadPublicGalleryImage, loadingPublicGalleryImage, removePublicGalleryImageModal, selectedPublicGalleryImage, setRemovePublicGalleryImageModal,
		setSelectedPublicGalleryImage, setUniqueId: UploadPublicGalleryImageUniqueId, successPublicGalleryImage, uploadingPublicGalleryImagePercentage
	} = useUploadPublicGalleryImage();

	const {
		errorDeletePublicGallery, handleDeletePublicGallery, loadingDeletePublicGallery, removeDeletePublicGalleryModal, setUniqueId: DeleteUniqueId,
		setRemoveDeletePublicGalleryModal, successDeletePublicGallery
	} = useDeletePublicGallery();

	const handleSelectAddPublicGallery = (e) => {
		const el = e.target.files[0];
		setSelectedAddPublicGallery("");
		setSelectedAddPublicGallery(el);
	};

	const handleSelectPublicGalleryImage = (e) => {
		const el = e.target.files[0];
		setSelectedPublicGalleryImage("");
		setSelectedPublicGalleryImage(el);
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

	const [allPublicGallery, setAllPublicGallery] = useState(null);
	const [errorPublicGallery, setErrorPublicGallery] = useState(null);
	const [loadingAllPublicGallery, setLoadingAllPublicGallery] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllPublicGallery(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllPublicGallery(parseInt(e.target.value), size); };

	async function previousPublicGallery() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllPublicGallery(page - 1, size);
	};

	async function nextPublicGallery() {
		if (page < allPublicGallery.data.pages) setPage(page + 1);
		if (page < allPublicGallery.data.pages) getAllPublicGallery(page + 1, size);
	};

	async function getAllPublicGallery(_page, _size) {
		setAllPublicGallery(null);
		setLoadingAllPublicGallery(true);
		const response = await getPublicGalleryAll(cookie, (_page || page), (_size || size));
		setAllPublicGallery(response.data);
		if (response.error) setErrorPublicGallery(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllPublicGallery(false);
	};

	useEffect(() => {
		if (allPublicGallery === null) {
			getAllPublicGallery();
		}
	}, [allPublicGallery]);

	const [loadingViewPublicGallery, setLoadingViewPublicGallery] = useState(false)
	const [errorViewPublicGallery, setErrorViewPublicGallery] = useState(null)
	const [viewPublicGallery, setViewPublicGallery] = useState(null)

	async function getAPublicGallery(unique_id) {
		setLoadingViewPublicGallery(true)
		const response = await getPublicGallery(cookie, { unique_id });
		if (!response.err) {
			setViewPublicGallery(response.data);
			setTitleEdit(response.data.data.title);
			setDetailsEdit(response.data.data.details);
		} else { setErrorViewPublicGallery(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewPublicGallery(false)
	};

	if (removeAddPublicGalleryModal) {
		const modalResponse = document.querySelector("#addPublicGalleryModal");
		modalResponse.setAttribute("display", false);
		getAllPublicGallery();
		setRemoveAddPublicGalleryModal(null);
	}
	if (removeUpdatePublicGalleryDetailsModal) {
		const modalResponse = document.querySelector("#editPublicGalleryModal");
		modalResponse.setAttribute("display", false);
		getAllPublicGallery();
		setRemoveUpdatePublicGalleryDetailsModal(null);
	}
	if (removePublicGalleryImageModal) {
		const modalResponse = document.querySelector("#editPublicGalleryModal");
		modalResponse.setAttribute("display", false);
		getAllPublicGallery();
		setRemovePublicGalleryImageModal(null);
	}
	if (removeDeletePublicGalleryModal) {
		const modalResponse = document.querySelector("#deletePublicGalleryModal");
		modalResponse.setAttribute("display", false);
		getAllPublicGallery();
		setRemoveDeletePublicGalleryModal(null);
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

	const pageSelectArray = new Array(allPublicGallery ? allPublicGallery.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Public Gallery</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all public gallery</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addPublicGalleryModal">
										<span className="xui-mr-half">Add Public Gallery</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllPublicGallery ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allPublicGallery && allPublicGallery.success && allPublicGallery.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Title</th>
														<th className='xui-min-w-150'>Stripped</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allPublicGallery.data.rows.map((data, i) => (
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
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="PublicGallery Image" />
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
																	<button title="Edit Public Gallery" onClick={() => { UploadPublicGalleryImageUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getAPublicGallery(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editPublicGalleryModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Public Gallery" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deletePublicGalleryModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorPublicGallery || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllPublicGallery ?
								<Loading width="12" height="12" /> :
								(
									allPublicGallery && allPublicGallery.success && allPublicGallery.data.rows.length !== 0 ?
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
												</select></span> of {allPublicGallery ? allPublicGallery.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousPublicGallery}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextPublicGallery}>
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
			<section className='xui-modal' xui-modal="deletePublicGalleryModal" id="deletePublicGalleryModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Public Gallery</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeletePublicGallery}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeletePublicGallery}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeletePublicGallery} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeletePublicGallery ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeletePublicGallery ? "" : "deletePublicGalleryModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addPublicGalleryModal" id="addPublicGalleryModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addPublicGalleryModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Public Gallery</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddPublicGallery}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Details (Optional)</label>
							<textarea type={"text"} maxLength={3000} placeholder={"Enter details"} value={details} onChange={handleDetails}></textarea>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image</label>
							<input onChange={handleSelectAddPublicGallery} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" required />
						</div>
						{
							uploadingAddPublicGalleryPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddPublicGalleryPercentage} id="uploader" max="100">{uploadingAddPublicGalleryPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddPublicGallery} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Public Gallery</span>
								{
									loadingAddPublicGallery ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					{loadingAddPublicGallery && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddPublicGallery}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddPublicGallery}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editPublicGalleryModal" id="editPublicGalleryModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editPublicGalleryModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewPublicGallery ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewPublicGallery && viewPublicGallery.success ?
									<>
										<h1>Edit Public Gallery</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of public gallery"></input>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Details (Optional)</label>
													<textarea type={"text"} maxLength={3000} placeholder={"Enter details"} value={detailsEdit} onChange={handleDetailsEdit}></textarea>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdatePublicGalleryDetails} disabled={loadingUpdatePublicGalleryDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdatePublicGalleryDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePublicGalleryDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePublicGalleryDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewPublicGallery.data.image ?
															getFileExtension(viewPublicGallery.data.image) === "pdf" || getFileExtension(viewPublicGallery.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewPublicGallery.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewPublicGallery.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewPublicGallery.data.image} alt="PublicGallery Image" />
															: null
													}
													<input onChange={handleSelectPublicGalleryImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" required />
												</div>
												{
													uploadingPublicGalleryImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingPublicGalleryImagePercentage} id="uploader" max="100">{uploadingPublicGalleryImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingPublicGalleryImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorPublicGalleryImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successPublicGalleryImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingPublicGalleryImage} onClick={handleUploadPublicGalleryImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingPublicGalleryImage ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewPublicGallery}</h3>
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
