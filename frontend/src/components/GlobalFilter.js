import React from "react";
import FilterCSS from "./GlobalFilter.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export const GlobalFilter = ({ filter, setFilter, placeholder }) => {
  return (
    <div className={FilterCSS.container}>
      <label className={FilterCSS.filterlabel} htmlFor="filter">
        Filter by{" "}
      </label>
      <FontAwesomeIcon
        className={FilterCSS.FontAwesomeIcon}
        icon={faMagnifyingGlass}
      />
      <input
        type="text"
        id="filter"
        placeholder={placeholder}
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
      ></input>
    </div>
  );
};
