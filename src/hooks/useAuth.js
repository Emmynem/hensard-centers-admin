import { useState } from "react";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useCookie from './useCookie';
import { publicGetCenters } from "../api/centers";
import { resetPassword, staffSignin, staffSignup, verifyEmail } from "../api/auth";
import { config } from "../config";

const useStaffSignUp = () => {

	const navigate = useNavigate();

	const [centers, setCenters] = useState(null);

	async function getAllCenters() {
		setCenters(null);
		const response = await publicGetCenters();
		setCenters(response.data);
		if (response.error) setCenters(null);
	};

	useEffect(() => {
		if (centers === null) {
			getAllCenters();
		}
	}, [centers]);

	const [loading, setLoading] = useState(false);

	// declaring and initializing (to null) values
	const [centerUniqueId, setCenterUniqueId] = useState("");
	const [method, setMethod] = useState("Email");
	const [firstname, setFirstname] = useState("");
	const [middlename, setMiddlename] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [altPhoneNumber, setAltPhoneNumber] = useState("");
	const [gender, setGender] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// error & success prompts
	const [errorStaffSignup, setErrorStaffSignup] = useState(null);
	const [successStaffSignup, setSuccessStaffSignup] = useState(null);

	// validating values that need precision
	const validEmail = new RegExp(config.EMAIL_REGEX);
	const test_all_regex = (data, regex) => {
		if (!data) {
			return false;
		}

		const valid = regex.test(data);
		if (!valid) {
			return false;
		}

		return true;
	};

	const validate_password = (url) => {
		const tester = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
		return test_all_regex(url, tester);
	};

	// handling all onChange states
	const handleCenterUniqueId = (e) => { e.preventDefault(); setErrorStaffSignup(null); setSuccessStaffSignup(null); setCenterUniqueId(e.target.value) };
	const handleFirstname = (e) => { e.preventDefault(); setFirstname(e.target.value) };
	const handleMiddlename = (e) => { e.preventDefault(); setMiddlename(e.target.value) };
	const handleLastname = (e) => { e.preventDefault(); setLastname(e.target.value) };
	const handleEmail = (e) => { e.preventDefault(); setEmail(e.target.value) };
	const handlePhoneNumber = (e) => { e.preventDefault(); setPhoneNumber(e.target.value) };
	const handleAltPhoneNumber = (e) => { e.preventDefault(); setAltPhoneNumber(e.target.value) };
	const handleGender = (e) => { e.preventDefault(); setGender(e.target.value) };
	const handleDateOfBirth = (e) => { e.preventDefault(); setDateOfBirth(e.target.value) };
	const handlePassword = (e) => { e.preventDefault(); setPassword(e.target.value) };
	const handleConfirmPassword = (e) => { e.preventDefault(); setConfirmPassword(e.target.value) };

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!loading) {
			if (centerUniqueId.length < 1) {
				setErrorStaffSignup(null);
				setSuccessStaffSignup(null);
				setErrorStaffSignup("Center is required");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (firstname.length < 2) {
				setErrorStaffSignup("Firstname is required | Min character - 2");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (firstname.length > 50) {
				setErrorStaffSignup("Invalid Firstname | Max character - 50");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (middlename.length > 50) {
				setErrorStaffSignup("Invalid Middlename | Max character - 50");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (lastname.length < 2) {
				setErrorStaffSignup("Lastname is required | Min character - 2");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (lastname.length > 50) {
				setErrorStaffSignup("Invalid Lastname | Max character - 50");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (email.length === 0) {
				setErrorStaffSignup("Email is required");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (!validEmail.test(email)) {
				setErrorStaffSignup("Invalid email");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (phoneNumber.length < 2) {
				setErrorStaffSignup("Phone Number is required");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (gender.length < 1) {
				setErrorStaffSignup("Gender is required");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (password.length === 0) {
				setErrorStaffSignup("Password is required");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (!validate_password(password)) {
				setErrorStaffSignup("Weak password");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (confirmPassword.length === 0) {
				setErrorStaffSignup("Confirm Password is required");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else if (confirmPassword !== password) {
				setErrorStaffSignup("Passwords not matching!");
				setTimeout(function () {
					setErrorStaffSignup(null);
				}, 2500)
			} else {
				setLoading(true);

				const staffSignupRes = staffSignup({
					center_unique_id: centerUniqueId,
					method: method,
					firstname: firstname,
					middlename: middlename.length > 0 ? middlename : undefined,
					lastname: lastname,
					email: email.trim().toLowerCase(),
					phone_number: phoneNumber,
					alt_phone_number: altPhoneNumber.length > 0 ? altPhoneNumber : undefined,
					gender: gender,
					date_of_birth: dateOfBirth.length > 0 ? dateOfBirth : undefined,
					password: password,
					confirmPassword: confirmPassword
				})

				staffSignupRes.then(res => {
					setLoading(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.data.message} - ${res.error.response.data.data[0].msg}`;
							setErrorStaffSignup(error);
							setTimeout(function () {
								setErrorStaffSignup(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorStaffSignup(error);
							setTimeout(function () {
								setErrorStaffSignup(null);
							}, 2000)
						}
					} else {
						setErrorStaffSignup(null);
						setSuccessStaffSignup(`Sign up successful ...`);

						setTimeout(function () {
							setSuccessStaffSignup(null);
							navigate(`/`);
						}, 2500)
					}
				}).catch(err => {
					setLoading(false);
				})

			}
		}
	};

	return {
		centers, errorStaffSignup, successStaffSignup, loading, centerUniqueId, method, firstname, middlename, lastname, email, phoneNumber, 
		altPhoneNumber, gender, dateOfBirth, password, confirmPassword, handleCenterUniqueId, handleFirstname, handleMiddlename, handleLastname, 
		handleEmail, handlePhoneNumber, handleAltPhoneNumber, handleGender, handleDateOfBirth, handleSubmit, 
		password, setPassword, confirmPassword, setConfirmPassword, handleConfirmPassword, handlePassword
	};
};

const useStaffSignin = () => {
	const [centers, setCenters] = useState(null);

	async function getAllCenters() {
		setCenters(null);
		const response = await publicGetCenters();
		setCenters(response.data);
		if (response.error) setCenters(null);
	};

	useEffect(() => {
		if (centers === null) {
			getAllCenters();
		}
	}, [centers]);

	const [loading, setLoading] = useState(false);

	const [centerUniqueId, setCenterUniqueId] = useState("");
	const [loginId, setLoginId] = useState(null);
	const [password, setPassword] = useState(null);
	const [remember_me, setRememberMe] = useState(false);
	const [errorLogin, setErrorLogin] = useState(null);
	const [successLogin, setSuccessLogin] = useState(null);

	const { cookie, updateCookie } = useCookie(config.data, "");

	const navigate = useNavigate();

	const handleCenterUniqueId = (e) => { e.preventDefault(); setCenterUniqueId(e.target.value) };
	const handleLoginId = (e) => { e.preventDefault(); setLoginId(e.target.value) };
	const handlePassword = (e) => { e.preventDefault(); setPassword(e.target.value) };
	const handleRememberMe = (e) => { e.preventDefault(); setRememberMe(!remember_me); };

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!loading) {
			if (centerUniqueId.length < 1) {
				setErrorLogin("Center is required");
				setTimeout(function () {
					setErrorLogin(null);
				}, 2500)
			} else if (loginId.length === 0) {
				setErrorLogin("Email or Phone Number is required");
				setTimeout(function () {
					setErrorLogin(null);
				}, 2500)
			} else if (password.length === 0) {
				setErrorLogin("Password is required");
				setTimeout(function () {
					setErrorLogin(null);
				}, 2500)
			} else {
				setLoading(true);
				const staffSigninRes = staffSignin({ center_unique_id: centerUniqueId, login_id: loginId, password });

				staffSigninRes.then(res => {
					setLoading(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorLogin(error);
							setTimeout(function () {
								setErrorLogin(null);
							}, 2500)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorLogin(error);
							setTimeout(function () {
								setErrorLogin(null);
							}, 2500)
						}
					} else {
						setErrorLogin(null);
						setSuccessLogin("Login successful!");
						updateCookie(JSON.stringify(res.data.data), (remember_me ? 7 : 1));

						setTimeout(function () {
							setSuccessLogin(null);
							navigate(`/internal/dashboard`);
							window.location.reload(true);
						}, 2000);
					}
				}).catch(err => {
					setLoading(false);
				})
			}
		}
	};

	return {
		loginId, centers, centerUniqueId, remember_me, errorLogin, successLogin, cookie, loading, handleLoginId, handleCenterUniqueId, handleRememberMe, handleSubmit, handlePassword, password
	};
};

const useVerifyEmail = () => {

	const [loading, setLoading] = useState(false);
	const [errorVerifyEmail, setErrorVerifyEmail] = useState(null);
	const [successVerifyEmail, setSuccessVerifyEmail] = useState(null);

	const handleVerification = (email, verification_id, center_unique_id) => {
		if (!loading) {
			setLoading(true);
			const verifyEmailRes = verifyEmail({ email, center_unique_id });

			verifyEmailRes.then(res => {
				setLoading(false);
				if (res.err) {
					if (!res.error.response.data.success) {
						const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
						setErrorVerifyEmail(error);
						// setTimeout(function () {
						// 	setErrorVerifyEmail(null);
						// }, 2500)
					} else {
						const error = `${res.error.code} - ${res.error.message}`;
						setErrorVerifyEmail(error);
						// setTimeout(function () {
						// 	setErrorVerifyEmail(null);
						// }, 2500)
					}
				} else {
					setErrorVerifyEmail(null);
					setSuccessVerifyEmail(res.data.message);
				}
			}).catch(err => {
				setLoading(false);
			})
		}
	};

	return {
		loading, errorVerifyEmail, successVerifyEmail, handleVerification
	};
};

const useResetPassword = () => {
	const [centers, setCenters] = useState(null);

	async function getAllCenters() {
		setCenters(null);
		const response = await publicGetCenters();
		setCenters(response.data);
		if (response.error) setCenters(null);
	};

	useEffect(() => {
		if (centers === null) {
			getAllCenters();
		}
	}, [centers]);

	const [loading, setLoading] = useState(false);
	const [showPasswordResetSuccess, setShowPasswordResetSuccess] = useState(false);
	const [centerUniqueId, setCenterUniqueId] = useState("");
	const [loginId, setLoginId] = useState(null);
	const [errorPasswordReset, setErrorPasswordReset] = useState(null);
	const [successPasswordReset, setSuccessPasswordReset] = useState(null);

	const handleCenterUniqueId = (e) => { e.preventDefault(); setCenterUniqueId(e.target.value) };
	const handleLoginId = (e) => { e.preventDefault(); setLoginId(e.target.value) };

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!loading) {
			if (centerUniqueId.length < 1) {
				setErrorPasswordReset("Center is required");
				setTimeout(function () {
					setErrorPasswordReset(null);
				}, 2500)
			} else if (loginId.length === 0) {
				setErrorPasswordReset("Email or Phone Number is required");
				setTimeout(function () {
					setErrorPasswordReset(null);
				}, 2500)
			} else {
				setLoading(true);
				const resetPasswordRes = resetPassword({ login_id: loginId });

				resetPasswordRes.then(res => {
					setLoading(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorPasswordReset(error);
							setTimeout(function () {
								setErrorPasswordReset(null);
							}, 2500)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorPasswordReset(error);
							setTimeout(function () {
								setErrorPasswordReset(null);
							}, 2500)
						}
					} else {
						setErrorPasswordReset(null);
						setSuccessPasswordReset("Password reset successful!");

						setTimeout(function () {
							setSuccessPasswordReset(null);
							setShowPasswordResetSuccess(true);
						}, 2000);
					}
				}).catch(err => {
					setLoading(false);
				})
			}
		}
	};

	return {
		centers, loginId, centerUniqueId, loading, handleLoginId, handleCenterUniqueId, errorPasswordReset, successPasswordReset, handleSubmit, showPasswordResetSuccess
	};
};

export { useStaffSignUp, useStaffSignin, useVerifyEmail, useResetPassword };