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
import { getCourseCategories, getCourseCategory } from "../api/courseCategories";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddCourseCategory, useDeleteCourseCategory, useUpdateCourseCategoryDetails, useUploadCourseCategoryImage } from "../hooks/useCourseCategories";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function CourseCategories() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddCourseCategory, handleAddCourseCategory, handleTitle, loadingAddCourseCategory, title, removeAddCourseCategoryModal, selectedAddCourseCategory, setTitle,
		setRemoveAddCourseCategoryModal, setSelectedAddCourseCategory, successAddCourseCategory, uploadingAddCourseCategoryPercentage,
	} = useAddCourseCategory();

	const {
		errorUpdateCourseCategoryDetails, handleTitle: handleTitleEdit, handleUpdateCourseCategoryDetails, loadingUpdateCourseCategoryDetails,
		title: titleEdit, removeUpdateCourseCategoryDetailsModal, setTitle: setTitleEdit, setRemoveUpdateCourseCategoryDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateCourseCategoryDetails
	} = useUpdateCourseCategoryDetails();

	const {
		errorCourseCategoryImage, handleUploadCourseCategoryImage, loadingCourseCategoryImage, removeCourseCategoryImageModal, selectedCourseCategoryImage, setRemoveCourseCategoryImageModal,
		setSelectedCourseCategoryImage, setUniqueId: UploadCourseCategoryImageUniqueId, successCourseCategoryImage, uploadingCourseCategoryImagePercentage
	} = useUploadCourseCategoryImage();

	const {
		errorDeleteCourseCategory, handleDeleteCourseCategory, loadingDeleteCourseCategory, removeDeleteCourseCategoryModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteCourseCategoryModal, successDeleteCourseCategory
	} = useDeleteCourseCategory();

	const handleSelectAddCourseCategory = (e) => {
		const el = e.target.files[0];
		setSelectedAddCourseCategory("");
		setSelectedAddCourseCategory(el);
	};

	const handleSelectCourseCategoryImage = (e) => {
		const el = e.target.files[0];
		setSelectedCourseCategoryImage("");
		setSelectedCourseCategoryImage(el);
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

	const [allCourseCategory, setAllCourseCategory] = useState(null);
	const [errorCourseCategory, setErrorCourseCategory] = useState(null);
	const [loadingAllCourseCategory, setLoadingAllCourseCategory] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllCourseCategories(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllCourseCategories(parseInt(e.target.value), size); };

	async function previousCourseCategory() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllCourseCategories(page - 1, size);
	};

	async function nextCourseCategory() {
		if (page < allCourseCategory.data.pages) setPage(page + 1);
		if (page < allCourseCategory.data.pages) getAllCourseCategories(page + 1, size);
	};

	async function getAllCourseCategories(_page, _size) {
		setAllCourseCategory(null);
		setLoadingAllCourseCategory(true);
		const response = await getCourseCategories(cookie, (_page || page), (_size || size));
		setAllCourseCategory(response.data);
		if (response.error) setErrorCourseCategory(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllCourseCategory(false);
	};

	useEffect(() => {
		if (allCourseCategory === null) {
			getAllCourseCategories();
		}
	}, [allCourseCategory]);

	const [loadingViewCourseCategory, setLoadingViewCourseCategory] = useState(false)
	const [errorViewCourseCategory, setErrorViewCourseCategory] = useState(null)
	const [viewCourseCategory, setViewCourseCategory] = useState(null)

	async function getACourseCategory(unique_id) {
		setLoadingViewCourseCategory(true)
		const response = await getCourseCategory(cookie, { unique_id });
		if (!response.err) {
			setViewCourseCategory(response.data);
			setTitleEdit(response.data.data.title);
		} else { setErrorViewCourseCategory(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewCourseCategory(false)
	};

	if (removeAddCourseCategoryModal) {
		const modalResponse = document.querySelector("#addCourseCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCourseCategories();
		setRemoveAddCourseCategoryModal(null);
	}
	if (removeUpdateCourseCategoryDetailsModal) {
		const modalResponse = document.querySelector("#editCourseCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCourseCategories();
		setRemoveUpdateCourseCategoryDetailsModal(null);
	}
	if (removeCourseCategoryImageModal) {
		const modalResponse = document.querySelector("#editCourseCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCourseCategories();
		setRemoveCourseCategoryImageModal(null);
	}
	if (removeDeleteCourseCategoryModal) {
		const modalResponse = document.querySelector("#deleteCourseCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCourseCategories();
		setRemoveDeleteCourseCategoryModal(null);
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

	const pageSelectArray = new Array(allCourseCategory ? allCourseCategory.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Course Categories</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all course categories</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addCourseCategoryModal">
										<span className="xui-mr-half">Add Course Category</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllCourseCategory ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allCourseCategory && allCourseCategory.success && allCourseCategory.data.rows.length !== 0 ?
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
													{allCourseCategory.data.rows.map((data, i) => (
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
																			<img className="xui-img-50" src={data.image} alt="CourseCategory Image" />
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
																	<button title="Edit Course Category" onClick={() => { UploadCourseCategoryImageUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getACourseCategory(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editCourseCategoryModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Course Category" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteCourseCategoryModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorCourseCategory || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllCourseCategory ?
								<Loading width="12" height="12" /> :
								(
									allCourseCategory && allCourseCategory.success && allCourseCategory.data.rows.length !== 0 ?
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
												</select></span> of {allCourseCategory ? allCourseCategory.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousCourseCategory}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextCourseCategory}>
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
			<section className='xui-modal' xui-modal="deleteCourseCategoryModal" id="deleteCourseCategoryModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Course Category</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteCourseCategory}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteCourseCategory}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteCourseCategory} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteCourseCategory ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteCourseCategory ? "" : "deleteCourseCategoryModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addCourseCategoryModal" id="addCourseCategoryModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addCourseCategoryModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Course Category</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddCourseCategory}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of course category"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddCourseCategory} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddCourseCategoryPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddCourseCategoryPercentage} id="uploader" max="100">{uploadingAddCourseCategoryPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddCourseCategory} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Course Category</span>
								{
									loadingAddCourseCategory ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					{loadingAddCourseCategory && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddCourseCategory}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddCourseCategory}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editCourseCategoryModal" id="editCourseCategoryModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editCourseCategoryModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewCourseCategory ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewCourseCategory && viewCourseCategory.success ?
									<>
										<h1>Edit Course Category</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of course category"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateCourseCategoryDetails} disabled={loadingUpdateCourseCategoryDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateCourseCategoryDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseCategoryDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseCategoryDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewCourseCategory.data.image ?
															getFileExtension(viewCourseCategory.data.image) === "pdf" || getFileExtension(viewCourseCategory.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewCourseCategory.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewCourseCategory.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewCourseCategory.data.image} alt="CourseCategory Image" />
															: null
													}
													<input onChange={handleSelectCourseCategoryImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingCourseCategoryImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingCourseCategoryImagePercentage} id="uploader" max="100">{uploadingCourseCategoryImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingCourseCategoryImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCourseCategoryImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCourseCategoryImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingCourseCategoryImage} onClick={handleUploadCourseCategoryImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingCourseCategoryImage ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewCourseCategory}</h3>
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
