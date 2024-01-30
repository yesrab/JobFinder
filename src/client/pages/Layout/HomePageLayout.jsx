import React from "react";
import { Outlet } from "react-router-dom";
import HomePage from "../home/HomePage";
import NavBar from "../../components/Navigaton/NavBar";
function HomePageLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default HomePageLayout;
