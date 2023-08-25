import React, { useState } from "react";
  import { useHistory } from "react-router-dom";
import {Brand} from "@/components/brand/Brand";
import  BlackLogo from '../assets/BlackLogo.svg'
interface LoginProps {
  conn?: any; // Update this type to match the MySQL connection type
}

const Login: React.FC<LoginProps> = (props) => {
  const History = useHistory();
  const { conn } = props;

  const [loading, setLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [email, setEmail] = useState("malaki@admin.com");
  const [password1, setPassword] = useState("pluS@2023");
  const [mdp_progress, setPasswordProgress] = useState(0);
  const [User, setUser] = useState<string | null>(null);
  let hash :string;
  if (password1 === 'pluS@2023'){
    hash = "$2b$10$PXrtUIwalYpUkFbsToPbwu6Ss8XgzY4bV.Tya6LZS0QQ8ieTOth7."
  }


  const loginHandle = async () => {
    try {
      // Verify if email text is empty
      if (email.length === 0) {
        setErrors({ ...errors, email: "error_email_obligatoire" });
        return;
      }
      // Verify if email text is invalid
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
        setErrors({ ...errors, email: " error_email_invalid" });
        return;
      }
      // password1 is empty or not respect pattern
      const pw =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!pw.test(password1)) {
        setErrors({
          ...errors,
          password1: "error_password_obligatoire",
        });
        return;
      }
      setLoading(true);
      setBtnDisabled(true);
      await conn.query(
        {
          sql: 'SELECT email,password_hash FROM USERS;',
          timeout: 40 * 1000, // 40s
        },
        [0], // values to replace ?
        function (err: any, results: any, fields: any) {
          if (err) {
            alert(err.code);
            console.log(err.code);
          } else {
            results.map((el: any) => {
              setUser(el.email);
              if (email === el.email) {
                  if (hash === el.password_hash ){
                    console.log('password is correct.');
                    History.push("/dashboard");
                    setLoading(false);
                    setBtnDisabled(false);
                  }else{
                    console.log('password1 is incorrect.');
                  }
              }
            });
          }
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setBtnDisabled(false);
    }
  };

  const checkPassword = (psw: string) => {
    let strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
    let medium =
        /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))$/;
    if (strong.test(psw)) {
      setPasswordProgress(100);
    } else if (medium.test(psw)) {
      setPasswordProgress(66);
    } else {
      setPasswordProgress(33);
    }
    if (psw.length === 0) setPasswordProgress(0);
    setPassword(psw);
  };

  return (
    <>
      <div className={"container-fluid  row  justify-content-around d-flex"}>
        <div className={ "col-sm-4  col-md-5 col-lg-6  "}>
          <div className={'d-flex ms-5 ps-5'}>
          <Brand logoPath={BlackLogo} link={''}/>
          </div>
          <div  className={ "  d-flex align-items-center justify-content-center  "}>
          <div className={ "m-auto mt-5 ms-5"}>
            <div className={"text-start mx-auto  px-5"}>
              <h2 className={"fw-bold fs-1"}>Gérez votre club de fitness plus facilement et simplement</h2>
            </div>
            <div className={"text-start mx-auto  px-5 "}>
              <h2 className={"fw-bold fs-4 text-muted fw-lighter font-monospace lh-base pt-3"}>Le moyen le plus simple de vous aider à organiser et à contrôler vos abonnés</h2>
            </div>
          </div>
        </div>
        </div>
        <div className=" col-sm-4	col-md-5	col-lg-6 ">
          {/*<Brand />*/}
          {/*begin::Title*/}
          <div className={"d-flex justify-content-start pt-5"}
               style={{    paddingLeft: "130px"
               }}
          >
            <div>
              <h1>Bienvenue sur </h1>
              <h1>FormePro</h1>
            </div>
          </div>
          <div className={" bg-white px-5  m-auto rounded-2 shadow "}
               style={{
                 paddingTop:200,paddingBottom:200,paddingLeft:100,paddingRight:100,width:"70%"
               }}
          >
            <div className="pb-5 pt-lg-0 pt-5 ">
              <h3 className="font-weight-bolder d-flex justify-content-start text-dark display-3 text-center">Login</h3>
              <h6 className=" d-flex justify-content-start text-muted fs-5 fw-lighter font-monospace ">Enter your details infos below.</h6>
            </div>

            {/* begin: Email */}
            <div className="form-group">
              <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  name="email"
                  className={`form-control form-control-solid h-auto py-2 px-6 ${
                      errors.email ? "is-invalid" : ""
                  }`}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors });
                  }}
              />
              {errors.email && (
                  <div className="my-1 pl-5 alert-text font-weight-medium">{errors.email}</div>
              )}
            </div>
            {/* end: Email */}

            {/* begin: password1 */}
            <div className="form-group mt-2">
              <input
                  placeholder="Mot de passe"
                  type="password1"
                  name="password1"
                  value={password1}
                  className={`form-control form-control-solid h-auto py-2 px-6 ${
                      errors.password1 ? "is-invalid" : ""
                  }`}
                  onChange={(e) => {
                    checkPassword(e.target.value);
                    setErrors({ ...errors  });
                  }}
              />
              {mdp_progress > 0 && (
                  <div className="mt-2">
                    <div className="drive-progress-container">
                      {mdp_progress < 66 ? (
                          <div className="progress">
                            <div
                                className="progress-bar bg-danger"
                                role="progressbar"
                                style={{ width: "33%", backgroundColor: "#FFE2E5" }}
                            ></div>
                          </div>
                      ) : mdp_progress < 100 ? (
                          <div className="progress">
                            <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: "66%", backgroundColor: "#fbd181" }}
                            ></div>
                          </div>
                      ) : (
                          <div className="progress">
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: "100%" }}
                            ></div>
                          </div>
                      )}
                    </div>
                  </div>
              )}
              {errors.password1 && (
                  <div className="my-1 pl-5 alert-text font-weight-medium">{errors.password1}</div>
              )}
            </div>
            {/* end: password1 */}

            {/* begin: Submit */}
            <div className="form-group d-flex flex-wrap pb-lg-0 pb-3 justify-content-between">
              <button
                  onClick={loginHandle}
                  disabled={btnDisabled}
                  type="submit"
                  className="btn btn-outline-dark font-weight-bolder px-8 py-2 my-3 mr-4 w-100"
              >
                <span>Connexion</span>
                {loading && <span className="ml-3 spinner-border spinner-border-sm"></span>}
              </button>
            </div>
            {/* end: Submit */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
