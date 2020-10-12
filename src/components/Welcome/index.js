import React, { useState, Fragment, useContext, useEffect } from "react";
import { FirebaseContext } from "../Firebase";
import Logout from "../Logout/index";
import Quiz from "../Quiz";
import Loader from "../Loader";

const Welcome = (props) => {
  const firebase = useContext(FirebaseContext);

  const [userSession, setuserSession] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let listener = firebase.auth.onAuthStateChanged((user) => {
      user ? setuserSession(user) : props.history.push("/");
    });

    if (!!userSession) {
      firebase
        .user(userSession.uid)
        .get()
        .then((doc) => {
          if (doc && doc.exists) {
            const myData = doc.data();
            setUserData(myData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return () => {
      listener();
    };
  }, [userSession]);
  return userSession === null ? (
    <Fragment>
      <Loader
        loadingMsg={"Loading ..."}
        styling={{ textAlign: "center", color: "#FFFFFF" }}
      />
    </Fragment>
  ) : (
    <div className="quiz-bg">
      <div className="container">
        <Logout />
        <Quiz userData={userData} />
      </div>
    </div>
  );
};

export default Welcome;
