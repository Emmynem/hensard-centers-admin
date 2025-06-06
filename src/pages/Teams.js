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
import { getTeams, getTeam } from "../api/teams";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddTeam, useDeleteTeam, useUpdateTeamDetails, useUploadTeamImage } from "../hooks/useTeams";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Teams() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddTeam, handleAddTeam, handleTitle, handleFullname, handleEmail, handleAltEmail, handlePhoneNumber, handleAltPhoneNumber, handleQualifications, 
		handleProfileLink, handleDetails, loadingAddTeam, title, fullname, email, altEmail, phoneNumber, altPhoneNumber, qualifications, profileLink, details, 
		removeAddTeamModal, selectedAddTeam, setTitle, setFullname, setEmail, setAltEmail, setPhoneNumber, setAltPhoneNumber,
		setQualifications, setProfileLink, setDetails, setRemoveAddTeamModal, setSelectedAddTeam, successAddTeam, uploadingAddTeamPercentage,
	} = useAddTeam();

	const {
		errorUpdateTeamDetails, handleTitle: handleTitleEdit, handleFullname: handleFullnameEdit, handleEmail: handleEmailEdit, handleAltEmail: handleAltEmailEdit, 
		handlePhoneNumber: handlePhoneNumberEdit, handleAltPhoneNumber: handleAltPhoneNumberEdit, handleQualifications: handleQualificationsEdit, handleProfileLink: handleProfileLinkEdit, 
		handleDetails: handleDetailsEdit, handleUpdateTeamDetails, loadingUpdateTeamDetails, title: titleEdit, fullname: fullnameEdit, email: emailEdit, altEmail: altEmailEdit, 
		phoneNumber: phoneNumberEdit, altPhoneNumber: altPhoneNumberEdit, qualifications: qualificationsEdit, profileLink: profileLinkEdit, details: detailsEdit, removeUpdateTeamDetailsModal, 
		setTitle: setTitleEdit, setFullname: setFullnameEdit, setEmail: setEmailEdit, setAltEmail: setAltEmailEdit, setPhoneNumber: setPhoneNumberEdit, setAltPhoneNumber: setAltPhoneNumberEdit,
		setQualifications: setQualificationsEdit, setProfileLink: setProfileLinkEdit, setDetails: setDetailsEdit, setRemoveUpdateTeamDetailsModal, setUniqueId: EditUniqueIdDetails, successUpdateTeamDetails
	} = useUpdateTeamDetails();

	const {
		errorTeamImage, handleUploadTeamImage, loadingTeamImage, removeTeamImageModal, selectedTeamImage, setRemoveTeamImageModal,
		setSelectedTeamImage, setUniqueId: UploadTeamImageUniqueId, successTeamImage, uploadingTeamImagePercentage
	} = useUploadTeamImage();

	const {
		errorDeleteTeam, handleDeleteTeam, loadingDeleteTeam, removeDeleteTeamModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteTeamModal, successDeleteTeam
	} = useDeleteTeam();

	const handleSelectAddTeam = (e) => {
		const el = e.target.files[0];
		setSelectedAddTeam("");
		setSelectedAddTeam(el);
	};

	const handleSelectTeamImage = (e) => {
		const el = e.target.files[0];
		setSelectedTeamImage("");
		setSelectedTeamImage(el);
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

	const [allTeams, setAllTeams] = useState(null);
	const [errorTeam, setErrorTeam] = useState(null);
	const [loadingAllTeams, setLoadingAllTeams] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllTeams(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllTeams(parseInt(e.target.value), size); };

	async function previousTeam() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllTeams(page - 1, size);
	};

	async function nextTeam() {
		if (page < allTeams.data.pages) setPage(page + 1);
		if (page < allTeams.data.pages) getAllTeams(page + 1, size);
	};

	async function getAllTeams(_page, _size) {
		setAllTeams(null);
		setLoadingAllTeams(true);
		const response = await getTeams(cookie, (_page || page), (_size || size));
		setAllTeams(response.data);
		if (response.error) setErrorTeam(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllTeams(false);
	};

	useEffect(() => {
		if (allTeams === null) {
			getAllTeams();
		}
	}, [allTeams]);

	const [loadingViewTeam, setLoadingViewTeam] = useState(false)
	const [errorViewTeam, setErrorViewTeam] = useState(null)
	const [viewTeam, setViewTeam] = useState(null)

	async function getATeam(unique_id) {
		setLoadingViewTeam(true)
		const response = await getTeam(cookie, { unique_id });
		if (!response.err) {
			setViewTeam(response.data);
			setTitleEdit(response.data.data.title);
			setFullnameEdit(response.data.data.fullname);
			setEmailEdit(response.data.data.email);
			setAltEmailEdit(response.data.data.alt_email);
			setPhoneNumberEdit(response.data.data.phone_number);
			setAltPhoneNumberEdit(response.data.data.alt_phone_number);
			setQualificationsEdit(response.data.data.qualifications);
			setProfileLinkEdit(response.data.data.profile_link);
			setDetailsEdit(response.data.data.details);
		} else { setErrorViewTeam(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewTeam(false)
	};

	if (removeAddTeamModal) {
		const modalResponse = document.querySelector("#addTeamModal");
		modalResponse.setAttribute("display", false);
		getAllTeams();
		setRemoveAddTeamModal(null);
	}
	if (removeUpdateTeamDetailsModal) {
		const modalResponse = document.querySelector("#editTeamModal");
		modalResponse.setAttribute("display", false);
		getAllTeams();
		setRemoveUpdateTeamDetailsModal(null);
	}
	if (removeTeamImageModal) {
		const modalResponse = document.querySelector("#editTeamModal");
		modalResponse.setAttribute("display", false);
		getAllTeams();
		setRemoveTeamImageModal(null);
	}
	if (removeDeleteTeamModal) {
		const modalResponse = document.querySelector("#deleteTeamModal");
		modalResponse.setAttribute("display", false);
		getAllTeams();
		setRemoveDeleteTeamModal(null);
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

	const pageSelectArray = new Array(allTeams ? allTeams.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Teams</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all teams</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addTeamModal">
										<span className="xui-mr-half">Add Team</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllTeams ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allTeams && allTeams.success && allTeams.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Name</th>
														<th className='xui-min-w-150'>Email</th>
														<th className='xui-min-w-150'>Phone Number</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allTeams.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.title} {data.fullname}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.email ? data.email : "No email"}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.phone_number ? data.phone_number : "No phone number"}</span>
															</td>
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="Team Image" />
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
																	<button title="Edit Team" onClick={() => { UploadTeamImageUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getATeam(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editTeamModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Team" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteTeamModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorTeam || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllTeams ?
								<Loading width="12" height="12" /> :
								(
									allTeams && allTeams.success && allTeams.data.rows.length !== 0 ?
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
												</select></span> of {allTeams ? allTeams.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousTeam}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextTeam}>
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
			<section className='xui-modal' xui-modal="deleteTeamModal" id="deleteTeamModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Team</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteTeam}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteTeam}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteTeam} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteTeam ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteTeam ? "" : "deleteTeamModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addTeamModal" id="addTeamModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addTeamModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Team</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddTeam}>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Title</label>
								<input className="xui-font-sz-90" type="text" minLength={2} maxLength={200} value={title} onChange={handleTitle} required placeholder="Enter title"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Fullname</label>
								<input className="xui-font-sz-90" type="text" minLength={2} maxLength={300} value={fullname} onChange={handleFullname} required placeholder="Enter fullname"></input>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Email (Optional)</label>
								<input className="xui-font-sz-90" type="email" value={email} onChange={handleEmail} placeholder="Enter email"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Alt Email (Optional)</label>
								<input className="xui-font-sz-90" type="email" value={altEmail} onChange={handleAltEmail} placeholder="Enter alternate email"></input>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Phone Number (Optional)</label>
								<input className="xui-font-sz-90" type="text" value={phoneNumber} onChange={handlePhoneNumber} placeholder="Enter phone number (with country code)"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Alt Phone Number (Optional)</label>
								<input className="xui-font-sz-90" type="text" value={altPhoneNumber} onChange={handleAltPhoneNumber} placeholder="Enter alternate phone number (with country code)"></input>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Qualifications (Optional)</label>
								<input className="xui-font-sz-90" type="text" value={qualifications} onChange={handleQualifications} placeholder="Enter qualifications"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Profile Link (Optional)</label>
								<input className="xui-font-sz-90" type="url" value={profileLink} onChange={handleProfileLink} placeholder="Enter profile link"></input>
							</div>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Details (Optional)</label>
							<textarea type={"text"} maxLength={5000} placeholder={"Enter details"} value={details} onChange={handleDetails}></textarea>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image (Optional)</label>
							<input onChange={handleSelectAddTeam} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
						</div>
						{
							uploadingAddTeamPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddTeamPercentage} id="uploader" max="100">{uploadingAddTeamPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddTeam} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Team</span>
								{
									loadingAddTeam ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					{(loadingAddTeam && selectedAddTeam) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddTeam}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddTeam}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editTeamModal" id="editTeamModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editTeamModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewTeam ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewTeam && viewTeam.success ?
									<>
										<h1>Edit Team</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
													<div className="xui-form-box xui-mt-2">
														<label>Title</label>
														<input className="xui-font-sz-90" type="text" minLength={2} maxLength={200} value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title"></input>
													</div>
													<div className="xui-form-box xui-mt-2">
														<label>Fullname</label>
														<input className="xui-font-sz-90" type="text" minLength={2} maxLength={300} value={fullnameEdit} onChange={handleFullnameEdit} required placeholder="Enter fullname"></input>
													</div>
												</div>
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
													<div className="xui-form-box xui-mt-2">
														<label>Email (Optional)</label>
														<input className="xui-font-sz-90" type="email" value={emailEdit} onChange={handleEmailEdit} placeholder="Enter email"></input>
													</div>
													<div className="xui-form-box xui-mt-2">
														<label>Alt Email (Optional)</label>
														<input className="xui-font-sz-90" type="email" value={altEmailEdit} onChange={handleAltEmailEdit} placeholder="Enter alternate email"></input>
													</div>
												</div>
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
													<div className="xui-form-box xui-mt-2">
														<label>Phone Number (Optional)</label>
														<input className="xui-font-sz-90" type="text" value={phoneNumberEdit} onChange={handlePhoneNumberEdit} placeholder="Enter phone number (with country code)"></input>
													</div>
													<div className="xui-form-box xui-mt-2">
														<label>Alt Phone Number (Optional)</label>
														<input className="xui-font-sz-90" type="text" value={altPhoneNumberEdit} onChange={handleAltPhoneNumberEdit} placeholder="Enter alternate phone number (with country code)"></input>
													</div>
												</div>
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
													<div className="xui-form-box xui-mt-2">
														<label>Qualifications (Optional)</label>
														<input className="xui-font-sz-90" type="text" value={qualificationsEdit} onChange={handleQualificationsEdit} placeholder="Enter qualifications"></input>
													</div>
													<div className="xui-form-box xui-mt-2">
														<label>Profile Link (Optional)</label>
														<input className="xui-font-sz-90" type="url" value={profileLinkEdit} onChange={handleProfileLinkEdit} placeholder="Enter profile link"></input>
													</div>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Details (Optional)</label>
													<textarea type={"text"} maxLength={5000} placeholder={"Enter details"} value={detailsEdit} onChange={handleDetailsEdit}></textarea>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateTeamDetails} disabled={loadingUpdateTeamDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateTeamDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateTeamDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateTeamDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewTeam.data.image ?
															getFileExtension(viewTeam.data.image) === "pdf" || getFileExtension(viewTeam.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewTeam.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewTeam.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewTeam.data.image} alt="Team Image" />
															: null
													}
													<input onChange={handleSelectTeamImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" required />
												</div>
												{
													uploadingTeamImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingTeamImagePercentage} id="uploader" max="100">{uploadingTeamImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{(loadingTeamImage && selectedTeamImage) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorTeamImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successTeamImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingTeamImage} onClick={handleUploadTeamImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingTeamImage ?
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewTeam}</h3>
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
