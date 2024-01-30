import React from "react";
import cardStyles from "./JobCard.module.css";
import india from "../../assets/india.svg";
import { Link } from "react-router-dom";

function JobCard({ data }) {
  // console.log(data);
  return (
    <div className={cardStyles.container}>
      <img src={data.logoUrl} />
      <div className={cardStyles.infoContainer}>
        <p className={cardStyles.possition}>{data.jobPosition}</p>
        <div className={cardStyles.infoBlock}>
          <span>
            <span className="material-symbols-outlined">group</span>
            <p>{data.companySize}</p>
          </span>
          <span>
            <span className="material-symbols-outlined">currency_rupee</span>
            <p>{data.monthlySalary}</p>
          </span>
          <span>
            <img src={data.flagurl} />
            <p>{data.jobCity}</p>
          </span>
        </div>
        <div className={`${cardStyles.infoBlock} ${cardStyles.tags} `}>
          <p>{data.jobType}</p>
          <p>{data.jobLocation}</p>
        </div>
      </div>
      <div className={`${cardStyles.infoContainer} ${cardStyles.skillBlock} `}>
        <div className={cardStyles.skillList}>
          {data?.skills?.map((skill, index) => {
            return <span key={index}>{skill}</span>;
          })}
        </div>
        <div className={cardStyles.optionButtons}>
          {data.mutable ? (
            <Link
              to={`/addjob?jobId=${data._id}`}
              state={{ data }}
              className={`${cardStyles.details} ${cardStyles.editBtn} `}
            >
              Edit Job
            </Link>
          ) : null}
          <Link
            preventScrollReset={true}
            to={data._id}
            className={cardStyles.details}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
