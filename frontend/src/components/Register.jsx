// Register.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();
  const location = useLocation();
  const [user,setUser] = useState(null);

  useEffect(()=>{

    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    const token = tokenFromURL || localStorage.getItem("auth_token");

    if(token){

      try{

        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(window.atob(base64Payload));

        localStorage.setItem("auth_token",token);

        if(payload.id) localStorage.setItem("userId",payload.id);
        if(payload.mbtiType)
          localStorage.setItem("userType",payload.mbtiType);

        setUser(payload);

        const pending = localStorage.getItem("pendingResult");

        if(pending){

          fetch("http://localhost:5000/api/user/mbti",{
            method:"PUT",
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({ mbtiType:pending })
          });

          navigate(`/result?type=${pending}`,{ replace:true });

          localStorage.removeItem("pendingResult");

        }else if(tokenFromURL){

          window.history.replaceState({},document.title,"/register");

        }

      }catch(err){

        console.log("Token decode error",err);

      }finally{

        localStorage.removeItem("google_login_started");

      }

    }else{
      setUser(null);
    }

  },[location,navigate]);

  const handleGoogleLogin = () => {
  window.open("http://localhost:5000/auth/google", "_self");
};

  const getUserPhoto = ()=>{

    if(!user) return "/images/default.png";

    let photo = user.photo || "";

    if(photo.startsWith("http:")) photo = photo.replace("http:","https:");

    return photo || "/images/default.png";
  };

  const userPhoto = getUserPhoto();

  return (

    <div className="register-page">

      <div className="register-card">

        {/* როცა USER არაა */}
        {!user && (
          <>
            <h2 className="register-title">ავტორიზაცია</h2>

            <p className="register-description">
              გაიარე ავტორიზაცია Google ანგარიშით და შეინახე შენი MBTI შედეგები
            </p>

            <button className="google-signin" onClick={handleGoogleLogin}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
              />
              Continue with Google
            </button>
          </>
        )}

        {/* როცა USER უკვე შესულია */}
        {user && (
          <div className="register-user-preview">

            <img
              src={userPhoto}
              alt={user.email}
              className="register-user-photo"
              referrerPolicy="no-referrer"
              onError={(e)=>e.target.src="/images/default.png"}
            />

            <p className="gereating">მოგესალმებით, {user.name}</p>

            <Link
              to="/profile"
              className="google-signin"
              style={{marginTop:"20px"}}
            >
              პროფილის ნახვა
            </Link>

          </div>
        )}

      </div>

    </div>

  );
}

export default Register;