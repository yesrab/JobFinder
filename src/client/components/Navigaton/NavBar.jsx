import React, { useContext } from "react";
import NavBarStyle from "./NavBar.module.css";
// import { Link } from "react-router-dom";
import Navigator from "./Navigator";
import LoginContext from "../../context/loginContext";
import ProfileNavigator from "./ProfileNavigator";
import { Link } from "react-router-dom";
function NavBar() {
  const { loginState, dispatch } = useContext(LoginContext);

  return (
    <header className={NavBarStyle.NavHeadder}>
      <Link to='/' className={NavBarStyle.Logo} aria-label='Homepage'>
        Jobfinder
      </Link>
      <nav
        className={`${NavBarStyle.navigationContainer} ${
          loginState.login ? NavBarStyle.exp : ""
        }`}>
        {loginState.login ? (
          <ProfileNavigator dispatch={dispatch} />
        ) : (
          <Navigator />
        )}
      </nav>
    </header>
  );
}

export default NavBar;
