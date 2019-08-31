import React, { useReducer, useEffect } from "react";
import { battle } from "../utils/api";
import PropTypes from "prop-types";
import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaUserFriends,
  FaCode,
  FaUser,
  FaFriends
} from "react-icons/fa";
import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";
import queryString from "query-string";
import { Link } from "react-router-dom";

const ProfileList = ({ profile }) => (
  <ul className="card-list">
    <li>
      <FaUser color="rgb(239, 115, 115)" size={22} />
      {profile.name}
    </li>
    {profile.location && (
      <li>
        <Tooltip text="User location">
          <FaCompass color="rgb(144, 115, 255)" size={22} />
          {profile.location}
        </Tooltip>
      </li>
    )}
    {profile.company && (
      <li>
        <Tooltip text="User company">
          <FaBriefcase color="#795548" size={22} />
          {profile.company}
        </Tooltip>
      </li>
    )}
    <li>
      <FaUsers color="rgb(129, 195, 245)" size={22} />
      {profile.followers.toLocaleString()} followers
    </li>
    <li>
      <FaUserFriends color="rgb(64, 183, 95)" size={22} />
      {profile.following.toLocaleString()} following
    </li>
  </ul>
);

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired
};

const resultsReducer = (state, action) => {
  switch (action.type) {
    case "success": {
      return {
        ...state,
        winner: action.players[0],
        looser: action.players[1],
        error: null,
        loading: false
      };
    }

    case "error": {
      return {
        ...state,
        error: action.message,
        loading: false
      };
    }

    default: {
      throw new Error(`That action type is not defined.`);
    }
  }
};

const initialState = {
  winner: null,
  looser: null,
  error: null,
  loading: true
};

const Results = ({ location }) => {
  const [state, dispatch] = useReducer(resultsReducer, initialState);
  const { playerOne, playerTwo } = queryString.parse(location.search);

  useEffect(() => {
    battle([playerOne, playerTwo])
      .then(players => dispatch({ type: "success", players }))
      .catch(error => dispatch({ type: "error", message: error.message }));
  }, []);

  const { winner, looser, error, loading } = state;

  if (loading) {
    return <Loading text="Waiting" speed={400} />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <React.Fragment>
      <div className="grid space-around container-sm">
        <Card
          header={winner.score === looser.score ? "Tie" : "Winner"}
          subheader={`Score: ${winner.score.toLocaleString()}`}
          avatar={winner.profile.avatar_url}
          href={winner.profile.html_url}
          name={winner.profile.login}
        >
          <ProfileList profile={winner.profile} />
        </Card>

        <Card
          header={winner.score === looser.score ? "Tie" : "Looser"}
          subheader={`Score: ${looser.score.toLocaleString()}`}
          avatar={looser.profile.avatar_url}
          href={looser.profile.html_url}
          name={looser.profile.login}
        >
          <ProfileList profile={looser.profile} />
        </Card>
      </div>
      <Link to="/battle" className="btn dark-btn btn-space">
        Reset
      </Link>
    </React.Fragment>
  );
};

export default Results;
