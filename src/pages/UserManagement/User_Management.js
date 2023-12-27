import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";

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
} from "./UserElements";
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
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Field, Form } from "formik";
import Input from "../../components/Input";
import YearInput from "../../components/YearInput";
import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../../components/Overlay";
import { toast } from "react-toastify";
import EditIcon from "../../images/edit_profile_button_table.png";
import DeleteIcon from "../../images/delete_profile_button_table.png";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

import * as IoIcons from "react-icons/io";
import * as HiIcons from "react-icons/hi";
import * as AiIcons from "react-icons/ai";
import { get, isEmpty } from "lodash";
import classNames from "classnames";
import Select from "../../components/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter } from "react-router-dom";
// import SearchBar from "material-ui-search-bar";
import { ProductValidator } from "../../utils/validators";
import TextArea from "../../components/TextArea";
import FileInput from "../../components/FileInput";
import { uploadImage } from "../../utils/functions";
import { FaSearch } from "react-icons/fa";
import BlockIcon from "@material-ui/icons/Block";
import {
  SearchContainer,
  SearchBar,
  SearchIcon,
  SearchInput,
} from "../../components/SearchBar/SearchElements";
import DatePicker from "react-date-picker";
import { BsFilter } from "react-icons/bs";
import moment from "moment";
import NoDataFound from "../../components/NoDataFound";
import Nodata from "../../components/Nodata";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { FaUserCheck } from "react-icons/fa";
import { FaUserTimes } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";
import User_Information from "./User_Information";
const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "5px",
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: "800",
  },
  tableContainerHeight: {
    maxHeight: "65vh",
  },
  paperTableHeight: {
    height: "650px",
    width: "95%",
    marginLeft: "2rem",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  "@media (max-width: 780px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  "@media (max-width: 1026px)": {
    statusContainer: {
      flexDirection: "column",
    },
  },
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  tablePaginationStyle: {
    // border: "1px solid #0000001a",
    borderRadius: "0rem 0rem 0.4rem 0.4rem",
    overflowY: "hidden",
  },
  tableFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  searchDesign: {
    borderRadius: "20px",
    boxShadow: "none",
    width: "21%",
  },
}));

const OfferManagement = ({ history, setUsers, userData }) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [datefiltervalue, setDateFilter] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [total_data, setTotalData] = useState(90);
  const [categoryList, setCategoryList] = useState("");
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [id, setId] = useState("");

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    getUserList();
  }, []);

  // function formatDate(date) {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}/${month}/${day}`;
  // }

  // For Pagination 10
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const requestSearch = (searchedVal) => {
    console.log("searchedVal", searchedVal);
    console.log("searchedVal", searchedData);
    const filteredRows = searchedData.filter((row) => {
      let name = get(row, "firstName", "") + " " + get(row, "lastName", "");
      let mobileNumber = JSON.stringify(get(row, "mobileNumber", ""));
      let email = get(row, "email", "");
      // let sequenceId = JSON.stringify(get(row, "sequenceId", ""));
      return (
        name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        mobileNumber
          .toLowerCase()
          .includes(searchedVal.target.value.toLowerCase()) ||
        email.toLowerCase().includes(searchedVal.target.value.toLowerCase())
        // sequenceId.toLowerCase().includes(searchedVal.target.value.toLowerCase())
      );
    });
    setTableData(filteredRows);
  };

  const handleSortRequest = (cellId) => {
    console.log(cellId);
    console.log(orderBy);
    const isAsc = orderBy === cellId && order === "asc";
    stableSort(tableData, getComparator(order, cellId));
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const recordsAfterPagingAndSorting = () => {
    return stableSort(tableData, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
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
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
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

  const userBlocked = async (e) => {
    // console.log(e);
    if (e.categoryBlocked === true) {
      if (window.confirm("Are you sure you want to unblock this user?")) {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.post(
            "/admin/user-block-unblock",
            {
              user_id: e.categoryId,
              is_blocked: false,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          if (categoryList == "userlist") {
            getUserList();
          }
          if (categoryList == "customlist") {
            getFilteredUserList();
          }
          if(categoryList=="userweeklist"){
            getFilteredUserListWeekAndMonth();
          }


          // setIsLoading(false);
          toast.success("User unblocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // getCategory();
      }
    } else if (e.categoryBlocked === false) {
      if (window.confirm("Are you sure you want to block this user?")) {
        try {
          console.log("chlra");
          // console.log(e.categoryId)
          const token = localStorage.getItem("accessToken");
          await axios.post(
            "/admin/user-block-unblock",
            {
              user_id: e.categoryId,
              is_blocked: true,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          if (categoryList == "userlist") {
            getUserList();
          }
          if (categoryList == "customlist") {
            getFilteredUserList();
          }
          if(categoryList=="userweeklist"){
            getFilteredUserListWeekAndMonth();
          }
          toast.success("User blocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // getCategory();
      }
    } else {
      return "error";
    }
  };

  const dateOfJoining = (e) => {
    var date = new Date(e).toLocaleDateString();
    return date;
  };
  const dateOfExpiry = (e) => {
    var date = new Date(e).toLocaleDateString();
    if (e) {
      return date;
    } else {
      return "N/A";
    }
  };
  const handleUserDetails = (id) => {
    setId(id);
  };

  const getUserList = async (
    page = 1,
    rowsPerPage = 15,
    searchValue = "",
    startDate = "",
    endDate = "",
    datefiltervalue = ""
  ) => {
    setIsLoading(true);
    setCategoryList("userlist");

    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/get-user?page=${page}&pageSize=${rowsPerPage}&searchTerm=${searchValue}&fromDate=${startDate}&endDate=${endDate}&dateFilter=${datefiltervalue}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setTableData(data.data);
      setSearchedData(data.data);
      setTotalData(data.data);
      setPage(page - 1);
      setRowsPerPage(rowsPerPage);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 500)
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
    }
  };
  const getFilteredUserList = async () => {
    // console.log("aag");

    try {
      const token = localStorage.getItem("accessToken");
      const formatStartDate = moment(startDate).format("YYYY-MM-DD");
      const formatEndDate = moment(endDate).format("YYYY-MM-DD");

      const { data } = await axios.get(
        `/admin/user-filter?filterType=${datefiltervalue}&to_date=${formatEndDate}&from_date=${formatStartDate}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setTableData(data.data);
      setSearchedData(data.data);
      setCategoryList("customlist");

      // setCustom('set')

      // console.log("this is start date", formatStartDate)
      // console.log("this is end date", formatEndDate)

      // console.log(tableData, "this is custom table data");
    } catch (err) {
      console.log(err);
    }
  };
  const getFilteredUserListWeekAndMonth = async () => {
    // console.log("fire");
    // console.log(datefiltervalue);

    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/user-filter?filterType=${datefiltervalue}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setTableData(data.data);
      setSearchedData(data.data);
      setCategoryList("userweeklist");

      console.log(data.data, "this is weekly data");
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(startDate, "idharrrrr--------------******");

  function myDeb(call, d = 1000) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        call(...args);
      }, d);
    };
  }

  const SearchUser = (searchedVal) => {
    const filteredRows = searchedData.filter((row) => {
      let id = row._id;
      let first_name = row.first_name;
      let last_name = row.last_name;
      let email=row.email;
  
      return (
        first_name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        last_name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        id.includes(searchedVal.target.value.toLowerCase()) ||
        email.includes(searchedVal.target.value.toLowerCase())
      );
    });
      setTableData(filteredRows);
  };
  

  const closeFilterMenu = (event) => {
    if (showFilter && !event.target.closest("#yourFilterMenuId")) {
      setShowFilter(false);
    }
  };

  // Attach and detach the event listener on mount and unmount
  useEffect(() => {
    document.addEventListener("click", closeFilterMenu);
    return () => {
      document.removeEventListener("click", closeFilterMenu);
    };
  }, [showFilter]);
  // console.log("page", page);
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "2rem",
              }}
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
                {/* <ArrowBackIosIcon
                  style={{ color: "black", margin: "0rem 1rem", cursor: "pointer" }}
                  onClick={() => history.push({ pathname: state[0].location, state: state })}
                /> */}
                <FaIcons.FaUser style={{ fontSize: "25px", margin: "8px" }} />
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  User Management
                </DashHeading>
              </MenuAndBack>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <SearchContainer>
                  <SearchBar>
                    <SearchIcon>
                      <FaSearch style={{ color: "#c4c4c4" }} />
                      {/*<SearchIconn color="#000000" style={{fontWeight:"200"}}/>*/}
                      {/*<IconSearch/>*/}
                    </SearchIcon>
                    <SearchInput
                      type="text"
                      onChange={(searchVal) => SearchUser(searchVal)}
                      placeholder="Search by Name, Email & Id"
                    ></SearchInput>
                  </SearchBar>
                </SearchContainer>
                <div style={{ position: "relative" }}>
                  <Tooltip
                    title={
                      <span style={{ color: "white", fontSize: "16px" }}>
                        Filter
                      </span>
                    }
                    arrow
                  >
                    <IconButton
                      className=""
                      id="yourFilterMenuId"
                      style={{
                        background:
                          "transparent linear-gradient(90deg, #012844 0%, #012844 100%) 0% 0% no-repeat padding-box",
                        color: "#fff",
                        marginLeft: "5px",
                      }}
                      onClick={() => {
                        setShowFilter(!showFilter);
                      }}
                    >
                      <BsFilter />
                    </IconButton>
                  </Tooltip>
                  {showFilter ? (
                    <div
                      className="box arrow-top"
                      id="yourFilterMenuId"
                      style={{
                        display: "flex",

                        position: "absolute",
                        backgroundColor: "whitesmoke",
                        zIndex: 5,
                        borderRadius: "10px",
                        marginLeft: "-125px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",

                          backgroundColor: "white",
                          borderRadius: "5px",
                          padding: "5px",
                          margin: "20px",
                          // width: "250px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "5px",
                          }}
                        >
                          <input
                            type="radio"
                            id="week"
                            name="dateFilter"
                            value="1"
                            onClickCapture={(e) =>
                              setDateFilter(e.target.value)
                            }
                            style={{ cursor: "pointer" }}
                          />
                          <label
                            style={{
                              color: "black",
                              cursor: "pointer",
                              flex: 1,
                            }}
                            for="week"
                          >
                            This Week
                          </label>
                          <br />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "5px",
                          }}
                        >
                          <input
                            type="radio"
                            id="month"
                            name="dateFilter"
                            value="2"
                            onClickCapture={(e) =>
                              setDateFilter(e.target.value)
                            }
                            style={{ cursor: "pointer" }}
                          />
                          <label
                            style={{
                              color: "black",
                              cursor: "pointer",
                              flex: 1,
                            }}
                            for="month"
                          >
                            This Month
                          </label>
                          <br />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "5px",
                          }}
                        >
                          <input
                            type="radio"
                            id="custom"
                            name="dateFilter"
                            value="3"
                            onClickCapture={(e) =>
                              setDateFilter(e.target.value)
                            }
                            style={{ cursor: "pointer" }}
                          />
                          <label
                            style={{
                              color: "black",
                              cursor: "pointer",
                              flex: 1,
                            }}
                            for="custom"
                          >
                            Custom
                          </label>
                          <br />
                        </div>

                        {datefiltervalue == 3 ? (
                          <div>
                            <div>
                              <span style={{ color: "black" }}>From:</span>
                              <DatePicker
                                value={startDate}
                                format="dd-MM-yyyy"
                                onChange={(date) => {
                                  setStartDate(date);
                                }}
                              />
                            </div>
                            <div>
                              <span style={{ color: "black" }}>To:</span>
                              <DatePicker
                                onChange={(date) => {
                                  setEndDate(date);
                                }}
                                minDate={startDate}
                                value={endDate}
                                format="dd/MM/yyyy"
                              />
                            </div>
                          </div>
                        ) : (
                          false
                        )}

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            marginTop: "15px",
                          }}
                        >
                          <span
                            style={{
                              background:
                                "transparent linear-gradient(90deg, #012844 0%, #012844 100%) 0% 0% no-repeat padding-box",

                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              if (datefiltervalue == 3) {
                                if (startDate === null && endDate === null) {
                                  toast.info(
                                    "Please Select Both Dates To Get Filtered Data",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                    }
                                  );
                                } else if (
                                  startDate === null ||
                                  endDate === null
                                ) {
                                  toast.info(
                                    "Please Select Both Dates To Get Filtered Data",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                    }
                                  );
                                } else if (
                                  startDate !== null &&
                                  endDate !== null
                                ) {
                                  setShowFilter(false);
                                  getFilteredUserList();
                                  // getUserList(
                                  //   page + 1,
                                  //   rowsPerPage,
                                  //   "",
                                  //   startDate,
                                  //   endDate,
                                  //   3
                                  // );
                                }
                              } else {
                                getFilteredUserListWeekAndMonth();
                                setShowFilter(false);
                                if (datefiltervalue == 1) {
                                  // getUserList(
                                  //   page + 1,
                                  //   rowsPerPage,
                                  //   "",
                                  //   "",
                                  //   "",
                                  //   1
                                  // );
                                } else if (datefiltervalue == 2) {
                                  // getUserList(
                                  //   page + 1,
                                  //   rowsPerPage,
                                  //   "",
                                  //   "",
                                  //   "",
                                  //   2
                                  // );
                                }
                              }
                            }}
                          >
                            {" "}
                            Apply
                          </span>
                          <span
                            style={{
                              background:
                                "transparent linear-gradient(90deg, #012844 0%, #012844 100%) 0% 0% no-repeat padding-box",
                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              setStartDate(null);
                              setEndDate(null);
                              setDateFilter();
                              getUserList();
                              setShowFilter(false);
                            }}
                          >
                            {" "}
                            Reset
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                </div>
              </div>
            </DashboardHeading>
            <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",
                height: "100%",
                marginBottom: "0.5rem",
              }}
            >
              <TableContainer className={classes.tableContainerHeight}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tablePadding}
                        style={{ fontWeight: "800" }}
                      >
                        S.&nbsp;No.
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "createdAt" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("createdAt");
                          }}
                        > */}
                          Date Of Joining
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {" "}
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "sequenceId" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("sequenceId");
                          }}
                        > */}
                           Id
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "first_name" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("first_name");
                          }}
                        > */}
                          First Name
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "last_name" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("last_name");
                          }}
                        > */}
                          Last Name
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "email" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("email");
                          }}
                        > */}
                          Email
                        {/* </TableSortLabel>  */}
                      </TableCell>

                      <TableCell className={classes.tablePadding}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recordsAfterPagingAndSorting().map((category, index) => (
                      <TableRow key={category._id}>
                        {/* {console.log(category)} */}
                        <TableCell
                          component="th"
                          scope="row"
                          className={classes.textMiddle}
                        >
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          {/* <div>{dateOfJoining(category.createdAt)}</div> */}
                          <div>
                            {" "}
                            {moment(category?.createdAt).format("DD/MM/YYYY")}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          {/* <div>{dateOfJoining(category.createdAt)}</div> */}
                          <div>{get(category, "_id", "")}</div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "first_name", "")}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{ textTransform: "capitalize" }}
                          className="text-center"
                        >
                          {get(category, "last_name", "")}
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>
                            {!get(category, "email", "")
                              ? "N/A"
                              : get(category, "email", "")}
                          </div>
                        </TableCell>
                        {/* <TableCell className={classes.textMiddle}>
                                                          <div>
                                                              {get(category, 'quantity', '')}
                                                          </div>
                                                      </TableCell> */}
                        {/* <TableCell className={classes.textMiddle}>
                          <div>
                            {get(category, "countryCode", "")} {get(category, "mobileNumber", "")}
                          </div>
                        </TableCell> */}
                        {/* <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>{get(category, "plan_id.planName", "N/A")}</div>
                        </TableCell> */}
                        {/* <TableCell className={classes.textMiddle}>
                          <div>{dateOfExpiry(category?.plan_expired_on)}</div>
                        </TableCell> */}
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* <div style={{ marginRight: "1rem" }}>
                          <Button
                            variant="outlined"
                            aria-label="add"
                            className={classes.iconMargin}
                            onClick={() => {
                              history.push({
                                pathname: `/adminPanel/user/${category.id}`,
                              });
                            }}
                          >
                            <VisibilityIcon color="primary" />
                          </Button>
                        </div> */}
                            <div>
                              <Tooltip title={"View User"} arrow>
                                <Button
                                  aria-label="add"
                                  onClick={() => {
                                    handleUserDetails(category.id);
                                  }}
                                >
                                  <Link
                                    to={`/adminPanel/userorder?id=${category._id}`}
                                  >
                                    <AiIcons.AiFillEye
                                      style={{ fontSize: "1.5rem" }}
                                    />
                                  </Link>
                                </Button>
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip
                                title={
                                  category.is_blocked ? "Unblock" : "Block"
                                }
                                arrow
                              >
                                <Button
                                  // variant="outlined"
                                  aria-label="add"
                                  // className={classes.Marginbutton}
                                  onClick={() => {
                                    userBlocked({
                                      categoryId: category._id,
                                      categoryBlocked: category.is_blocked,
                                    });
                                    // {`${console.log('Hello, World!')}`}
                                  }}
                                  style={{}}
                                >
                                  {category.is_blocked === true ? (
                                    // <BlockIcon style={{ color: "red" }} />
                                    <FaUserTimes
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
                                    />
                                  ) : (
                                    // <CheckCircleIcon style={{color:"green"}}/>
                                    <FaUserCheck
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "green",
                                      }}
                                    />
                                  )}
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {
                // total_data === 0
                tableData.length === 0 ? (
                  <Nodata TextToDisplay="No Data Found." fontSize="24px" />
                ) : (
                  false
                )
              }
              <TablePagination
                className={classes.tablePaginationStyle}
                rowsPerPageOptions={[15, 30, 100]}
                component="div"
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </DashboardWrapper>
        </DashboardContainer>
      </div>

      {isLoading && <Overlay />}
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
