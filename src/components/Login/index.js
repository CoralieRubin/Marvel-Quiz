import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

const Login = (props) => {
  const firebase = useContext(FirebaseContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btn, setBtn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (password.length > 5 && email !== "") {
      setBtn(true);
    } else if (btn) {
      setBtn(false);
    }
  }, [email, password, btn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .loginUser(email, password)
      .then((user) => {
        setEmail("");
        setPassword("");
        props.history.push("/welcome");
      })
      .catch((error) => {
        setError(error);
        setEmail("");
        setPassword("");
      });
  };
  return (
    <div className="signUpLoginBox">
      <div className="slContainer">
        <div className="formBoxLeftLogin"></div>
        <div className="formBoxRight"></div>
        <div className="formContent">
          <form onSubmit={handleSubmit}>
            {error !== "" && <span>{error.message}</span>}
            <h2>Connexion</h2>
            <div className="inputBox">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="inputBox">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                required
              />
              <label htmlFor="password">Mot de passe</label>
            </div>
            {btn ? (
              <button>Connection</button>
            ) : (
              <button disabled>Connection</button>
            )}
          </form>
          <div className="linkContainer">
            <Link className="simpleLink" to="/signup">
              Nouveau sur Marvel quiz ?? Inscrivez vous maintenant.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
