import React, { useState, useReducer, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle,
  FaCode
} from "react-icons/fa";
import { fetchPopularRepos } from "../utils/api";
import Card from "./Card";
import Loading from "./Loading";

function LanguagesNav({ selected, onUpdatelanguage }) {
  const languages = ["All", "Javascript", "Ruby", "Java", "Css", "Python"];

  return (
    <ul className="flex-container">
      {languages.map(language => (
        <li
          key={language}
          className={`${selected === language ? "selected" : ""}`}
        >
          <button
            className="btn-clear nav-link"
            onClick={() => onUpdatelanguage(language)}
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  );
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdatelanguage: PropTypes.func.isRequired
};

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues
        } = repo;
        const { login, avatar_url } = owner;

        return (
          <li key={html_url} className="card bg-light">
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <FaUser color="rgb(255, 191, 116)" size={22} />
                  <a href={`http://github.com/${login}`}>{login}</a>
                </li>
                <li>
                  <FaStar color="rgb(255, 215, 0)" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="rgb(129, 195, 245)" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
                  {open_issues.toLocaleString()} open
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired
};

const popularReducer = (state, action) => {
  switch (action.type) {
    case "success": {
      return {
        ...state,
        [action.selectedLanguage]: action.repos,
        error: null
      };
    }

    case "error": {
      return {
        ...state,
        error: action.error.message
      };
    }

    default: {
      throw new Error(`That action type is not supported.`);
    }
  }
};

const Popular = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [state, dispatch] = useReducer(popularReducer, { error: null });

  const fetchedLanguages = useRef([]);

  useEffect(() => {
    if (!fetchedLanguages.current.includes(selectedLanguage)) {
      fetchedLanguages.current.push(selectedLanguage);

      fetchPopularRepos(selectedLanguage)
        .then(repos => dispatch({ type: "success", selectedLanguage, repos }))
        .catch(error => dispatch({ type: "error", error }));
    }
  }, [fetchedLanguages, selectedLanguage]);

  const { error } = state;

  const isLoading = () => !state[selectedLanguage] && error === null;

  return (
    <React.Fragment>
      <LanguagesNav
        selected={selectedLanguage}
        onUpdatelanguage={language => setSelectedLanguage(language)}
      />
      {isLoading() && <Loading text="Loading Repos" />}
      {error && <div className="center-text error">{error}</div>}
      {state[selectedLanguage] && <ReposGrid repos={state[selectedLanguage]} />}
    </React.Fragment>
  );
};

export default Popular;
