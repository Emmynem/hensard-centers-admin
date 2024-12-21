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
import { getVideos, getVideo } from "../api/videos";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddVideo, useDeleteVideo, useUpdateVideoDetails } from "../hooks/useVideos";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Video() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddVideo, handleAddVideo, handleTitle, handleWatchCode, loadingAddVideo, title, watchCode, removeAddVideoModal, setTitle, setWatchCode,
		setRemoveAddVideoModal, successAddVideo,
	} = useAddVideo();

	const {
		errorUpdateVideoDetails, handleTitle: handleTitleEdit, handleWatchCode: handleWatchCodeEdit, handleUpdateVideoDetails, loadingUpdateVideoDetails,
		title: titleEdit, watchCode: watchCodeEdit, removeUpdateVideoDetailsModal, setTitle: setTitleEdit, setWatchCode: setWatchCodeEdit, setRemoveUpdateVideoDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateVideoDetails
	} = useUpdateVideoDetails();

	const {
		errorDeleteVideo, handleDeleteVideo, loadingDeleteVideo, removeDeleteVideoModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteVideoModal, successDeleteVideo
	} = useDeleteVideo();

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [allVideo, setAllVideo] = useState(null);
	const [errorVideo, setErrorVideo] = useState(null);
	const [loadingAllVideo, setLoadingAllVideo] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllVideo(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllVideo(parseInt(e.target.value), size); };

	async function previousVideo() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllVideo(page - 1, size);
	};

	async function nextVideo() {
		if (page < allVideo.data.pages) setPage(page + 1);
		if (page < allVideo.data.pages) getAllVideo(page + 1, size);
	};

	async function getAllVideo(_page, _size) {
		setAllVideo(null);
		setLoadingAllVideo(true);
		const response = await getVideos(cookie, (_page || page), (_size || size));
		setAllVideo(response.data);
		if (response.error) setErrorVideo(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllVideo(false);
	};

	useEffect(() => {
		if (allVideo === null) {
			getAllVideo();
		}
	}, [allVideo]);

	const [loadingViewVideo, setLoadingViewVideo] = useState(false)
	const [errorViewVideo, setErrorViewVideo] = useState(null)
	const [viewVideo, setViewVideo] = useState(null)

	async function getAVideo(unique_id) {
		setLoadingViewVideo(true)
		const response = await getVideo(cookie, { unique_id });
		if (!response.err) {
			setViewVideo(response.data);
			setTitleEdit(response.data.data.title);
			setWatchCodeEdit(response.data.data.youtube_url.split("=")[1]);
		} else { setErrorViewVideo(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewVideo(false)
	};

	if (removeAddVideoModal) {
		const modalResponse = document.querySelector("#addVideoModal");
		modalResponse.setAttribute("display", false);
		getAllVideo();
		setRemoveAddVideoModal(null);
	}
	if (removeUpdateVideoDetailsModal) {
		const modalResponse = document.querySelector("#editVideoModal");
		modalResponse.setAttribute("display", false);
		getAllVideo();
		setRemoveUpdateVideoDetailsModal(null);
	}
	if (removeDeleteVideoModal) {
		const modalResponse = document.querySelector("#deleteVideoModal");
		modalResponse.setAttribute("display", false);
		getAllVideo();
		setRemoveDeleteVideoModal(null);
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

	const pageSelectArray = new Array(allVideo ? allVideo.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Videos</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all videos</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addVideoModal">
										<span className="xui-mr-half">Add Video</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllVideo ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allVideo && allVideo.success && allVideo.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Title</th>
														<th className='xui-min-w-150'>Youtube URL</th>
														<th className='xui-min-w-150'>Thumbnail</th>
														<th className='xui-min-w-200'>Created At</th>
														<th className='xui-min-w-200'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allVideo.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.title}</span>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.youtube_url}</span>
																	<span title="View Video" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.youtube_url); }}>
																		<EyeOpen width="16" height="16" />
																	</span>
																</div>
															</td>
															<td className=''>
																{
																	data.thumbnail === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.thumbnail} alt="Video Thumbnail" />
																			<span title="Copy Thumbnail Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.thumbnail); setTextCopied(data.thumbnail); }}>
																				{copiedText && textCopied === data.thumbnail ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.thumbnail); }}>
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
																	<button title="Edit Video" onClick={() => { EditUniqueIdDetails(data.unique_id); getAVideo(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editVideoModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Video" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteVideoModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorVideo || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllVideo ?
								<Loading width="12" height="12" /> :
								(
									allVideo && allVideo.success && allVideo.data.rows.length !== 0 ?
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
												</select></span> of {allVideo ? allVideo.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousVideo}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextVideo}>
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
			<section className='xui-modal' xui-modal="deleteVideoModal" id="deleteVideoModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Video</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteVideo}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteVideo}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteVideo} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteVideo ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteVideo ? "" : "deleteVideoModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addVideoModal" id="addVideoModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addVideoModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Video</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddVideo}>
						<div className="xui-form-box xui-mt-2">
							<label>Title</label>
							<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Watch Code (youtube watch code)</label>
							<input className="xui-font-sz-90" type="text" minLength={6} maxLength={11} value={watchCode} onChange={handleWatchCode} required placeholder="Enter watch code"></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddVideo} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Video</span>
								{
									loadingAddVideo ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddVideo}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddVideo}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editVideoModal" id="editVideoModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editVideoModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewVideo ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewVideo && viewVideo.success ?
									<>
										<h1>Edit Video</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of video"></input>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Watch Code (youtube watch code)</label>
													<input className="xui-font-sz-90" type="text" minLength={6} maxLength={11} value={watchCodeEdit} onChange={handleWatchCodeEdit} required placeholder="Enter watch code"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateVideoDetails} disabled={loadingUpdateVideoDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateVideoDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateVideoDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateVideoDetails}</span></p>
											</div>
										</form>
									</> :
									<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
										<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
											<center className="xui-text-red">
												<Close width="100" height="100" />
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewVideo}</h3>
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
