import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { Routes } from "../node_modules/react-router-dom/index";
import "./css/menu.css";
import { Level } from "./level";
import { Rank } from "./rank";

function Menu(props: {}) {
    return (
        <div className="menu">
            <div className="menu-entry menu-logo">NextPex</div>
            <div className="menu-entry menu-link">
                <Link to="/level">Level</Link>
            </div>
            <div className="menu-entry menu-link">
                <Link to="/rank">Rank</Link>
            </div>
            <div className="menu-entry menu-link">
                <Link to="/check">Check</Link>
            </div>
            <div className="menu-entry">Tinaxcraft</div>
        </div>
    );
}

export default function App(props: {}) {
    return (
        <>
            <Menu />
            <Routes>
                <Route path="/level" element={<Level />}></Route>
                <Route path="/rank" element={<Rank />}></Route>
            </Routes>
        </>
    );
}
