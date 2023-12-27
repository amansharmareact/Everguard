import React, { useState, useContext, useEffect } from "react";

// import { Button } from '../ButtonElements'
import {
  InfoContainer,
  InfoWrapper,
  InfoRow,
  Column1,
  Column2,
  TextWrapper,
  ImgWrap,
  Img,
  LoginBox,
  LoginHeading,
  LoginPara,
  InputBox,
  LoginButtons,
  LoginButton,
  LabelHeading,
  LabelPara,
  SelectServiceBox,
  LanguageLogout,
  LanguageIcon,
  LogoutIcon,
  SearchIcon,
  LoginButtonLink,
  LoginBtnWrapper,
  LogoMenzil,
} from "./LoginElements";
import { BackIcon, HeadingButton } from "../Profile/ProfileElements";
import { Formik, Field, Form } from "formik";
import Input from "../Input";
import InputLogin from "../InputLogin";
// import { IconUser, IconEmail } from '../SvgElements'
import PassIcon from "../../images/password.png";
import NameIcon from "../../images/name.png";
import EmailIcon from "../../images/email.png";
import RestaurantIcon from "../../images/restaurant.png";
import languageIcon from "../../images/languageBlack.png";
import logoutIcon from "../../images/logout.png";
import { withRouter, NavLink, Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import Overlay from "../Overlay";
import axios from "../../axios";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { get } from "lodash";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ProfileTime, ProfileDayTime } from "./LoginElements";
import Radio from "@mui/material/Radio";
import TimeInput from "../TimeInput";
import FileInput from "../FileInput";
import { uploadImage } from "../../utils/functions";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import Select from "../Select";
import * as IoIcons from "react-icons/io";
import { makeStyles } from "@material-ui/core/styles";
// import savypackLogoWhite from "../../images/savypackLogoWhite.png";
import logoOnBannerImage from "../../images/logo.png";
import logoAboveLogin from "../../images/logo.png";
import LogoName from "../../images/logo-name.png"
import nameHolder from "../../images/name.png";

import {
  signUpValidator,
  loginValidator,
  forgetValidator,
  otpValidator,
  resetOutValidator,
  completeProfileValidator,
  bankDetailsValidator,
} from "../../utils/validators";

import {
  loginObjOne,
  signUpObjOne,
  forgotObjOne,
  resetObjOne,
  restaurantDetailsObjOne,
  bankDetailsObjOne,
  verifyOtpObjOne,
  pendingApprovalObjOne,
} from "./Data";

import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from "react-places-autocomplete";
import "./locationdropdown.css";
import { RiLockPasswordLine, RiUserLine } from "react-icons/ri";
import Forgot from "./Forgot";
// import { FaRegUser } from 'react-icons/fa';
const useStyles = makeStyles((theme) => ({
  formStyle: {
    width: "100%",
    padding: "2rem",
    // height: "80vh",
    overflow: "scroll",
  },
  "@media (max-width: 780px)": {
    formStyle: {
      padding: "1.8rem",
    },
    formStyleOnly: {
      padding: "1.8rem",
    },
  },
  "@media (max-width: 480px)": {
    formStyle: {
      padding: "1.3rem",
    },
    formStyleOnly: {
      padding: "1.3rem",
    },
  },

  formStyleOnly: {
    width: "100%",
    padding: "2rem",
    // height: "80vh",
    // overflow: "scroll",
  },
}));

const InfoSection = ({
  lightBg,
  imgStart,
  img,
  pageHeading,
  pagePara,
  form,
  history,
  setUsers,
  userData,
  defaultState,
  setDefaultState,
}) => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [OTPSend, setOtpSend] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [isForgetiing, setIsForgetting] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    header: "success_message",
    message: "Your add will post Shortly",
  });

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
    token:"sdnfshdfffrregtgtggg"
  });

  const handleLogin = async (values, isSocial = false) => {
    setLoginValues(values);
    setIsLoading(true);
    var url = "/admin/login";
    var formvalues = {
      email: values.email,
      password: values.password,
      device_token:values.token
    };

    try {
      const { data } = await axios.post(url, formvalues);
      // if (data?.data?.isVerified)
      //  {
        // console.log("this data", data)
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("userData", JSON.stringify(data.data));
      localStorage.setItem("isSuperAdmin", data.data.isSuperAdmin);
      setUsers(data.data);
      
      history.push("/adminPanel/dashboard");
      // }
      setIsLoading(false);
    }catch (err) {
      setIsLoading(false);
      console.log("wrong ")
      toast.error(`${err.response.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
     
    }
  };

  return (
    <div>
      <InfoContainer lightBg={lightBg}>
        <InfoWrapper>
          <InfoRow imgStart={imgStart}>
            <Column2>
              <ImgWrap>
                <div className="d-flex justify-content-between align-items-center" style={{width:"192px"}}>
                  <img style={{ width: "4rem" ,marginRight:"10px"}} src={logoOnBannerImage}></img>
                  <span style={{fontSize:"42px"}}>Simplifi</span>
                  {/* <img style={{ width: "10rem", paddingTop: "10px" }} src={LogoName}></img> */}
                </div>
              </ImgWrap>
            </Column2>
            <Column1>
              <TextWrapper contentAlign={defaultState.form == "pendingApproval" ? true : false}>
                <LoginBox>
                  <LogoMenzil>
                    <img style={{ width: "5rem" }} src={logoAboveLogin}></img>
                  </LogoMenzil>
                 
                  <LoginHeading>
                    {/* <BackIcon>
                                            {(updateProfileValues.is_profile_completed === "2" && (defaultState.form == "restaurantDetailsForm" || defaultState.form == "bankDetailsForm")) ? (
                                                <>
                                                    <HeadingButton
                                                        style={{ fontSize: "1.5rem", padding: "0.2em 0.2em", borderRadius: "32px", justifyContent: "center", marginBottom: "0.4em" }}
                                                        onClick={() => {
                                                            setDefaultState(pendingApprovalObjOne)
                                                        }}
                                                    >
                                                        <IoIcons.IoIosArrowRoundBack />
                                                    </HeadingButton>
                                                </>
                                            ) : ""}
                                        </BackIcon> */}
                    Welcome Back !
                  </LoginHeading>
                  <LoginPara>Sign In to continue to Simplifi Admin Panel</LoginPara>
                </LoginBox>
                <InputBox>
                  <Formik
                    enableReinitialize
                    initialValues={loginValues}
                    validate={loginValidator}
                    validateOnChange
                    onSubmit={(values) => handleLogin(values, false)}
                  >
                    {(formikBag) => {
                      return (
                        <Form className={classes.formStyleOnly}>
                          <Field name="email">
                            {({ field }) => (
                              <div className="py-2">
                                <InputLogin
                                  {...field}
                                  type="email"
                                  // icon={nameHolder}
                                  icon={<RiUserLine style={{ fontSize: "24px" }} />}
                                  //   value={formikBag.values.password}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("email", e.target.value);
                                  }}
                                  error={formikBag.touched.email && formikBag.errors.email ? formikBag.errors.email : null}
                                  className="form-control"
                                  placeholder="Email"
                                />
                              </div>
                            )}
                          </Field>
                          <Field name="password">
                            {({ field }) => (
                              <div className="py-2">
                                <InputLogin
                                  {...field}
                                  type="password"
                                  // icon={PassIcon}
                                  icon={<RiLockPasswordLine style={{ fontSize: "24px" }} />}
                                  //   value={formikBag.values.password}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("password", e.target.value);
                                  }}
                                  error={
                                    formikBag.touched.password && formikBag.errors.password ? formikBag.errors.password : null
                                  }
                                  className="form-control"
                                  placeholder="Password"
                                />
                              </div>
                            )}
                          </Field>

                    

                          <LoginBtnWrapper>
                            <LoginButton
                            type="submit"
                            >
                              Log In
                            </LoginButton>
                          </LoginBtnWrapper>
                          <p className="text-center" style={{ padding: "0.3rem", marginBottom: "1.5rem", color: "#74788d" }}>
                            © 2023 Simplifi Wellness
                          </p>
                        </Form>
                      );
                    }}
                  </Formik>
                </InputBox>
                {/*<LoginButtons>

                                </LoginButtons>*/}
              </TextWrapper>
            </Column1>
          </InfoRow>
        </InfoWrapper>
      </InfoContainer>
      {isLoading && <Overlay />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    locationData: state.locations,
    defaultState: state.defaultState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUsers: (updatedValue) => {
      dispatch({
        type: actionTypes.UPDATE_USER,
        updatedUser: updatedValue,
      });
    },
    setDefaultState: (updatedValue) => {
      dispatch({
        type: actionTypes.UPDATE_DEFAULT,
        updateDefault: updatedValue,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InfoSection));
