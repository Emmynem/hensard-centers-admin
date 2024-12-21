import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CodeEditor from '@uiw/react-textarea-code-editor';
import MarkdownPreview from "@uiw/react-markdown-preview";
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
import { getCourses, getCourse } from "../api/courses";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUpdateCourseCertificateTemplate } from "../hooks/useCourses";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditCourseCertificateTemplate() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.data, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [showConfirmUpdateCourseCertificateTemplate, setShowConfirmUpdateCourseCertificateTemplate] = useState(false);

	const {
		errorUpdateCourseCertificateTemplate, handleCertificateTemplate: handleCertificateTemplateEdit, handleUpdateCourseCertificateTemplate, loadingUpdateCourseCertificateTemplate,
		certificateTemplate: certificateTemplateEdit, removeUpdateCourseCertificateTemplateModal, setCertificateTemplate: setCertificateTemplateEdit,
		setRemoveUpdateCourseCertificateTemplateModal, setUniqueId: EditUniqueIdCertificateTemplate, successUpdateCourseCertificateTemplate
	} = useUpdateCourseCertificateTemplate();

	const [loadingViewCourse, setLoadingViewCourse] = useState(false)
	const [errorViewCourse, setErrorViewCourse] = useState(null)
	const [viewCourse, setViewCourse] = useState(null)

	async function getACourse(unique_id) {
		setLoadingViewCourse(true)
		const response = await getCourse(cookie, { unique_id });
		if (!response.err) {
			setViewCourse(response.data);
			EditUniqueIdCertificateTemplate(unique_id);
			setCertificateTemplateEdit(response.data.data.certificate_template);
		} else { setErrorViewCourse(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewCourse(false)
	};

	useEffect(() => {
		if (viewCourse === null) {
			getACourse(unique_id);
		}
	}, [viewCourse]);

	if (removeUpdateCourseCertificateTemplateModal) {
		setRemoveUpdateCourseCertificateTemplateModal(null);
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
											<form className="xui-form xui-mt-2" layout="2" onSubmit={handleUpdateCourseCertificateTemplate}>
												<h1 className='xui-font-sz-110 xui-font-w-normal xui-mb-2'>Update Course Certificate Template</h1>
												<p className='xui-font-sz-90 xui-font-w-normal xui-mb-2'><b>Note:</b> The template should include almost all of the following values below</p>
												<ol>
													<li>center_name</li>
													<li>center_image</li>
													<li>center_url</li>
													<li>username</li>
													<li>email</li>
													<li>course</li>
													<li>course_certificate</li>
													<li>course_image</li>
													<li>reference</li>
													<li>enrolled_date</li>
													<li>completion_date</li>
													<li>certification_date</li>
													<li>enrollment_status</li>
												</ol>
												<div className="xui-form-box xui-mt-2">
													<label className="">Certificate Template</label>
													<section className="xui-d-grid xui-lg-grid-col-2 xui-grid-gap-2 xui-mt-1">
														<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
															<p className="xui-font-sz-100 xui-my-1 xui-text-center">Code</p>
															<div data-color-mode="light">
																<CodeEditor
																	value={certificateTemplateEdit}
																	language="html"
																	placeholder="Please enter HTML code."
																	onChange={(evn) => setCertificateTemplateEdit(evn.target.value)}
																	padding={15}
																	style={{
																		font: 12,
																		backgroundColor: "#f5f5f5",
																		fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
																	}}
																/>
															</div>
														</div>
														<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
															<p className="xui-font-sz-100 xui-my-1 xui-text-center">Preview</p>
															<div data-color-mode="light">
																<MarkdownPreview source={certificateTemplateEdit} />
															</div>
														</div>
													</section>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Template</span>
														{
															loadingUpdateCourseCertificateTemplate ?
																<Loading width="12" height="12" />
																: <Arrowright width="12" height="12" />
														}
													</button>
												</div>
											</form>
											<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateCourseCertificateTemplate}</span></p>
											<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateCourseCertificateTemplate}</span></p>
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