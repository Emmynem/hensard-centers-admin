import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
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
import { getCourses, getCourse } from "../api/courses";
import { publicGetCourseCategories } from "../api/courseCategories";
import { publicGetCourseTypes } from "../api/courseTypes";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useDeleteCourse, useToggleCourseActiveEnrollment } from "../hooks/useCourses";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Courses() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [courseCategories, setCourseCategories] = useState(null);
	const [courseTypes, setCourseTypes] = useState(null);

	const {
		errorToggleCourseActiveEnrollment, handleToggleCourseActiveEnrollment, loadingToggleCourseActiveEnrollment, removeToggleCourseActiveEnrollmentModal, setUniqueId: ToggleCourseActiveEnrollmentUniqueId,
		setRemoveToggleCourseActiveEnrollmentModal, successToggleCourseActiveEnrollment
	} = useToggleCourseActiveEnrollment();

	const {
		errorDeleteCourse, handleDeleteCourse, loadingDeleteCourse, removeDeleteCourseModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteCourseModal, successDeleteCourse
	} = useDeleteCourse();

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

	const [allCourse, setAllCourse] = useState(null);
	const [errorCourse, setErrorCourse] = useState(null);
	const [loadingAllCourse, setLoadingAllCourse] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllCourses(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllCourses(parseInt(e.target.value), size); };

	async function previousCourse() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllCourses(page - 1, size);
	};

	async function nextCourse() {
		if (page < allCourse.data.pages) setPage(page + 1);
		if (page < allCourse.data.pages) getAllCourses(page + 1, size);
	};

	async function getAllCourses(_page, _size) {
		setAllCourse(null);
		setLoadingAllCourse(true);
		const response = await getCourses(cookie, (_page || page), (_size || size));
		setAllCourse(response.data);
		if (response.error) setErrorCourse(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllCourse(false);
	};

	async function getAllCourseCategories() {
		setCourseCategories(null);
		const response = await publicGetCourseCategories(cookie);
		setCourseCategories(response.data);
		if (response.error) setCourseCategories(null);
	};
	
	async function getAllCourseTypes() {
		setCourseTypes(null);
		const response = await publicGetCourseTypes(cookie);
		setCourseTypes(response.data);
		if (response.error) setCourseTypes(null);
	};

	useEffect(() => {
		if (allCourse === null) {
			getAllCourses();
		}
		if (courseCategories === null) {
			getAllCourseCategories();
		} 
		if (courseTypes === null) {
			getAllCourseTypes();
		} 
	}, [allCourse]);

	if (removeToggleCourseActiveEnrollmentModal) {
		const modalResponse = document.querySelector("#toggleCourseActiveEnrollmentModal");
		modalResponse.setAttribute("display", false);
		getAllCourses();
		setRemoveToggleCourseActiveEnrollmentModal(null);
	}
	if (removeDeleteCourseModal) {
		const modalResponse = document.querySelector("#deleteCourseModal");
		modalResponse.setAttribute("display", false);
		getAllCourses();
		setRemoveDeleteCourseModal(null);
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

	const pageSelectArray = new Array(allCourse ? allCourse.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Courses</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all courses</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<Link to={`/internal/course/add`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80">
										<span>Add Course</span>
									</Link>
								</div>
							</div>
						</div>
						{
							loadingAllCourse ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allCourse && allCourse.success && allCourse.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Course Category</th>
														<th className='xui-min-w-150'>Course Type</th>
														<th className='xui-min-w-150'>Reference</th>
														<th className='xui-min-w-150'>Title</th>
														<th className='xui-max-w-150'>Stripped</th>
														<th className='xui-min-w-150'>Amount</th>
														<th className='xui-min-w-150'>Certificate</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-150'>Views</th>
														<th className='xui-min-w-150'>Enrollment Status</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-500'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allCourse.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.course_category.title}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.course_type.title}</span>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.reference}</span>
																	<span title="Copy Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.reference); setTextCopied(data.reference); }}>
																		{copiedText && textCopied === data.reference ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.title}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.stripped}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.currency} {data.amount.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																{
																	data.certificate ?
																		<span>{data.certificate}</span> :
																		<span>No Certificate</span>
																}
															</td>
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="Course Image" />
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
															<td className=''>
																{
																	data.active_enrollment ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Active</span> :
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Inactive</span>
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
																	<Link to={`/internal/course/edit/details?unique_id=${data.unique_id}`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80">
																		<Edit width="20" height="20" />
																		<span className="xui-px-half">Details</span>
																	</Link>
																	<Link to={`/internal/course/edit/enrollment/details?unique_id=${data.unique_id}`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80">
																		<Edit width="20" height="20" />
																		<span className="xui-px-half">Enrollment Details</span>
																	</Link>
																	<Link to={`/internal/course/edit/certificate/template?unique_id=${data.unique_id}`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80">
																		<Edit width="20" height="20" />
																		<span className="xui-px-half">Certificate Template</span>
																	</Link>
																	<button title="Toggle Course Active Enrollment" onClick={() => { ToggleCourseActiveEnrollmentUniqueId(data.unique_id); }} className={`xui-d-inline-flex xui-flex-ai-center xui-btn ${data.active_enrollment ? "psc-btn-red" : "psc-btn-green"} xui-bdr-rad-half`} xui-modal-open="toggleCourseActiveEnrollmentModal">
																		{
																			data.active_enrollment ? 
																			<Cancel width="16" height="16" /> :
																			<Check width="16" height="16" />
																		}
																		{
																			data.active_enrollment ? 
																			<span className="xui-px-half">Deactivate Enrollment</span> :
																			<span className="xui-px-half">Activate Enrollment</span>
																		}
																	</button>
																	<button title="Delete Course" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half" xui-modal-open="deleteCourseModal">
																		<Delete width="16" height="16" />
																		<span className="xui-px-half">Delete Course</span>
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorCourse || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllCourse ?
								<Loading width="12" height="12" /> :
								(
									allCourse && allCourse.success && allCourse.data.rows.length !== 0 ?
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
												</select></span> of {allCourse ? allCourse.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousCourse}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextCourse}>
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
			<section className='xui-modal' xui-modal="deleteCourseModal" id="deleteCourseModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Course</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteCourse}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteCourse}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteCourse} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteCourse ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteCourse ? "" : "deleteCourseModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="toggleCourseActiveEnrollmentModal" id="toggleCourseActiveEnrollmentModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Toggle Course Enrollment</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorToggleCourseActiveEnrollment}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successToggleCourseActiveEnrollment}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleToggleCourseActiveEnrollment} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingToggleCourseActiveEnrollment ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingToggleCourseActiveEnrollment ? "" : "toggleCourseActiveEnrollmentModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);

}
