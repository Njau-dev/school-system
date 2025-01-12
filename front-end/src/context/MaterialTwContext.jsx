import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// Create the context
const MaterialTailwindContext = createContext(null);
MaterialTailwindContext.displayName = "MaterialTailwindContext";

// Context provider
export function MaterialTailwindProvider({ children }) {
    const [state, setState] = useState({
        openSidenav: false,
        sidenavColor: "dark",
        sidenavType: "white",
        transparentNavbar: true,
        fixedNavbar: false,
        openConfigurator: true,
    });

    // Handlers to update state
    const setOpenSidenav = (value) =>
        setState((prev) => ({ ...prev, openSidenav: value }));

    const setSidenavColor = (value) =>
        setState((prev) => ({ ...prev, sidenavColor: value }));

    const setSidenavType = (value) =>
        setState((prev) => ({ ...prev, sidenavType: value }));

    const setTransparentNavbar = (value) =>
        setState((prev) => ({ ...prev, transparentNavbar: value }));

    const setFixedNavbar = (value) =>
        setState((prev) => ({ ...prev, fixedNavbar: value }));

    const setOpenConfigurator = (value) =>
        setState((prev) => ({ ...prev, openConfigurator: value }));

    // Error handling for accessing the context outside the provider
    const value = {
        state,
        setOpenSidenav,
        setSidenavColor,
        setSidenavType,
        setTransparentNavbar,
        setFixedNavbar,
        setOpenConfigurator,
    };

    return (
        <MaterialTailwindContext.Provider value={value}>
            {children}
        </MaterialTailwindContext.Provider>
    );
}

// Hook to use the context
export function useMaterialTailwind() {
    const context = useContext(MaterialTailwindContext);

    if (!context) {
        throw new Error(
            "useMaterialTailwind must be used within a MaterialTailwindProvider."
        );
    }

    return context;
}

// PropTypes for the provider
MaterialTailwindProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
