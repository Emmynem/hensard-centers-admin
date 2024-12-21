import { useState } from "react";
import { Link } from "react-router-dom";
import { useStaffSignUp } from '../../hooks/useAuth';
import Loading from "../../icons/Loading";
import SuccessTick from "../../assets/images/success-tick.png";
import Arrowright from "../../icons/Arrowright";
import EyeOpen from "../../icons/EyeOpen";
import EyeClose from "../../icons/EyeClose";

export default function SignUp() {
	const {
		altPhoneNumber, centerUniqueId, centers, confirmPassword, dateOfBirth, email, errorStaffSignup, firstname, gender, handleAltPhoneNumber, handleCenterUniqueId, handleConfirmPassword, 
		handleDateOfBirth, handleEmail, handleFirstname, handleGender, handleLastname, handleMiddlename, handlePassword, handlePhoneNumber, handleSubmit, lastname, loading, middlename, 
		password, phoneNumber, setConfirmPassword, setPassword, successStaffSignup
	} = useStaffSignUp();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<>
			<div className="xui-max-w-800 xui-w-fluid-100 xui-mt-2 xui-md-mt-none">
				<div className="xui-bg-white xui-bdr-rad-half xui-w-fluid-100 xui-p-1-half xui-pb-3 xui-text-black">
					<h2 className="xui-font-sz-125 xui-w-fluid-80">Sign Up</h2>
					<p className="xui-font-sz-80 xui-my-1"><span className="xui-opacity-7">Already have an account?</span> <Link to={`/signin`} className="xui-font-w-bold psc-text xui-text-dc-none">Login</Link></p>
					<form className="xui-form" layout="2" onSubmit={handleSubmit}>
						<div className="xui-form-box xui-mt-1">
							<select onChange={handleCenterUniqueId} value={centerUniqueId} required>
								<option selected value={""}>Select Center</option>
								{
									centers && centers.data.rows.length !== 0 ? (
										centers.data.rows.map((item, index) => {
											return (
												<option key={index} value={item.unique_id}>{item.name} ({item.acronym})</option>
											)
										})
									) : ""
								}
							</select>
						</div>
						<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-md-grid-col-3 xui-grid-gap-1">
							<div className="xui-form-box xui-mt-1">
								<input className="xui-font-sz-90" type="text" value={firstname} onChange={handleFirstname} required placeholder="First Name"></input>
							</div>
							<div className="xui-form-box xui-mt-1">
								<input className="xui-font-sz-90" type="text" value={middlename} onChange={handleMiddlename} placeholder="Middle Name (optional)"></input>
							</div>
							<div className="xui-form-box xui-mt-1">
								<input className="xui-font-sz-90" type="text" value={lastname} onChange={handleLastname} required placeholder="Last Name"></input>
							</div>
						</div>
						<div className="xui-form-box xui-mt-1">
							<input className="xui-font-sz-90" type="email" value={email} onChange={handleEmail} required placeholder="Email"></input>
						</div>
						<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
							<div className="xui-form-box xui-mt-1">
								<input className="xui-font-sz-90" type="tel" value={phoneNumber} onChange={handlePhoneNumber} required placeholder="Phone Number"></input>
							</div>
							<div className="xui-form-box xui-mt-1">
								<input className="xui-font-sz-90" type="tel" value={altPhoneNumber} onChange={handleAltPhoneNumber} placeholder="Alt Phone Number (optional)"></input>
							</div>
						</div>
						<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
							<div className="xui-form-box xui-mt-1">
								<select onChange={handleGender} value={gender} required>
									<option selected value={""}>Select Gender</option>
									<option value={"Male"}>Male</option>
									<option value={"Female"}>Female</option>
								</select>
							</div>
							<div className="xui-form-box xui-mt-1">
								<input className="xui-font-sz-90" type={"date"} value={dateOfBirth} onChange={handleDateOfBirth}></input>
							</div>
						</div>
						<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
							<div className="xui-form-box xui-mb-1 xui-d-inline-flex xui-flex-ai-center xui-w-fluid-100">
								<input className="xui-font-sz-90" type={showPassword ? "text" : "password"} value={password} onChange={handlePassword} required placeholder="Password"></input>
								<span className="xui-cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOpen width="20" height="20" /> : <EyeClose width="20" height="20" />}</span>
							</div>
							<div className="xui-form-box xui-mb-1 xui-d-inline-flex xui-flex-ai-center xui-w-fluid-100">
								<input className="xui-font-sz-90" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={handleConfirmPassword} required placeholder="Confirm Password"></input>
								<span className="xui-cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOpen width="20" height="20" /> : <EyeClose width="20" height="20" />}</span>
							</div>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Get access</span>
								{
									loading ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorStaffSignup}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successStaffSignup}</span></p>
				</div>
			</div>
		</>
	)
}