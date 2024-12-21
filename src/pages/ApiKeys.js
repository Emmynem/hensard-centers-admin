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
import { getApiKeys } from "../api/apiKeys";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddApiKey, useDeleteApiKey, useDisableApiKey, useEnableApiKey } from "../hooks/useApiKeys";

export default function ApiKeys() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		alias, errorAddApiKey, handleAddApiKey, handleAlias, handleType, loadingAddApiKey, removeAddApiKeyModal,
		setRemoveAddApiKeyModal, successAddApiKey, type
	} = useAddApiKey();

	const {
		errorDeleteApiKey, handleDeleteApiKey, loadingDeleteApiKey, removeDeleteApiKeyModal, setUniqueId: DeleteUniqueId, 
		setRemoveDeleteApiKeyModal, successDeleteApiKey
	} = useDeleteApiKey();

	const {
		errorDisableApiKey, handleDisableApiKey, loadingDisableApiKey, removeDisableApiKeyModal, setUniqueId: DisableUniqueId,
		setRemoveDisableApiKeyModal, successDisableApiKey
	} = useDisableApiKey();

	const {
		errorEnableApiKey, handleEnableApiKey, loadingEnableApiKey, removeEnableApiKeyModal, setUniqueId: EnableUniqueId,
		setRemoveEnableApiKeyModal, successEnableApiKey
	} = useEnableApiKey();

	const [allApiKeys, setAllApiKeys] = useState(null);
	const [errorApiKeys, setErrorApiKeys] = useState(null);
	const [loadingAllApiKeys, setLoadingAllApiKeys] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllApiKeys(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllApiKeys(parseInt(e.target.value), size); };

	async function previousApiKeys() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllApiKeys(page - 1, size);
	};

	async function nextApiKeys() {
		if (page < allApiKeys.data.pages) setPage(page + 1);
		if (page < allApiKeys.data.pages) getAllApiKeys(page + 1, size);
	};

	async function getAllApiKeys(_page, _size) {
		setLoadingAllApiKeys(true);
		const response = await getApiKeys(cookie, (_page || page), (_size || size));
		setAllApiKeys(response.data);
		if (response.error) setErrorApiKeys(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllApiKeys(false);
	};

	useEffect(() => {
		if (allApiKeys === null) {
			getAllApiKeys();
		}
	}, [allApiKeys]);

	if (removeAddApiKeyModal) {
		const modalResponse = document.querySelector("#addApiKeyModal");
		modalResponse.setAttribute("display", false);
		getAllApiKeys();
		setRemoveAddApiKeyModal(null);
	}
	if (removeDeleteApiKeyModal) {
		const modalResponse = document.querySelector("#deleteApiKeyModal");
		modalResponse.setAttribute("display", false);
		getAllApiKeys();
		setRemoveDeleteApiKeyModal(null);
	}
	if (removeEnableApiKeyModal) {
		const modalResponse = document.querySelector("#enableApiKeyModal");
		modalResponse.setAttribute("display", false);
		getAllApiKeys();
		setRemoveEnableApiKeyModal(null);
	}
	if (removeDisableApiKeyModal) {
		const modalResponse = document.querySelector("#disableApiKeyModal");
		modalResponse.setAttribute("display", false);
		getAllApiKeys();
		setRemoveDisableApiKeyModal(null);
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

	const pageSelectArray = new Array(allApiKeys ? allApiKeys.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All API Keys</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all administrator user details</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addApiKeyModal">
										<span className="xui-mr-half">Add Key</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllApiKeys ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allApiKeys && allApiKeys.success ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-200'>Alias</th>
														<th className='xui-min-w-150'>Type</th>
														<th className='xui-min-w-150'>Key</th>
														<th className='xui-min-w-100'>Status</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allApiKeys.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.alias ? data.alias : "No Alias"}</span>
															</td>
															<td className='xui-opacity-5'>
																{
																	data.alias === "Master" ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Master Key</span> : 
																		<span>{data.type}</span>
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.alias === "Master" ? 
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Master Key</span> : 
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<span>{data.api_key}</span>
																			<span title="Copy API Key" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.api_key); setTextCopied(data.api_key); }}>
																				{copiedText && textCopied === data.api_key ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																		</div>
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.status === 1 ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Active</span> :
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Inactive</span>
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.createdAt.date} at {data.createdAt.time}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.updatedAt.date} at {data.updatedAt.time}</span>
															</td>
															<td className=''>
																{
																	data.alias === "Master" ? 
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Forbidden</span> : 
																		<div className="xui-d-flex xui-grid-gap-1">
																			{
																				data.status === 1 ?  
																					<button title="Disable API Key" onClick={() => { DisableUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn xui-bg-warning xui-text-white xui-bdr-rad-half xui-font-sz-50" xui-modal-open="disableApiKeyModal">
																						<Close width="16" height="16" />
																					</button> : 
																					<button title="Enable API Key" onClick={() => { EnableUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="enableApiKeyModal">
																						<Check width="16" height="16" />
																					</button>
																			}
																			<button title="Delete API Key" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteApiKeyModal">
																				<Delete width="16" height="16" />
																			</button>
																		</div>
																}
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorApiKeys}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllApiKeys ?
								<Loading width="12" height="12" /> :
								(
									allApiKeys && allApiKeys.success ?
										<div className='xui-d-flex xui-flex-jc-flex-end xui-py-1 xui-font-sz-85 xui-opacity-5 xui-mt-1'>
											<div className='xui-d-inline-flex xui-flex-ai-center'>
												<span>Rows per page:</span>
												<select value={size} onChange={handleSize} className='psc-select-rows-per-page xui-ml-half'>
													<option value={20}>20</option>
													<option value={50}>50</option>
													<option value={100}>100</option>
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
												</select></span> of {allApiKeys ? allApiKeys.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousApiKeys}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextApiKeys}>
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
			<section className='xui-modal' xui-modal="enableApiKeyModal" id="enableApiKeyModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Enable API Key</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorEnableApiKey}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successEnableApiKey}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleEnableApiKey} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingEnableApiKey ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingEnableApiKey ? "" : "enableApiKeyModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="disableApiKeyModal" id="disableApiKeyModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Disable API Key</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDisableApiKey}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDisableApiKey}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDisableApiKey} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDisableApiKey ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDisableApiKey ? "" : "disableApiKeyModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="deleteApiKeyModal" id="deleteApiKeyModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete API Key</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteApiKey}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteApiKey}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteApiKey} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteApiKey ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteApiKey ? "" : "deleteApiKeyModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addApiKeyModal" id="addApiKeyModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addApiKeyModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new API Key</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddApiKey}>
						<div className="xui-form-box xui-mt-2">
							<label>Alias</label>
							<input className="xui-font-sz-90" type="text" value={alias} onChange={handleAlias} required placeholder="Enter user's name"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Type</label>
							<select onChange={handleType} value={type} required>
								<option selected disabled>Select Type</option>
								<option value={"Root"}>Root</option>
								<option value={"Administrator"}>Administrator</option>
								<option value={"Internal"}>Internal</option>
							</select>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save User Key</span>
								{
									loadingAddApiKey ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddApiKey}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddApiKey}</span></p>
				</div>
			</section>
		</>
	);

}
