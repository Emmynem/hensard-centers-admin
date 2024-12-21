import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAddPost } from "../hooks/usePosts";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function AddPost() {
	const navigate = useNavigate();

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDetailsRef = useRef(null);

	const [showConfirmAddPost, setShowConfirmAddPost] = useState(false);

	const [categories, setCategories] = useState(null);

	const {
		errorAddPost, handleAddPost, handleTitle, handleDetails, handleAltText, loadingAddPost, title, details, altText,
		removeAddPostModal, selectedAddPost, setTitle, setAltText, setDetails, setRemoveAddPostModal, setSelectedAddPost, 
		successAddPost, uploadingAddPostPercentage, categoryUniqueId, handleCategoryUniqueId, setCategoryUniqueId,
	} = useAddPost();


	const setDetailsContents = () => {
		if (editorDetailsRef.current) {
			handleDetails(editorDetailsRef.current.getContent());
		}
	};

	const handleSelectAddPost = (e) => {
		const el = e.target.files[0];
		setSelectedAddPost("");
		setSelectedAddPost(el);
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
	}, [categories]);

	if (removeAddPostModal) {
		setRemoveAddPostModal(null);
		setTimeout(function () {
			navigate(`/internal/posts`);
		}, 1500)
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Create new Post</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						<form className="xui-form" layout="2" onSubmit={(e) => e.preventDefault()}>
							<div className="xui-form-box xui-mt-2">
								<label>Category</label>
								<select onChange={handleCategoryUniqueId} value={categoryUniqueId} required>
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
							<div className="xui-form-box xui-mt-1">
								<label>Title</label>
								<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of post"></input>
							</div>
							<div className="xui-form-box xui-mt-1">
								<label>Alt Text</label>
								<input className="xui-font-sz-90" type="text" value={altText} onChange={handleAltText} required placeholder="Enter alt text for post"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label className="">Details</label>
								<BundledEditor
									onInit={(evt, editor) => editorDetailsRef.current = editor}
									initialValue={details}
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
							<div className="xui-form-box xui-mt-2">
								<label>Image</label>
								<input onChange={handleSelectAddPost} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" required />
							</div>
							{
								uploadingAddPostPercentage > 0 ?
									<>
										<label htmlFor="uploader">Uploading</label>
										<progress className="xui-h-30" value={uploadingAddPostPercentage} id="uploader" max="100">{uploadingAddPostPercentage + "%"}</progress><br /><br></br>
									</> :
									""
							}

							{(loadingAddPost && selectedAddPost) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}
							
							{
								showConfirmAddPost ?
									<div className="xui-m-3">
										<center>
											<h4>Confirm Add Post</h4>
											<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
										</center>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddPost}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddPost}</span></p>
										<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={handleAddPost} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Yes</span>
													{
														loadingAddPost ?
															<Loading width="12" height="12" />
															: <Check width="20" height="20" />
													}
												</button>
											</div>
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={() => setShowConfirmAddPost(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">No</span>
													<Close width="20" height="20" />
												</button>
											</div>
										</div>
									</div> :
									<div>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddPost}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddPost}</span></p>
										<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
											<button disabled={categoryUniqueId.length < 2 || title.length < 2 || altText.length < 2} onClick={() => { setDetailsContents(); setShowConfirmAddPost(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
												<span className="xui-mr-half">Save Post</span>
											</button>
										</div>
									</div>
							}
						</form>
					</section>
				</Content>
			</Screen>
		</>
	);

}