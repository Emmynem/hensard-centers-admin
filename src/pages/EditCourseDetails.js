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
import { getCourses, getCourse } from "../api/courses";
import { publicGetCourseCategories } from "../api/courseCategories";
import { publicGetCourseTypes } from "../api/courseTypes";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUpdateCourseDetails, useUpdateCourseOtherDetails, useUploadCourseImage } from "../hooks/useCourses";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditCourseDetails() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDescriptionRef = useRef(null);

	const [showConfirmUpdateCourseDetails, setShowConfirmUpdateCourseDetails] = useState(false);

	const [courseCategories, setCourseCategories] = useState(null);
	const [courseTypes, setCourseTypes] = useState(null);

	const {
		errorUpdateCourseDetails, handleTitle: handleTitleEdit, handleDescription: handleDescriptionEdit, handleCurrency: handleCurrencyEdit, handleAmount: handleAmountEdit, handleCertificate: handleCertificateEdit, handleUpdateCourseDetails, loadingUpdateCourseDetails,
		title: titleEdit, description: descriptionEdit, currency: currencyEdit, amount: amountEdit, certificate: certificateEdit, removeUpdateCourseDetailsModal, setTitle: setTitleEdit, setDescription: setDescriptionEdit, setCurrency: setCurrencyEdit, setAmount: setAmountEdit,
		setCertificate: setCertificateEdit, setRemoveUpdateCourseDetailsModal, setUniqueId: EditUniqueIdDetails, successUpdateCourseDetails
	} = useUpdateCourseDetails();

	const {
		errorUpdateCourseOtherDetails, handleCourseCategoryUniqueId: handleCourseCategoryUniqueIdEdit, handleCourseTypeUniqueId: handleCourseTypeUniqueIdEdit, handleUpdateCourseOtherDetails, loadingUpdateCourseOtherDetails,
		courseCategoryUniqueId: courseCategoryUniqueIdEdit, courseTypeUniqueId: courseTypeUniqueIdEdit, removeUpdateCourseOtherDetailsModal, setCourseCategoryUniqueId: setCourseCategoryUniqueIdEdit, setCourseTypeUniqueId: setCourseTypeUniqueIdEdit,
		setRemoveUpdateCourseOtherDetailsModal, setUniqueId: EditUniqueIdOtherDetails, successUpdateCourseOtherDetails
	} = useUpdateCourseOtherDetails();

	const {
		errorCourseImage, handleUploadCourseImage, loadingCourseImage, removeCourseImageModal, selectedCourseImage, setRemoveCourseImageModal,
		setSelectedCourseImage, setUniqueId: UploadCourseImageUniqueId, successCourseImage, uploadingCourseImagePercentage
	} = useUploadCourseImage();

	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			handleDescriptionEdit(editorDescriptionRef.current.getContent());
		}
	};

	const handleSelectCourseImage = (e) => {
		const el = e.target.files[0];
		setSelectedCourseImage("");
		setSelectedCourseImage(el);
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

	const [loadingViewCourse, setLoadingViewCourse] = useState(false)
	const [errorViewCourse, setErrorViewCourse] = useState(null)
	const [viewCourse, setViewCourse] = useState(null)

	async function getACourse(unique_id) {
		setLoadingViewCourse(true)
		const response = await getCourse(cookie, { unique_id });
		if (!response.err) {
			setViewCourse(response.data);
			EditUniqueIdDetails(unique_id); EditUniqueIdOtherDetails(unique_id); UploadCourseImageUniqueId(unique_id);
			setCourseCategoryUniqueIdEdit(response.data.data.course_category_unique_id);
			setCourseTypeUniqueIdEdit(response.data.data.course_type_unique_id);
			setTitleEdit(response.data.data.title);
			setDescriptionEdit(response.data.data.description);
			setCurrencyEdit(response.data.data.currency);
			setAmountEdit(response.data.data.amount);
			setCertificateEdit(response.data.data.certificate);
		} else { setErrorViewCourse(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewCourse(false)
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
		if (viewCourse === null) {
			getACourse(unique_id);
		}
	}, [viewCourse, courseTypes, courseCategories]);

	if (removeUpdateCourseDetailsModal) {
		setRemoveUpdateCourseDetailsModal(null);
		window.location.reload(true);
		// setTimeout(function () {
		// 	navigate(`/internal/courses`);
		// }, 1500)
	}
	if (removeUpdateCourseOtherDetailsModal) {
		setRemoveUpdateCourseOtherDetailsModal(null);
		window.location.reload(true);
	}
	if (removeCourseImageModal) {
		setRemoveCourseImageModal(null);
		window.location.reload(true);
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						{
							loadingViewCourse ?
								<center>
									<Loading width="12" height="12" />
								</center> : (
									viewCourse && viewCourse.success ?
										<>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<h1 className='xui-font-sz-110 xui-font-w-normal'>Update Course Other details</h1>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mt-2'>
														<div className="xui-form-box xui-mt-1">
															<label>Course Category</label>
															<select onChange={handleCourseCategoryUniqueIdEdit} value={courseCategoryUniqueIdEdit} required>
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
															<select onChange={handleCourseTypeUniqueIdEdit} value={courseTypeUniqueIdEdit} required>
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
													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseOtherDetails}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseOtherDetails}</span></p>
													<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
														<button onClick={handleUpdateCourseOtherDetails} disabled={loadingUpdateCourseOtherDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
															<span className="xui-mr-half">Save Changes</span>
															{
																loadingUpdateCourseOtherDetails ?
																	<Loading width="12" height="12" />
																	: <Arrowright width="12" height="12" />
															}
														</button>
													</div>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<h1 className='xui-font-sz-110 xui-font-w-normal xui-mb-2'>Update Course Image</h1>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<label>Image (Optional)</label>
													<div className="xui-d-flex xui-flex-ai-center">
														{
															viewCourse.data.image ?
																getFileExtension(viewCourse.data.image) === "pdf" || getFileExtension(viewCourse.data.image) === "PDF" ?
																	<div className='xui-d-inline-flex xui-flex-ai-center'>
																		<span className="xui-font-sz-120 xui-text-course xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewCourse.data.image)}</span>
																		<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewCourse.data.image); }}>
																			<EyeOpen width="20" height="20" />
																		</span>
																	</div> :
																	<img className="xui-img-200" src={viewCourse.data.image} alt="Course Image" />
																: null
														}
														<input onChange={handleSelectCourseImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .avif, .webp" id="editImage" />
													</div>
													{
														uploadingCourseImagePercentage > 0 ?
															<>
																<label htmlFor="uploader">Uploading</label>
																<progress className="xui-h-30" value={uploadingCourseImagePercentage} id="uploader" max="100">{uploadingCourseImagePercentage + "%"}</progress><br /><br></br>
															</> :
															""
													}

													{loadingCourseImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCourseImage}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successCourseImage}</span></p>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button disabled={loadingCourseImage} onClick={handleUploadCourseImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingCourseImage ?
																<Loading width="12" height="12" />
																: <Arrowright width="12" height="12" />
														}
													</button>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<h1 className='xui-font-sz-110 xui-font-w-normal xui-mb-2'>Update Course Details</h1>
												<div className="xui-form-box xui-mt-1">
													<label>Title</label>
													<input className="xui-font-sz-90" type="text" value={titleEdit} onChange={handleTitleEdit} required placeholder="Enter title of course"></input>
												</div>
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2'>
													<div className="xui-form-box xui-mt-1">
														<label>Currency</label>
														<select onChange={handleCurrencyEdit} value={currencyEdit} required>
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
														<input className="xui-font-sz-90" type="number" min={1} value={amountEdit} onChange={handleAmountEdit} required placeholder="Enter amount for course"></input>
													</div>
													<div className="xui-form-box xui-mt-1">
														<label>Certificate (Optional)</label>
														<input className="xui-font-sz-90" type="url" value={certificateEdit} onChange={handleCertificateEdit} placeholder="Enter certificate for course"></input>
													</div>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label className="">Description</label>
													<BundledEditor
														onInit={(evt, editor) => editorDescriptionRef.current = editor}
														initialValue={descriptionEdit}
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
													showConfirmUpdateCourseDetails ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit Course Details</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseDetails}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUpdateCourseDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUpdateCourseDetails ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdateCourseDetails(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> :
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseDetails}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																<button disabled={titleEdit.length < 2 || currencyEdit.length < 2} onClick={() => { setDescriptionContents(); setShowConfirmUpdateCourseDetails(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewCourse}</h3>
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