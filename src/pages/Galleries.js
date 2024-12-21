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
import { getGalleries, getGallery } from "../api/galleries";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useDeleteGalleryImage, useUploadGalleryImages } from "../hooks/useGalleries";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Galleries() {
	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorGalleryImages, handleUploadGalleryImages, loadingGalleryImages, removeGalleryImagesModal, selectedGalleryImages, setRemoveGalleryImagesModal,
		setSelectedGalleryImages, successGalleryImages, uploadingGalleryImagesPercentage
	} = useUploadGalleryImages();

	const {
		errorDeleteGalleryImage, handleDeleteGalleryImage, loadingDeleteGalleryImage, removeDeleteGalleryImageModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteGalleryImageModal, successDeleteGalleryImage
	} = useDeleteGalleryImage();

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

	const [allGalleryImage, setAllGalleryImage] = useState(null);
	const [errorGalleryImage, setErrorGalleryImage] = useState(null);
	const [loadingAllGalleryImage, setLoadingAllGalleryImage] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllGalleries(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllGalleries(parseInt(e.target.value), size); };

	async function previousGalleryImage() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllGalleries(page - 1, size);
	};

	async function nextGalleryImage() {
		if (page < allGalleryImage.data.pages) setPage(page + 1);
		if (page < allGalleryImage.data.pages) getAllGalleries(page + 1, size);
	};

	async function getAllGalleries(_page, _size) {
		setAllGalleryImage(null);
		setLoadingAllGalleryImage(true);
		const response = await getGalleries(cookie, (_page || page), (_size || size));
		setAllGalleryImage(response.data);
		if (response.error) setErrorGalleryImage(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllGalleryImage(false);
	};

	useEffect(() => {
		if (allGalleryImage === null) {
			getAllGalleries();
		}
	}, [allGalleryImage]);

	if (removeDeleteGalleryImageModal) {
		const modalResponse = document.querySelector("#deleteGalleryImageModal");
		modalResponse.setAttribute("display", false);
		getAllGalleries();
		setRemoveDeleteGalleryImageModal(null);
	}
	if (removeGalleryImagesModal) {
		const modalResponse = document.querySelector("#addGalleryImageModal");
		modalResponse.setAttribute("display", false);
		getAllGalleries();
		setRemoveGalleryImagesModal(null);
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

	const pageSelectArray = new Array(allGalleryImage ? allGalleryImage.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Gallery Images</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and delete all gallery images</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addGalleryImageModal">
										<span className="xui-mr-half">Add Images</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllGalleryImage ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allGalleryImage && allGalleryImage.success && allGalleryImage.data.rows.length !== 0 ?
										<div className='xui-d-grid xui-lg-grid-col-3 xui-grid-col-1 xui-grid-gap-1 xui-mt-1'>
											{
												allGalleryImage.data.rows.map((data, i) => (
													<div key={i}>
														<div className='xui-p-half xui-pos-relative xui-bdr-rad-half xui-bg-white xui-bdr-w-2 xui-bdr-fade xui-bdr-style-solid'>
															<img className='xui-w-fluid-100 xui-h-300 xui-object-pos-center xui-object-fit-cover xui-bdr-rad-half' src={data.image} alt="" />
															<span onClick={() => { DeleteUniqueId(data.unique_id); }} style={{ "top": "20px", "left": "20px" }} className='xui-cursor-pointer xui-w-50 xui-h-50 xui-bdr-rad-circle psc-btn-red xui-pos-absolute xui-d-flex xui-flex-jc-center xui-flex-ai-center' xui-modal-open="deleteGalleryImageModal">
																<Delete width="16" height="16" strokeWidth={1.4} strokeOpacity={.8} />
															</span>
															<span onClick={() => { copyText(data.image); setTextCopied(data.image); }} style={{ "top": "20px", "right": "20px" }} className='xui-cursor-pointer xui-w-50 xui-h-50 xui-bdr-rad-circle xui-bg-white xui-pos-absolute xui-d-flex xui-flex-jc-center xui-flex-ai-center'>
																{/* <Copy width="16" height="16" strokeWidth={1.4} strokeOpacity={.8} /> */}
																{copiedText && textCopied === data.image ? <Check width="16" height="16" strokeWidth={1.4} strokeOpacity={.8} /> : <Copy width="16" height="16" strokeWidth={1.4} strokeOpacity={.8} />}
															</span>
														</div>
													</div>
												))
											}
										</div> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorGalleryImage || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllGalleryImage ?
								<Loading width="12" height="12" /> :
								(
									allGalleryImage && allGalleryImage.success && allGalleryImage.data.rows.length !== 0 ?
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
												</select></span> of {allGalleryImage ? allGalleryImage.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousGalleryImage}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextGalleryImage}>
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
			<section className='xui-modal' xui-modal="addGalleryImageModal" id="addGalleryImageModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addGalleryImageModal">
						<Close width="24" height="24" />
					</div>

					<form className="xui-form" layout="2" onSubmit={handleUploadGalleryImages}>
						<div className="xui-form-box xui-mt-2">
							<label>Images (max 10 files)</label>
							<input className="xui-font-sz-90" type={"file"} multiple accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="galleryImages"
								// onChange={handleSelectGalleryImages} // No need for this ever again, check hook for new way for multiple images
								required></input>
						</div>
						{
							uploadingGalleryImagesPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingGalleryImagesPercentage} id="uploader" max="100">{uploadingGalleryImagesPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{loadingGalleryImages && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorGalleryImages}</span></p>
						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successGalleryImages}</span></p>

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingGalleryImages} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Images</span>
								{
									loadingGalleryImages ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="deleteGalleryImageModal" id="deleteGalleryImageModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Gallery Image</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteGalleryImage}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteGalleryImage}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteGalleryImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteGalleryImage ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteGalleryImage ? "" : "deleteGalleryImageModal"}>
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
