import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from '../assets/images/logo-white.png';
import Category from '../icons/Category';
import Swap from '../icons/Swap';
import Team from '../icons/Team';
import Token from '../icons/Token';
import Alarm from '../icons/Alarm';
import Tag from '../icons/Tag';
import Users from '../icons/Users';
import Wallet from '../icons/Wallet';
import Setting from '../icons/Setting';
import Check from '../icons/Check';
import Close from '../icons/Close';
import Logout from '../icons/Logout';
import { config } from "../config";
import useCookie from "../hooks/useCookie";
import Loading from "../icons/Loading";
import '../assets/css/style.css';
import Key from "../icons/Key";
import Arrowright from "../icons/Arrowright";
import Mail from "../icons/Mail";
import Document from "../icons/Document";
import Image from "../icons/Image";
import Folder from "../icons/Folder";
import Server from "../icons/Server";
import Cart from "../icons/Cart";
import AlertCircle from "../icons/AlertCircle";
import HelpCircle from "../icons/HelpCircle";
import Love from "../icons/Love";
import Lock from "../icons/Lock";
import ShoppingBag from "../icons/ShoppingBag";
import EyeOpenAlt from "../icons/EyeOpenAlt";
import Rating from "../icons/Rating";

export default function Layout() {
    const loc = useLocation();

    const { cookie, removeCookie } = useCookie(config.data, "");

    const navigate = useNavigate();

    const [loadingLogout, setLoadingLogout] = useState(false);

    const handleLogout = () => {
        setLoadingLogout(true);
        removeCookie();
        setTimeout(function () {
            navigate(`/signin`);
            window.location.reload(true);
        }, 1500)
    };

    return (
        <>
            <section className="xui-dashboard">
                <div className="navigator xui-text-white xui-px-2 disable-scrollbars">
                    <div className="brand xui-pt-2">
                        <div className="maxified xui-d-flex xui-flex-ai-center">
                            <Link className='xui-text-inherit xui-text-dc-none' to={`/internal/dashboard`}>
                                <div className='xui-d-inline-flex'>
                                    {
                                        JSON.parse(cookie) && JSON.parse(cookie).center_image !== null ?
                                            <img className='xui-img-30' src={JSON.parse(cookie).center_image} alt='logo' /> : 
                                            <img className='xui-img-30' src={Logo} alt='logo' />
                                    }
                                    <div className='xui-pl-1'>
                                        <p className='xui-font-w-bold'>Admin</p>
                                        <span className='xui-font-sz-70 xui-opacity-7'>for Hensard Centre</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="links xui-pt-2">
                        <div className='xui-d-flex psc-dashboard-profile'>
                            <div className='xui-pl-half'>
                                <h3 className='xui-font-sz-90 xui-font-w-normal'>{JSON.parse(cookie) ? JSON.parse(cookie).center : ""}</h3>
                                <hr></hr>
                                <h6 className='xui-font-sz-90 xui-font-w-normal'>{JSON.parse(cookie) ? JSON.parse(cookie).fullname : ""}</h6>
                            </div>
                        </div>
                        <Link to={`/internal/dashboard`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/dashboard` ? 'active' : '')}>
                            <div className="icon">
                                <Category width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Dashboard</span>
                            </div>
                        </Link>
                        {/* <Link to={`/internal/api/keys`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/api/keys` ? 'active' : '')}>
                            <div className="icon">
                                <Key width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>API Keys</span>
                            </div>
                        </Link>
                        <Link to={`/internal/app/defaults`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/app/defaults` ? 'active' : '')}>
                            <div className="icon">
                                <Setting width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>App Defaults</span>
                            </div>
                        </Link> */}
                        <Link to={`/internal/centers`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/centers` ? 'active' : '')}>
                            <div className="icon">
                                <Folder width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Centers</span>
                            </div>
                        </Link>
                        <hr></hr>
                        <Link to={`/internal/course-categories`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/course-categories` ? 'active' : '')}>
                            <div className="icon">
                                <Category width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Course Categories</span>
                            </div>
                        </Link>
                        <Link to={`/internal/course-types`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/course-types` ? 'active' : '')}>
                            <div className="icon">
                                <Category width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Course Types</span>
                            </div>
                        </Link>
                        <Link to={`/internal/courses`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/courses` || loc.pathname === `/internal/course/add` || loc.pathname === `/internal/course/edit/details` || loc.pathname === `/internal/course/edit/enrollment/details` || loc.pathname === `/internal/course/edit/certificate/template` ? 'active' : '')}>
                            <div className="icon">
                                <Folder width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Courses</span>
                            </div>
                        </Link>
                        <Link to={`/internal/enrollments`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/enrollments` ? 'active' : '')}>
                            <div className="icon">
                                <Server width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Enrollments</span>
                            </div>
                        </Link>
                        <hr></hr>
                        <Link to={`/internal/categories`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/categories` ? 'active' : '')}>
                            <div className="icon">
                                <Category width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Categories</span>
                            </div>
                        </Link>
                        <Link to={`/internal/posts`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/posts` || loc.pathname === `/internal/post/add` || loc.pathname === `/internal/post/edit/details` ? 'active' : '')}>
                            <div className="icon">
                                <Tag width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Posts</span>
                            </div>
                        </Link>
                        <Link to={`/internal/events`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/events` || loc.pathname === `/internal/event/add` || loc.pathname === `/internal/event/edit/details` ? 'active' : '')}>
                            <div className="icon">
                                <Alarm width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Events</span>
                            </div>
                        </Link>
                        <Link to={`/internal/galleries`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/galleries` ? 'active' : '')}>
                            <div className="icon">
                                <Image width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Galleries</span>
                            </div>
                        </Link>
                        <Link to={`/internal/public-galleries`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/public-galleries` ? 'active' : '')}>
                            <div className="icon">
                                <Image width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Public Galleries</span>
                            </div>
                        </Link>
                        <Link to={`/internal/videos`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/videos` ? 'active' : '')}>
                            <div className="icon">
                                <Image width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Videos</span>
                            </div>
                        </Link>
                        <hr></hr>
                        <Link to={`/internal/journals`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/journals` ? 'active' : '')}>
                            <div className="icon">
                                <Document width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Journals</span>
                            </div>
                        </Link>
                        <Link to={`/internal/policies`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/policies` ? 'active' : '')}>
                            <div className="icon">
                                <Document width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Policies</span>
                            </div>
                        </Link>
                        <Link to={`/internal/presentations`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/presentations` ? 'active' : '')}>
                            <div className="icon">
                                <Document width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Presentations</span>
                            </div>
                        </Link>
                        <Link to={`/internal/projects`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/projects` || loc.pathname === `/internal/project/add` || loc.pathname === `/internal/project/edit/details` ? 'active' : '')}>
                            <div className="icon">
                                <Document width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Projects</span>
                            </div>
                        </Link>
                        <Link to={`/internal/reports`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/reports` ? 'active' : '')}>
                            <div className="icon">
                                <Document width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Reports</span>
                            </div>
                        </Link>
                        <Link to={`/internal/research`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/research` ? 'active' : '')}>
                            <div className="icon">
                                <Document width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Research</span>
                            </div>
                        </Link>
                        <Link to={`/internal/teams`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/teams` ? 'active' : '')}>
                            <div className="icon">
                                <Team width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Teams</span>
                            </div>
                        </Link>
                        <hr></hr>
                        <Link to={`/internal/transactions`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/transactions` ? 'active' : '')}>
                            <div className="icon">
                                <Wallet width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Transactions</span>
                            </div>
                        </Link>
                        <Link to={`/internal/users`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/users` ? 'active' : '')}>
                            <div className="icon">
                                <Users width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Users</span>
                            </div>
                        </Link>
                        {/* <Link to={`/internal/settings`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6" + (loc.pathname === `/internal/settings` ? 'active' : '')}>
                            <div className="icon">
                                <Setting />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Settings</span>
                            </div>
                        </Link> */}
                        <div xui-modal-open="logoutModal" className="bottom-fixed xui-cursor-pointer">
                            <div xui-modal-open="logoutModal" className="xui-text-inherit link-box xui-font-sz-90 xui-opacity-6">
                                <div xui-modal-open="logoutModal" className="icon">
                                    <Logout width="20" height="20" />
                                </div>
                                <div xui-modal-open="logoutModal" className="name xui-ml-half">
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className='xui-modal' xui-modal="logoutModal" id="logoutModal">
                    <div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
                        <center>
                            <h1>Logout confirmation</h1>
                            <p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to cotinue with this action?</p>
                        </center>
                        <div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
                            <div className="xui-d-inline-flex xui-flex-ai-center">
                                <button onClick={handleLogout} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
                                    <span className="xui-mr-half">Yes</span>
                                    {
                                        loadingLogout ?
                                            <Loading width="12" height="12" />
                                            : <Check width="20" height="20" />
                                    }
                                </button>
                            </div>
                            <div className="xui-d-inline-flex xui-flex-ai-center">
                                <button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close="logoutModal">
                                    <span className="xui-mr-half">No</span>
                                    <Close width="20" height="20" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <Outlet />
            </section>
        </>
    );
}