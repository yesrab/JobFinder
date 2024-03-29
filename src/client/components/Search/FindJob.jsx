import React, { Suspense, useContext, useEffect, useState } from "react";
import jobStyles from "./FindJob.module.css";
import useDebounce from "../../hooks/useDebounce.js";
import { Await, Link, useSearchParams } from "react-router-dom";
import LoginContext from "../../context/loginContext";
function FindJob({ data }) {
  const { loginState } = useContext(LoginContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // const skills = [
  //   "FrontEnd",
  //   "CSS",
  //   "HTML",
  //   "JavaScript",
  //   "BackEnd",
  //   "WordPress",
  // ];
  // console.log(data);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const debouncedInputSearch = useDebounce(inputSearch, 300);
  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      setSelected((prev) => prev.filter((item) => item !== skill));
    } else {
      setSelected((prev) => [...prev, skill]);
    }
  };
  const searchObj = {};
  useEffect(() => {
    // console.log(searchParams);
    if (selected.length > 0) {
      searchObj.skill = selected.join(",");
    } else {
      delete searchObj.skill;
    }

    if (debouncedInputSearch.trim()) {
      searchObj.position = debouncedInputSearch;
    }
    setSearchParams(searchObj);
  }, [selected, debouncedInputSearch]);

  return (
    <div className={jobStyles.container}>
      <span className={jobStyles.head}>
        <div>
          <span className={`material-symbols-outlined  ${jobStyles.icon}`}>
            search
          </span>
          <input
            aria-label='Search-job-positions'
            value={inputSearch}
            onChange={(event) => {
              setInputSearch(event.target.value);
            }}
            type='text'
            placeholder='Type any job title'
          />
        </div>
      </span>
      <div className={jobStyles.dropDownContainer}>
        <div className={jobStyles.dropDown}>
          <button
            aria-label='Skills-filter-dropdown'
            onFocus={() => {
              setIsOpen(true);
            }}
            onBlur={() => {
              setIsOpen(false);
            }}>
            Skills
            <span className={`material-symbols-outlined`}>expand_more</span>
          </button>
          {isOpen ? (
            <div className={jobStyles.dropDownMenu}>
              <ul className={jobStyles.list}>
                <Suspense fallback={<li>Loading</li>}>
                  <Await resolve={data}>
                    {(skills) => {
                      return skills.allSkills.map((item, index) => {
                        return (
                          <li
                            key={index}
                            aria-label={`skills-filter-${item}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setIsOpen(true);
                              toggleSkill(item);
                            }}>
                            {item}
                          </li>
                        );
                      });
                    }}
                  </Await>
                </Suspense>
              </ul>
            </div>
          ) : null}
        </div>
        {selected.map((skill, index) => {
          return (
            <div className={jobStyles.chipContainer} key={index}>
              <span className={jobStyles.chips}>{skill}</span>
              <span
                aria-label={`Remove-skill-${skill}`}
                onClick={() => {
                  toggleSkill(skill);
                }}
                className={`material-symbols-outlined ${jobStyles.closeBtn}`}>
                close
              </span>
            </div>
          );
        })}
        <button
          aria-label='Clear-all-filters'
          onClick={() => {
            setSelected([]);
            setSearchParams({});
            setInputSearch("");
          }}
          className={jobStyles.clearButton}>
          Clear
        </button>
        {loginState.login ? (
          <Link
            to='addjob'
            aria-label='Add-new-job'
            className={jobStyles.addbtn}>
            + Add Job
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default FindJob;

