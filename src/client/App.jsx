import "./App.css";
import { useContext, lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  Await,
} from "react-router-dom";
import HomePage, { loader as JobCardLoader } from "./pages/home/HomePage";
import HomePageLayout from "./pages/Layout/HomePageLayout";
import { action as LoginAction } from "./pages/account/Login";
const Login = lazy(() => import("./pages/account/Login"));
import Error from "./pages/error/Error";
import Register, { action as RegisterAction } from "./pages/account/Register";
import AddJobDetails, {
  action as AddJobAction,
} from "./pages/add/AddJobDetails";
import { loader as jobLoader } from "./pages/details/JobDetail";
const JobDetail = lazy(() => import("./pages/details/JobDetail"));
import LoginContext from "./context/loginContext";
import { Watch } from "react-loader-spinner";
import { Toaster } from "react-hot-toast";
function App() {
  const { loginState, dispatch } = useContext(LoginContext);

  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' errorElement={<Error />}>
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
            path='/:job'
            element={
              <Suspense
                fallback={
                  <div className='centerWatch'>
                    <Watch
                      visible={true}
                      height='80'
                      width='80'
                      radius='48'
                      color='#ED5353'
                      ariaLabel='watch-loading'
                      wrapperStyle={{}}
                      wrapperClass=''
                    />
                  </div>
                }>
                <Await resolve={JobDetail}>
                  <JobDetail />
                </Await>
              </Suspense>
            }
          />
        </Route>
        <Route
          path='login'
          action={({ request, params }) => {
            return LoginAction({ dispatch, request, params });
          }}
          element={
            <Suspense>
              <Await resolve={Login}>
                <Login />
              </Await>
            </Suspense>
          }
        />

        <Route path='register' action={RegisterAction} element={<Register />} />

        <Route
          path='addjob'
          action={({ request, params }) =>
            AddJobAction({ loginState, dispatch, request, params })
          }
          element={
            loginState.token ? (
              <AddJobDetails />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
      </Route>
    )
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
            backgroundColor: "#ffefef",
          },
        }}
      />
      <RouterProvider router={Router} />
    </>
  );
}

export default App;

