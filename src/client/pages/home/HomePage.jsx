import React, { Suspense } from "react";
import HomeStyles from "./HomePage.module.css";
import FindJob from "../../components/Search/FindJob";
import JobCard from "../../components/JobCard/JobCard";
import { useLoaderData, defer, Await } from "react-router-dom";
import { Watch } from "react-loader-spinner";
export const loader = ({ loginState, request, params }) => {
  const url = new URL(request.url);
  const { id } = loginState;
  const skill = url.searchParams.get("skill");
  const position = url.searchParams.get("position");

  const FetchUrl = new URL("/api/v1/job/getjobs", window.location.origin);
  if (id) {
    FetchUrl.searchParams.set("reqId", id);
  } else {
    FetchUrl.searchParams.delete("reqId");
  }
  if (skill) {
    FetchUrl.searchParams.set("skills", skill);
  } else {
    FetchUrl.searchParams.delete("skills");
  }
  if (position) {
    FetchUrl.searchParams.set("position", position);
  } else {
    FetchUrl.searchParams.delete("position");
  }
  const jobs = fetch(FetchUrl.toString());
  // const skills = await fetch(SkillFetchUrl.toString());
  // const skillsData = await skills.json();
  return defer({
    jobs: jobs.then((res) => res.json()),
  });
};
function HomePage() {
  const responceData = useLoaderData();
  return (
    <div className={HomeStyles.Container}>
      <FindJob data={responceData.jobs} />
      <Suspense
        fallback={
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
        }>
        <Await resolve={responceData.jobs}>
          {(responce) => {
            return responce?.updatedJobs.map((item, key) => {
              return <JobCard key={key} data={item} />;
            });
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export default HomePage;

