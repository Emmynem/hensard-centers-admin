import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { config } from "./config";
import useCookie from "./hooks/useCookie";
import Layout from "./pages/Layout";
import Access from "./pages/Access";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Centers from "./pages/Centers";
import CourseCategories from "./pages/CourseCategories";
import CourseTypes from "./pages/CourseTypes";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import EditCourseDetails from "./pages/EditCourseDetails";
import EditCourseEnrollmentDetails from "./pages/EditCourseEnrollmentDetails";
import EditCourseCertificateTemplate from "./pages/EditCourseCertificateTemplate";
import Enrollments from "./pages/Enrollments";
import Categories from "./pages/Categories";
import Posts from "./pages/Posts";
import AddPost from "./pages/AddPost";
import EditPostDetails from "./pages/EditPostDetails";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EditEventDetails from "./pages/EditEventDetails";
import Galleries from "./pages/Galleries";
import PublicGallery from "./pages/PublicGallery";
import Videos from "./pages/Videos";
import Journals from "./pages/Journals";
import Policies from "./pages/Policies";
import Presentations from "./pages/Presentations";
import Reports from "./pages/Reports";
import Research from "./pages/Research";
import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";
import EditProjectDetails from "./pages/EditProjectDetails";
import Teams from "./pages/Teams";
// import ApiKeys from "./pages/ApiKeys";
// import Carts from "./pages/Carts";
// import AppDefaults from "./pages/AppDefaults";

export default function App(){
  const {cookie} = useCookie(config.data, "");

  return(
    <BrowserRouter>
      <Routes>
        <Route path='/internal' element={<Layout />}>
          <Route path="dashboard" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Dashboard />)
          } />
          {/* <Route path="api/keys" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<ApiKeys />)
          } />
          <Route path="app/defaults" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<AppDefaults />)
          } /> */}
          <Route path="transactions" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Transactions />)
          } />
          <Route path="users" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Users />)
          } />
          <Route path="centers" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Centers />)
          } />
          <Route path="course-categories" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
              (<CourseCategories />)
          } />
          <Route path="course-types" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
              (<CourseTypes />)
          } />
          <Route path="courses" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Courses />)
          } />
          <Route path="course/add" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<AddCourse />)
          } />
          <Route path="course/edit/details" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<EditCourseDetails />)
          } />
          <Route path="course/edit/enrollment/details" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<EditCourseEnrollmentDetails />)
          } />
          <Route path="course/edit/certificate/template" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
              (<EditCourseCertificateTemplate />)
          } />
          <Route path="enrollments" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Enrollments />)
          } />
          <Route path="categories" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Categories />)
          } />
          <Route path="posts" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Posts />)
          } />
          <Route path="post/add" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<AddPost />)
          } />
          <Route path="post/edit/details" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<EditPostDetails />)
          } />
          <Route path="events" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Events />)
          } />
          <Route path="event/add" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<AddEvent />)
          } />
          <Route path="event/edit/details" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<EditEventDetails />)
          } />
          <Route path="galleries" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Galleries />)
          } />
          <Route path="public-galleries" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<PublicGallery />)
          } />
          <Route path="videos" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Videos />)
          } />
          <Route path="journals" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Journals />)
          } />
          <Route path="policies" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Policies />)
          } />
          <Route path="presentations" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Presentations />)
          } />
          <Route path="reports" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Reports />)
          } />
          <Route path="research" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Research />)
          } />
          <Route path="projects" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Projects />)
          } />
          <Route path="project/add" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<AddProject />)
          } />
          <Route path="project/edit/details" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<EditProjectDetails />)
          } />
          <Route path="teams" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Teams />)
          } />
          {/* <Route path="settings" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Dashboard />)
          } /> */}
          <Route path="*" element={<Navigate replace to={"dashboard"} />} />
        </Route>
        <Route path='/' element={<Access />}>
          <Route index element={<SignIn />} />
          <Route path="signin" element={
            cookie && cookie !== '' && cookie !== '[object Object]' ?
              (<Navigate replace to={"/internal/dashboard"} />) :
              (<SignIn />)
          } />
          <Route path="signup" element={
            cookie && cookie !== '' && cookie !== '[object Object]' ?
              (<Navigate replace to={"/internal/dashboard"} />) :
              (<SignUp />)
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}