import React from "react";
import LoginStyle from "./Login.module.css";
import { Form, Link, redirect, useSubmit } from "react-router-dom";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Please enter your name"),
  email: yup.string().required("Please enter your email").email(),
  mobile: yup
    .number()
    .required("Please enter your number")
    .typeError("Please enter a valid number")
    .positive()
    .integer(),

  password: yup.string().required("Please create a password"),
});

export const action = async ({ params, request }) => {
  const action = "/api/v1/user/register";
  const FormData = await request.formData();
  const formObj = {};
  for (const val of FormData.entries()) {
    formObj[val[0]] = val[1];
  }
  formObj.mobile = +formObj.mobile;
  // console.log(formObj);
  const newRequest = new Request(action, {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: { "Content-Type": "application/json" },
  });

  const data = await fetch(newRequest);
  const res = await data.json();
  if (res?.status === "success") {
    toast.success("Account created!");
    toast("Now you can login");
    return redirect("/");
  }
  return res;
};

function Register() {
  let submit = useSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  function handleSubmitFunc(data) {
    // console.log("from test:", data);
    submit(data, { method: "post" });
  }
  return (
    <div className={LoginStyle.Container}>
      <div className={LoginStyle.formContaierRegister}>
        <div className={LoginStyle.headdings}>
          <h1>Create an account</h1>
          <p>Your personal job finder is here</p>
        </div>
        <Form
          method='post'
          onSubmit={handleSubmit(handleSubmitFunc)}
          className={LoginStyle.LoginForm}>
          <input
            name='name'
            placeholder='Name'
            type='text'
            {...register("name")}
          />
          {errors.name && (
            <p className={LoginStyle.errors}>{errors.name?.message}</p>
          )}
          <br />
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
            name='mobile'
            placeholder='Mobile'
            type='tel'
            {...register("mobile")}
          />
          {errors.mobile && (
            <p className={LoginStyle.errors}>{errors.mobile?.message}</p>
          )}
          <br />
          <input
            name='password'
            type='password'
            placeholder='Password'
            {...register("password")}
          />
          {errors.password && (
            <p className={LoginStyle.errors}>{errors.password?.message}</p>
          )}
          <br />
          <label>
            <input type='checkbox' name='TnC' required /> By creating an
            account, I agree to our terms of use and privacy policy
          </label>
          <br />
          <button>Create account</button>
        </Form>
        <p>Already have an account?</p>
        <Link to='/login'>Sign In</Link>
      </div>
      <div className={LoginStyle.galary}>
        <h1>Your Personal Job Finder</h1>
      </div>
    </div>
  );
}

export default Register;
