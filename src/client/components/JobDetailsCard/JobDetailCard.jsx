import React from "react";
import DetailStyles from "./JobDetail.module.css";
import { timeAgo } from "../../libs/timeAgo";
import { Link } from "react-router-dom";
function JobDetailCard({ data }) {
  // console.log(timeAgo(data.createdAt));
  return (
    <div className={DetailStyles.container}>
      <div className={DetailStyles.header}>
        <span>{timeAgo(data.createdAt)} &middot;</span>
        <span>{data.jobType}</span>
        <img src={data.logoUrl} />
        <span>{data.companyName}</span>
      </div>
      <div className={DetailStyles.possition}>
        <h1>{data.jobPosition}</h1>
        {data?.mutable ? (
          <Link
            to={`/addjob?jobId=${data._id}`}
            state={{ data }}
            className={DetailStyles.edit}>
            Edit job
          </Link>
        ) : null}
      </div>
      <div className={DetailStyles.JobInfo}>
        <p>
          {data.jobCity} | {data.country}
        </p>
        <div className={DetailStyles.jobGrid}>
          <div className={DetailStyles.money}>
            <span className='material-symbols-outlined'>payments</span> Stipend
          </div>
          <div className={DetailStyles.time}>
            <span className='material-symbols-outlined'>calendar_today</span>
            Duration
          </div>
          <div className={DetailStyles.moneyAmmount}>
            Rs {data.monthlySalary}/month
          </div>
          <div className={DetailStyles.durationVal}>6 months</div>
        </div>
      </div>
      <div className={DetailStyles.TextContainer}>
        <div>
          <h3>About company</h3>
          <p>{data.aboutCompany}</p>
          <h3>About the job/internship</h3>
          <p>{data.jobDescription}</p>
          <h3>Skill(s) required</h3>
          <div className={DetailStyles.chipsContainer}>
            {data.skills?.map((item, index) => {
              return (
                <p className={DetailStyles.skillChip} key={index}>
                  {item}
                </p>
              );
            })}
          </div>
          <h3>Additional Information</h3>
          <p>{data.information}</p>
        </div>
      </div>
    </div>
  );
}

export default JobDetailCard;

