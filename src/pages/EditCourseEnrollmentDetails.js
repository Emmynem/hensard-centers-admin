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
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUpdateCourseEnrollmentDetails } from "../hooks/useCourses";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditCourseEnrollmentDetails() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorEnrollmentDetailsRef = useRef(null);

	const [showConfirmUpdateCourseEnrollmentDetails, setShowConfirmUpdateCourseEnrollmentDetails] = useState(false);

	const {
		errorUpdateCourseEnrollmentDetails, handleEnrollmentDetails: handleEnrollmentDetailsEdit, handleUpdateCourseEnrollmentDetails, loadingUpdateCourseEnrollmentDetails,
		enrollmentDetails: enrollmentDetailsEdit, removeUpdateCourseEnrollmentDetailsModal, setEnrollmentDetails: setEnrollmentDetailsEdit,
		setRemoveUpdateCourseEnrollmentDetailsModal, setUniqueId: EditUniqueIdEnrollmentDetails, successUpdateCourseEnrollmentDetails
	} = useUpdateCourseEnrollmentDetails();

	const setEnrollmentDetailsContents = () => {
		if (editorEnrollmentDetailsRef.current) {
			handleEnrollmentDetailsEdit(editorEnrollmentDetailsRef.current.getContent());
		}
	};

	const [loadingViewCourse, setLoadingViewCourse] = useState(false)
	const [errorViewCourse, setErrorViewCourse] = useState(null)
	const [viewCourse, setViewCourse] = useState(null)

	async function getACourse(unique_id) {
		setLoadingViewCourse(true)
		const response = await getCourse(cookie, { unique_id });
		if (!response.err) {
			setViewCourse(response.data);
			EditUniqueIdEnrollmentDetails(unique_id); 
			setEnrollmentDetailsEdit(response.data.data.enrollment_details);
		} else { setErrorViewCourse(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewCourse(false)
	};

	useEffect(() => {
		if (viewCourse === null) {
			getACourse(unique_id);
		}
	}, [viewCourse]);

	if (removeUpdateCourseEnrollmentDetailsModal) {
		setRemoveUpdateCourseEnrollmentDetailsModal(null);
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
												<h1 className='xui-font-sz-110 xui-font-w-normal xui-mb-2'>Update Course Enrollment Details</h1>
												<div className="xui-form-box xui-mt-2">
													<label className="">Enrollment Details</label>
													<BundledEditor
														onInit={(evt, editor) => editorEnrollmentDetailsRef.current = editor}
														initialValue={enrollmentDetailsEdit}
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
													showConfirmUpdateCourseEnrollmentDetails ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit Course Enrollment Details</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseEnrollmentDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseEnrollmentDetails}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUpdateCourseEnrollmentDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUpdateCourseEnrollmentDetails ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdateCourseEnrollmentDetails(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> :
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseEnrollmentDetails}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseEnrollmentDetails}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																<button onClick={() => { setEnrollmentDetailsContents(); setShowConfirmUpdateCourseEnrollmentDetails(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
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