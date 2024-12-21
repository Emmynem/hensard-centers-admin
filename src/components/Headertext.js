import { useLocation } from "react-router-dom";

export default function Headertext() {
    const loc = useLocation();

    if (loc.pathname === `/internal/dashboard`) {
        return "Dashboard";
    } else if (loc.pathname === `/internal/users`) {
        return "Users";
    } else if (loc.pathname === `/internal/centers`) {
        return "Centers";
    } else if (loc.pathname === `/internal/api/keys`) {
        return "API Keys";
    } else if (loc.pathname === `/internal/app/defaults`) {
        return "App Defaults";
    } else if (loc.pathname === `/internal/course-categories`) {
        return "Course Categories"
    } else if (loc.pathname === `/internal/course-types`) {
        return "Course Types"
    } else if (loc.pathname === `/internal/courses`) {
        return "Courses"
    } else if (loc.pathname === `/internal/course/add`) {
        return "Add Course"
    } else if (loc.pathname === `/internal/course/edit/details`) {
        return "Course Details"
    } else if (loc.pathname === `/internal/course/edit/enrollment/details`) {
        return "Course Enrollment Details"
    } else if (loc.pathname === `/internal/course/edit/certificate/template`) {
        return "Course Certificate Template"
    } else if (loc.pathname === `/internal/categories`) {
        return "Categories"
    } else if (loc.pathname === `/internal/enrollments`) {
        return "Enrollments"
    } else if (loc.pathname === `/internal/posts`) {
        return "Posts"
    } else if (loc.pathname === `/internal/post/add`) {
        return "Add Post"
    } else if (loc.pathname === `/internal/post/edit/details`) {
        return "Post Details"
    } else if (loc.pathname === `/internal/events`) {
        return "Events"
    } else if (loc.pathname === `/internal/event/add`) {
        return "Add Event"
    } else if (loc.pathname === `/internal/event/edit/details`) {
        return "Event Details"
    } else if (loc.pathname === `/internal/galleries`) {
        return "Galleries"
    } else if (loc.pathname === `/internal/public-galleries`) {
        return "Public Galleries"
    } else if (loc.pathname === `/internal/videos`) {
        return "Videos"
    } else if (loc.pathname === `/internal/journals`) {
        return "Journals"
    } else if (loc.pathname === `/internal/policies`) {
        return "Policies"
    } else if (loc.pathname === `/internal/presentations`) {
        return "Presentations"
    } else if (loc.pathname === `/internal/projects`) {
        return "Projects"
    } else if (loc.pathname === `/internal/project/add`) {
        return "Add Project"
    } else if (loc.pathname === `/internal/project/edit/details`) {
        return "Project Details"
    } else if (loc.pathname === `/internal/reports`) {
        return "Reports"
    } else if (loc.pathname === `/internal/research`) {
        return "Research"
    } else if (loc.pathname === `/internal/teams`) {
        return "Teams"
    } else if (loc.pathname === `/internal/transactions`) {
        return "Transactions";
    } else if (loc.pathname === `/internal/settings`) {
        return "Settings";
    } else {
        return "Page not found";
    }
}