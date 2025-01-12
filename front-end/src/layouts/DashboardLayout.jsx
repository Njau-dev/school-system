import React from "react";
import { Outlet } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import Sidenav from "../components/SideNav";
import DashboardNavbar from "../components/DashNavbar";
import Configurator from "../components/Configurator";
import { useMaterialTailwind } from "../context/MaterialTwContext";

const DashboardLayout = () => {
    const { state, setOpenConfigurator } = useMaterialTailwind();
    const { sidenavType } = state;

    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav />
            <div className="p-4 xl:ml-80">
                <DashboardNavbar />
                <Configurator />

                {/* This is where the child routes will render */}
                <Outlet />


                <IconButton
                    size="lg"
                    color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
                    ripple={false}
                    onClick={() => setOpenConfigurator(true)}
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
            </div>
        </div>
    );
};

export default DashboardLayout;