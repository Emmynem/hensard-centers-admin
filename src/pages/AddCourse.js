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
import { getCourses, getCourse } from "../api/courses";
import { publicGetCourseCategories } from "../api/courseCategories";
import { publicGetCourseTypes } from "../api/courseTypes";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddCourse } from "../hooks/useCourses";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function AddCourse() {
	const navigate = useNavigate();

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDescriptionRef = useRef(null);

	const [showConfirmAddCourse, setShowConfirmAddCourse] = useState(false);

	const [courseCategories, setCourseCategories] = useState(null);
	const [courseTypes, setCourseTypes] = useState(null);

	const {
		errorAddCourse, handleAddCourse, handleTitle, handleDescription, handleCertificate, handleCurrency, handleAmount, loadingAddCourse, title, description, currency, amount, certificate,
		removeAddCourseModal, selectedAddCourse, setTitle, setDescription, setCurrency, setAmount, setCertificate, setRemoveAddCourseModal, setSelectedAddCourse, successAddCourse, uploadingAddCoursePercentage,
		courseCategoryUniqueId, courseTypeUniqueId, handleCourseCategoryUniqueId, handleCourseTypeUniqueId, setCourseCategoryUniqueId, setCourseTypeUniqueId
	} = useAddCourse();


	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			handleDescription(editorDescriptionRef.current.getContent());
		}
	};

	const handleSelectAddCourse = (e) => {
		const el = e.target.files[0];
		setSelectedAddCourse("");
		setSelectedAddCourse(el);
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

	async function getAllCourseCategories() {
		setCourseCategories(null);
		const response = await publicGetCourseCategories(cookie);
		setCourseCategories(response.data);
		if (response.error) setCourseCategories(null);
	};

	async function getAllCourseTypes() {
		setCourseTypes(null);
		const response = await publicGetCourseTypes(cookie);
		setCourseTypes(response.data);
		if (response.error) setCourseTypes(null);
	};

	useEffect(() => {
		if (courseCategories === null) {
			getAllCourseCategories();
		}
		if (courseTypes === null) {
			getAllCourseTypes();
		}
	}, [courseTypes, courseCategories]);

	if (removeAddCourseModal) {
		setRemoveAddCourseModal(null);
		setTimeout(function () {
			navigate(`/internal/courses`);
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
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Create new Course</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						<form className="xui-form" layout="2" onSubmit={(e) => e.preventDefault()}>
							<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mt-2'>
								<div className="xui-form-box xui-mt-1">
									<label>Course Category</label>
									<select onChange={handleCourseCategoryUniqueId} value={courseCategoryUniqueId} required>
										<option selected value={""}>Select Course Category</option>
										{
											courseCategories && courseCategories.data.rows.length !== 0 ? (
												courseCategories.data.rows.map((item, index) => {
													return (
														<option key={index} value={item.unique_id}>{item.title}</option>
													)
												})
											) : ""
										}
									</select>
								</div>
								<div className="xui-form-box xui-mt-1">
									<label>Course Type</label>
									<select onChange={handleCourseTypeUniqueId} value={courseTypeUniqueId} required>
										<option selected value={""}>Select Course Type</option>
										{
											courseTypes && courseTypes.data.rows.length !== 0 ? (
												courseTypes.data.rows.map((item, index) => {
													return (
														<option key={index} value={item.unique_id}>{item.title}</option>
													)
												})
											) : ""
										}
									</select>
								</div>
							</div>
							<div className="xui-form-box xui-mt-1">
								<label>Title</label>
								<input className="xui-font-sz-90" type="text" value={title} onChange={handleTitle} required placeholder="Enter title of course"></input>
							</div>
							<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2'>
								<div className="xui-form-box xui-mt-1">
									<label>Currency</label>
									<select onChange={handleCurrency} value={currency} required>
										<option selected value={""}>Select Currency</option>
										<option value={"NGN"}>NGN</option>
										<option value={"USD"}>USD</option>
										<option value={"GBP"}>GBP</option>
										<option value={"EUR"}>EUR</option>
										<option value={"AUD"}>AUD</option>
										<option value={"CAD"}>CAD</option>
									</select>
								</div>
								<div className="xui-form-box xui-mt-1">
									<label>Amount</label>
									<input className="xui-font-sz-90" type="number" min={1} value={amount} onChange={handleAmount} required placeholder="Enter amount for course"></input>
								</div>
								<div className="xui-form-box xui-mt-1">
									<label>Certificate (Optional)</label>
									<input className="xui-font-sz-90" type="url" value={certificate} onChange={handleCertificate} placeholder="Enter certificate for course"></input>
								</div>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label className="">Description</label>
								<BundledEditor
									onInit={(evt, editor) => editorDescriptionRef.current = editor}
									initialValue={description}
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
								<label>Image (Optional)</label>
								<input onChange={handleSelectAddCourse} type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="image" />
							</div>
							{
								uploadingAddCoursePercentage > 0 ?
									<>
										<label htmlFor="uploader">Uploading</label>
										<progress className="xui-h-30" value={uploadingAddCoursePercentage} id="uploader" max="100">{uploadingAddCoursePercentage + "%"}</progress><br /><br></br>
									</> :
									""
							}

							{(loadingAddCourse && selectedAddCourse) && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}
							
							{
								showConfirmAddCourse ?
									<div className="xui-m-3">
										<center>
											<h4>Confirm Add Course</h4>
											<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
										</center>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddCourse}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddCourse}</span></p>
										<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={handleAddCourse} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Yes</span>
													{
														loadingAddCourse ?
															<Loading width="12" height="12" />
															: <Check width="20" height="20" />
													}
												</button>
											</div>
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={() => setShowConfirmAddCourse(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">No</span>
													<Close width="20" height="20" />
												</button>
											</div>
										</div>
									</div> :
									<div>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddCourse}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddCourse}</span></p>
										<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
											<button disabled={courseCategoryUniqueId.length < 2 || courseTypeUniqueId.length < 2 || title.length < 2 || currency.length < 2} onClick={() => { setDescriptionContents(); setShowConfirmAddCourse(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
												<span className="xui-mr-half">Save Course</span>
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