import * as React from "react";
import { Home, TagIcon, ChartAreaIcon } from "lucide-react";
import logo from '../assets/logo.svg'
import { NavProjects } from "@/components/nav-projects";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarRail, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from "@/context/context";
import { useSidebar } from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

const employeeNav = [
    {
        name: "Home",
        url: "/employee",
        icon: Home,
    },
    {
        name: "New Request",
        url: "/employee/requests",
        icon: TagIcon,
    },
];

const supervisorNav = [
    {
        name: "Home",
        url: "/supervisor",
        icon: Home,
    },
    {
        name: "Requests",
        url: "/supervisor/requests",
        icon: ChartAreaIcon
    }
];


export function AppSidebar({ ...props }) {
    const { user } = useAuth();
    const { state } = useSidebar();
    const [navLinks, setNavLinks] = React.useState([]);

    React.useEffect(() => {
        if (user) {
            if (user.role === 'EMPLOYEE') {
                setNavLinks(employeeNav);
            } else if (user.role === 'SUPERVISOR') {
                setNavLinks(supervisorNav);
            } else {
                setNavLinks([]);
            }
        }
    }, [user]);


    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader className="flex items-start justify-between flex-row align-middle">
                {state !== 'collapsed' && <img src={logo} className="max-w-36" />}
                <SidebarTrigger className="hidden md:inline-flex" />
            </SidebarHeader>
            <SidebarContent>
                <NavProjects projects={navLinks} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
