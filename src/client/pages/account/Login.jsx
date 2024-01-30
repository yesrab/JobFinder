import React, { useContext, useEffect } from "react";
import LoginStyle from "./Login.module.css";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  redirectDocument,
  redirect,
  Navigate,
  useSubmit,
} from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup.string().required("Please enter your registered email").email(),
  password: yup.string().required("Please enter your password"),
});

export const action = async ({ dispatch, request }) => {
  const action = "/api/v1/user/login";
  const FormData = await request.formData();
  const formObj = {};
  for (const val of FormData.entries()) {
    formObj[val[0]] = val[1];
  }
  // console.log(formObj);
  const newRequest = new Request(action, {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: { "Content-Type": "application/json" },
  });

  const data = await fetch(newRequest);
  const responce = await data.json();
  // console.log(responce);
  if (responce?.status === "success") {
    toast.success("Logged in");
    dispatch({
      type: "LOGIN",
      payload: { token: responce.token, id: responce.id },
    });
    console.log("logged in and now navigating");
    return redirectDocument("/", { replace: true });
  }
  if (responce?.status === "Error") {
    toast.error("Error Incorrect Credentials");
    console.log("logged out user");
    dispatch({ type: "LOGOUT" });
  }
  return responce;
};

function Login() {
  let submit = useSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  function handleSubmitFunc(data) {
    console.log("from test:", data);
    submit(data, { method: "post" });
  }
  return (
    <div className={LoginStyle.Container}>
      <div className={LoginStyle.formContaier}>
        <div className={LoginStyle.headdings}>
          <h1>Already have an account?</h1>
          <p>Your personal job finder is here</p>
        </div>
        <Form
          method='post'
          onSubmit={handleSubmit(handleSubmitFunc)}
          className={LoginStyle.LoginForm}>
          <input
            name='email'
            placeholder='Email'
            type='email'
            {...register("email")}
          />
          {errors.email && (
            <p className={LoginStyle.errors}>{errors.email?.message}</p>
          )}
          <br />
          <input
            name='password'
            placeholder='Password'
            {...register("password")}
          />
          {errors.password && (
            <p className={LoginStyle.errors}>{errors.password?.message}</p>
          )}
          <br />
          <button>Sign in</button>
        </Form>
        <p>Don’t have an account?</p>
        <Link to='/register'>Sign Up</Link>
      </div>
      <div className={LoginStyle.galary}>
        <h1>Your Personal Job Finder</h1>
      </div>
    </div>
  );
}

export default Login;
