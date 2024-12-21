import { useEffect, useState } from "react";
import SuccessTick from "../assets/images/success-tick.png";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Screen from '../components/Screen';
import Arrowright from '../icons/Arrowright';
import Arrowleft from '../icons/Arrowleft';
import Close from "../icons/Close";
import Reset from "../icons/Reset";
import Check from "../icons/Check";
import Plus from "../icons/Plus";
import Filter from "../icons/Filter";
import Search from "../icons/Search";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import {
	getEnrollmentsViaCourse, getEnrollments, getEnrollmentsViaEnrollmentStatus, getEnrollmentsViaReference, filterEnrollmentsViaEnrolledDate, filterEnrollmentsViaCertificationDate, filterEnrollmentsViaCompletionDate, searchEnrollments
} from "../api/enrollments";
import { publicGetCourses } from "../api/courses";
import { searchUsers } from "../api/users";
import Loading from "../icons/Loading";
import {
	useAddEnrollment, useCancelEnrollment, useCompleteEnrollment, useDeleteEnrollment, useUpdateEnrollmentDetails
} from "../hooks/useEnrollments";
import Cancel from "../icons/Cancel";
import Copy from "../icons/Copy";
import EyeOpenAlt from "../icons/EyeOpenAlt";
import Delete from "../icons/Delete";

export default function Enrollments() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [courses, setCourses] = useState(null);

	const [users, setUsers] = useState(null);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [errorUsers, setErrorUsers] = useState(null);

	const {
		courseUniqueId, errorAddEnrollment, handleAddEnrollment, loadingAddEnrollment, removeAddEnrollmentModal, setCourseUniqueId, setRemoveAddEnrollmentModal, 
		setUserUniqueId, successAddEnrollment, userUniqueId, handleUserUniqueId, handleCourseUniqueId
	} = useAddEnrollment();

	const {
		errorCompleteEnrollment, handleCompleteEnrollment, loadingCompleteEnrollment, uniqueId: CompleteEnrollmentUniqueId, removeCompleteEnrollmentModal, 
		setUniqueId: CompleteEnrollmentSetUniqueId, setRemoveCompleteEnrollmentModal, successCompleteEnrollment
	} = useCompleteEnrollment();

	const {
		errorCancelEnrollment, handleCancelEnrollment, loadingCancelEnrollment, uniqueId: CancelEnrollmentUniqueId, removeCancelEnrollmentModal, 
		setUniqueId: CancelEnrollmentSetUniqueId, setRemoveCancelEnrollmentModal, successCancelEnrollment
	} = useCancelEnrollment();

	const {
		errorUpdateEnrollmentDetails, handleUpdateEnrollmentDetails, loadingUpdateEnrollmentDetails, uniqueId: UpdateEnrollmentDetailsUniqueId, removeUpdateEnrollmentDetailsModal,
		setUniqueId: UpdateEnrollmentDetailsSetUniqueId, setRemoveUpdateEnrollmentDetailsModal, successUpdateEnrollmentDetails
	} = useUpdateEnrollmentDetails();

	const {
		errorDeleteEnrollment, handleDeleteEnrollment, loadingDeleteEnrollment, removeDeleteEnrollmentModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteEnrollmentModal, successDeleteEnrollment
	} = useDeleteEnrollment();

	const [currentFunction, setCurrentFunction] = useState("getAllEnrollments");

	const [filterByCourseUniqueId, setFilterByCourseUniqueId] = useState("");
	const [removeCourseFilterModal, setRemoveCourseFilterModal] = useState(null);

	const [filterByReference, setFilterByReference] = useState("");
	const [removeReferenceFilterModal, setRemoveReferenceFilterModal] = useState(null);

	const [enrollmentStatus, setEnrollmentStatus] = useState(null);

	const [filterStartDate, setFilterStartDate] = useState(null);
	const [filterEndDate, setFilterEndDate] = useState(null);

	const [removeEnrolledDateFilterModal, setRemoveEnrolledDateFilterModal] = useState(null);
	const [removeCompletionDateFilterModal, setRemoveCompletionDateFilterModal] = useState(null);
	const [removeCertificationDateFilterModal, setRemoveCertificationDateFilterModal] = useState(null);

	const handleFilterStartDate = (e) => { e.preventDefault(); setFilterStartDate(e.target.value); };
	const handleFilterEndDate = (e) => { e.preventDefault(); setFilterEndDate(e.target.value); };

	const [enrollmentFullDetails, setEnrollmentFullDetails] = useState(null);

	const [userSearch, setUserSearch] = useState("");
	const handleUserSearch = (e) => { e.preventDefault(); setUserSearch(e.target.value); };

	const [allEnrollments, setAllEnrollments] = useState(null);
	const [errorEnrollments, setErrorEnrollments] = useState(null);
	const [loadingAllEnrollments, setLoadingAllEnrollments] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); enrollmentsBySize(e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); enrollmentsByPage(parseInt(e.target.value), size); };
	const handleEnrollmentStatus = (e) => { e.preventDefault(); setEnrollmentStatus(e.target.value === "Select to Reset" ? null : e.target.value); setPage(1); if (e.target.value !== null && e.target.value !== "Select to Reset") setCurrentFunction("getAllStatusEnrollments"); getAllStatusEnrollments(e.target.value, page, size); };

	const handleFilterByCourseUniqueId = (e) => { e.preventDefault(); setFilterByCourseUniqueId(e.target.value); };
	
	const handleFilterByReference = (e) => { e.preventDefault(); setFilterByReference(e.target.value); };

	const resetCourseFilterParameters = () => {
		setFilterByCourseUniqueId("");
		setCurrentFunction("getAllEnrollments");
	};

	const resetReferenceFilterParameters = () => {
		setFilterByReference("");
		setCurrentFunction("getAllEnrollments");
	};

	const resetDateFilterParameters = () => {
		setFilterStartDate(null);
		setFilterEndDate(null);
		setCurrentFunction("getAllEnrollments");
	};

	const continueFilterByCourse = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllCourseEnrollments");
		getAllCourseEnrollments(filterByCourseUniqueId, page, size);
		setRemoveCourseFilterModal(true);
	};

	const continueFilterByReference = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllReferenceEnrollments");
		getAllReferenceEnrollments(filterByReference, page, size);
		setRemoveReferenceFilterModal(true);
	};

	const continueFilterByEnrolledDate = (e) => {
		e.preventDefault();

		if (!filterStartDate || !filterEndDate) {
			alert("Start and End dates are required");
		} else {
			setPage(1);
			setCurrentFunction("getAllEnrolledDateEnrollments");
			getAllEnrolledDateEnrollments(filterStartDate, filterEndDate, page, size);
			setRemoveEnrolledDateFilterModal(true);
			// setFilterEndDate(null); setFilterStartDate(null);
		}
	};

	const continueFilterByCompletionDate = (e) => {
		e.preventDefault();

		if (!filterStartDate || !filterEndDate) {
			alert("Start and End dates are required");
		} else {
			setPage(1);
			setCurrentFunction("getAllCompletionDateEnrollments");
			getAllCompletionDateEnrollments(filterStartDate, filterEndDate, page, size);
			setRemoveEnrolledDateFilterModal(true);
			// setFilterEndDate(null); setFilterStartDate(null);
		}
	};

	const continueFilterByCertificationDate = (e) => {
		e.preventDefault();

		if (!filterStartDate || !filterEndDate) {
			alert("Start and End dates are required");
		} else {
			setPage(1);
			setCurrentFunction("getAllCertificationDateEnrollments");
			getAllCertificationDateEnrollments(filterStartDate, filterEndDate, page, size);
			setRemoveEnrolledDateFilterModal(true);
			// setFilterEndDate(null); setFilterStartDate(null);
		}
	};

	async function callLastEnrollmentFunction() {
		switch (currentFunction) {
			case "getAllEnrollments":
				getAllEnrollments(page, size);
				break;
			case "getAllStatusEnrollments":
				getAllStatusEnrollments(enrollmentStatus, page, size);
				break;
			case "getAllCourseEnrollments":
				getAllCourseEnrollments(filterByCourseUniqueId, page, size);
				break;
			case "getAllReferenceEnrollments":
				getAllReferenceEnrollments(filterByReference, page, size);
				break;
			case "getAllEnrolledDateEnrollments":
				getAllEnrolledDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			case "getAllCompletionDateEnrollments":
				getAllCompletionDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			case "getAllCertificationDateEnrollments":
				getAllCertificationDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			// default:
			// 	getAllEnrollments(page, size);
		}
	};

	async function enrollmentsBySize(size) {
		switch (currentFunction) {
			case "getAllEnrollments":
				getAllEnrollments(page, size);
				break;
			case "getAllStatusEnrollments":
				getAllStatusEnrollments(enrollmentStatus, page, size);
				break;
			case "getAllCourseEnrollments":
				getAllCourseEnrollments(filterByCourseUniqueId, page, size);
				break;
			case "getAllReferenceEnrollments":
				getAllReferenceEnrollments(filterByReference, page, size);
				break;
			case "getAllEnrolledDateEnrollments":
				getAllEnrolledDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			case "getAllCompletionDateEnrollments":
				getAllCompletionDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			case "getAllCertificationDateEnrollments":
				getAllCertificationDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			default:
				getAllEnrollments(page, size);
		}
	};

	async function enrollmentsByPage(page) {
		switch (currentFunction) {
			case "getAllEnrollments":
				getAllEnrollments(page, size);
				break;
			case "getAllStatusEnrollments":
				getAllStatusEnrollments(enrollmentStatus, page, size);
				break;
			case "getAllCourseEnrollments":
				getAllCourseEnrollments(filterByCourseUniqueId, page, size);
				break;
			case "getAllReferenceEnrollments":
				getAllReferenceEnrollments(filterByReference, page, size);
				break;
			case "getAllEnrolledDateEnrollments":
				getAllEnrolledDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			case "getAllCompletionDateEnrollments":
				getAllCompletionDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			case "getAllCertificationDateEnrollments":
				getAllCertificationDateEnrollments(filterStartDate, filterEndDate, page, size);
				break;
			default:
				getAllEnrollments(page, size);
		}
	};

	async function previousEnrollments() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) {
			switch (currentFunction) {
				case "getAllEnrollments":
					getAllEnrollments(page - 1, size);
					break;
				case "getAllStatusEnrollments":
					getAllStatusEnrollments(enrollmentStatus, page - 1, size);
					break;
				case "getAllCourseEnrollments":
					getAllCourseEnrollments(filterByCourseUniqueId, page - 1, size);
					break;
				case "getAllReferenceEnrollments":
					getAllReferenceEnrollments(filterByReference, page - 1, size);
					break;
				case "getAllEnrolledDateEnrollments":
					getAllEnrolledDateEnrollments(filterStartDate, filterEndDate, page - 1, size);
					break;
				case "getAllCompletionDateEnrollments":
					getAllCompletionDateEnrollments(filterStartDate, filterEndDate, page - 1, size);
					break;
				case "getAllCertificationDateEnrollments":
					getAllCertificationDateEnrollments(filterStartDate, filterEndDate, page - 1, size);
					break;
				default:
					getAllEnrollments(page - 1, size);
			}
		};
	};

	async function nextEnrollments() {
		if (page < allEnrollments.data.pages) setPage(page + 1);
		if (page < allEnrollments.data.pages) {
			switch (currentFunction) {
				case "getAllEnrollments":
					getAllEnrollments(page + 1, size);
					break;
				case "getAllStatusEnrollments":
					getAllStatusEnrollments(enrollmentStatus, page + 1, size);
					break;
				case "getAllCourseEnrollments":
					getAllCourseEnrollments(filterByCourseUniqueId, page + 1, size);
					break;
				case "getAllReferenceEnrollments":
					getAllReferenceEnrollments(filterByReference, page + 1, size);
					break;
				case "getAllEnrolledDateEnrollments":
					getAllEnrolledDateEnrollments(filterStartDate, filterEndDate, page + 1, size);
					break;
				case "getAllCompletionDateEnrollments":
					getAllCompletionDateEnrollments(filterStartDate, filterEndDate, page + 1, size);
					break;
				case "getAllCertificationDateEnrollments":
					getAllCertificationDateEnrollments(filterStartDate, filterEndDate, page + 1, size);
					break;
				default:
					getAllEnrollments(page + 1, size);
			}
		};
	};

	async function getAllEnrollments(_page, _size) {
		setLoadingAllEnrollments(true);
		const response = await getEnrollments(cookie, (_page || page), (_size || size));
		setAllEnrollments(response.data);
		if (response.error) setErrorEnrollments(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEnrollments(false);
	};
	async function getAllStatusEnrollments(enrollment_status, _page, _size) {
		setLoadingAllEnrollments(true);
		const response = await getEnrollmentsViaEnrollmentStatus(cookie, (_page || page), (_size || size), ({ enrollment_status: enrollment_status }));
		setAllEnrollments(response.data);
		if (response.error) setErrorEnrollments(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEnrollments(false);
	};

	async function getAllCourseEnrollments(course_unique_id, _page, _size) {
		setLoadingAllEnrollments(true);
		const response = await getEnrollmentsViaCourse(cookie, (_page || page), (_size || size), ({ course_unique_id: course_unique_id }));
		setAllEnrollments(response.data);
		if (response.error) setErrorEnrollments(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEnrollments(false);
	};

	async function getAllReferenceEnrollments(reference, _page, _size) {
		setLoadingAllEnrollments(true);
		const response = await getEnrollmentsViaReference(cookie, (_page || page), (_size || size), ({ reference: reference }));
		setAllEnrollments(response.data);
		if (response.error) setErrorEnrollments(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEnrollments(false);
	};

	async function getAllEnrolledDateEnrollments(start_date, end_date, _page, _size) {
		setLoadingAllEnrollments(true);
		const response = await filterEnrollmentsViaEnrolledDate(cookie, (_page || page), (_size || size), ({ start_date: start_date, end_date: end_date }));
		setAllEnrollments(response.data);
		if (response.error) setErrorEnrollments(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEnrollments(false);
	};

	async function getAllCompletionDateEnrollments(start_date, end_date, _page, _size) {
		setLoadingAllEnrollments(true);
		const response = await filterEnrollmentsViaCompletionDate(cookie, (_page || page), (_size || size), ({ start_date: start_date, end_date: end_date }));
		setAllEnrollments(response.data);
		if (response.error) setErrorEnrollments(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEnrollments(false);
	};

	async function getAllCertificationDateEnrollments(start_date, end_date, _page, _size) {
		setLoadingAllEnrollments(true);
		const response = await filterEnrollmentsViaCertificationDate(cookie, (_page || page), (_size || size), ({ start_date: start_date, end_date: end_date }));
		setAllEnrollments(response.data);
		if (response.error) setErrorEnrollments(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEnrollments(false);
	};

	async function getAllCourses() {
		setCourses(null);
		const response = await publicGetCourses(cookie);
		setCourses(response.data);
		if (response.error) setCourses(null);
	};

	async function searchUser(search, _page, _size) {
		setLoadingUsers(true);
		const response = await searchUsers(cookie, (_page || page), (_size || size), { search });
		setUsers(response.data);
		if (response.error) setErrorUsers(response.error.response.status === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message);
		setLoadingUsers(false);
	};

	useEffect(() => {
		if (allEnrollments === null) {
			callLastEnrollmentFunction();
		}
		if (courses === null) {
			getAllCourses();
		} 
	}, [allEnrollments]);

	if (removeAddEnrollmentModal) {
		const modalResponse = document.querySelector("#addEnrollmentModal");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveAddEnrollmentModal(null);
	}
	if (removeCompleteEnrollmentModal) {
		const modalResponse = document.querySelector("#completeEnrollmentModal");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveCompleteEnrollmentModal(null);
	}
	if (removeCancelEnrollmentModal) {
		const modalResponse = document.querySelector("#cancelEnrollmentModal");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveCancelEnrollmentModal(null);
	}
	if (removeUpdateEnrollmentDetailsModal) {
		const modalResponse = document.querySelector("#updateEnrollmentDetailsModal");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveUpdateEnrollmentDetailsModal(null);
	}
	if (removeDeleteEnrollmentModal) {
		const modalResponse = document.querySelector("#deleteEnrollmentModal");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveDeleteEnrollmentModal(null);
	}

	if (removeCourseFilterModal) {
		const modalResponse = document.querySelector("#filterByCourse");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveCourseFilterModal(null);
	}

	if (removeReferenceFilterModal) {
		const modalResponse = document.querySelector("#filterByReference");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveReferenceFilterModal(null);
	}

	if (removeEnrolledDateFilterModal) {
		const modalResponse = document.querySelector("#filterByEnrolledDate");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveEnrolledDateFilterModal(null);
	}
	if (removeCompletionDateFilterModal) {
		const modalResponse = document.querySelector("#filterByCompletionDate");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveCompletionDateFilterModal(null);
	}
	if (removeCertificationDateFilterModal) {
		const modalResponse = document.querySelector("#filterByCertificationDate");
		modalResponse.setAttribute("display", false);
		callLastEnrollmentFunction();
		setRemoveCertificationDateFilterModal(null);
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

	const pageSelectArray = new Array(allEnrollments ? allEnrollments.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className='xui-mt-2'>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Enrollments</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Total - {allEnrollments && allEnrollments.success ? allEnrollments.data.count : "..."}</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half'>
										<Filter width="16" height="16" />
										<select value={enrollmentStatus} onChange={handleEnrollmentStatus} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-ml-half'>
											{
												!enrollmentStatus ?
													<option selected disabled>Filter By Status</option> :
													<option value={null}>Select to Reset</option>
											}
											<option value={"Enrolled"}>Enrolled</option>
											<option value={"Certified"}>Certified</option>
											<option value={"Cancelled"}>Cancelled</option>
											<option value={"Completed"}>Completed</option>
										</select>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByCourse">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Course</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByReference">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Reference</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByEnrolledDate">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Enrolled Date</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByCompletionDate">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Completion Date</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByCertificationDate">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Certification Date</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addEnrollmentModal">
										<span className="xui-mr-half">Add Enrollment</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllEnrollments ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allEnrollments && allEnrollments.success && allEnrollments.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-min-w-20'>S/N</th>
														<th className='xui-min-w-150'>Reference</th>
														<th className='xui-min-w-300'>User</th>
														<th className='xui-min-w-300'>Course</th>
														<th className='xui-min-w-150'>Enrollment Details</th>
														<th className='xui-min-w-100'>Enrolled Date</th>
														<th className='xui-min-w-100'>Completion Date</th>
														<th className='xui-min-w-100'>Certification Date</th>
														<th className='xui-min-w-150'>Status</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-300'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allEnrollments.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	{i + 1}
																</div>
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
																<span>
																	{
																		data.user || allEnrollments.data.user ?
																			<div className='xui-d-inline-flex xui-flex-ai-center'>
																				<span>{(data.user ? data.user.firstname + (data.user.middlename ? " " + data.user.middlename + " " : " ") + data.user.lastname : allEnrollments.data.user.firstname + (allEnrollments.data.user.middlename ? " " + allEnrollments.data.user.middlename + " " : " ") + allEnrollments.data.user.lastname)}</span>
																				<span title="Copy User Unique ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.user ? data.user.unique_id : allEnrollments.data.user.unique_id); setTextCopied(data.user ? data.user.unique_id : allEnrollments.data.user.unique_id); }}>
																					{copiedText && textCopied === (data.user ? data.user.unique_id : allEnrollments.data.user.unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																				</span>
																			</div> :
																			"No User"
																	}
																</span>
															</td>
															<td className='xui-opacity-5'>
																<span>
																	{
																		data.course ?
																			<div className='xui-d-inline-flex xui-flex-ai-center'>
																				<span>{data.course.title}</span>
																				<span title="Copy Course Unique ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.course.unique_id); setTextCopied(data.course.unique_id); }}>
																					{copiedText && textCopied === (data.course.unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																				</span>
																			</div> :
																			"No Course"
																	}
																</span>
															</td>
															<td className=''>
																{
																	data.enrollment_details ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Available</span> :
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Not updated</span> 
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.enrolled_date ? data.enrolled_date : "Not found"}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.completion_date ? data.completion_date : "Not found"}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.certification_date ? data.certification_date : "Not found"}</span>
															</td>
															<td className=''>
																{
																	data.enrollment_status === "Completed" ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{data.enrollment_status}</span> : ""
																}
																{
																	data.enrollment_status === "Enrolled" ?
																		<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{data.enrollment_status}</span> : ""
																}
																{
																	data.enrollment_status === "Certified" ?
																		<span className='xui-badge xui-badge-blue xui-font-sz-80 xui-bdr-rad-half'>{data.enrollment_status}</span> : ""
																}
																{
																	data.enrollment_status === "Cancelled" ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{data.enrollment_status}</span> : ""
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
																	{
																		data.enrollment_status === "Enrolled" && data.user ?
																			<button title="Update Enrollment Details" onClick={() => { UpdateEnrollmentDetailsSetUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="updateEnrollmentDetailsModal">
																				<Reset width="20" height="20" />
																			</button> :
																			""
																	}
																	{
																		data.enrollment_status === "Enrolled" && data.user ?
																			<button title="Complete Enrollment" onClick={() => { CompleteEnrollmentSetUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="completeEnrollmentModal">
																				<Check width="20" height="20" />
																			</button> :
																			""
																	}
																	{
																		data.enrollment_status === "Enrolled" && data.user ?
																			<button title="Cancel Enrollment" onClick={() => { CancelEnrollmentSetUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="cancelEnrollmentModal">
																				<Close width="20" height="20" />
																			</button> :
																			""
																	}
																	<button title="View Enrollment Full Details"
																		onClick={() => {
																			setEnrollmentFullDetails(data);
																		}} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="enrollmentFullDetailsModal">
																		<EyeOpenAlt width="20" height="20" />
																	</button>
																	<button title="Delete Enrollment" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteEnrollmentModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorEnrollments || "No data found!"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllEnrollments ?
								<Loading width="12" height="12" /> :
								(
									allEnrollments && allEnrollments.success && allEnrollments.data.rows.length !== 0 ?
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
												</select></span> of {allEnrollments ? allEnrollments.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousEnrollments}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextEnrollments}>
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
			<section className='xui-modal' xui-modal="filterByCourse" id="filterByCourse">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetCourseFilterParameters()} xui-modal-close="filterByCourse">
						<Close width="24" height="24" />
					</div>
					<h1>Filter By Course</h1>
					<form className="xui-form" onSubmit={continueFilterByCourse}>
						<div className="xui-form-box xui-mt-1">
							<label>Course</label>
							<select onChange={handleFilterByCourseUniqueId} value={filterByCourseUniqueId} required>
								<option selected value={""}>Select Course</option>
								{
									courses && courses.data.rows.length !== 0 ? (
										courses.data.rows.map((item, index) => {
											return (
												<optgroup label={`${item.course_category.title} - ${item.course_type.title}`}>
													<option key={index} value={item.unique_id}>{item.title} ({item.active_enrollment ? "Active" : "Inactive"})</option>
												</optgroup>
											)
										})
									) : ""
								}
							</select>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-70">
								<Filter width="16" height="16" />
								<span className="xui-ml-half">Filter</span>
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="filterByReference" id="filterByReference">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetReferenceFilterParameters()} xui-modal-close="filterByReference">
						<Close width="24" height="24" />
					</div>
					<h1>Filter By Reference</h1>
					<form className="xui-form" onSubmit={continueFilterByReference}>
						<div className="xui-form-box">
							<label>Reference</label>
							<input className="xui-font-sz-90" type="text" value={filterByReference} onChange={handleFilterByReference} required placeholder="Enter/Paste Reference"></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-70">
								<Filter width="16" height="16" />
								<span className="xui-ml-half">Filter</span>
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="filterByEnrolledDate" id="filterByEnrolledDate">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetDateFilterParameters()} xui-modal-close="filterByEnrolledDate">
						<Close width="24" height="24" />
					</div>
					<h1>Filter By Enrolled Date</h1>
					<form className="xui-form" onSubmit={continueFilterByEnrolledDate}>
						<div className="xui-form-box">
							<label>Start Date</label>
							<input className="xui-font-sz-90" type="date" name="startDate" onChange={handleFilterStartDate} required></input>
						</div>
						<div className="xui-form-box">
							<label>End Date</label>
							<input className="xui-font-sz-90" type="date" name="endDate" onChange={handleFilterEndDate} required></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-70">
								<Filter width="16" height="16" />
								<span className="xui-ml-half">Filter</span>
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="filterByCompletionDate" id="filterByCompletionDate">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetDateFilterParameters()} xui-modal-close="filterByCompletionDate">
						<Close width="24" height="24" />
					</div>
					<h1>Filter By Completion Date</h1>
					<form className="xui-form" onSubmit={continueFilterByCompletionDate}>
						<div className="xui-form-box">
							<label>Start Date</label>
							<input className="xui-font-sz-90" type="date" name="startDate" onChange={handleFilterStartDate} required></input>
						</div>
						<div className="xui-form-box">
							<label>End Date</label>
							<input className="xui-font-sz-90" type="date" name="endDate" onChange={handleFilterEndDate} required></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-70">
								<Filter width="16" height="16" />
								<span className="xui-ml-half">Filter</span>
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="filterByCertificationDate" id="filterByCertificationDate">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetDateFilterParameters()} xui-modal-close="filterByCertificationDate">
						<Close width="24" height="24" />
					</div>
					<h1>Filter By Certification Date</h1>
					<form className="xui-form" onSubmit={continueFilterByCertificationDate}>
						<div className="xui-form-box">
							<label>Start Date</label>
							<input className="xui-font-sz-90" type="date" name="startDate" onChange={handleFilterStartDate} required></input>
						</div>
						<div className="xui-form-box">
							<label>End Date</label>
							<input className="xui-font-sz-90" type="date" name="endDate" onChange={handleFilterEndDate} required></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-70">
								<Filter width="16" height="16" />
								<span className="xui-ml-half">Filter</span>
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addEnrollmentModal" id="addEnrollmentModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addEnrollmentModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Enrollment</h1>
					<form className="xui-form xui-mt-2 xui-mb-2" onSubmit={(e) => {
						e.preventDefault();
						if (userSearch.length > 0) {
							searchUser(userSearch);
						} else {

						}
					}}>
						<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
							<label>Search for user</label>
							<div className="xui-d-flex xui-flex-ai-center">
								<input style={{ width: "calc(100% - 50px)" }} type={"text"} placeholder={"Enter search word"} value={userSearch} onChange={handleUserSearch} />
								<button className="xui-bdr-light-blue xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-light-blue xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text" >
									{
										loadingUsers ? 
											<Loading width="16" height="16" /> :
											<Search width="16" height="16" />
									}
								</button>
							</div>
							{(users && users.data.rows.length !== 0) && <p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-green">Users loaded</span></p>}
							{(users && users.data.rows.length == 0) && <p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">No result found</span></p> }
						</div>
					</form>
					<hr></hr>
					<form className="xui-form" layout="2" onSubmit={handleAddEnrollment}>
						<div className="xui-form-box xui-mt-1">
							<label>Course</label>
							<select onChange={handleCourseUniqueId} value={courseUniqueId} required>
								<option selected value={""}>Select Course</option>
								{
									courses && courses.data.rows.length !== 0 ? (
										courses.data.rows.map((item, index) => {
											return (
												<optgroup label={`${item.course_category.title} - ${item.course_type.title}`}>
													<option key={index} disabled={!item.active_enrollment} value={item.unique_id}>{item.title} ({item.active_enrollment ? "Active" : "Inactive"})</option>
												</optgroup>
											)
										})
									) : ""
								}
							</select>
						</div>
						<div className="xui-form-box xui-mt-1">
							<label>User</label>
							<select onChange={handleUserUniqueId} value={userUniqueId} required>
								<option selected value={""}>Select User</option>
								{
									users && users.data.rows.length !== 0 ? (
										users.data.rows.map((item, index) => {
											return (
												<optgroup label={`${item.type}`}>
													<option key={index} disabled={item.type !== "Student"} value={item.unique_id}>{item.firstname + (item.middlename ? " " + item.middlename + " " : " ") + item.lastname} ({item.email})</option>
												</optgroup>
											)
										})
									) : ""
								}
							</select>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddEnrollment} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Enrollment</span>
								{
									loadingAddEnrollment ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddEnrollment}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddEnrollment}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="completeEnrollmentModal" id="completeEnrollmentModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Complete Enrollment</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCompleteEnrollment}</span></p>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCompleteEnrollment}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleCompleteEnrollment} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingCompleteEnrollment ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingCompleteEnrollment ? "" : "completeEnrollmentModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="cancelEnrollmentModal" id="cancelEnrollmentModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Cancel Enrollment</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCancelEnrollment}</span></p>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCancelEnrollment}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleCancelEnrollment} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingCancelEnrollment ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingCancelEnrollment ? "" : "cancelEnrollmentModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="updateEnrollmentDetailsModal" id="updateEnrollmentDetailsModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Update Enrollment Details from Course</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateEnrollmentDetails}</span></p>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateEnrollmentDetails}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleUpdateEnrollmentDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingUpdateEnrollmentDetails ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingUpdateEnrollmentDetails ? "" : "updateEnrollmentDetailsModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="enrollmentFullDetailsModal" id="enrollmentFullDetailsModal">
				<div className='xui-modal-content xui-max-h-500 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => setEnrollmentFullDetails(null)} xui-modal-close="enrollmentFullDetailsModal">
						<Close width="24" height="24" />
					</div>
					<center>
						<h1>Enrollment Full Details</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">
							<div className='xui-d-inline-flex xui-flex-ai-center'>
								<span>#{enrollmentFullDetails?.unique_id}</span>
								<span title="Copy ID Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(enrollmentFullDetails?.unique_id); setTextCopied(enrollmentFullDetails?.unique_id); }}>
									{copiedText && textCopied === enrollmentFullDetails?.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
								</span>
							</div>
						</p>
					</center>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-1">
						<div className="">
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">User - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Course - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Enrolled Date - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Completion Date - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Certification Date - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Reference - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Status - </p>
						</div>
						<div className="">
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{enrollmentFullDetails?.user.firstname + (enrollmentFullDetails?.user.middlename ? " " + enrollmentFullDetails?.user.middlename + " " : " ") + enrollmentFullDetails?.user.lastname}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{enrollmentFullDetails?.course.title} ({enrollmentFullDetails?.course.active_enrollment ? "Active" : "Inactive"}) | Certificate - {enrollmentFullDetails?.course.certificate}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{enrollmentFullDetails?.enrolled_date ? enrollmentFullDetails?.enrolled_date : "No date"}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{enrollmentFullDetails?.completion_date ? enrollmentFullDetails?.completion_date : "No date"}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{enrollmentFullDetails?.certification_date ? enrollmentFullDetails?.certification_date : "No date"}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">
								<div className='xui-d-inline-flex xui-flex-ai-center'>
									<span>{enrollmentFullDetails?.reference}</span>
									<span title="Copy Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(enrollmentFullDetails?.reference); setTextCopied(enrollmentFullDetails?.reference); }}>
										{copiedText && textCopied === enrollmentFullDetails?.reference ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
									</span>
								</div>
							</p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">
								{
									enrollmentFullDetails?.enrollment_status === "Completed" ?
										<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{enrollmentFullDetails?.enrollment_status}</span> : ""
								}
								{
									enrollmentFullDetails?.enrollment_status === "Enrolled" ?
										<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{enrollmentFullDetails?.enrollment_status}</span> : ""
								}
								{
									enrollmentFullDetails?.enrollment_status === "Certified" ?
										<span className='xui-badge xui-badge-blue xui-font-sz-80 xui-bdr-rad-half'>{enrollmentFullDetails?.enrollment_status}</span> : ""
								}
								{
									enrollmentFullDetails?.enrollment_status === "Cancelled" ?
										<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{enrollmentFullDetails?.enrollment_status}</span> : ""
								}
							</p>
						</div>
					</div>
					<center>
						<p className="xui-opacity-4 xui-font-sz-90 xui-m-half">Created - {new Date(enrollmentFullDetails?.createdAt).toLocaleString()} | Last Updated - {new Date(enrollmentFullDetails?.updatedAt).toLocaleString()}</p>
					</center>
				</div>
			</section>
			<section className='xui-modal' xui-modal="deleteEnrollmentModal" id="deleteEnrollmentModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Enrollment</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteEnrollment}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteEnrollment}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteEnrollment} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteEnrollment ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteEnrollment ? "" : "deleteEnrollmentModal"}>
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