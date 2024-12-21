import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import BundledEditor from '../BundledEditor';
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getPosts, getPost } from "../api/posts";
import { publicGetCategories } from "../api/categories";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUpdatePostDetails, useUpdatePostAltText, useUpdatePostCategory, useUpdatePostTimestamp, useUpdatePostTitle, useUploadPostImage } from "../hooks/usePosts";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditPostDetails() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDetailsRef = useRef(null);

	const [showConfirmUpdatePostDetails, setShowConfirmUpdatePostDetails] = useState(false);

	const [categories, setCategories] = useState(null);

	const {
		title: titleEdit, errorUpdatePostTitle, handleTitle: handleTitleEdit, handleUpdatePostTitle, loadingUpdatePostTitle, removeUpdatePostTitleModal,
		setTitle: setTitleEdit, setRemoveUpdatePostTitleModal, setUniqueId: EditUniqueIdTitle, successUpdatePostTitle
	} = useUpdatePostTitle();

	const {
		details: detailsEdit, errorUpdatePostDetails, handleDetails: handleDetailsEdit, handleUpdatePostDetails, loadingUpdatePostDetails, removeUpdatePostDetailsModal, 
		setDetails: setDetailsEdit, setRemoveUpdatePostDetailsModal, setUniqueId: EditUniqueIdDetails, successUpdatePostDetails
	} = useUpdatePostDetails();

	const {
		altText: altTextEdit, errorUpdatePostAltText, handleAltText: handleAltTextEdit, handleUpdatePostAltText, loadingUpdatePostAltText, removeUpdatePostAltTextModal, 
		setAltText: setAltTextEdit, setRemoveUpdatePostAltTextModal, setUniqueId: EditUniqueIdAltText, successUpdatePostAltText
	} = useUpdatePostAltText();

	const {
		categoryUniqueId: categoryUniqueIdEdit, errorUpdatePostCategory, handleCategoryUniqueId: handleCategoryUniqueIdEdit, handleUpdatePostCategory, loadingUpdatePostCategory, removeUpdatePostCategoryModal, 
		setCategoryUniqueId: setCategoryUniqueIdEdit, setRemoveUpdatePostCategoryModal, setUniqueId: EditUniqueIdCategory, successUpdatePostCategory
	} = useUpdatePostCategory();

	const {
		createdAt: createdAtEdit, errorUpdatePostTimestamp, handleCreatedAt: handleCreatedAtEdit, handleUpdatePostTimestamp, loadingUpdatePostTimestamp, removeUpdatePostTimestampModal,
		setCreatedAt: setCreatedAtEdit, setRemoveUpdatePostTimestampModal, setUniqueId: EditUniqueIdTimestamp, successUpdatePostTimestamp
	} = useUpdatePostTimestamp();

	const {
		errorPostImage, handleUploadPostImage, loadingPostImage, removePostImageModal, selectedPostImage, setRemovePostImageModal,
		setSelectedPostImage, setUniqueId: UploadPostImageUniqueId, successPostImage, uploadingPostImagePercentage
	} = useUploadPostImage();

	const setDetailsContents = () => {
		if (editorDetailsRef.current) {
			handleDetailsEdit(editorDetailsRef.current.getContent());
		}
	};

	const handleSelectPostImage = (e) => {
		const el = e.target.files[0];
		setSelectedPostImage("");
		setSelectedPostImage(el);
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

	const [loadingViewPost, setLoadingViewPost] = useState(false)
	const [errorViewPost, setErrorViewPost] = useState(null)
	const [viewPost, setViewPost] = useState(null)

	async function getAPost(unique_id) {
		setLoadingViewPost(true)
		const response = await getPost(cookie, { unique_id });
		if (!response.err) {
			setViewPost(response.data);
			EditUniqueIdDetails(unique_id); EditUniqueIdAltText(unique_id); EditUniqueIdCategory(unique_id); EditUniqueIdTimestamp(unique_id); EditUniqueIdTitle(unique_id); UploadPostImageUniqueId(unique_id);
			setCategoryUniqueIdEdit(response.data.data.category_unique_id);
			setTitleEdit(response.data.data.title);
			setDetailsEdit(response.data.data.details);
			setAltTextEdit(response.data.data.alt_text);
			setCreatedAtEdit(response.data.data.createdAt);
		} else { setErrorViewPost(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewPost(false)
	};

	async function getAllCategories() {
		setCategories(null);
		const response = await publicGetCategories(cookie);
		setCategories(response.data);
		if (response.error) setCategories(null);
	};

	useEffect(() => {
		if (categories === null) {
			getAllCategories();
		}
		if (viewPost === null) {
			getAPost(unique_id);
		}
	}, [viewPost, categories]);

	if (removeUpdatePostDetailsModal) {
		setRemoveUpdatePostDetailsModal(null);
		window.location.reload(true);
		// setTimeout(function () {
		// 	navigate(`/internal/posts`);
		// }, 1500)
	}
	if (removeUpdatePostAltTextModal) {
		setRemoveUpdatePostAltTextModal(null);
		window.location.reload(true);
	}
	if (removeUpdatePostTitleModal) {
		setRemoveUpdatePostTitleModal(null);
		window.location.reload(true);
	}
	if (removeUpdatePostCategoryModal) {
		setRemoveUpdatePostCategoryModal(null);
		window.location.reload(true);
	}
	if (removeUpdatePostTimestampModal) {
		setRemoveUpdatePostTimestampModal(null);
		window.location.reload(true);
	}
	if (removePostImageModal) {
		setRemovePostImageModal(null);
		window.location.reload(true);
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Edit Post</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						{
							loadingViewPost ?
								<center>
									<Loading width="12" height="12" />
								</center> : (
									viewPost && viewPost.success ?
										<>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className="xui-form-box xui-mt-1">
														<label>Category</label>
														<select onChange={handleCategoryUniqueIdEdit} value={categoryUniqueIdEdit} required>
															<option selected value={""}>Select Category</option>
															{
																categories && categories.data.rows.length !== 0 ? (
																	categories.data.rows.map((item, index) => {
																		return (
																			<option key={index} value={item.unique_id}>{item.name}</option>
																		)
																	})
																) : ""
															}
														</select>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePostCategory}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePostCategory}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdatePostCategory} disabled={loadingUpdatePostCategory} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdatePostCategory ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className="xui-form-box xui-mt-1">
														<label>Title</label>
														<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of post"></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePostTitle}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePostTitle}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdatePostTitle} disabled={loadingUpdatePostTitle} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdatePostTitle ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className="xui-form-box xui-mt-1">
														<label>Alt Text</label>
														<input className="xui-font-sz-90" type="text" value={altTextEdit} onChange={handleAltTextEdit} required placeholder="Enter alt text for post"></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePostAltText}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePostAltText}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdatePostAltText} disabled={loadingUpdatePostAltText} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdatePostAltText ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className="xui-form-box xui-mt-1">
														<label>Timestamp</label>
														<input className="xui-font-sz-90" type="datetime-local" value={createdAtEdit} onChange={handleCreatedAtEdit} required></input>
													</div>
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePostTimestamp}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePostTimestamp}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdatePostTimestamp} disabled={loadingUpdatePostTimestamp} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdatePostTimestamp ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<label>Image</label>
													<div className="xui-d-flex xui-flex-ai-center">
														{
															viewPost.data.image ?
																getFileExtension(viewPost.data.image) === "pdf" || getFileExtension(viewPost.data.image) === "PDF" ?
																	<div className='xui-d-inline-flex xui-flex-ai-center'>
																		<span className="xui-font-sz-120 xui-text-post xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewPost.data.image)}</span>
																		<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewPost.data.image); }}>
																			<EyeOpen width="20" height="20" />
																		</span>
																	</div> :
																	<img className="xui-img-200" src={viewPost.data.image} alt="Post Image" />
																: null
														}
														<input onChange={handleSelectPostImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" required />
													</div>
													{
														uploadingPostImagePercentage > 0 ?
															<>
																<label htmlFor="uploader">Uploading</label>
																<progress className="xui-h-30" value={uploadingPostImagePercentage} id="uploader" max="100">{uploadingPostImagePercentage + "%"}</progress><br /><br></br>
															</> :
															""
													}

													{loadingPostImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorPostImage}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successPostImage}</span></p>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button disabled={loadingPostImage} onClick={handleUploadPostImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingPostImage ?
																<Loading width="12" height="12" />
																: <Arrowright width="12" height="12" />
														}
													</button>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-form-box xui-mt-2">
													<label className="">Details</label>
													<BundledEditor
														onInit={(evt, editor) => editorDetailsRef.current = editor}
														initialValue={detailsEdit}
														init={{
															height: 500,
															font_size_input_default_unit: "pt",
															menubar: false,
															plugins: [
																'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
																'searchreplace', 'table', 'wordcount', 'code',
															],
															toolbar: [
																'undo redo | styles | bold italic forecolor fontsizeinput | bullist numlist outdent indent | link image | alignleft aligncenter alignright alignjustify | removeformat | table | code',
															],
															toolbar_mode: 'floating',
															content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
														}}
													/>
												</div>

												{
													showConfirmUpdatePostDetails ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit Post Details</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePostDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePostDetails}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUpdatePostDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUpdatePostDetails ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdatePostDetails(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> :
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdatePostDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdatePostDetails}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																<button onClick={() => { setDetailsContents(); setShowConfirmUpdatePostDetails(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
																	<span className="xui-mr-half">Save Changes</span>
																	<Arrowright width="12" height="12" />
																</button>
															</div>
														</div>

												}
											</form>
										</> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewPost}</h3>
												</center>
											</div>
										</div>
								)
						}
					</section>
				</Content>
			</Screen>
		</>
	);

}