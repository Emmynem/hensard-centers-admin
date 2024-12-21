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
import Filter from "../icons/Filter";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import {
	getTransactionsViaUser, getTransactions, getTransactionsViaStatus, getTransactionsViaType, getTransactionsViaReference, filterTransactions
} from "../api/transactions";
import Loading from "../icons/Loading";
import {
	useCompleteDeposit, useCompleteWithdrawal, useCompleteEnrollmentFee
} from "../hooks/useTransactions";
import Cancel from "../icons/Cancel";
import Copy from "../icons/Copy";
import EyeOpenAlt from "../icons/EyeOpenAlt";
import Delete from "../icons/Delete";

export default function Transactions() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorCompleteDeposit, handleCompleteDeposit, loadingCompleteDeposit, userDepositUniqueId, removeCompleteDepositModal, setUserDepositUniqueId, 
		setUserUniqueId: UserDepositUniqueId, setRemoveCompleteDepositModal, successCompleteDeposit
	} = useCompleteDeposit();

	const {
		errorCompleteWithdrawal, handleCompleteWithdrawal, loadingCompleteWithdrawal, userWithdrawalUniqueId, removeCompleteWithdrawalModal, setUserWithdrawalUniqueId, 
		setUserUniqueId: UserWithdrawalUniqueId, setRemoveCompleteWithdrawalModal, successCompleteWithdrawal
	} = useCompleteWithdrawal();

	const {
		errorCompleteEnrollmentFee, handleCompleteEnrollmentFee, loadingCompleteEnrollmentFee, enrollmentFeeReference, removeCompleteEnrollmentFeeModal, setEnrollmentFeeReference, 
		setUserUniqueId: UserEnrollmentFeeUniqueId, setRemoveCompleteEnrollmentFeeModal, successCompleteEnrollmentFee
	} = useCompleteEnrollmentFee();

	const [currentFunction, setCurrentFunction] = useState("getAllTransactions");

	const [filterByUserFilterType, setFilterByUserFilterType] = useState(null);
	const [filterByUserTransactionStatus, setFilterByUserTransactionStatus] = useState(null);
	const [filterByUserUniqueId, setFilterByUserUniqueId] = useState("");
	const [removeUserFilterModal, setRemoveUserFilterModal] = useState(null);

	const [filterByReference, setFilterByReference] = useState("");
	const [removeReferenceFilterModal, setRemoveReferenceFilterModal] = useState(null);

	const [filterType, setFilterType] = useState(null);
	const [transactionStatus, setTransactionStatus] = useState(null);

	const [filterStartDate, setFilterStartDate] = useState(null);
	const [filterEndDate, setFilterEndDate] = useState(null);

	const [removeDateFilterModal, setRemoveDateFilterModal] = useState(null);

	const handleFilterStartDate = (e) => { e.preventDefault(); setFilterStartDate(e.target.value); };
	const handleFilterEndDate = (e) => { e.preventDefault(); setFilterEndDate(e.target.value); };

	const [transactionFullDetails, setTransactionFullDetails] = useState(null);

	const [userBankDetails, setUserBankDetails] = useState(null);

	const [allTransactions, setAllTransactions] = useState(null);
	const [errorTransactions, setErrorTransactions] = useState(null);
	const [loadingAllTransactions, setLoadingAllTransactions] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); transactionsBySize(e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); transactionsByPage(parseInt(e.target.value), size); };
	const handleFilterType = (e) => { e.preventDefault(); setFilterType(e.target.value === "Select to Reset" ? null : e.target.value); setPage(1); if (e.target.value !== null && e.target.value !== "Select to Reset") setCurrentFunction("getAllTypeTransactions"); getAllTypeTransactions(e.target.value, page, size); };
	const handleTransactionStatus = (e) => { e.preventDefault(); setTransactionStatus(e.target.value === "Select to Reset" ? null : e.target.value); setPage(1); if (e.target.value !== null && e.target.value !== "Select to Reset") setCurrentFunction("getAllStatusTransactions"); getAllStatusTransactions(e.target.value, page, size); };

	const handleFilterByUserUniqueId = (e) => { e.preventDefault(); setFilterByUserUniqueId(e.target.value); };
	const handleFilterByUserFilterType = (e) => { e.preventDefault(); if (e.target.value.length > 0) setFilterByUserFilterType(e.target.value); else setFilterByUserFilterType(null); setFilterByUserTransactionStatus(null); };
	const handleFilterByUserTransactionStatus = (e) => { e.preventDefault(); if (e.target.value.length > 0) setFilterByUserTransactionStatus(e.target.value); else setFilterByUserTransactionStatus(null); setFilterByUserFilterType(null); };

	const handleFilterByReference = (e) => { e.preventDefault(); setFilterByReference(e.target.value); };

	const resetUserFilterParameters = () => {
		setFilterByUserUniqueId("");
		setFilterByUserFilterType(null);
		setFilterByUserTransactionStatus(null);
		setCurrentFunction("getAllTransactions");
	};

	const resetReferenceFilterParameters = () => {
		setFilterByReference("");
		setCurrentFunction("getAllTransactions");
	};

	const resetDateFilterParameters = () => {
		setFilterStartDate(null);
		setFilterEndDate(null);
		setCurrentFunction("getAllTransactions");
	};

	const continueUserFilterByUser = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllUserTransactions");
		getAllUserTransactions(filterByUserUniqueId, page, size);
		setRemoveUserFilterModal(true);
	};

	const continueFilterByReference = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllReferenceTransactions");
		getAllReferenceTransactions(filterByReference, page, size);
		setRemoveReferenceFilterModal(true);
	};

	const continueFilterByDate = (e) => {
		e.preventDefault();

		if (!filterStartDate || !filterEndDate) {
			alert("Start and End dates are required");
		} else {
			setPage(1);
			setCurrentFunction("getAllDateTransactions");
			getAllDateTransactions(filterStartDate, filterEndDate, page, size);
			setRemoveDateFilterModal(true);
			// setFilterEndDate(null); setFilterStartDate(null);
		}
	};

	async function callLastTransactionFunction() {
		switch (currentFunction) {
			case "getAllTransactions":
				getAllTransactions(page, size);
				break;
			case "getAllTypeTransactions":
				getAllTypeTransactions(filterType, page, size);
				break;
			case "getAllStatusTransactions":
				getAllStatusTransactions(transactionStatus, page, size);
				break;
			case "getAllUserTransactions":
				getAllUserTransactions(filterByUserUniqueId, page, size);
				break;
			case "getAllReferenceTransactions":
				getAllReferenceTransactions(filterByReference, page, size);
				break;
			case "getAllDateTransactions":
				getAllDateTransactions(filterStartDate, filterEndDate, page, size);
				break;
			// default:
			// 	getAllTransactions(page, size);
		}
	};

	async function transactionsBySize(size) {
		switch (currentFunction) {
			case "getAllTransactions":
				getAllTransactions(page, size);
				break;
			case "getAllTypeTransactions":
				getAllTypeTransactions(filterType, page, size);
				break;
			case "getAllStatusTransactions":
				getAllStatusTransactions(transactionStatus, page, size);
				break;
			case "getAllUserTransactions":
				getAllUserTransactions(filterByUserUniqueId, page, size);
				break;
			case "getAllReferenceTransactions":
				getAllReferenceTransactions(filterByReference, page, size);
				break;
			case "getAllDateTransactions":
				getAllDateTransactions(filterStartDate, filterEndDate, page, size);
				break;
			default:
				getAllTransactions(page, size);
		}
	};

	async function transactionsByPage(page) {
		switch (currentFunction) {
			case "getAllTransactions":
				getAllTransactions(page, size);
				break;
			case "getAllTypeTransactions":
				getAllTypeTransactions(filterType, page, size);
				break;
			case "getAllStatusTransactions":
				getAllStatusTransactions(transactionStatus, page, size);
				break;
			case "getAllUserTransactions":
				getAllUserTransactions(filterByUserUniqueId, page, size);
				break;
			case "getAllReferenceTransactions":
				getAllReferenceTransactions(filterByReference, page, size);
				break;
			case "getAllDateTransactions":
				getAllDateTransactions(filterStartDate, filterEndDate, page, size);
				break;
			default:
				getAllTransactions(page, size);
		}
	};

	async function previousTransactions() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) {
			switch (currentFunction) {
				case "getAllTransactions":
					getAllTransactions(page - 1, size);
					break;
				case "getAllTypeTransactions":
					getAllTypeTransactions(filterType, page - 1, size);
					break;
				case "getAllStatusTransactions":
					getAllStatusTransactions(transactionStatus, page - 1, size);
					break;
				case "getAllUserTransactions":
					getAllUserTransactions(filterByUserUniqueId, page - 1, size);
					break;
				case "getAllReferenceTransactions":
					getAllReferenceTransactions(filterByReference, page - 1, size);
					break;
				case "getAllDateTransactions":
					getAllDateTransactions(filterStartDate, filterEndDate, page - 1, size);
					break;
				default:
					getAllTransactions(page - 1, size);
			}
		};
	};

	async function nextTransactions() {
		if (page < allTransactions.data.pages) setPage(page + 1);
		if (page < allTransactions.data.pages) {
			switch (currentFunction) {
				case "getAllTransactions":
					getAllTransactions(page + 1, size);
					break;
				case "getAllTypeTransactions":
					getAllTypeTransactions(filterType, page + 1, size);
					break;
				case "getAllStatusTransactions":
					getAllStatusTransactions(transactionStatus, page + 1, size);
					break;
				case "getAllUserTransactions":
					getAllUserTransactions(filterByUserUniqueId, page + 1, size);
					break;
				case "getAllReferenceTransactions":
					getAllReferenceTransactions(filterByReference, page + 1, size);
					break;
				case "getAllDateTransactions":
					getAllDateTransactions(filterStartDate, filterEndDate, page + 1, size);
					break;
				default:
					getAllTransactions(page + 1, size);
			}
		};
	};

	async function getAllTransactions(_page, _size) {
		setLoadingAllTransactions(true);
		const response = await getTransactions(cookie, (_page || page), (_size || size));
		setAllTransactions(response.data);
		if (response.error) setErrorTransactions(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllTransactions(false);
	};
	async function getAllTypeTransactions(type, _page, _size) {
		setLoadingAllTransactions(true);
		const response = await getTransactionsViaType(cookie, (_page || page), (_size || size), ({ type: type }));
		setAllTransactions(response.data);
		if (response.error) setErrorTransactions(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllTransactions(false);
	};
	async function getAllStatusTransactions(transaction_status, _page, _size) {
		setLoadingAllTransactions(true);
		const response = await getTransactionsViaStatus(cookie, (_page || page), (_size || size), ({ transaction_status: transaction_status }));
		setAllTransactions(response.data);
		if (response.error) setErrorTransactions(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllTransactions(false);
	};

	async function getAllUserTransactions(user_unique_id, _page, _size) {
		setLoadingAllTransactions(true);
		const response = await getTransactionsViaUser(cookie, (_page || page), (_size || size), ({ user_unique_id: user_unique_id }));
		setAllTransactions(response.data);
		if (response.error) setErrorTransactions(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllTransactions(false);
	};

	async function getAllReferenceTransactions(reference, _page, _size) {
		setLoadingAllTransactions(true);
		const response = await getTransactionsViaReference(cookie, (_page || page), (_size || size), ({ reference: reference }));
		setAllTransactions(response.data);
		if (response.error) setErrorTransactions(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllTransactions(false);
	};

	async function getAllDateTransactions(start_date, end_date, _page, _size) {
		setLoadingAllTransactions(true);
		const response = await filterTransactions(cookie, (_page || page), (_size || size), ({ start_date: start_date, end_date: end_date }));
		setAllTransactions(response.data);
		if (response.error) setErrorTransactions(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllTransactions(false);
	};

	useEffect(() => {
		if (allTransactions === null) {
			callLastTransactionFunction();
		}
	}, [allTransactions]);

	if (removeCompleteDepositModal) {
		const modalResponse = document.querySelector("#userDepositConfirmationDialog");
		modalResponse.setAttribute("display", false);
		callLastTransactionFunction();
		setRemoveCompleteDepositModal(null);
	}
	if (removeCompleteWithdrawalModal) {
		const modalResponse = document.querySelector("#userWithdrawalConfirmationDialog");
		modalResponse.setAttribute("display", false);
		callLastTransactionFunction();
		setRemoveCompleteWithdrawalModal(null);
	}
	if (removeCompleteEnrollmentFeeModal) {
		const modalResponse = document.querySelector("#enrollmentFeeConfirmationDialog");
		modalResponse.setAttribute("display", false);
		callLastTransactionFunction();
		setRemoveCompleteEnrollmentFeeModal(null);
	}

	if (removeUserFilterModal) {
		const modalResponse = document.querySelector("#filterByUser");
		modalResponse.setAttribute("display", false);
		callLastTransactionFunction();
		setRemoveUserFilterModal(null);
	}

	if (removeReferenceFilterModal) {
		const modalResponse = document.querySelector("#filterByReference");
		modalResponse.setAttribute("display", false);
		callLastTransactionFunction();
		setRemoveReferenceFilterModal(null);
	}

	if (removeDateFilterModal) {
		const modalResponse = document.querySelector("#filterByDate");
		modalResponse.setAttribute("display", false);
		callLastTransactionFunction();
		setRemoveDateFilterModal(null);
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

	const pageSelectArray = new Array(allTransactions ? allTransactions.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className='xui-mt-2'>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Transactions</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Total - {allTransactions && allTransactions.success ? allTransactions.data.count : "..."}</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half'>
										<Filter width="16" height="16" />
										<select value={filterType} onChange={handleFilterType} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-ml-half'>
											{
												!filterType ?
													<option selected disabled>Filter By Type</option> :
													<option value={null}>Select to Reset</option>
											}
											<option value={"Deposit"}>Deposit</option>
											<option value={"Withdrawal"}>Withdrawal</option>
											<option value={"Payment"}>Payment</option>
											<option value={"Debit"}>Debit</option>
											<option value={"Refund"}>Refund</option>
											<option value={"Transfer"}>Transfer</option>
											<option value={"Enrollment Fee"}>Enrollment Fee</option>
											<option value={"Certification Fee"}>Certification Fee</option>
											<option value={"Application Fee"}>Application Fee</option>
											<option value={"Fees"}>Fees</option>
										</select>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half'>
										<Filter width="16" height="16" />
										<select value={transactionStatus} onChange={handleTransactionStatus} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-ml-half'>
											{
												!transactionStatus ?
													<option selected disabled>Filter By Status</option> :
													<option value={null}>Select to Reset</option>
											}
											<option value={"Processing"}>Processing</option>
											<option value={"Reversed"}>Reversed</option>
											<option value={"Cancelled"}>Cancelled</option>
											<option value={"Completed"}>Completed</option>
										</select>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByUser">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By User</span>
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
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByDate">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Date</span>
									</div>
								</div>
							</div>
						</div>
						{
							loadingAllTransactions ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allTransactions && allTransactions.success && allTransactions.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-min-w-20'>S/N</th>
														<th className='xui-min-w-150'>Reference</th>
														<th className='xui-min-w-300'>Card / Transfer Reference</th>
														<th className='xui-min-w-300'>User</th>
														<th className='xui-min-w-300'>Course</th>
														<th className='xui-min-w-200'>Type</th>
														<th className='xui-min-w-150'>Payment Method</th>
														<th className='xui-min-w-150'>Gateway</th>
														<th className='xui-min-w-150'>Amount</th>
														<th className='xui-min-w-250'>Details</th>
														<th className='xui-min-w-150'>Status</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-200'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allTransactions.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	{i + 1}
																</div>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>#{data.unique_id}</span>
																	<span title="Copy ID Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.unique_id); setTextCopied(data.unique_id); }}>
																		{copiedText && textCopied === data.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.reference}</span>
																	<span title="Copy Other Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.reference); setTextCopied(data.reference); }}>
																		{copiedText && textCopied === data.reference ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span>
																	{
																		data.user || allTransactions.data.user ?
																			<div className='xui-d-inline-flex xui-flex-ai-center'>
																				<span>{(data.user ? data.user.firstname + (data.user.middlename ? " " + data.user.middlename + " " : " ") + data.user.lastname : allTransactions.data.user.firstname + (allTransactions.data.user.middlename ? " " + allTransactions.data.user.middlename + " " : " ") + allTransactions.data.user.lastname)}</span>
																				<span title="Copy User Unique ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.user ? data.user.unique_id : allTransactions.data.user.unique_id); setTextCopied(data.user ? data.user.unique_id : allTransactions.data.user.unique_id); }}>
																					{copiedText && textCopied === (data.user ? data.user.unique_id : allTransactions.data.user.unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
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
															<td className='xui-opacity-5'>
																<span>{data.type}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.payment_method ? data.payment_method : "Not found"}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.gateway ? data.gateway : "Not found"}</span>
															</td>
															<td className='xui-opacity-5 xui-font-w-bold'>
																<span>{data.amount === 0 ? "Free" : data.currency + " " + data.amount.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.details}</span>
															</td>
															<td className=''>
																{
																	data.transaction_status === "Completed" ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{data.transaction_status}</span> : ""
																}
																{
																	data.transaction_status === "Processing" ?
																		<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{data.transaction_status}</span> : ""
																}
																{
																	data.transaction_status === "Reversed" ?
																		<span className='xui-badge xui-badge-blue xui-font-sz-80 xui-bdr-rad-half'>{data.transaction_status}</span> : ""
																}
																{
																	data.transaction_status === "Cancelled" ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{data.transaction_status}</span> : ""
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
																		data.transaction_status === "Processing" && data.type === "Enrollment Fee" && data.user ?
																			<button title="Complete Enrollment Fee Transaction" onClick={() => { setEnrollmentFeeReference(data.reference); UserEnrollmentFeeUniqueId(data.user.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="enrollmentFeeConfirmationDialog">
																				<Check width="20" height="20" />
																			</button> :
																			""
																	}
																	{/* {
																		data.transaction_status === "Processing" && data.type === "Deposit" && (data.user || allTransactions.data.user) ?
																			<button title="Complete User Deposit Transaction" onClick={() => { setUserDepositUniqueId(data.unique_id); UserDepositUniqueId(data.user ? data.user.unique_id : allTransactions.data.user.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="userDepositConfirmationDialog">
																				<Check width="20" height="20" />
																			</button> :
																			""
																	}
																	{
																		data.transaction_status === "Processing" && data.type === "Withdrawal" && (data.user || allTransactions.data.user) ?
																			<button title="Complete User Withdrawal Transaction" onClick={() => { setUserWithdrawalUniqueId(data.unique_id); UserWithdrawalUniqueId(data.user ? data.user.unique_id : allTransactions.data.user.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="userWithdrawalConfirmationDialog">
																				<Check width="20" height="20" />
																			</button> :
																			""
																	}
																	{
																		data.transaction_status === "Processing" && data.type === "Withdrawal" && (data.user || allTransactions.data.user) ?
																			<button title="View User Bank Details" 
																				onClick={() => { 
																					setUserBankDetails(
																						data.user ? { 
																							name: data.user.firstname + (data.user.middlename ? " " + data.user.middlename + " " : " ") + data.user.lastname,
																							account_name: data.user.account_name, 
																							account_number: data.user.account_number, 
																							bank: data.user.bank 
																						} : { 
																							name: allTransactions.data.user.firstname + (allTransactions.data.user.middlename ? " " + allTransactions.data.user.middlename + " " : " ") + allTransactions.data.user.lastname,
																							account_name: allTransactions.data.user.account_name, 
																							account_number: allTransactions.data.user.account_number, 
																							bank: allTransactions.data.user.bank 
																						}); 
																				}} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="userBankDetailsModal">
																				<EyeOpenAlt width="20" height="20" />
																			</button> :
																			""
																	} */}
																	<button title="View Transaction Full Details"
																		onClick={() => {
																			setTransactionFullDetails(data);
																		}} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="transactionFullDetailsModal">
																		<EyeOpenAlt width="20" height="20" />
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorTransactions || "No data found!"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllTransactions ?
								<Loading width="12" height="12" /> :
								(
									allTransactions && allTransactions.success && allTransactions.data.rows.length !== 0 ?
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
												</select></span> of {allTransactions ? allTransactions.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousTransactions}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextTransactions}>
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
			<section className='xui-modal' xui-modal="filterByUser" id="filterByUser">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetUserFilterParameters()} xui-modal-close="filterByUser">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Transactions By User</h1>
					<form className="xui-form" onSubmit={continueUserFilterByUser}>
						<div className="xui-form-box">
							<label>User Unique Id</label>
							<input className="xui-font-sz-90" type="text" value={filterByUserUniqueId} onChange={handleFilterByUserUniqueId} required placeholder="Enter/Paste User UniqueId"></input>
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
					<h1>Filter Transactions By Reference</h1>
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
			<section className='xui-modal' xui-modal="filterByDate" id="filterByDate">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetDateFilterParameters()} xui-modal-close="filterByDate">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Transactions By Date</h1>
					<form className="xui-form" onSubmit={continueFilterByDate}>
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
			<section className='xui-modal' xui-modal="userDepositConfirmationDialog" id="userDepositConfirmationDialog">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Complete User Deposit Transaction</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCompleteDeposit}</span></p>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCompleteDeposit}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleCompleteDeposit} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingCompleteDeposit ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingCompleteDeposit ? "" : "userDepositConfirmationDialog"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="enrollmentFeeConfirmationDialog" id="enrollmentFeeConfirmationDialog">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Complete Enrollment Fee Transaction</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCompleteEnrollmentFee}</span></p>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCompleteEnrollmentFee}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleCompleteEnrollmentFee} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingCompleteEnrollmentFee ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingCompleteEnrollmentFee ? "" : "enrollmentFeeConfirmationDialog"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="transactionFullDetailsModal" id="transactionFullDetailsModal">
				<div className='xui-modal-content xui-max-h-500 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => setTransactionFullDetails(null)} xui-modal-close="transactionFullDetailsModal">
						<Close width="24" height="24" />
					</div>
					<center>
						<h1>Transaction Full Details</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">
							<div className='xui-d-inline-flex xui-flex-ai-center'>
								<span>#{transactionFullDetails?.unique_id}</span>
								<span title="Copy ID Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(transactionFullDetails?.unique_id); setTextCopied(transactionFullDetails?.unique_id); }}>
									{copiedText && textCopied === transactionFullDetails?.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
								</span>
							</div>
						</p>
					</center>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-1">
						<div className="">
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Gateway - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Payment Method - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Amount - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Details - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Reference - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Gateway Reference - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Type - </p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Status - </p>
						</div>
						<div className="">
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{transactionFullDetails?.gateway}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{transactionFullDetails?.payment_method}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{transactionFullDetails?.amount === 0 ? "Free" : "USD " + transactionFullDetails?.amount.toLocaleString()}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half"><span>{transactionFullDetails?.details ? transactionFullDetails?.details : "No details"}</span></p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">
								<div className='xui-d-inline-flex xui-flex-ai-center'>
									<span>{transactionFullDetails?.reference}</span>
									<span title="Copy Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(transactionFullDetails?.reference); setTextCopied(transactionFullDetails?.reference); }}>
										{copiedText && textCopied === transactionFullDetails?.reference ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
									</span>
								</div>
							</p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">
								{
									transactionFullDetails?.gateway_reference ?
										<div className='xui-d-inline-flex xui-flex-ai-center'>
											<span>{transactionFullDetails?.gateway_reference}</span>
											<span title="Copy Reference" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(transactionFullDetails?.gateway_reference); setTextCopied(transactionFullDetails?.gateway_reference); }}>
												{copiedText && textCopied === transactionFullDetails?.gateway_reference ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
											</span>
										</div> : "No gateway reference"
								}
							</p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">{transactionFullDetails?.type}</p>
							<hr></hr>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">
								{
									transactionFullDetails?.transaction_status === "Completed" ?
										<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{transactionFullDetails?.transaction_status}</span> : ""
								}
								{
									transactionFullDetails?.transaction_status === "Processing" ?
										<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{transactionFullDetails?.transaction_status}</span> : ""
								}
								{
									transactionFullDetails?.transaction_status === "Reversed" ?
										<span className='xui-badge xui-badge-blue xui-font-sz-80 xui-bdr-rad-half'>{transactionFullDetails?.transaction_status}</span> : ""
								}
								{
									transactionFullDetails?.transaction_status === "Cancelled" ?
										<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{transactionFullDetails?.transaction_status}</span> : ""
								}
							</p>
						</div>
					</div>
					<center>
						<p className="xui-opacity-4 xui-font-sz-90 xui-m-half">Created - {new Date(transactionFullDetails?.createdAt).toLocaleString()} | Last Updated - {new Date(transactionFullDetails?.updatedAt).toLocaleString()}</p>
					</center>
				</div>
			</section>
			<section className='xui-modal' xui-modal="userBankDetailsModal" id="userBankDetailsModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => setUserBankDetails(null)} xui-modal-close="userBankDetailsModal">
						<Close width="24" height="24" />
					</div>
					<center>
						<h1>{userBankDetails?.name}</h1>
						<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Bank Details</p>
					</center>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-1">
						<div className="">
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Account Name</p>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Account Number</p>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">Bank</p>
						</div>
						<div className="">
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">{userBankDetails?.account_name}</p>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">{userBankDetails?.account_number}</p>
							<p className="xui-opacity-5 xui-font-sz-100 xui-mt-half">{userBankDetails?.bank}</p>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="userWithdrawalConfirmationDialog" id="userWithdrawalConfirmationDialog">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Complete User Withdrawal Transaction</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCompleteWithdrawal}</span></p>
					<p className="xui-font-sz-80 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCompleteWithdrawal}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleCompleteWithdrawal} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingCompleteWithdrawal ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingCompleteWithdrawal ? "" : "userWithdrawalConfirmationDialog"}>
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