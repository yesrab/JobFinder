import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage, { loader as JobCardLoader } from "./pages/home/HomePage";
import HomePageLayout from "./pages/Layout/HomePageLayout";
import Login, { action as LoginAction } from "./pages/account/Login";
import Register, { action as RegisterAction } from "./pages/account/Register";
import AddJobDetails, {
  action as AddJobAction,
} from "./pages/add/AddJobDetails";
import JobDetail, { loader as jobLoader } from "./pages/details/JobDetail";
import LoginContext from "./context/loginContext";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
function App() {
  const { loginState, dispatch } = useContext(LoginContext);

  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<HomePageLayout />}>
          <Route
            loader={({ request, params }) => {
              return JobCardLoader({ loginState, request, params });
            }}
            index
            element={<HomePage />}
          />
          <Route
            loader={({ request, params }) => {
              return jobLoader({ loginState, request, params });
            }}
            path="/:job"
            element={<JobDetail />}
          />
        </Route>
        <Route
          path="login"
          action={({ request, params }) => {
            return LoginAction({ dispatch, request, params });
          }}
          element={<Login />}
        />
        <Route path="register" action={RegisterAction} element={<Register />} />

        <Route
          path="addjob"
          action={({ request, params }) =>
            AddJobAction({ loginState, dispatch, request, params })
          }
          element={
            loginState.token ? (
              <AddJobDetails />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Route>,
    ),
  );

  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
            fontFamily: "DM Sans",
          },
        }}
      />
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
