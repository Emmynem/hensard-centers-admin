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
import { getCategories, getCategory } from "../api/categories";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddCategory, useDeleteCategory, useUpdateCategoryDetails, useUploadCategoryImage } from "../hooks/useCategories";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Categories() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddCategory, handleAddCategory, handleName, loadingAddCategory, name, removeAddCategoryModal, selectedAddCategory, setName,
		setRemoveAddCategoryModal, setSelectedAddCategory, successAddCategory, uploadingAddCategoryPercentage,
	} = useAddCategory();

	const {
		errorUpdateCategoryDetails, handleName: handleNameEdit, handleUpdateCategoryDetails, loadingUpdateCategoryDetails,
		name: nameEdit, removeUpdateCategoryDetailsModal, setName: setNameEdit, setRemoveUpdateCategoryDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateCategoryDetails
	} = useUpdateCategoryDetails();

	const {
		errorCategoryImage, handleUploadCategoryImage, loadingCategoryImage, removeCategoryImageModal, selectedCategoryImage, setRemoveCategoryImageModal,
		setSelectedCategoryImage, setUniqueId: UploadCategoryImageUniqueId, successCategoryImage, uploadingCategoryImagePercentage
	} = useUploadCategoryImage();

	const {
		errorDeleteCategory, handleDeleteCategory, loadingDeleteCategory, removeDeleteCategoryModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteCategoryModal, successDeleteCategory
	} = useDeleteCategory();

	const handleSelectAddCategory = (e) => {
		const el = e.target.files[0];
		setSelectedAddCategory("");
		setSelectedAddCategory(el);
	};

	const handleSelectCategoryImage = (e) => {
		const el = e.target.files[0];
		setSelectedCategoryImage("");
		setSelectedCategoryImage(el);
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

	const [allCategory, setAllCategory] = useState(null);
	const [errorCategory, setErrorCategory] = useState(null);
	const [loadingAllCategory, setLoadingAllCategory] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllCategories(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllCategories(parseInt(e.target.value), size); };

	async function previousCategory() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllCategories(page - 1, size);
	};

	async function nextCategory() {
		if (page < allCategory.data.pages) setPage(page + 1);
		if (page < allCategory.data.pages) getAllCategories(page + 1, size);
	};

	async function getAllCategories(_page, _size) {
		setAllCategory(null);
		setLoadingAllCategory(true);
		const response = await getCategories(cookie, (_page || page), (_size || size));
		setAllCategory(response.data);
		if (response.error) setErrorCategory(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllCategory(false);
	};

	useEffect(() => {
		if (allCategory === null) {
			getAllCategories();
		}
	}, [allCategory]);

	const [loadingViewCategory, setLoadingViewCategory] = useState(false)
	const [errorViewCategory, setErrorViewCategory] = useState(null)
	const [viewCategory, setViewCategory] = useState(null)

	async function getACategory(unique_id) {
		setLoadingViewCategory(true)
		const response = await getCategory(cookie, { unique_id });
		if (!response.err) {
			setViewCategory(response.data);
			setNameEdit(response.data.data.name);
		} else { setErrorViewCategory(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewCategory(false)
	};

	if (removeAddCategoryModal) {
		const modalResponse = document.querySelector("#addCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCategories();
		setRemoveAddCategoryModal(null);
	}
	if (removeUpdateCategoryDetailsModal) {
		const modalResponse = document.querySelector("#editCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCategories();
		setRemoveUpdateCategoryDetailsModal(null);
	}
	if (removeCategoryImageModal) {
		const modalResponse = document.querySelector("#editCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCategories();
		setRemoveCategoryImageModal(null);
	}
	if (removeDeleteCategoryModal) {
		const modalResponse = document.querySelector("#deleteCategoryModal");
		modalResponse.setAttribute("display", false);
		getAllCategories();
		setRemoveDeleteCategoryModal(null);
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

	const pageSelectArray = new Array(allCategory ? allCategory.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Categories</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all categories</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addCategoryModal">
										<span className="xui-mr-half">Add Category</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllCategory ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allCategory && allCategory.success && allCategory.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Name</th>
														<th className='xui-min-w-150'>Stripped</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allCategory.data.rows.map((data, i) => (
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
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="Category Image" />
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
																	<button title="Edit Category" onClick={() => { UploadCategoryImageUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getACategory(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editCategoryModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Category" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteCategoryModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorCategory || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllCategory ?
								<Loading width="12" height="12" /> :
								(
									allCategory && allCategory.success && allCategory.data.rows.length !== 0 ?
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
												</select></span> of {allCategory ? allCategory.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousCategory}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextCategory}>
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
			<section className='xui-modal' xui-modal="deleteCategoryModal" id="deleteCategoryModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Category</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteCategory}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteCategory}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteCategory} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteCategory ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteCategory ? "" : "deleteCategoryModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addCategoryModal" id="addCategoryModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addCategoryModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Category</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddCategory}>
						<div className="xui-form-box xui-mt-2">
							<label>Name</label>
							<input className="xui-font-sz-90" type="text" value={name} onChange={handleName} required placeholder="Enter name of course category"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddCategory} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddCategoryPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddCategoryPercentage} id="uploader" max="100">{uploadingAddCategoryPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddCategory} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Category</span>
								{
									loadingAddCategory ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					{(loadingAddCategory && uploadingAddCategoryPercentage) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddCategory}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddCategory}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editCategoryModal" id="editCategoryModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editCategoryModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewCategory ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewCategory && viewCategory.success ?
									<>
										<h1>Edit Category</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Name</label>
													<input className="xui-font-sz-90" type="text" value={nameEdit} onChange={handleNameEdit} required placeholder="Enter name of course category"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateCategoryDetails} disabled={loadingUpdateCategoryDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateCategoryDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCategoryDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCategoryDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image (Optional)</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewCategory.data.image ?
															getFileExtension(viewCategory.data.image) === "pdf" || getFileExtension(viewCategory.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewCategory.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewCategory.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewCategory.data.image} alt="Category Image" />
															: null
													}
													<input onChange={handleSelectCategoryImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
												</div>
												{
													uploadingCategoryImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingCategoryImagePercentage} id="uploader" max="100">{uploadingCategoryImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingCategoryImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCategoryImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCategoryImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingCategoryImage} onClick={handleUploadCategoryImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingCategoryImage ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewCategory}</h3>
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
