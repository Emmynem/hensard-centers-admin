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
import { getEvents, getEvent } from "../api/events";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useDeleteEvent } from "../hooks/useEvents";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Events() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorDeleteEvent, handleDeleteEvent, loadingDeleteEvent, removeDeleteEventModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteEventModal, successDeleteEvent
	} = useDeleteEvent();

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

	const [allEvent, setAllEvent] = useState(null);
	const [errorEvent, setErrorEvent] = useState(null);
	const [loadingAllEvent, setLoadingAllEvent] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllEvents(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllEvents(parseInt(e.target.value), size); };

	async function previousEvent() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllEvents(page - 1, size);
	};

	async function nextEvent() {
		if (page < allEvent.data.pages) setPage(page + 1);
		if (page < allEvent.data.pages) getAllEvents(page + 1, size);
	};

	async function getAllEvents(_page, _size) {
		setAllEvent(null);
		setLoadingAllEvent(true);
		const response = await getEvents(cookie, (_page || page), (_size || size));
		setAllEvent(response.data);
		if (response.error) setErrorEvent(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllEvent(false);
	};

	useEffect(() => {
		if (allEvent === null) {
			getAllEvents();
		}
	}, [allEvent]);

	if (removeDeleteEventModal) {
		const modalResponse = document.querySelector("#deleteEventModal");
		modalResponse.setAttribute("display", false);
		getAllEvents();
		setRemoveDeleteEventModal(null);
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

	const pageSelectArray = new Array(allEvent ? allEvent.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Events</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all events</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<Link to={`/internal/event/add`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80">
										<span>Add Event</span>
									</Link>
								</div>
							</div>
						</div>
						{
							loadingAllEvent ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allEvent && allEvent.success && allEvent.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-max-w-100'>Name</th>
														<th className='xui-max-w-100'>Stripped</th>
														<th className='xui-min-w-150'>Type</th>
														<th className='xui-min-w-150'>Location</th>
														<th className='xui-min-w-150'>Start</th>
														<th className='xui-min-w-150'>End</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-150'>Views</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allEvent.data.rows.map((data, i) => (
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
																<span>{data.type}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.location}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.start).toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.end ? new Date(data.end).toLocaleString() : "No end date"}</span>
															</td>
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="Event Image" />
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
																	<Link to={`/internal/event/edit/details?unique_id=${data.unique_id}`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50">
																		<Edit width="16" height="16" />
																	</Link>
																	<button title="Delete Event" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteEventModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorEvent || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllEvent ?
								<Loading width="12" height="12" /> :
								(
									allEvent && allEvent.success && allEvent.data.rows.length !== 0 ?
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
												</select></span> of {allEvent ? allEvent.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousEvent}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextEvent}>
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
			<section className='xui-modal' xui-modal="deleteEventModal" id="deleteEventModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Event</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteEvent}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteEvent}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteEvent} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteEvent ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteEvent ? "" : "deleteEventModal"}>
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
