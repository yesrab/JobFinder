import React, { useEffect, Suspense } from "react";
import detailCss from "./JobDetail.module.css";
import JobDetailCard from "../../components/JobDetailsCard/JobDetailCard";
import {
  redirect,
  useLoaderData,
  ScrollRestoration,
  defer,
  Await,
} from "react-router-dom";
import { Watch } from "react-loader-spinner";
export const loader = async ({ loginState, params }) => {
  const Jobid = params.job;
  if (!Jobid) {
    redirect("/");
  }
  const FetchUrl = new URL(`/api/v1/job/${Jobid}`, window.location.origin);

  const { id } = loginState;
  if (id) {
    FetchUrl.searchParams.set("reqId", id);
  } else {
    FetchUrl.searchParams.delete("reqId");
  }

  const job = await fetch(FetchUrl.toString());
  const jobData = job.json();
  return defer({ data: jobData });
  // return null;
};
function JobDetail() {
  const { data } = useLoaderData();
  // console.log(data);
  useEffect(() => {
    document.body.style.backgroundColor = "#FFEFEF";
    window.scroll({
      top: 0,
      left: 0,
    });
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <Suspense
      fallback={
        <div className={detailCss.loader}>
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
      <Await resolve={data}>
        {(data) => {
          return (
            <div className={detailCss.container}>
              <div className={detailCss.heading}>
                <h2>
                  {data.jobPosition} {data.jobLocation} job/internship at{" "}
                  {data.companyName}
                </h2>
              </div>
              <div className={detailCss.detailsBlock}>
                <JobDetailCard data={data} />
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

export default JobDetail;
