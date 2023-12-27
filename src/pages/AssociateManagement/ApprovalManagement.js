import React, { useState, useEffect } from "react";
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
} from "./AssociateElements";
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
import { get, isEmpty } from "lodash";
import classNames from "classnames";
import Select from "../../components/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter } from "react-router-dom";
// import SearchBar from "material-ui-search-bar";
import { BlogDataValidator } from "../../utils/validators";
import TextArea from "../../components/TextArea";
import FileInput from "../../components/FileInput";
import { uploadImage } from "../../utils/functions";
import { FaSearch } from "react-icons/fa";
import BlockIcon from "@material-ui/icons/Block";
import { SearchContainer, SearchBar, SearchIcon, SearchInput } from "../../components/SearchBar/SearchElements";
import DatePicker from "react-date-picker";
import { BsFilter } from "react-icons/bs";
import moment from "moment";
import NoDataFound from "../../components/NoDataFound";
import Nodata from "../../components/Nodata";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Modal } from "../../components/Modal";
import { SlClose } from "react-icons/sl";
import AddIcon from "@material-ui/icons/Add";
import { handleImageUpload } from "../../utils/functions";
import { DeleteOutline } from "@material-ui/icons";
import { Edit } from "@material-ui/icons";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

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
    maxHeight: "77vh",
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
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  tablePaginationStyle: {
    border: "1px solid #0000001a",
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [NameText, setNameText] = useState(null);
  const [LinkNameText, setLinkNameText] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [total_data, setTotalData] = useState(90);
  const [categoryList, setCategoryList] = useState([]);
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [BlogData, setBlogData] = useState({
    date: "",
    title: "",

    file: [],
    link: "",
    description: "",
    _id: "",
  });
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    getBlogList();

    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    getBlogList(newPage + 1, rowsPerPage, searchValue);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(+event.target.value);
    // setPage(0);

    getBlogList(1, event.target.value, searchValue);
    console.log("checkrows");
    console.log(parseInt(event.target.value, 10));
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const fetchSubcategoryList = async () => {
  //     try {
  //         let { data } = await axios.get("supermarket/get_subCategories");
  //         setSubcategoryList(
  //             data.data.map((item) => {
  //                 return { label: item.subcategory_name, value: item._id };
  //             })
  //         );
  //     } catch (error) {
  //         console.log(error);
  //         toast.error("Something went wrong.", {
  //             position: toast.POSITION.TOP_RIGHT,
  //         });
  //     }
  // };

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
        mobileNumber.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        email.toLowerCase().includes(searchedVal.target.value.toLowerCase())
        // sequenceId.toLowerCase().includes(searchedVal.target.value.toLowerCase())
      );
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    getBlogList(page + 1, rowsPerPage, searchValue);
    // getBlogList()
  };

  const recordsAfterPagingAndSorting = () => {
    return stableSort(tableData, getComparator(order, orderBy));
    //  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const handleSortRequest = (cellId) => {
    console.log(cellId);
    console.log(orderBy);
    const isAsc = orderBy === cellId && order === "asc";
    // stableSort(tableData, getComparator(order, cellId))
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
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

  const blogBlocked = async (e) => {
    // console.log(e);
    if (e.categoryBlocked === true) {
      if (window.confirm("Are you sure you want to unblock this blog?")) {
        try {
          const { data } = await axios.post("/admin/block_unblock_blog", {
            blog_id: e.categoryId,
            isBlocked: false,
          });
          getBlogList(page + 1, rowsPerPage, searchValue);
          // getBlogList()
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // getCategory();
      }
    } else if (e.categoryBlocked === false) {
      if (window.confirm("Are you sure you want to block this blog?")) {
        try {
          const { data } = await axios.post("/admin/block_unblock_blog", {
            blog_id: e.categoryId,
            isBlocked: true,
          });
          getBlogList(page + 1, rowsPerPage, searchValue);
          // getBlogList();
          toast.success(data.message, {
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
  const deleteBlog = async (e) => {
    // console.log(e);

    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const { data } = await axios.delete(`/admin/delete_blog?blog_id=${e.categoryId}`);
        getBlogList(page + 1, rowsPerPage, searchValue);
        // getBlogList()
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // getCategory();
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
  const getBlogList = async (page = 1, rowsPerPage = 15, searchValue = "", isApproved = 0) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/admin/getAssociateMember?page=${page}&pageSize=${rowsPerPage}&searchTerm=${searchValue}&isApproved=${isApproved}`
      );
      setTableData(data.data.docs);
      setSearchedData(data.data.docs);
      setTotalData(data.data.totalDocs);
      setPage(page - 1);
      setRowsPerPage(rowsPerPage);
      setIsLoading(false);

      // if (data.data.length === 0) {
      //   toast.error("No Data Found", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      // }
      console.log(data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      if (err.response.status === 401 || err.response.status === 500) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
    }
  };
  // const getFilteredUserList = async () => {
  //   console.log("fire");

  //   try {
  //     const { data } = await axios.get(`/admin/userList?fromDate=${startDate}&endDate=${endDate}&dateFilter=${datefiltervalue}`);
  //     setTableData(data.data);
  //     setSearchedData(data.data);

  //     console.log(data);

  //   } catch (err) {
  //     console.log(err);

  //   }
  // };
  // const getFilteredUserListWeekAndMonth = async () => {
  //   console.log("fire");

  //   try {
  //     const { data } = await axios.get(`/admin/userList?dateFilter=${datefiltervalue}`);
  //     setTableData(data.data);
  //     setSearchedData(data.data);

  //     console.log(data);

  //   } catch (err) {
  //     console.log(err);

  //   }
  // };
  console.log(startDate, "idharrrrr--------------******");

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
    let { value: value1 } = e.target;
    setSearchValue(value1);
    // const FormatedDate = getDateFormat(startDate, endDate);
    getBlogList(page + 1, rowsPerPage, value1.toLowerCase(), value);
    // console.log(value)
  });
  console.log("page", page);
  const handleSubmit = async (values) => {
    console.log(values);
    // if (!id) {
    //   //add profile

    let addUrl = `/admin/create_blog`;
    let BlogData;

    BlogData = {
      date: values.date,
      title: values.title,

      image: values.file[0],
      link: values.link,
      description: values.description,
    };

    try {
      const { data } = await axios.post(addUrl, BlogData);
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getBlogList();
      setBlogData({
        date: "",
        title: "",

        file: [],
        link: "",
        description: "",
        _id: "",
      });
    } catch (err) {
      if (err.response.status == "400") {
        toast.error(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    // } else {

    // }
  };
  const handleEditBlog = async (values) => {
    //   //update profile

    let updateUrl = `/admin/update_blog`;
    let BlogData;

    BlogData = {
      date: values.date,
      title: values.title,

      image: values.file[0],
      link: values.link,
      description: values.description,
      blog_id: values._id,
    };

    try {
      const { data } = await axios.patch(updateUrl, BlogData);
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getBlogList();
      setBlogData({
        date: "",
        title: "",

        file: [],
        link: "",
        description: "",
        _id: "",
      });
    } catch (err) {
      if (err.response.status == "400") {
        toast.error(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      console.log(err.response);
    }
  };
  const ApproveOrDisapprove = async (status, id) => {
    if (status === "approve") {
      try {
        const { data } = await axios.post(`/admin/approveDisapproveAssociateMember`, {
          user_id: id,
          isApproved: 1,
        });

        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getBlogList();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await axios.post(`/admin/approveDisapproveAssociateMember`, {
          user_id: id,
          isApproved: 2,
        });
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getBlogList();
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading>
              <MenuAndBack>
                <DashHeading>Approval Management</DashHeading>
              </MenuAndBack>
              <div style={{ display: "flex", gap: "1rem" }}>
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
                      // value={searched}
                      placeholder="Search"
                    ></SearchInput>
                  </SearchBar>
                </SearchContainer>
                {/* <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Create Blog </span>} arrow>
                  <IconButton
                    className=""
                    style={{
                      background: "transparent linear-gradient(90deg, #012844 0%, #012844 100%) 0% 0% no-repeat padding-box",
                      color: "#fff",
                    }}
                    onClick={() => {
                      // history.push({
                      //   pathname: `/adminPanel/category/AddEditCategory`,
                      // });
                      setOpenModal(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip> */}
                {/* <div style={{ position: "relative" }}>
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Filter</span>} arrow>
                    <IconButton
                      className=""
                      style={{
                        background: "transparent linear-gradient(90deg, #012844 0%, #012844 100%) 0% 0% no-repeat padding-box",
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
<div style={{display:"flex",justifyContent:"space-around",gap:"5px"}}>
<input type="radio" id="week" name="dateFilter" value="1" onClickCapture={(e)=>setDateFilter(e.target.value)} style={{cursor:"pointer"}}/>
  <label style={{color:"black",cursor:"pointer",flex:1}} for="week">This Week</label><br/>
</div>
<div style={{display:"flex",justifyContent:"space-around",gap:"5px"}}>
<input type="radio" id="month" name="dateFilter" value="2" onClickCapture={(e)=>setDateFilter(e.target.value)} style={{cursor:"pointer"}}/>
  <label style={{color:"black",cursor:"pointer",flex:1}} for="month">This Month</label><br/>
</div>
<div style={{display:"flex",justifyContent:"space-around",gap:"5px"}} >
<input type="radio" id="custom" name="dateFilter" value="3" onClickCapture={(e)=>setDateFilter(e.target.value)} style={{cursor:"pointer"}}/>
  <label style={{color:"black",cursor:"pointer",flex:1}} for="custom">Custom</label><br/>
</div>

                        {datefiltervalue==3?<div>
                          <div ><span style={{ color: "black" }}>From:</span>
                        <DatePicker
                          value={startDate}
                          format="dd/MM/yyyy"
                          // showLeadingZeros={true}
                          onChange={(date) => {
                            setStartDate(date);
                          }}
                        /></div>
                        <div><span style={{ color: "black" }}>To:</span>
                        <DatePicker
                          onChange={(date) => {
                            setEndDate(date);
                            
                          }}
                          minDate={startDate}
                          value={endDate}
                          format="dd/MM/yyyy"
                        /></div></div>:false}

                        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
                          <span
                            style={{
                              background:
                                "transparent linear-gradient(90deg, #ff781f 0%, #ff8b3d 100%) 0% 0% no-repeat padding-box",

                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              if(datefiltervalue==3){
                              if (startDate === null && endDate === null) {
                                toast.info("Please Select Both Dates To Get Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              } else if (startDate === null || endDate === null) {
                                toast.info("Please Select Both Dates To Get Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              } else if (startDate !== null && endDate !== null) {
                                setShowFilter(false);
                                // getFilteredUserList();
                                getBlogList(page+1,rowsPerPage,"")
                              }
                            }else{
                              // getFilteredUserListWeekAndMonth();
                              // setShowFilter(false);
                              if(datefiltervalue==1){
                                getBlogList(page+1,rowsPerPage,"")
                              }
                              else if(datefiltervalue==2){
                                getBlogList(page+1,rowsPerPage,"")
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
                                "transparent linear-gradient(90deg, #ff781f 0%, #ff8b3d 100%) 0% 0% no-repeat padding-box",
                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              setStartDate(null);
                              setEndDate(null);
                              setDateFilter()
                              getBlogList();
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
                </div> */}
              </div>
            </DashboardHeading>

            <Paper className={classes.paperTableHeight} style={{ overflow: "hidden", height: "100%", marginBottom: "0.5rem" }}>
              <div>
                {" "}
                <Tabs value={value} onChange={handleChange} className="TabCustomColor" textColor="primary" centered>
                  <Tab label="Pending" onClick={() => getBlogList(page + 1, rowsPerPage, searchValue, 0)} />
                  <Tab label="Approved" onClick={() => getBlogList(page + 1, rowsPerPage, searchValue, 1)} />
                  <Tab label="Disapproved" onClick={() => getBlogList(page + 1, rowsPerPage, searchValue, 2)} />
                </Tabs>
                <TableContainer className={classes.tableContainerHeight}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tablePadding} style={{ fontWeight: "800" }}>
                          S.&nbsp;No.
                        </TableCell>
                        <TableCell className={classes.tablePadding}>Name</TableCell>

                        <TableCell className={classes.tablePadding}>Email</TableCell>
                        <TableCell className={classes.tablePadding}>Mobile Number</TableCell>
                        <TableCell className={classes.tablePadding}>Description</TableCell>

                        {value === 2 || value === 1 ? false : <TableCell className={classes.tablePadding}>Actions</TableCell>}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        // tableData
                        recordsAfterPagingAndSorting().map((category, index) => (
                          <TableRow key={category._id}>
                            <TableCell component="th" scope="row" className={classes.textMiddle}>
                              {index + 1 + page * rowsPerPage}
                            </TableCell>
                            <TableCell className={classes.textMiddle} style={{ textTransform: "capitalize" }}>
                              {/* <div>{dateOfJoining(category.createdAt)}</div> */}
                              <div> {get(category, "name", "N/A")}</div>
                            </TableCell>

                            <TableCell className={classes.textMiddle}>
                              <div>{get(category, "email", "N/A")}</div>
                            </TableCell>
                            <TableCell className={classes.textMiddle}>
                              {get(category, "countryCode", "")}
                              {get(category, "mobileNumber", "N/A")}
                            </TableCell>

                            <Tooltip title={NameText === category._id ? "Click to Hide" : "Click to View"} arrow>
                              <TableCell
                                onClick={() => setNameText(NameText === category._id ? null : category._id)}
                                style={{
                                  textAlign: "center",
                                  whiteSpace: NameText === category._id ? "" : "nowrap",
                                  maxWidth: "150px",
                                  overflow: NameText === category._id ? "" : "hidden",
                                  textOverflow: NameText === category._id ? "" : "ellipsis",
                                  cursor: "pointer",
                                  textTransform: "capitalize",
                                }}
                                className={classes.textMiddle}
                              >
                                {get(category, "description", "N/A")}
                                {/* <CroppedText text={`${get(category, "location", "N/A")}`} bool={locationText} /> */}
                              </TableCell>
                            </Tooltip>

                            {value === 2 || value === 1 ? (
                              false
                            ) : (
                              <TableCell className={classes.tableFlex}>
                                <div>
                                  <Tooltip title={"Approve"} arrow>
                                    <Button
                                      // variant="outlined"
                                      aria-label="Approve"
                                      // className={classes.Marginbutton}
                                      onClick={() => {
                                        ApproveOrDisapprove("approve", category._id);
                                      }}
                                    >
                                      <CheckIcon style={{ color: "green" }} />
                                    </Button>
                                  </Tooltip>
                                </div>
                                <div>
                                  <Tooltip title={"Disapprove"} arrow>
                                    <Button
                                      // variant="outlined"
                                      aria-label="Disapprove"
                                      // className={classes.Marginbutton}
                                      onClick={() => {
                                        ApproveOrDisapprove("disapprove", category._id);
                                      }}
                                    >
                                      <CloseIcon style={{ color: "red" }} />
                                    </Button>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {
                // total_data === 0
                tableData.length === 0 ? <Nodata TextToDisplay="No Data Found." fontSize="24px" /> : false
              }
              <TablePagination
                className={classes.tablePaginationStyle}
                rowsPerPageOptions={[15, 30, 100]}
                component="div"
                count={total_data}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </DashboardWrapper>
        </DashboardContainer>
      </div>
      <Modal
        maxWidth="lg"
        width="440px"
        RoundedCorners={true}
        isOpen={openModal}
        // RoundedCorners={true}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
            setBlogData({
              date: "",
              title: "",

              file: [],
              link: "",
              description: "",
              _id: "",
            });
            // if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            //   console.log(reason);
            //   setOpenModal(true);
            // } else {
            //   setOpenModal(false);
          }
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="my-3"
              style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}
            >
              {!BlogData._id ? `Add Blog` : `Edit Blog`}
            </div>
            <div className="">
              <SlClose
                style={{
                  // fontSize: "1.5rem",
                  position: "absolute",
                  top: 16,
                  right: 16,
                  // color: "#fff",
                  // borderRadius: "50%",
                  // backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenModal(false);
                  // setSelectedPetCategoryData(null);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={BlogData}
              enableReinitialize
              initialValues={BlogData}
              validate={BlogDataValidator}
              validateOnChange
              // onSubmit={handleSubmit}
              onSubmit={(values) => {
                if (values._id) {
                  handleEditBlog(values);
                } else {
                  handleSubmit(values);
                }
              }}
            >
              {(formikBag) => {
                return (
                  <Form style={{ margin: "1rem 1rem 0 1rem" }}>
                    <div className="signup-cont">
                      <div className="row">
                        {/* <div className="col-md-12"> */}
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Date</label>
                          <Field name="date">
                            {({ field }) => (
                              <div className="pb-2 mt-1 ">
                                <Input
                                  {...field}
                                  type="Customdate"
                                  // variant="outlined"
                                  value={formikBag.values.date}
                                  minDate={new Date()}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("date", e);
                                  }}
                                  error={formikBag.touched.date && formikBag.errors.date ? formikBag.errors.date : null}
                                  // className="form-control"
                                  // placeholder="Date"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Title</label>
                          <Field name="title">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.title}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("title", e.target.value);
                                  }}
                                  error={formikBag.touched.title && formikBag.errors.title ? formikBag.errors.title : null}
                                  className="form-control"
                                  placeholder="Title"
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Description</label>
                          <Field name="description">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.description}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("description", e.target.value);
                                  }}
                                  error={
                                    formikBag.touched.description && formikBag.errors.description
                                      ? formikBag.errors.description
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Description"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Link</label>
                          <Field name="link">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.link}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("link", e.target.value);
                                  }}
                                  error={formikBag.touched.link && formikBag.errors.link ? formikBag.errors.link : null}
                                  className="form-control"
                                  placeholder="Link"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label>Image</label>
                          <Field name="file">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={formikBag.values.file}
                                  onDelete={(image) => {
                                    var images = [...formikBag.values.file];
                                    images.splice(images.indexOf(image), 1);
                                    formikBag.setFieldValue("file", images);
                                  }}
                                  type="text"
                                  label="upload_products_facility_photos"
                                  info="eg_img"
                                  onChange={async (e) => {
                                    const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
                                    if (fileSize > 2) {
                                      alert("ex_2mb");
                                      // $(file).val(''); //for clearing with Jquery
                                    } else {
                                      // setIsLoading(true);
                                      var image = await handleImageUpload(e.target.files[0]);
                                      var images = [...formikBag.values.file];
                                      console.log("images..........", images.path);
                                      images.push(image);
                                      formikBag.setFieldValue("file", images);

                                      // setIsLoading(false);
                                    }
                                  }}
                                  error={formikBag.touched.file && formikBag.errors.file ? formikBag.errors.file : null}
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        {/* <div className="row">
                            <div className="col-md-12">
                              <label className={classes.offerLabel}>Features</label>
                              <Field name="feature1">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="test"
                                      variant="outlined"
                                      value={formikBag.values.feature1}
                                      onChange={(e) => {
                                        formikBag.setFieldValue("feature1", e.target.value);
                                      }}
                                      error={
                                        formikBag.touched.feature1 && formikBag.errors.feature1
                                          ? formikBag.errors.feature1
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="First Feature"
                                    />
                                  </div>
                                )}
                              </Field>

                              <Field name="feature2">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="test"
                                      variant="outlined"
                                      value={formikBag.values.feature2}
                                      onChange={(e) => {
                                        formikBag.setFieldValue("feature2", e.target.value);
                                      }}
                                      error={
                                        formikBag.touched.feature2 && formikBag.errors.feature2
                                          ? formikBag.errors.feature2
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Second Feature"
                                    />
                                  </div>
                                )}
                              </Field>

                              <Field name="feature3">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="test"
                                      variant="outlined"
                                      value={formikBag.values.feature3}
                                      onChange={(e) => {
                                        formikBag.setFieldValue("feature3", e.target.value);
                                      }}
                                      error={
                                        formikBag.touched.feature3 && formikBag.errors.feature3
                                          ? formikBag.errors.feature3
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Third Feature "
                                    />
                                  </div>
                                )}
                              </Field>
                            </div>
                          </div> */}
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-12" style={{ display: "flex", justifyContent: "center" }}>
                        <HeadingButton type="submit" style={{ padding: "0.5em 2em" }}>
                          Save
                        </HeadingButton>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </>
        }
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OfferManagement));
