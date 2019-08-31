import React, { useState, useEffect } from "react";
import propTypes from "prop-types";

const styles = {
  content: {
    fontSize: "35px",
    position: "absolute",
    left: "0",
    right: "0",
    marginTop: "20px",
    textAlign: "center"
  }
};

const Loading = ({ text = "Loading", speed = 300 }) => {
  const [content, setContent] = useState(text);

  useEffect(() => {
    const timerId = setInterval(() => {
      setContent(content => {
        return content === `${text}...` ? text : `${content}.`;
      });
    }, speed);

    return () => clearInterval(timerId);
  }, [text, speed]);

  return <p style={styles.content}>{content}</p>;
};

Loading.propTypes = {
  text: propTypes.string,
  speed: propTypes.number
};

export default Loading;
