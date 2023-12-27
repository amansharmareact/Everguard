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
} from "./ReferAndEarnElements";
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
  styled,
  Switch,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
import { ReferDataValidator } from "../../utils/validators";
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
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import RSelect from "react-select";
import JoditEditor from "jodit-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Refer.css";
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
const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#012844",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: "block" }} onClick={onClick} />;
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: "block" }} onClick={onClick} />;
}

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
  const [ReferData, setReferData] = useState({
    file: [],
    videoLink: [""],
    videoTitle: "",
    benefits: "",
    _id: "",
  });
  const [categoryListData, setCategoryListData] = useState([]);
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    getVideoList();
    getCategoryList();

    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    getVideoList(newPage + 1, rowsPerPage, searchValue);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(+event.target.value);
    // setPage(0);

    getVideoList(1, event.target.value, searchValue);
    console.log("checkrows");
    console.log(parseInt(event.target.value, 10));
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
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
    getVideoList(page + 1, rowsPerPage, searchValue);
    // getVideoList()
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
          getVideoList(page + 1, rowsPerPage, searchValue);
          // getVideoList()
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
          getVideoList(page + 1, rowsPerPage, searchValue);
          // getVideoList();
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
  const deleteVideo = async (e) => {
    // console.log(e);

    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        const { data } = await axios.delete(`/admin/removereferEarnContent?content_id=${e.categoryId}`);
        getVideoList(page + 1, rowsPerPage, searchValue);
        // getVideoList()
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
  const getVideoList = async (page = 1, rowsPerPage = 15, searchValue = "", startDate = "", endDate = "", dateFilter = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/admin/getreferEarnContent?page=${page}&pageSize=${rowsPerPage}&searchTerm=${searchValue}`
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

  const getCategoryList = async () => {
    try {
      const { data } = await axios.get(`/admin/getCategory`);
      if (data.data.docs) {
        const listFilter = data.data.docs.filter((ele) => ele.isBlocked === false);
        const newarr = listFilter.map((ele) => ({ label: ele.name, value: ele._id }));
        setCategoryListData(newarr);
      }
    } catch (error) {
      console.log(error);
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
    let { value } = e.target;
    setSearchValue(value);
    // const FormatedDate = getDateFormat(startDate, endDate);
    getVideoList(page + 1, rowsPerPage, value.toLowerCase());
    // console.log(value)
  });
  console.log("page", page);
  const handleSubmit = async (values) => {
    console.log(values);
    // if (!id) {
    //   //add profile

    let addUrl = `/admin/createreferEarnContent`;
    let ReferData;

    ReferData = {
      images: values.file,
      videos: values.videoLink,
      description: values.benefits,
      video_description: values.videoTitle,
    };

    try {
      const { data } = await axios.post(addUrl, ReferData);
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getVideoList();
      setReferData({
        file: [],
        videoLink: [""],
        videoTitle: "",
        benefits: "",
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

    let updateUrl = `/admin/updatereferEarnContent`;
    let ReferData;

    ReferData = {
      images: values.file,
      videos: values.videoLink,
      video_description: values.videoTitle,
      description: values.benefits,
      content_id: values._id,
    };

    try {
      const { data } = await axios.patch(updateUrl, ReferData);
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getVideoList();
      setReferData({
        videoLink: [""],
        file: [],
        videoTitle: "",
        benefits: "",
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
  const statusSwitch = async (e, id) => {
    try {
      console.log(id);

      const { data } = await axios.post("/admin/blockUnblockreferEarnContent", {
        content_id: id,
        isBlocked: !e.target.checked,
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });
      getVideoList();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }

    // console.log(e.target.checked);
    // console.log(checked);
    // console.log(id);
  };

  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading>
              <MenuAndBack>
                <DashHeading>Say Something Earn Something</DashHeading>
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
                <Tooltip
                  title={<span style={{ color: "white", fontSize: "16px" }}>Create Say Something Earn Something </span>}
                  arrow
                >
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
                </Tooltip>
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
                                getVideoList(page+1,rowsPerPage,"")
                              }
                            }else{
                              // getFilteredUserListWeekAndMonth();
                              // setShowFilter(false);
                              if(datefiltervalue==1){
                                getVideoList(page+1,rowsPerPage,"")
                              }
                              else if(datefiltervalue==2){
                                getVideoList(page+1,rowsPerPage,"")
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
                              getVideoList();
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
              <TableContainer className={classes.tableContainerHeight}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tablePadding} style={{ fontWeight: "800" }}>
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
                        Image
                        {/* </TableSortLabel> */}
                      </TableCell>
                      {/* <TableCell className={classes.tablePadding}>   <TableSortLabel
                          active={true}
                          direction={orderBy === "sequenceId" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("sequenceId");
                          }}
                        >User Id</TableSortLabel></TableCell> */}
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "firstName" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("firstName");
                          }}
                        > */}
                        Video Title
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
                        Video Link
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "mobileNumber" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("mobileNumber");
                          }}
                        > */}
                        Benefits & Conditions
                        {/* </TableSortLabel> */}
                      </TableCell>

                      <TableCell className={classes.tablePadding}>Actions</TableCell>
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
                          <TableCell className={classes.textMiddle} style={{ maxWidth: "100px" }}>
                            <Slider {...settings}>
                              {category.images.map((ele, i) => (
                                <img src={ele} alt="image" width="30px" height="70px" />
                              ))}
                            </Slider>
                          </TableCell>

                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "video_description", "N/A")}</div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>
                              {category?.videos
                                ? category?.videos.map((ele, i) => (
                                    <div>
                                      <a key={i} target="_blank" href={ele}>
                                        {ele}
                                      </a>
                                    </div>
                                  ))
                                : "N/A"}
                            </div>
                          </TableCell>
                          {/* <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                {get(category, 'quantity', '')}
                                                            </div>
                                                        </TableCell> */}
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
                              <div dangerouslySetInnerHTML={{ __html: get(category, "description", "N/A") }} />
                              {/* <CroppedText text={`${get(category, "location", "N/A")}`} bool={locationText} /> */}
                            </TableCell>
                          </Tooltip>
                          {/* <Tooltip title={LinkNameText === category._id ? "Click to Hide" : "Click to View"} arrow>
                                  <TableCell
                                    onClick={() => setLinkNameText(LinkNameText === category._id ? null : category._id)}
                                    style={{
                                       textAlign: "center",
                                      whiteSpace: LinkNameText === category._id ? "" : "nowrap",
                                      maxWidth: "150px",
                                      overflow: LinkNameText === category._id ? "" : "hidden",
                                      textOverflow: LinkNameText === category._id ? "" : "ellipsis",
                                      cursor: "pointer",
                                      textTransform:"capitalize"
                                    }}
                                    className={classes.textMiddle}
                                  >
                                  {!get(category, "link", "N/A")?"N/A":<a target="_blank" href={get(category, "link", "")}/>}
                                  </TableCell>
                                </Tooltip> */}

                          <TableCell>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                              <div>
                                {" "}
                                <Tooltip
                                  title={
                                    <span className="TooltipCustomSize">{`${
                                      category?.isBlocked == true ? "Inactive" : "Active"
                                    }`}</span>
                                  }
                                  arrow
                                >
                                  <IOSSwitch
                                    onChange={(e) => {
                                      statusSwitch(e, category);
                                    }}
                                    checked={!category.isBlocked}
                                  />
                                </Tooltip>
                              </div>
                              <div>
                                <Tooltip title={"Edit"} arrow>
                                  <Button
                                    // variant="outlined"
                                    aria-label="Edit"
                                    // className={classes.Marginbutton}
                                    onClick={() => {
                                      setReferData({
                                        file: category.images.map((ele) => ele),
                                        videoLink: get(category, "videos", [""]),
                                        videoTitle: get(category, "video_description", ""),
                                        benefits: category.description,
                                        _id: category._id,
                                      });
                                      setOpenModal(true);
                                      // setModalState({ isAddEditTaxiSingle: true });
                                      //             setSelectedTaxiDataAddEdit(category);
                                    }}
                                  >
                                    <Edit />
                                  </Button>
                                </Tooltip>
                              </div>
                              {/* <div>
                              <Tooltip title={category.isBlocked ? "Unblock" : "Block"} arrow>
                                <Button
                                  // variant="outlined"
                                  aria-label="add"
                                  // className={classes.Marginbutton}
                                  onClick={() => {
                                    blogBlocked({ categoryId: category._id, categoryBlocked: category.isBlocked });
                                  }}
                                >
                                  {category.isBlocked === true ? (
                                    // <BlockIcon style={{ color: "red"}} />
                                    <CloseIcon style={{ color: "red" }} />
                                  ) : (
                                    <CheckIcon style={{ color: "green" }} />
                                  )}
                                </Button>
                              </Tooltip>
                            </div> */}
                              <div>
                                <Tooltip title={"Delete"} arrow>
                                  <Button
                                    // variant="outlined"
                                    aria-label="delete"
                                    // className={classes.Marginbutton}
                                    onClick={() => {
                                      deleteVideo({ categoryId: category._id });
                                    }}
                                  >
                                    <DeleteOutline />
                                  </Button>
                                </Tooltip>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
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
        width="640px"
        RoundedCorners={true}
        isOpen={openModal}
        // RoundedCorners={true}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
            setReferData({
              file: [],
              videoLink: [""],
              videoTitle: "",
              benefits: "",
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
              {!ReferData._id ? `Add Say Something Earn Something` : `Edit Say Something Earn Something`}
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
                  setReferData({
                    file: [],
                    videoLink: [""],
                    videoTitle: "",
                    benefits: "",
                    _id: "",
                  });
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={ReferData}
              enableReinitialize
              initialValues={ReferData}
              validate={ReferDataValidator}
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
                          <label>Image</label>
                          <Field name="file">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  id="facility_images"
                                  limit="100"
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
                        <div className="col-md-12">
                          <label className={classes.offerLabel} style={{ marginBottom: "0.5rem" }}>
                            Video Link
                          </label>
                          <Field name="videoLink">
                            {({ field }) => (
                              <>
                                {field.value?.map((desc, idx) => (
                                  <div key={idx} className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      value={field.value[idx]}
                                      onChange={(e) => {
                                        const arr = [...field.value];
                                        console.log("field.value", field.value);
                                        console.log("arr", arr);
                                        arr.splice(idx, 1, e.target.value);
                                        console.log("array after splice", arr);
                                        formikBag.setFieldValue("videoLink", [...arr]);
                                      }}
                                      error={
                                        get(formikBag, "touched.videoLink[" + idx + "]", false) &&
                                        get(formikBag, "errors.videoLink[" + idx + "]", null)
                                      }
                                      className="form-control"
                                      placeholder="Video Link"
                                    />
                                    {idx > 0 && (
                                      <button
                                        type="button"
                                        style={{
                                          marginTop: "5px",
                                          padding: "5px",
                                          borderRadius: "5px",
                                          color: "white",
                                          backgroundColor: "#012844",
                                          borderStyle: "none",
                                        }}
                                        onClick={() => {
                                          const arr = [...field.value];
                                          arr.splice(idx, 1);
                                          formikBag.setFieldValue("videoLink", [...arr]);
                                        }}
                                      >
                                        Remove Video Link
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12" style={{ marginBottom: "2rem" }}>
                          <div>
                            <button
                              type="button"
                              style={{
                                padding: "5px 20px",
                                borderRadius: "5px",
                                color: "white",
                                backgroundColor: "#012844",
                                borderStyle: "none",
                              }}
                              onClick={() => formikBag.setFieldValue("videoLink", [...formikBag.values.videoLink, ""])}
                            >
                              Add Video Link
                            </button>
                          </div>
                        </div>
                        <div className="col-md-12" style={{ marginBottom: "2rem" }}>
                          <label className={classes.offerLabel} style={{ marginBottom: "0.5rem" }}>
                            {" "}
                            Video Title
                          </label>
                          <Field name=" videoTitle">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.videoTitle}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("videoTitle", e.target.value);
                                  }}
                                  error={
                                    formikBag.touched.videoTitle && formikBag.errors.videoTitle
                                      ? formikBag.errors.videoTitle
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Video Title"
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12">
                          <div className="editor-container-1">
                            <label className="label-text" style={{ marginBottom: "1rem" }}>
                              Benefits & Conditions
                            </label>
                            <JoditEditor
                              value={formikBag.values.benefits}
                              name="benefits"
                              onChange={(newContent) => {
                                // SettingData(newContent);

                                formikBag.setFieldValue("benefits", newContent);
                              }}
                            />
                          </div>
                          {formikBag.touched.benefits && formikBag.errors.benefits ? (
                            <p
                              style={{
                                paddingTop: 5,
                                fontSize: 13,
                                color: "red",
                                textAlign: "left",
                              }}
                            >
                              {formikBag.errors.benefits}
                            </p>
                          ) : null}
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
