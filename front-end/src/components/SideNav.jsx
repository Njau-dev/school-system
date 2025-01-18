// Updated Sidenav Component
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { HomeIcon, UserCircleIcon, TableCellsIcon, DocumentTextIcon, IdentificationIcon } from "@heroicons/react/24/solid";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwind } from "../context/MaterialTwContext";
import { useAuth } from "../context/AuthContext";

export function Sidenav() {
    const { state, setOpenSidenav } = useMaterialTailwind();
    const { sidenavColor, sidenavType, openSidenav } = state
    const { role } = useAuth()

    const sidenavTypes = {
        dark: "bg-gradient-to-br from-gray-800 to-gray-900",
        white: "bg-white shadow-md",
        transparent: "bg-transparent backdrop-blur-lg",
    };

    return (
        <aside
            className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
                } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
        >
            <div className={`relative`}>
                <Link to="/dashboard" className="py-6 px-8 text-center">
                    <Typography
                        variant="h3"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                    >
                        School App
                    </Typography>

                    <Typography
                        variant="h6"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                        className="mt-3 capitalize flex justify-center items-center gap-3"
                    >
                        <IdentificationIcon className="h-7" /> {role}
                    </Typography>
                </Link>
                <IconButton
                    variant="text"
                    size="sm"
                    ripple={false}
                    className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none bg-red-500 xl:hidden"
                    onClick={() => setOpenSidenav(false)}
                >
                    <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
                </IconButton>
            </div>
            <div className="m-4">
                <ul className="mb-4 flex flex-col gap-1">
                    <li>
                        <NavLink to="/dashboard">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <HomeIcon className="w-5 h-5 text-inherit" />
                                    <Typography color="inherit" className="font-medium capitalize">
                                        Dashboard
                                    </Typography>
                                </Button>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <UserCircleIcon className="w-5 h-5 text-inherit" />
                                    <Typography color="inherit" className="font-medium capitalize">
                                        Profile
                                    </Typography>
                                </Button>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/assignments">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <TableCellsIcon className="w-5 h-5 text-inherit" />
                                    <Typography color="inherit" className="font-medium capitalize">
                                        Assignments
                                    </Typography>
                                </Button>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/submissions">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <DocumentTextIcon className="w-5 h-5 text-inherit" />
                                    <Typography color="inherit" className="font-medium capitalize">
                                        Submissions
                                    </Typography>
                                </Button>
                            )}
                        </NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default Sidenav;
