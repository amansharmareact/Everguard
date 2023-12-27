import React, { useEffect, useState } from "react";
// import { Container, Row, Col } from "reactstrap";
// import axios from "../../axios";
import axios from "../../axios";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
// import Label from 'reactstrap/lib/Label';
import { Formik, Field, Form } from "formik";
// import './Notification.scss'
import Checkbox from "@material-ui/core/Checkbox";
import { Radio, TextareaAutosize, TextField } from "@material-ui/core";
import { lightGreen } from "@material-ui/core/colors";
import { toast } from "react-toastify";
import Select from "../../components/Select";
import { FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter } from "react-router-dom";
import { get, isEmpty } from "lodash";
import { IoNotifications } from "react-icons/io5";


import SearchBar from "material-ui-search-bar";
import {
  DashboardContainer,
  DashboardWrapper,
  DashboardHeading,
  DashHeading,
  SvgLogo,
  BackIcon,
  MenuAndBack,
  PreperationTime,
  LabelHeading,
  RetaurantDetailsForm,
  InputDivide,
  MiddleColumnProfile,
  InputPic,
  HeadingBlock,
  HeadingProfile,
  HeadingPara,
  MultipleButtons,
  TripleButton,
  MultipleButton,
  VoucherHeading,
  VoucherHeadingMain,
  FullWidthMobileInput,
  OfferRadioSection,
  OfferSectionLabel,
  MobileViewCalender,
  HeadingButton,
  LoginButton,
  ApproveButton,
  DisapproveButton,
  AgentApprove,
  NotificationButton,
} from "../UserManagement/UserElements";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Button,
} from "@material-ui/core";
import Input from "../../components/Input";
import Notification_UserList from "./Notification_UserList";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    marginTop: "5rem",
    // verticalAlign: 'scroll'
  },
  tablePad: {
    // padding: "20px 30px",
    lineHeight: "50px",
    // width: "60%",
  },
  textS: {
    fontSize: "1.2rem",
    color: "#525f7f",
    marginBottom: "-0.2rem",
  },
  textA: {
    display: "flex",
    flexDirection: "column",
    marginTop: "0.5rem",
  },
  btnSize: {
    fontSize: "1.1rem",
  },
  topM: {
    marginTop: "8rem",
    marginBottom: "2rem",
  },
  paperTableHeight: {
    height: "auto",
    width: "100%",
    padding: "10px 30px",
  },
  container: {
    marginTop: "2rem",
  },
  textMiddle: {
    margin: "auto",
    textAlign: "center",
  },
  // searchHeight: {
  //     // width: '50%',
  //     margin: 'auto'
  // },
  searchBox: {
    display: "flex",
    // backgroundColor: 'pink',
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 20px",
  },
  textSizes: {
    textAlign: "center",
    fontSize: "0.9rem",
  },
  //   checkSize: {
  //       height: '10px',
  //       width: '10px'
  //   }
}));

const OfferManagement = ({ history, userData }) => {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [checkBoxError, setCheckBoxError] = useState(false);

  
  const [defaultState, setDefaultState] = useState({ individual: false });
  const [selectUserType, setSelectUserType] = useState("USER");
  const [individualType, setIndividualType] = useState(false);
  const [check, setCheck] = useState(false);

  const [formdata, setFormdata] = useState({
    title: "",
    message: "",
    device_type: "",
    user_role: "USER",
    user_id: [],
  });

  // const handleTitleFocus = () => {
  //   if (formdata.title == "") {
  //     setTitleError(true);
  //   }
  // };
  // const handleMessageFocus = () => {
  //   if (formdata.message == "") {
  //     setMessageError(true);
  //   }
  // };

  const Submit = async (e) => {
    e.preventDefault();
    if(formdata.device_type===""){
      setSelectError(true)
    } 
    if(formdata.device_type==="Individual" && formdata.user_id.length<=0){
      setCheckBoxError(true)
    }
    if(formdata.title===""){
      setTitleError(true)
    }
    if(formdata.message===""){
      setMessageError(true)
    }
    else{

      if (!formdata.user_id || formdata.user_id.length === 0) {
        const formDataToSend = { ...formdata };
        formDataToSend.user_id.length = 0;
  
        try {
          console.log(formDataToSend, "this is submited data");
          const token = localStorage.getItem("accessToken");
          const { data } = await axios.post(
            `/admin/send-notification`,
            formDataToSend,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          toast.success(`${data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          window.location.reload();
        } catch (err) {
          if (err.response.status == "400") {
            toast.error(`${err.response.data.message}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          console.log(err.response);
        }
      } else {
        try {
          const formDataToSend = { ...formdata };
          delete formDataToSend.user_role;
          console.log(formDataToSend, "this is submited data");
  
          const token = localStorage.getItem("accessToken");
          const { data } = await axios.post(
            `/admin/send-notification`,
            formDataToSend,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          toast.success(`${data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          window.location.reload();
        } catch (err) {
          if (err.response.status == "400") {
            toast.error(`${err.response.data.message}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          console.log(err.response);
        }
      }
    }
  };
  const getData = (checkItem) => {
    setFormdata({
      ...formdata,
      user_id: checkItem,
    });
  };
  return (
    <>
      <DashboardContainer>
        <>
          <Paper
            className={classes.paperTableHeight}
            style={{ overflow: "hidden", height: "100%" ,background:"#f2f2f2" }}
          >
            <div className={classes.tablePad}>
              {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> */}
              <DashboardHeading
                style={{ display: "flex", flexDirection: "column" ,width:"100%"}}
              >
                <MenuAndBack
                  style={{
                    backgroundColor: "#012844",
                    width: "100%",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                   <IoNotifications style={{ fontSize: "25px", margin: "8px", color:"white" }}/>
                  <DashHeading
                    style={{ color: "white", flex: "1", padding: "8px" }}
                  >
                    Notification Management
                  </DashHeading>
                </MenuAndBack>
              </DashboardHeading>

              {/* </div> */}
              <Paper style={{ padding: "1rem 2rem" }}>
                <form onSubmit={Submit}>
                  <div className="form-group">
                    <div className="colsone">
                      <label className={classes.textS}>Title</label>
                      <Input
                        type="text"
                        className="form-control"
                        variant="outlined"
                        placeholder="Title"
                        // onBlur={handleTitleFocus}
                        onChange={(e) => {
                          setFormdata({
                            ...formdata,
                            title: e.target.value,
                          });
                          setTitleError(false);
                        }}
                      />
                      {titleError && (
                        <span style={{ color: "red" }}>Title is required</span>
                      )}
                    </div>
                    <div className={classes.textA}>
                      <label className={classes.textS}>Description</label>
                      <TextareaAutosize
                        placeholder="Message"
                        maxRows={12}
                        // onBlur={handleMessageFocus}
                        onChange={(e) => {
                          setFormdata({
                            ...formdata,
                            message: e.target.value,
                          });
                          setMessageError(false);
                        }}
                        style={{
                          height: 200,
                          borderRadius: 5,
                          borderColor: "lightgrey",
                          padding: "0 15px",
                          outline: "none",
                          color: "black",
                        }}
                      />
                      {messageError && (
                        <span style={{ color: "red" }}>
                          Message is required
                        </span>
                      )}
                    </div>

                    <div className="user_box" style={{ marginTop: "0.5rem" }}>
                      <label className={classes.textS}>User Type</label>
                      {/* <h4>User Type</h4> */}
                      <form>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            marginBottom: "20px",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex" }}>
                              <div>
                                <input
                                  type="radio"
                                  style={{
                                    marginRight: "10px",
                                    marginLeft: "10px",
                                  }}
                                  name="user"
                                  onClick={() => {
                                    setDefaultState({ android: true });
                                    setFormdata({
                                      ...formdata,
                                      device_type: "Android",
                                    });

                                    // setSelectUserType(selectUserType)
                                    setIndividualType(true);
                                    setCheck(false);
                                    setSelectError(false);
                                    setCheckBoxError(false)
                                  }}
                                />
                                <label style={{ fontSize: "1rem" }}>
                                  ANDROID
                                </label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{ display: "flex" }}>
                              <div>
                                <input
                                  type="radio"
                                  style={{
                                    marginRight: "10px",
                                    marginLeft: "10px",
                                  }}
                                  name="user"
                                  onClick={() => {
                                    setDefaultState({ individual: true });
                                    setFormdata({
                                      ...formdata,
                                      device_type: "iOS",
                                    });

                                    // setSelectUserType(selectUserType)
                                    setIndividualType(true);
                                    setCheck(false);
                                    setSelectError(false);
                                    setCheckBoxError(false)

                                  }}
                                />
                                <label style={{ fontSize: "1rem" }}>IOS</label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{ display: "flex" }}>
                              <div>
                                <input
                                  type="radio"
                                  style={{
                                    marginRight: "10px",
                                    marginLeft: "10px",
                                  }}
                                  name="user"
                                  onClick={() => {
                                    setDefaultState({ individual: true });
                                    setFormdata({
                                      ...formdata,
                                      device_type: "Web",
                                    });
                                    // setSelectUserType(selectUserType)
                                    setIndividualType(true);
                                    setCheck(false);
                                    setSelectError(false);
                                    setCheckBoxError(false)

                                  }}
                                />
                                <label style={{ fontSize: "1rem" }}>WEB</label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{ display: "flex" }}>
                              <div>
                                <input
                                  type="radio"
                                  style={{
                                    marginRight: "10px",
                                    marginLeft: "10px",
                                  }}
                                  name="user"
                                  onClick={() => {
                                    setDefaultState({ individual: true });
                                    setFormdata({
                                      ...formdata,
                                      device_type: "Individual",
                                    });
                                    // setSelectUserType(selectUserType)
                                    setIndividualType(true);
                                    setCheck(true);
                                    setSelectError(false);
                                    setCheckBoxError(false)

                                  }}
                                />
                                <label style={{ fontSize: "1rem" }}>
                                  INDIVIDUAL
                                </label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{ display: "flex" }}>
                              <div>
                                <input
                                  type="radio"
                                  style={{
                                    marginRight: "10px",
                                    marginLeft: "10px",
                                  }}
                                  name="user"
                                  onClick={() => {
                                    setDefaultState({ individual: true });
                                    setFormdata({
                                      ...formdata,
                                      device_type: "All",
                                    });
                                    // setSelectUserType(selectUserType)
                                    setIndividualType(true);
                                    setCheck(false);
                                    setSelectError(false);
                                  }}
                                />
                                <label style={{ fontSize: "1rem" }}>ALL</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    {selectError && (
                      <span style={{ color: "red" }}>Type is required</span>
                    )}
                    <Notification_UserList getData={getData} check={check} />
                    <div
                      className="text-center"
                      style={{display:"flex", justifyContent: "center", flexDirection:"column", alignItems:"center" }}
                    >
                       {checkBoxError && (
                      <span style={{ color: "red" }}>Please Select atleast one user</span>
                    )}
                      <NotificationButton
                        type="submit"
                        style={{width:"150px", marginTop:"15px"}}
                      >
                        Submit
                      </NotificationButton>
                    </div>
                  </div>
                </form>
              </Paper>
            </div>
          </Paper>
        </>
      </DashboardContainer>
    </>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferManagement));
