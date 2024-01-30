import React from "react";
// import { Link } from "react-router-dom";
import NavigatorStyles from "./Navigator.module.css";
import pfp from "../../assets/pfp.svg";
import toast from "react-hot-toast";
function ProfileNavigator({ dispatch }) {
  return (
    <>
      <button
        className={`${NavigatorStyles.logOutBtn}`}
        to='login'
        onClick={() => {
          toast.success("Successfully Logged out");
          dispatch({ type: "LOGOUT" });
        }}>
        Logout
      </button>
      <p className={`${NavigatorStyles.logOutBtn}`}>
        Hello! Recruiter
        <img className={NavigatorStyles.pfp} src={pfp} />
      </p>
    </>
  );
}

export default ProfileNavigator;
