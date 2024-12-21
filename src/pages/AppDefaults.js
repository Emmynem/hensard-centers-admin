import { useEffect, useState } from "react";
import SuccessTick from "../assets/images/success-tick.png";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Screen from '../components/Screen';
import Arrowright from '../icons/Arrowright';
import Arrowleft from '../icons/Arrowleft';
import Close from "../icons/Close";
import Plus from "../icons/Plus";
import Edit from "../icons/Edit";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";
import Minus from "../icons/Minus";
import Copy from "../icons/Copy";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getAllAppDefault as getAppDefaults, getAppDefault as getAnAppDefault } from "../api/appDefaults";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddAppDefault, useDeleteAppDefault, useEditAppDefault } from "../hooks/useAppDefaults";

export default function AppDefaults() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		app_defaults_data_type, criteria, dataType, errorAddAppDefault, handleAddAppDefault, handleCriteria, handleDataType, loadingAddAppDefault, 
		removeAddAppDefaultModal, setCriteria, setDataType, setRemoveAddAppDefaultModal, setValue, successAddAppDefault, value, handleValue
	} = useAddAppDefault();
	
	const {
		app_defaults_data_type: EditAppDefaultDataType, criteria: EditCriteria, dataType: EditDataType, errorEditAppDefault, handleCriteria: EditHandleCriteria, 
		handleDataType: EditHandleDataType, handleEditAppDefault, loadingEditAppDefault, removeEditAppDefaultModal, setCriteria: EditSetCriteria, handleValue: EditHandleValue, 
		setDataType: EditSetDataType, setRemoveEditAppDefaultModal, setUniqueId: EditUniqueId, setValue: EditSetValue, successEditAppDefault, value: EditValue 
	} = useEditAppDefault();

	const {
		errorDeleteAppDefault, handleDeleteAppDefault, loadingDeleteAppDefault, removeDeleteAppDefaultModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteAppDefaultModal, successDeleteAppDefault
	} = useDeleteAppDefault();

	const [allAppDefaults, setAllAppDefaults] = useState(null);
	const [errorAppDefaults, setErrorAppDefaults] = useState(null);
	const [loadingAllAppDefaults, setLoadingAllAppDefaults] = useState(false);

	const [arrayDataType, setArrayDataType] = useState(null);
	const handleArrayDataType = (e) => { 
		e.preventDefault(); setArrayDataType(e.target.value); 
		if (e.target.value === "MAP") {
			setValue([
				{
					"first_key": "first_value"
				}
			])
		} else {
			setValue([
				"first_value"
			])
		}
	};

	const handleStringValueChange = (index, val) => {
		let _value = value;
		_value.splice(index, 1, val);
		setValue(_value);
	};

	const get_key_index = (arr, keyName) => {
		const index = arr.findIndex((e) => Object.keys(e).some(key => key === keyName));
		return index;
	};

	const return_obj_key_string = (obj) => {
		return Object.keys(obj)[0];
	};

	const return_obj_value_string = (obj) => {
		return Object.values(obj)[0];
	};

	let count = 1;
	const handleMapKeyChange = (index, val) => {
		let _value = value;
		let keyObj = value[index];
		count += 1;
		console.log("MAP key: " + count, keyObj);
		// _value.splice(index, 1, { val: keyObj });
	};

	let count_2 = 1;
	const handleMapValueChange = (index, val) => {
		let _value = value;
		let keyObj = value[index];
		count_2 += 1;
		console.log("MAP value: " + count_2, keyObj);
		// _value.splice(index, 1, { val: keyObj });
	};

	const addValue = () => {
		if (arrayDataType === "MAP") {
			let _value = value;
			_value.push({
				"more_key": "more_value"
			});
			setValue(_value);
			console.log(_value);
		} else {
			let _value = value;
			_value.push(
				"more_value"
			);
			setValue(_value);
			console.log(_value);
		}
	};
	
	const removeValue = (index) => {
		if (value.length > 1) {
			let _value = value;
			_value.splice(index, 1);
			setValue(_value);
			console.log(_value);
		}
	};
	
	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllAppDefaults(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllAppDefaults(parseInt(e.target.value), size); };

	async function previousAppDefaults() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllAppDefaults(page - 1, size);
	};

	async function nextAppDefaults() {
		if (page < allAppDefaults.data.pages) setPage(page + 1);
		if (page < allAppDefaults.data.pages) getAllAppDefaults(page + 1, size);
	};

	async function getAllAppDefaults(_page, _size) {
		setLoadingAllAppDefaults(true);
		const response = await getAppDefaults(cookie, (_page || page), (_size || size));
		setAllAppDefaults(response.data);
		if (response.error) setErrorAppDefaults(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllAppDefaults(false);
	};

	const [loadingViewAppDefault, setLoadingViewAppDefault] = useState(false)
	const [errorViewAppDefault, setErrorViewAppDefault] = useState(null)
	const [viewUserAppDefault, setViewUserAppDefault] = useState(null)

	async function getAppDefault(uniqueId) {
		setLoadingViewAppDefault(true)
		const response = await getAnAppDefault(cookie, { unique_id: uniqueId })
		if (!response.err) {
			setViewUserAppDefault(response.data)
		} else { setErrorViewAppDefault(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewAppDefault(false)
	};

	useEffect(() => {
		if (allAppDefaults === null) {
			getAllAppDefaults();
		}
	}, [allAppDefaults]);

	if (removeAddAppDefaultModal) {
		const modalResponse = document.querySelector("#addAppDefaultModal");
		modalResponse.setAttribute("display", false);
		getAllAppDefaults();
		setRemoveAddAppDefaultModal(null);
	}
	if (removeDeleteAppDefaultModal) {
		const modalResponse = document.querySelector("#deleteAppDefaultModal");
		modalResponse.setAttribute("display", false);
		getAllAppDefaults();
		setRemoveDeleteAppDefaultModal(null);
	}
	if (removeEditAppDefaultModal) {
		const modalResponse = document.querySelector("#editAppDefaultModal");
		modalResponse.setAttribute("display", false);
		getAllAppDefaults();
		setRemoveEditAppDefaultModal(null);
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

	const pageSelectArray = new Array(allAppDefaults ? allAppDefaults.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All App Defaults</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all app defaults</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addAppDefaultModal">
										<span className="xui-mr-half">Add App Default</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllAppDefaults ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allAppDefaults && allAppDefaults.success ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-200'>Unique ID</th>
														<th className='xui-min-w-200'>Criteria</th>
														<th className='xui-min-w-200'>Data Type</th>
														<th className='xui-min-w-100'>Status</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allAppDefaults.data.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
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
																<span>{data.criteria}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.data_type}</span>
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
																<div className="xui-d-flex xui-grid-gap-1">
																	<button title="Edit App Default" onClick={() => { EditUniqueId(data.unique_id); EditSetCriteria(data.criteria); EditSetDataType(data.data_type); EditSetValue(data.data_type === "ARRAY" || data.data_type === "MAP" ? JSON.stringify(data.value) : data.data_type === "BOOLEAN" ? (data.value ? "TRUE" : "FALSE") : data.data_type === "STRING" ? data.value : parseInt(data.value)); setArrayDataType(data.data_type === "ARRAY" && typeof data.value[0] === "string" ? "STRING" : "MAP"); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editAppDefaultModal">
																		<Edit width="16" height="16" />
																	</button>
																	<button title="Delete App Default" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteAppDefaultModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorAppDefaults}</h3>
												</center>
											</div>
										</div>
								)
						}
						{/* {
							loadingAllAppDefaults ?
								<Loading width="12" height="12" /> :
								(
									allAppDefaults && allAppDefaults.success ?
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
												</select></span> of {allAppDefaults ? allAppDefaults.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousAppDefaults}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextAppDefaults}>
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
			<section className='xui-modal' xui-modal="addAppDefaultModal" id="addAppDefaultModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addAppDefaultModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new app default</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddAppDefault}>
						<div className="xui-form-box xui-mt-2">
							<label>Criteria</label>
							<input className="xui-font-sz-90" type="text" value={criteria} onChange={handleCriteria} required placeholder="Enter criteria"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Data Type</label>
							<select onChange={handleDataType} value={dataType} required>
								<option selected disabled>Select Data Type</option>
								{
									app_defaults_data_type.map((item, index) => {
										return (
											<option key={index} value={item}>{item}</option>
										)
									})
								}
							</select>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Value</label>
							{
								dataType ? 
									(
										dataType === "STRING" ?
											<input className="xui-font-sz-90" type="text" value={value} onChange={handleValue} required placeholder="Enter value"></input> : 
											(
												dataType === "INTEGER" ?
													<input className="xui-font-sz-90" type="number" value={value} onChange={handleValue} required placeholder="Enter value"></input> : 
													(
														dataType === "BIGINT" ?
															<input className="xui-font-sz-90" type="number" value={value} onChange={handleValue} required placeholder="Enter value"></input> : 
															(
																dataType === "BOOLEAN" ?
																	<select value={value} onChange={handleValue} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80'>
																		<option selected value="">Select Boolean</option>
																		<option value={"TRUE"}>True</option>
																		<option value={"FALSE"}>False</option>
																	</select> : 
																	(
																		dataType === "ARRAY" ? 
																			<textarea type={"text"} required placeholder={"Enter value"} style={{ resize: "vertical" }} value={value} onChange={handleValue}></textarea> : 
																			(
																				dataType === "MAP" ? 
																					<textarea type={"text"} required placeholder={"Enter value"} style={{ resize: "vertical" }} value={value} onChange={handleValue}></textarea> : 
																					<p className="xui-font-sz-100 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">Invalid Data Type</span></p>
																			)
																	)
															)
													)
											)
									) :
									<p className="xui-font-sz-100 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">Select Data Type</span></p>
							}
							{/* 
								// use later
								<>
									<select value={arrayDataType} onChange={handleArrayDataType} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-my-2'>
										<option selected disabled>Select Array Data Type</option>
										<option value={"MAP"}>MAP</option>
										<option value={"STRING"}>STRING</option>
									</select>
									{
										arrayDataType === "MAP" ? 
											value.map((val, index) => {
												return <div className="xui-d-flex xui-flex-ai-center">
													<div onClick={() => { removeValue(index); }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-mr-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
														<Minus width="16" height="16" />
													</div>
													<input style={{ width: "calc(28% - 50px)" }} type={"text"} value={return_obj_key_string(val)} placeholder={"key"} onChange={(e) => { handleMapKeyChange(index, e.target.value); }} required />
													<p className="xui-font-sz-100 xui-mx-1">|</p>
													<input style={{ width: "calc(68% - 50px)" }} type={"text"} value={return_obj_value_string(val)} placeholder={"value"} onChange={(e) => { handleMapValueChange(index, e.target.value); }} required />
													<div onClick={() => { addValue() }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
														<Plus width="16" height="16" />
													</div>
												</div> ;
											}) : 
											value.map((val, index) => {
												return <div className="xui-d-flex xui-flex-ai-center">
													<div onClick={() => { removeValue(index); }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-mr-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
														<Minus width="16" height="16" />
													</div>
													<input style={{ width: "calc(100% - 100px)" }} name={"field" + index} value={val} type={"text"} placeholder={""} onChange={(e) => { handleStringValueChange(index, e.target.value) }} required />
													{
														index === value.length - 1 ?
															<div onClick={() => { addValue() }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
																<Plus width="16" height="16" />
															</div> :
															<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
																<p className="xui-font-sz-100 xui-mx-1">{(index + 1).toLocaleString()}</p>
															</div>
													}
												</div>;
											})
									}
								</> :
							 */}
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Default</span>
								{
									loadingAddAppDefault ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddAppDefault}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddAppDefault}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="deleteAppDefaultModal" id="deleteAppDefaultModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete API Key</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteAppDefault}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteAppDefault}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteAppDefault} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteAppDefault ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteAppDefault ? "" : "deleteAppDefaultModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editAppDefaultModal" id="editAppDefaultModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editAppDefaultModal">
						<Close width="24" height="24" />
					</div>
					<h1>Edit app default</h1>
					<form className="xui-form" layout="2" onSubmit={handleEditAppDefault}>
						<div className="xui-form-box xui-mt-2">
							<label>Criteria</label>
							<input className="xui-font-sz-90" type="text" value={EditCriteria} onChange={EditHandleCriteria} required placeholder="Enter criteria"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Data Type</label>
							<select onChange={EditHandleDataType} value={EditDataType} required>
								<option selected disabled>Select Data Type</option>
								{
									app_defaults_data_type.map((item, index) => {
										return (
											<option key={index} value={item} disabled={item === "ARRAY" || item === "MAP"}>{item}</option>
										)
									})
								}
							</select>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Value</label>
							{
								EditDataType ?
									(
										EditDataType === "STRING" ?
											<input className="xui-font-sz-90" type="text" value={EditValue} onChange={EditHandleValue} required placeholder="Enter value"></input> :
											(
												EditDataType === "INTEGER" ?
													<input className="xui-font-sz-90" type="number" value={EditValue} onChange={EditHandleValue} required placeholder="Enter value"></input> :
													(
														EditDataType === "BIGINT" ?
															<input className="xui-font-sz-90" type="number" value={EditValue} onChange={EditHandleValue} required placeholder="Enter value"></input> :
															(
																EditDataType === "BOOLEAN" ?
																	<select value={EditValue} onChange={EditHandleValue} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80'>
																		<option selected value="">Select Boolean</option>
																		<option value={"TRUE"}>True</option>
																		<option value={"FALSE"}>False</option>
																	</select> :
																	(
																		EditDataType === "ARRAY" ?
																			<textarea type={"text"} required placeholder={"Enter value"} style={{ resize: "vertical" }} value={EditValue} onChange={EditHandleValue}></textarea> :
																			(
																				EditDataType === "MAP" ?
																					<textarea type={"text"} required placeholder={"Enter value"} style={{ resize: "vertical" }} value={EditValue} onChange={EditHandleValue}></textarea> :
																					<p className="xui-font-sz-100 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">Invalid Data Type</span></p>
																			)
																	)
															)
													)
											)
									) :
									<p className="xui-font-sz-100 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">Select Data Type</span></p>
							}
							{/* 
								// use later
								<>
									<select value={arrayDataType} onChange={handleArrayDataType} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-my-2'>
										<option selected disabled>Select Array Data Type</option>
										<option value={"MAP"}>MAP</option>
										<option value={"STRING"}>STRING</option>
									</select>
									{
										arrayDataType === "MAP" ? 
											EditValue.map((val, index) => {
												return <div className="xui-d-flex xui-flex-ai-center">
													<div onClick={() => { removeValue(index); }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-mr-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
														<Minus width="16" height="16" />
													</div>
													<input style={{ width: "calc(28% - 50px)" }} type={"text"} value={return_obj_key_string(val)} placeholder={"key"} onChange={(e) => { handleMapKeyChange(index, e.target.value); }} required />
													<p className="xui-font-sz-100 xui-mx-1">|</p>
													<input style={{ width: "calc(68% - 50px)" }} type={"text"} value={return_obj_value_string(val)} placeholder={"value"} onChange={(e) => { handleMapValueChange(index, e.target.value); }} required />
													<div onClick={() => { addValue() }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
														<Plus width="16" height="16" />
													</div>
												</div> ;
											}) :
											EditValue.map((val, index) => {
												return <div className="xui-d-flex xui-flex-ai-center">
													<div onClick={() => { removeValue(index); }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-mr-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
														<Minus width="16" height="16" />
													</div>
													<input style={{ width: "calc(100% - 100px)" }} value={val} type={"text"} placeholder={""} onChange={(e) => { handleStringValueChange(index, e.target.value) }} required />
													{
														index === EditValue.length - 1 ? 
															<div onClick={() => { addValue() }} className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-blue xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
																<Plus width="16" height="16" />
															</div> :
															<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text">
																<p className="xui-font-sz-100 xui-mx-1">{(index + 1).toLocaleString()}</p>
															</div>
													}
												</div>;
											})
									}
								</> :
							 */}
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Default</span>
								{
									loadingEditAppDefault ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorEditAppDefault}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successEditAppDefault}</span></p>
				</div>
			</section>
		</>
	);

}
