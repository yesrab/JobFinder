import React from "react";
import { Link } from "react-router-dom";
import NavigatorStyles from "./Navigator.module.css";
function Navigator() {
  return (
    <>
      <Link
        className={`${NavigatorStyles.anchor}`}
        to='login'
        aria-label='Go-to-Login'>
        Login
      </Link>
      <Link
        className={`${NavigatorStyles.anchor} ${NavigatorStyles.reg}`}
        to='register'
        aria-label='Go-to-register'>
        Register
      </Link>
    </>
  );
}

export default Navigator;
