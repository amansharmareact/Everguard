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
import Notification_UserList from '../NotificationSection/Notification_UserList'
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
import { MdEmail } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    marginTop: "5rem",
    // verticalAlign: 'scroll'
  },
  tablePad: {
    padding: "20px 30px",
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

  // For Pagination
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
  }, []);
  useEffect(() => {
    getUsers();
  }, []);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    getUsers(newPage + 1, rowsPerPage, search);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(+event.target.value);
    // setPage(0);

    getUsers(1, event.target.value, search);
    console.log("checkrows");
    console.log(parseInt(event.target.value, 10));
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [selectError, setSelectError] = useState("");
  const [defaultState, setDefaultState] = useState({ individual: false });
  const [selectUserType, setSelectUserType] = useState("USER");
  const [selectDeviceType, setSelectDeviceType] = useState("");
  const [individualType, setIndividualType] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState();
  const [check, setCheck] = useState(false)
  const [orderBy, setOrderBy] = useState();
  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [total_data, setTotalData] = useState(90);

  const requestSearch = (searchedVal) => {
    // console.log(searchedVal);
    const filteredRows = searchedData.filter((row) => {
      // console.log(searchedVal);
      //   console.log(row);
      let name = row.firstName + " " + row.lastName;
      let id = row.sequenceId;
      let email = row.email;
      let phone = row.countryCode + " " + row.mobileNumber;
      return (
        name.toLowerCase().includes(searchedVal.toLowerCase()) ||
        id.toLowerCase().includes(searchedVal.toLowerCase()) ||
        email.toLowerCase().includes(searchedVal.toLowerCase()) ||
        phone.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setUsers(filteredRows);
  };

  const getUsers = async (page = 1, rowsPerPage = 15, search = "") => {
    // if(type==="USER"){
    try {
      const { data } = await axios.get(`/admin/userList?page=${page}&pageSize=${rowsPerPage}&searchTerm=${search}`);
      setUsers(data.data.docs);
      setSearchedData(data.data.docs);
      setPage(page - 1);
      setTotalData(data.data.totalDocs);
      console.log(data.data);
    } catch (error) {
      setUsers("");
      console.log(error);
    }
    // }
    // else if(type==="AGENT"){
    //   try {
    //     const { data } = await axios.get(`/admin/listAgents`);
    //     setUsers(data.data);
    //     setSearchedData(data.data);
    //     console.log(data.data);
    //   } catch (error) {
    //     setUsers("");
    //     console.log(error);
    //   }
    // }else if(type==="MERCHANT"){
    //   try {
    //     const { data } = await axios.get(`/admin/listmerchants?approvalStatus=approved`);
    //     setUsers(data.data);
    //     setSearchedData(data.data);
    //     console.log(data.data);
    //   } catch (error) {
    //     setUsers("");
    //     console.log(error);
    //   }
    // }
  };
  const recordsAfterPagingAndSorting = () => {
    return stableSort(users, getComparator(order, orderBy));
    //  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  function getComparator(order, orderBy) {
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  const cancelSearch = () => {
    setSearched("");
    getUsers();
  };

  // console.log(checkId.map((val) => val.id));

  const Submit = async (e) => {
    e.preventDefault();

    if (title == "") {
      setTitleError("Please enter the subject");
    }
    if (title.length > 20) {
      setTitleError("Maximum 20 characters allowed");
    }

    if (message == "") {
      setMessageError("Please enter the body");
    }
    if (message.length > 40) {
      setMessageError("Maximum 40 characters allowed");
    }
    if (selectDeviceType === "") {
      setSelectError("Select atleast one option");
    }
    if (individualType) {
      // setSelectUserType("")
    }

    console.log("selectUserType", selectUserType);

    if (title && message && selected && selectDeviceType) {
      let values;
      if (selectDeviceType === "All") {
        values = {
          email_all: true,
          body: message,
          subject: title,
          // role: selectUserType.toLowerCase(),
          // deviceType: selectDeviceType
        };
      }
      //       else if(selectDeviceType==="Android"){
      // values={
      //   users: selected,
      //   message: message,
      //   heading: title,
      //   role: selectUserType.toLowerCase(),
      // deviceType: "1"
      // }
      //       }else if(selectDeviceType==="Web"){
      // values={
      //   users: selected,
      //   message: message,
      //   heading: title,
      //   role: selectUserType.toLowerCase(),
      // deviceType: "3"
      // }
      //       }
      else if (selectDeviceType === "Individual") {
        values = {
          user_ids: selected,
          body: message,
          subject: title,
          // role: selectUserType.toLowerCase(),
          // deviceType: selectDeviceType
        };
      }

      try {
        const { data } = await axios.post(
          "/admin/customEmail",
          // {
          //   users: selected,
          //   message: message,
          //   heading: title,
          //   role: selectUserType.toLowerCase(),
          // deviceType: selectDeviceType
          // }
          values
        );
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getUsers();
        window.location.reload();
        // setMessage("");
        // setTitle("");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please Enter All Fields");
    }
  };

  //Select Checkbox

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (selected?.length) {
      setSelected([]);
    } else {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
    }
  };

  const handleClick = (event, name) => {
    console.log(name);
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const UserCheck = [
    // {
    //   id: "1",
    //   name: "Android",
    // },
    // {
    //   id: "2",
    //   name: "iOS",
    // },
    // {
    //   id: "3",
    //   name: "Web",
    // },
    { id: "1", name: "All" },
  ];

  const UserTypes = [
    {
      label: "USER",
      value: "1",
    },
    {
      label: "AGENT",
      value: "2",
    },
    {
      label: "MERCHANT",
      value: "3",
    },
  ];
  function myDeb(call, d = 1000) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        call(...args);
      }, d);
    };
  }

  const SearchUser = myDeb((e) => {
    // let {value}=e.target;
    setSearch(e);
    // const FormatedDate = getDateFormat(startDate, endDate);
    getUsers(page + 1, rowsPerPage, e.toLowerCase());
    // console.log(value)
  });
  return (
    <>
      <DashboardContainer>
        <>
          <Paper className={classes.paperTableHeight} style={{ overflow: "hidden", height: "100%" }}>
            <div className={classes.tablePad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" , marginBottom:"20px"}}>
              <MenuAndBack
                style={{
                  backgroundColor: "#012844",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MdEmail style={{ fontSize: "25px", margin: "8px", color:"white" }} />
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Email Management
                </DashHeading>
              </MenuAndBack>
              </div>
              <Paper style={{ padding: "1rem 2rem" }}>
                <form onSubmit={Submit}>
                  <div className="form-group">
                    <div className="colsone">
                      <label className={classes.textS}>Subject</label>
                      <Input
                        type="text"
                        className="form-control"
                        variant="outlined"
                        placeholder="Title"
                        // inputProps={{ style: { fontSize: 16, padding: 12 } }}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setTitleError("");
                        }}
                        // fullWidth
                      />
                      <span style={{ color: "red" }}>{titleError}</span>
                    </div>
                    <div className={classes.textA}>
                      <label className={classes.textS}>Body</label>
                      <TextareaAutosize
                        placeholder="Message"
                        maxRows={12}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          setMessageError("");
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
                      <span style={{ color: "red" }}>{messageError}</span>
                    </div>

                    <div className="user_box" style={{ marginTop: "0.5rem" }}>
                      <label className={classes.textS}>User Type</label>
                      {/* <h4>User Type</h4> */}
                      <form>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex" }}>
                              {UserCheck.map((val) => {
                                return (
                                  <label>
                                    <input
                                      type="radio"
                                      name="user"
                                      style={{
                                        marginRight: "10px",
                                        marginLeft: "10px",
                                      }}
                                      onClick={() => {
                                        setDefaultState({ individual: false });
                                        setSelectDeviceType(val.name);
                                        setSelectError("");
                                      }}
                                      value={val.name}
                                    />
                                    <span style={{ fontSize: "1rem" }}>{val.name}</span>
                                  </label>
                                );
                              })}
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
                                    setSelectDeviceType("Individual");
                                    // setSelectUserType(selectUserType)
                                    setIndividualType(true);
                                    setSelectError("");
                                    setCheck(true)
                                  }}
                                />
                                <label style={{ fontSize: "1rem" }}>Select User</label>
                              </div>
                            </div>
                            <span style={{ color: "red" }}>{selectError}</span>
                          </div>
                        </div>
                      </form>
                    </div>
                   <Notification_UserList check={check}/>
                    {/* <div className={classes.topM}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.btnSize}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </div> */}

                    <div className="text-center login_btn_group" style={{ justifyContent: "center", marginTop: "3rem" }}>
                      <NotificationButton type="submit" className="buttonWidthResponsive">
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OfferManagement));
