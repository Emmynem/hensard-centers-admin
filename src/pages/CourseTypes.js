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
import { getCourseTypes, getCourseType } from "../api/courseTypes";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddCourseType, useDeleteCourseType, useUpdateCourseTypeDetails } from "../hooks/useCourseTypes";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function CourseTypes() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddCourseType, handleAddCourseType, handleTitle, loadingAddCourseType, title, removeAddCourseTypeModal, setTitle,
		setRemoveAddCourseTypeModal, successAddCourseType,
	} = useAddCourseType();

	const {
		errorUpdateCourseTypeDetails, handleTitle: handleTitleEdit, handleUpdateCourseTypeDetails, loadingUpdateCourseTypeDetails,
		title: titleEdit, removeUpdateCourseTypeDetailsModal, setTitle: setTitleEdit, setRemoveUpdateCourseTypeDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateCourseTypeDetails
	} = useUpdateCourseTypeDetails();

	const {
		errorDeleteCourseType, handleDeleteCourseType, loadingDeleteCourseType, removeDeleteCourseTypeModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteCourseTypeModal, successDeleteCourseType
	} = useDeleteCourseType();

	const [allCourseType, setAllCourseType] = useState(null);
	const [errorCourseType, setErrorCourseType] = useState(null);
	const [loadingAllCourseType, setLoadingAllCourseType] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllCourseTypes(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllCourseTypes(parseInt(e.target.value), size); };

	async function previousCourseType() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllCourseTypes(page - 1, size);
	};

	async function nextCourseType() {
		if (page < allCourseType.data.pages) setPage(page + 1);
		if (page < allCourseType.data.pages) getAllCourseTypes(page + 1, size);
	};

	async function getAllCourseTypes(_page, _size) {
		setAllCourseType(null);
		setLoadingAllCourseType(true);
		const response = await getCourseTypes(cookie, (_page || page), (_size || size));
		setAllCourseType(response.data);
		if (response.error) setErrorCourseType(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllCourseType(false);
	};

	useEffect(() => {
		if (allCourseType === null) {
			getAllCourseTypes();
		}
	}, [allCourseType]);

	const [loadingViewCourseType, setLoadingViewCourseType] = useState(false)
	const [errorViewCourseType, setErrorViewCourseType] = useState(null)
	const [viewCourseType, setViewCourseType] = useState(null)

	async function getACourseType(unique_id) {
		setLoadingViewCourseType(true)
		const response = await getCourseType(cookie, { unique_id });
		if (!response.err) {
			setViewCourseType(response.data);
			setTitleEdit(response.data.data.title);
		} else { setErrorViewCourseType(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewCourseType(false)
	};

	if (removeAddCourseTypeModal) {
		const modalResponse = document.querySelector("#addCourseTypeModal");
		modalResponse.setAttribute("display", false);
		getAllCourseTypes();
		setRemoveAddCourseTypeModal(null);
	}
	if (removeUpdateCourseTypeDetailsModal) {
		const modalResponse = document.querySelector("#editCourseTypeModal");
		modalResponse.setAttribute("display", false);
		getAllCourseTypes();
		setRemoveUpdateCourseTypeDetailsModal(null);
	}
	if (removeDeleteCourseTypeModal) {
		const modalResponse = document.querySelector("#deleteCourseTypeModal");
		modalResponse.setAttribute("display", false);
		getAllCourseTypes();
		setRemoveDeleteCourseTypeModal(null);
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

	const pageSelectArray = new Array(allCourseType ? allCourseType.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Course Types</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all course types</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addCourseTypeModal">
										<span className="xui-mr-half">Add Course Type</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllCourseType ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allCourseType && allCourseType.success && allCourseType.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Title</th>
														<th className='xui-min-w-150'>Stripped</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allCourseType.data.rows.map((data, i) => (
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
																<span>{new Date(data.createdAt).toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.updatedAt).toLocaleString()}</span>
															</td>
															<td className=''>
																<div className="xui-d-flex xui-grid-gap-1">
																	<button title="Edit Course Type" onClick={() => { EditUniqueIdDetails(data.unique_id); getACourseType(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editCourseTypeModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Course Type" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteCourseTypeModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorCourseType || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllCourseType ?
								<Loading width="12" height="12" /> :
								(
									allCourseType && allCourseType.success && allCourseType.data.rows.length !== 0 ?
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
												</select></span> of {allCourseType ? allCourseType.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousCourseType}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextCourseType}>
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
			<section className='xui-modal' xui-modal="deleteCourseTypeModal" id="deleteCourseTypeModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Course Type</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteCourseType}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteCourseType}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteCourseType} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteCourseType ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteCourseType ? "" : "deleteCourseTypeModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addCourseTypeModal" id="addCourseTypeModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addCourseTypeModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Course Type</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddCourseType}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of course type"></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddCourseType} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Course Type</span>
								{
									loadingAddCourseType ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddCourseType}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddCourseType}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editCourseTypeModal" id="editCourseTypeModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editCourseTypeModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewCourseType ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewCourseType && viewCourseType.success ?
									<>
										<h1>Edit Course Type</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of course type"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateCourseTypeDetails} disabled={loadingUpdateCourseTypeDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateCourseTypeDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseTypeDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseTypeDetails}</span></p>
											</div>
										</form>
									</> :
									<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
										<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
											<center className="xui-text-red">
												<Close width="100" height="100" />
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewCourseType}</h3>
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
