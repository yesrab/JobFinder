import React, { useState, useEffect, useContext } from "react";
import LoginContext from "../../context/loginContext";
import addJobStyles from "./AddJob.module.css";
import {
  Form,
  Link,
  redirectDocument,
  redirect,
  useSubmit,
  useLocation,
} from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  companyName: yup.string().required("Please enter your company name"),
  logoUrl: yup.string().url("Please enter a valid URL for the logo"),
  jobPosition: yup.string().required("Please enter the job position"),
  monthlySalary: yup
    .number()
    .required("Please enter the salary")
    .typeError("Please enter a valid salary")
    .positive("Salary must be a positive number")
    .integer("Salary must be an integer"),

  jobType: yup.string().required("Please select a job type"),
  jobLocation: yup.string().required("Please select a work location"),
  jobCity: yup.string().required("Please enter the office location"),
  jobDescription: yup.string().required("Please provide a job description"),
  aboutCompany: yup.string().required("Tell us about your company"),
  skills: yup
    .string()
    .required("Enter the ideal skills, comma-separated")
    .matches(
      /^[a-zA-Z]+(?:,[a-zA-Z]+)*$/,
      "Invalid format. Use letters and commas only.",
    ),
  information: yup
    .string()
    .required("Add additional information about this job"),
  companySize: yup.string().required("Enter estimated company size"),
});

export const action = async ({ loginState, dispatch, request }) => {
  const action = "http://localhost:3000/api/v1/job/addjobs";
  const FormData = await request.formData();
  console.log(FormData);
  const formObj = {};
  for (const val of FormData.entries()) {
    formObj[val[0]] = val[1];
  }
  const { token, id } = loginState;
  formObj.createdBy = id;
  formObj.skills = formObj.skills.split(",");

  console.log(formObj);
  // console.log(token);

  console.log("intent is", request.method);
  if (request.method === "POST") {
    const newRequest = new Request(action, {
      method: "POST",
      body: JSON.stringify(formObj),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await fetch(newRequest);
    // console.log(data);
    if (data.status === 401) {
      console.log("unauthorised logging out");
      dispatch({ type: "LOGOUT" });
      return redirectDocument("/login");
    }
    const res = await data.json();
    function tost() {
      const mypromice = new Promise((resolver, reject) => {
        if (res?._id) {
          resolver(res._id);
        } else {
          reject("The _id does not exist in the response.");
        }
      });
      return mypromice;
    }
    toast.promise(tost(), {
      loading: "Saving...",
      success: <b>Job Added!</b>,
      error: <b>Could not Add Job please try again later</b>,
    });
    if (res?._id) {
      // toast.success("Job Added");
      return redirect("/");
    }
    return res;
  }

  if (request.method === "PUT") {
    const url = new URL(request.url);
    const id = url.searchParams.get("jobId");
    const puturl = `/api/v1/job/addjobs?jobId=${id}`;
    console.log(puturl);
    const newRequest = new Request(puturl, {
      method: "PUT",
      body: JSON.stringify(formObj),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await fetch(newRequest);
    // console.log(data);
    if (data.status === 401) {
      console.log("unauthorised logging out");
      dispatch({ type: "LOGOUT" });
      return redirectDocument("/login");
    }
    const res = await data.json();
    function tost() {
      const mypromice = new Promise((resolver, reject) => {
        if (res?._id) {
          resolver(res._id);
        } else {
          reject("The _id does not exist in the response.");
        }
      });
      return mypromice;
    }
    toast.promise(tost(), {
      loading: "Saving...",
      success: <b>Job Updated!</b>,
      error: <b>Could not Update Job please try again later</b>,
    });
    if (res?._id) {
      // toast.success("Job Added");
      return redirect("/");
    }
    return res;
  }
};

function AddJobDetails() {
  let submit = useSubmit();
  let { state } = useLocation();
  const { loginState } = useContext(LoginContext);
  const method = state?.data ? "put" : "post";

  const [jobData, setJobData] = useState(null);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      if (state?.data) {
        try {
          const url = `http://localhost:3000/api/v1/job/${state?.data._id}?reqId=${loginState.id}`;
          const response = await fetch(url, { signal });

          if (!response.ok) {
            throw new Error(`Error fetching data. Status: ${response.status}`);
          }

          const responseData = await response.json();
          setJobData(responseData);
        } catch (error) {
          console.error("Error:", error);
          // Handle the error, e.g., set an error state or display an error message
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      abortController.abort();
      // Additional cleanup logic (if needed)
    };
  }, [state?.data]);
  // console.log("data form use loac", state?.data);
  // console.log("method", method);
  // console.log("react state", jobData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  function handleSubmitFunc(data) {
    // console.log("from test:", data);
    submit(data, { method: method });
  }
  return (
    <div className={addJobStyles.Container}>
      <div className={addJobStyles.formContaierRegister}>
        <div className={addJobStyles.headdings}>
          <h1>Add job description</h1>
          <p>Your personal job finder is here</p>
        </div>
        <Form
          onSubmit={handleSubmit(handleSubmitFunc)}
          method={method}
          className={addJobStyles.LoginForm}
        >
          <span>
            <label htmlFor="companyName">Company Name</label>
            <input
              name="companyName"
              defaultValue={jobData?.companyName}
              id="companyName"
              placeholder="Enter your company name here"
              type="text"
              {...register("companyName")}
            />
          </span>
          {errors.companyName && (
            <p className={addJobStyles.errors}>{errors.companyName?.message}</p>
          )}
          <span>
            <label htmlFor="logoUrl">Add logo URL</label>
            <input
              defaultValue={
                jobData?.logoUrl ||
                "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              }
              type="url"
              name="logoUrl"
              id="logoUrl"
              placeholder="Enter the link"
              {...register("logoUrl")}
            />
          </span>
          {errors.logoUrl && (
            <p className={addJobStyles.errors}>{errors.logoUrl?.message}</p>
          )}
          <span>
            <label htmlFor="jobPosition">Job position</label>
            <input
              name="jobPosition"
              id="jobPosition"
              placeholder="Enter job position"
              defaultValue={jobData?.jobPosition}
              {...register("jobPosition")}
            />
          </span>
          {errors.jobPosition && (
            <p className={addJobStyles.errors}>{errors.jobPosition?.message}</p>
          )}
          <span>
            <label htmlFor="monthlySalary">Monthly salary</label>
            <input
              name="monthlySalary"
              id="monthlySalary"
              type="number"
              placeholder="Enter Amount in rupees"
              defaultValue={jobData?.monthlySalary}
              {...register("monthlySalary")}
            />
          </span>
          {errors.monthlySalary && (
            <p className={addJobStyles.errors}>
              {errors.monthlySalary?.message}
            </p>
          )}
          <span className={addJobStyles.tags}>
            <legend>Job Type</legend>
            <select
              className={addJobStyles.selection}
              name="jobType"
              id="jobType"
              defaultValue={jobData?.jobType || ""}
              {...register("jobType")}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
              <option value="Internship">Internship</option>
            </select>
          </span>
          {errors.jobType && (
            <p className={addJobStyles.errors}>{errors.jobType?.message}</p>
          )}
          <span className={addJobStyles.tags}>
            <legend>Remote/office</legend>
            <select
              className={addJobStyles.selection}
              name="jobLocation"
              id="jobLocation"
              defaultValue={jobData?.jobLocation || ""}
              {...register("jobLocation")}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Remote">Remote</option>
              <option value="Office">Office</option>
            </select>
          </span>
          {errors.jobLocation && (
            <p className={addJobStyles.errors}>{errors.jobLocation?.message}</p>
          )}
          <span>
            <label htmlFor="jobCity">Location</label>
            <input
              name="jobCity"
              id="jobCity"
              placeholder="Enter Location"
              defaultValue={jobData?.jobCity}
              {...register("jobCity")}
            />
          </span>
          {errors.jobCity && (
            <p className={addJobStyles.errors}>{errors.jobCity?.message}</p>
          )}
          <span>
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder="Type the job description"
              defaultValue={jobData?.jobDescription}
              {...register("jobDescription")}
            />
          </span>
          {errors.jobDescription && (
            <p className={addJobStyles.errors}>
              {errors.jobDescription?.message}
            </p>
          )}
          <span>
            <label htmlFor="aboutCompany">About Company</label>
            <textarea
              name="aboutCompany"
              id="aboutCompany"
              placeholder="Type about your company"
              defaultValue={jobData?.aboutCompany}
              {...register("aboutCompany")}
            />
          </span>
          {errors.aboutCompany && (
            <p className={addJobStyles.errors}>
              {errors.aboutCompany?.message}
            </p>
          )}
          <span>
            <label htmlFor="skills">Skills Required</label>
            <input
              name="skills"
              id="skills"
              placeholder="Enter the must have skills"
              defaultValue={jobData?.skills.join(",")}
              {...register("skills")}
            />
          </span>
          {errors.skills && (
            <p className={addJobStyles.errors}>{errors.skills?.message}</p>
          )}
          <span>
            <label htmlFor="information">Information</label>
            <input
              name="information"
              id="information"
              placeholder="Enter the additional information"
              defaultValue={jobData?.information}
              {...register("information")}
            />
          </span>
          {errors.information && (
            <p className={addJobStyles.errors}>{errors.information?.message}</p>
          )}
          <span>
            <label htmlFor="companySize">companySize</label>
            <input
              name="companySize"
              id="companySize"
              placeholder="Enter Company size"
              defaultValue={jobData?.companySize}
              {...register("companySize")}
            />
          </span>
          {errors.companySize && (
            <p className={addJobStyles.errors}>{errors.companySize?.message}</p>
          )}
          <span className={addJobStyles.boundary}>
            <Link to=".." className={addJobStyles.cancel}>
              Cancel
            </Link>
            <button type="submit" name="intent" value="add">
              {jobData?.mutable ? "Edit" : "+ Add Job"}
            </button>
          </span>
        </Form>
      </div>
      <div className={addJobStyles.galary}>
        <h1>Recruiter add job details here</h1>
      </div>
    </div>
  );
}

export default AddJobDetails;
