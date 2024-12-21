import { useState } from "react";
import { Link } from "react-router-dom";
import Arrowright from "../../icons/Arrowright";
import { useStaffSignin } from '../../hooks/useAuth';
import Loading from "../../icons/Loading";
import EyeOpen from "../../icons/EyeOpen";
import EyeClose from "../../icons/EyeClose";

export default function SignIn(){
    const { 
        errorLogin, handleSubmit, handleRememberMe, loginId, password, loading, remember_me, successLogin, centerUniqueId, centers, handleCenterUniqueId, handleLoginId, handlePassword
    } = useStaffSignin();

    const [showPassword, setShowPassword] = useState(false);

    return(
        <>
            <div className="xui-bg-white xui-bdr-rad-half xui-max-w-500 xui-md-mt-none xui-w-fluid-100 xui-p-1-half xui-pb-3 xui-text-black">
                <h2 className="xui-font-sz-125 xui-w-fluid-80 xui-my-1">Sign In</h2>
                <p className="xui-font-sz-80 xui-my-2"><span className="xui-opacity-7">Don't have an account?</span> <Link to="/signup" className="xui-font-w-bold psc-text xui-text-dc-none">Sign up</Link></p>
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
                    <div className="xui-form-box xui-mt-1">
                        <input className="xui-font-sz-90" type="text" value={loginId} onChange={handleLoginId} required placeholder="Email or Phone Number"></input>
                    </div>
                    <div className="xui-mb-2 xui-d-inline-flex xui-flex-ai-center xui-w-fluid-100">
                        <input className="xui-font-sz-90" type={showPassword ? "text" : "password"} value={password} onChange={handlePassword} required placeholder="Password"></input>
                        <span className="xui-cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOpen width="20" height="20" /> : <EyeClose width="20" height="20" />}</span>
                    </div>
                    <div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-between">
                        <div className="xui-d-inline-flex xui-flex-ai-center">
                            <input type="checkbox" onChange={handleRememberMe} checked={remember_me} id="remember-me" />
                            <label for="remember-me" className="xui-ml-half" style={{ marginBottom: '0' }}>Remember me</label>
                        </div>
                    </div>
                    <div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
                        <button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
                            <span className="xui-mr-half">Sign In</span>
                            {
                                loading ?
                                    <Loading width="12" height="12" />
                                    : <Arrowright width="12" height="12" />
                            }
                        </button>
                    </div>
                </form>
                <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorLogin}</span></p>
                <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successLogin}</span></p>
            </div>
        </>
    )
}