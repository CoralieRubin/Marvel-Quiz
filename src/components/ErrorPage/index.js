import React from "react";
import batman from "../../images/batman.png";

const centerH2 = {
  textAlign: "center",
  marginTop: "50px",
};

const centerimg = {
  display: "block",
  marginTop: "40px auto",
  height: "20vh",
  width: "40vh",
  marginLeft: "37%",
};
const ErrorPage = () => {
  return (
    <div className="quiz-bg">
      <div className="container">
        <h2 style={centerH2}>Oups, cette page n'existe pas!!</h2>
        <img style={centerimg} src={batman} alt="" />
      </div>
    </div>
  );
};

export default ErrorPage;
