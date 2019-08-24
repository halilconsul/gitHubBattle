import React from "react";
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

export default class Popular extends React.Component {
  state = {
    selectedLanguage: "All",
    repos: {},
    error: null
  };

  componentDidMount() {
    this.updateSelectedLanguage(this.state.selectedLanguage);
  }

  updateSelectedLanguage = selectedLanguage => {
    this.setState({
      selectedLanguage,
      error: null
    });

    if (!this.state.repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then(data => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data
            }
          }));
        })
        .catch(err => {
          this.setState({
            error: "Error fetchinf the repositories"
          });
        });
    }
  };

  isLoading = () => {
    const { repos, error, selectedLanguage } = this.state;
    return !repos[selectedLanguage] && error === null;
  };

  render() {
    const { selectedLanguage } = this.state;
    return (
      <React.Fragment>
        <LanguagesNav
          selected={this.state.selectedLanguage}
          onUpdatelanguage={this.updateSelectedLanguage}
        />
        {this.isLoading() && <Loading />}
        {this.state.error && (
          <div className="center-text error">{this.state.error}</div>
        )}
        {this.state.repos[selectedLanguage] && (
          <ReposGrid repos={this.state.repos[selectedLanguage]} />
        )}
      </React.Fragment>
    );
  }
}
