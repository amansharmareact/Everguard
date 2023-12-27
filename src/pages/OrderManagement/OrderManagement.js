import React, { useState, useEffect, useRef } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";
import * as FaIcons from "react-icons/fa";
import Select from "react-select";
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
  LeftRight,
  RightLeft,
  CloseLabel,
  CloseContainer,
} from "./OrderElements";
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
import { AiOutlineClose } from "react-icons/ai";

import * as IoIcons from "react-icons/io";
import * as HiIcons from "react-icons/hi";
import { add, get, isEmpty } from "lodash";
import classNames from "classnames";
// import Select from "../../components/Select";
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
import {
  DeleteOutline,
  Edit,
  EditAttributesOutlined,
} from "@material-ui/icons";
import moment from "moment";
import { CSVLink, CSVDownload } from "react-csv";
import { TiExport } from "react-icons/ti";
import AddIcon from "@material-ui/icons/Add";
import DatePicker from "react-date-picker";
import { BsFilter } from "react-icons/bs";
import { Modal } from "../../components/Modal";
import PhoneInput from "../../components/PhoneInput";
import { deliveryBoyDataValidator } from "../../utils/validators";
import { RiLockPasswordFill } from "react-icons/ri";
import Nodata from "../../components/Nodata";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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
    maxHeight: "50vh",
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
  const {
    location: { state },
  } = history;
  const classes = useStyles();
  const exportRef = useRef(null);
  let { merchant_id } = useParams();
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [status, setStatus] = useState("");



  const [statusId, setStatusId] = useState(null);

  const [addressDisplayData, setAddressDisplayData] = useState({
    addressLine1: "",
    addressLine2: "N/A",
    state: "N/A",
    district: "N/A",
    landmark: "N/A",
    pincode: "N/A",
    alternatePhone: "N/A",
    _id: "",
  });

  const [orderStatusonPageNavigate, setOrderStatusonPageNavigate] =
    useState("ongoing");
  const [openModal, setOpenModal] = useState(false);
  const [deliveryBoyData, setDeliveryBoydata] = useState({
    firstName: "",
    lastName: "",

    mobileNum: "",
    password: "",
    email: "",
    countryCode: "",
    _id: "",
  });
  const [edit, setEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [datefiltervalue, setDateFilter] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [defaultState, setDefaultState] = useState({
    isAddMenu: "",
    isRestaurantDetails: "",
  });
  const [menuState, setMenuState] = useState({
    isOfferVoucher: true,
    isAddOffer: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [offersData, setOffersData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [showStatus, setShowStatus] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [orderDetails, setOrderDetails] = useState({
    id: "",
    status: "",
  });
  const [statusTitle, setStatusTitle] = useState(true);
  const [orderVal, setOrderVal] = useState("active");
  // const [activeCheckbox, setActiveCheckbox] = useState(1);

  // const handleCheckboxChange = (checkboxNumber) => {
  //   if (checkboxNumber === activeCheckbox) {
  //     setActiveCheckbox(checkboxNumber + 1);
  //   }
  // };
  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  // useEffect(() => {
  //   getOrderListing();
  // }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSelectChange = async (selectedOption) => {
    
    setSelectedOption(selectedOption);
    setStatusTitle(false);
    try{
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/order-filter?&status=${selectedOption.value}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(data.data)
      setTableData(data.data);
      setSearchedData(data.data);
    }
    catch(e){
      console.log(e)
    }
  };


  // const handleCheckboxChange = (checkboxName) => {
  //   setCheckboxStates((prevStates) => ({
  //     ...Object.fromEntries(
  //       Object.keys(prevStates).map((name) => [name, name === checkboxName])
  //     ),
  //   }));
  // };
  // console.log(checkboxStates, "this is state of checkbox");

  const SearchUser = (searchedVal) => {
    const filteredRows = searchedData.filter((row) => {
      let id = row.productId;
      let name = row.shippingDetails?.fullName;

      return (
        name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        id.includes(searchedVal.target.value.toLowerCase())
      );
    });
    setTableData(filteredRows);
  };

  const recordsAfterPagingAndSorting = () => {
    return stableSort(tableData, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
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

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(orderVal)
  };
 

  const getOrderListing = async (orderVal) => {
    setIsLoading(true);
    setActiveTab(orderVal);

    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.get(`/admin/get-orders`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log(data.data[orderStatus]);
      console.log(data.data);

      setTableData(data.data[orderVal]);
      setSearchedData(data.data[orderVal]);
      setIsLoading(false);
      // setOrderStatusonPageNavigate(orderVal);

      // console.log(tableData);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    setOrderVal(orderVal)
    console.log(orderVal);
    getOrderListing(orderVal);
  }, [orderVal]);
  const getFilteredOrderListing = async () => {
    const formatStartDate = moment(startDate).format("YYYY-MM-DD");
    const formatEndDate = moment(endDate).format("YYYY-MM-DD");
    if(orderVal==='active')
    {
      if (datefiltervalue === 3) {
        const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/order-filter?filterType=${datefiltervalue}&status=ACTIVE`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("data hai ", selectedOption);
      setTableData(data.data);
      setSearchedData(data.data);
      // console.log(data.data)
    } 
      else{
        try {
          const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `/admin/order-filter?filterType=${datefiltervalue}&to_date=${formatEndDate}&from_date=${formatStartDate}&status=ACTIVE`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log("data hai ", selectedOption);
        setTableData(data.data);
        setSearchedData(data.data);
      } catch (err) {
        console.log(err);
      }
      }
    }
    if(orderVal==='past')
    {
      if (datefiltervalue === 3) {
        const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/order-filter?filterType=${datefiltervalue}&status=DELIVERED`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("data hai ", selectedOption);
      setTableData(data.data);
      setSearchedData(data.data);
      // console.log(data.data)
    } 
      else{
        try {
          const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `/admin/order-filter?filterType=${datefiltervalue}&to_date=${formatEndDate}&from_date=${formatStartDate}&status=DELIVERED`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log("data hai ", selectedOption);
        setTableData(data.data);
        setSearchedData(data.data);
      } catch (err) {
        console.log(err);
      }
      }
    }

    if(orderVal==='cancelled')
    {
      if (datefiltervalue === 3) {
        const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/order-filter?filterType=${datefiltervalue}&status=CANCELLED`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("data hai ", selectedOption);
      setTableData(data.data);
      setSearchedData(data.data);
      // console.log(data.data)
    } 
      else{
        try {
          const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `/admin/order-filter?filterType=${datefiltervalue}&to_date=${formatEndDate}&from_date=${formatStartDate}&status=CANCELLED`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log("data hai ", selectedOption);
        setTableData(data.data);
        setSearchedData(data.data);
      } catch (err) {
        console.log(err);
      }
      }
    }
 
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

  const options = [
    { value: "ORDER_PLACED", label: "ORDER PLACED" },
    { value: "SHIPPED", label: "SHIPPED" },
    { value: "PACKED", label: "PACKED" },
    { value: "OUT_FOR_DELIVERY", label: "OUT FOR DELIVERY" },
  ];

  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading
              style={{ display: "flex", flexDirection: "column", padding: 0 }}
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
                <FaIcons.FaListOl style={{ fontSize: "25px", margin: "8px" }} />
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Order Management
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
                        // value={searched}
                        placeholder="Search by Name and Id"
                      ></SearchInput>
                    </SearchBar>
                  </SearchContainer>
                </div>
                <div className="d-flex flex-column">
                  <div>
                    <Tooltip
                      title={
                        <span style={{ color: "white", fontSize: "16px" }}>
                          Filter
                        </span>
                      }
                      arrow
                    >
                      <div class="dropdown">
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
                      </div>
                    </Tooltip>

                    {showFilter ? (
                      <div
                        className="box arrow-top"
                        id="yourFilterMenuId"
                        style={{
                          display: "flex",
                          position: "absolute",
                          backgroundColor: "whitesmoke",
                          zIndex: 12,
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
                            margin: "25px",
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
                                  format="dd/MM/yyyy"
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
                                background: "#012844",

                                color: "#fff",
                                cursor: "pointer",
                                borderRadius: "5px",
                                padding: "5px 10px",
                              }}
                              onClick={() => {
                                getFilteredOrderListing();
                                setShowFilter(!showFilter);
                              }}
                            >
                              {" "}
                              Apply
                            </span>
                            <span
                              style={{
                                background: "#012844",
                                color: "#fff",
                                cursor: "pointer",
                                borderRadius: "5px",
                                padding: "5px 10px",
                              }}
                              onClick={() => {
                                setStartDate(null);
                                setEndDate(null);
                                setDateFilter();
                                getOrderListing(orderVal);
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
              </div>

              <div
                className={`d-flex gap-4 align-items-center justify-content-end ${classes.statusContainer}`}
                style={{ width: "100%", padding: "1rem 0rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    className="TabCustomColor"
                    // TabIndicatorProps={{
                    //   style: {
                    //     backgroundColor: "red",
                    //   },
                    // }}
                    // indicatorColor="#bb2649"
                    textColor="primary"
                    centered
                  >
                    <Tab
                      style={{
                        border: "1px solid #012844",
                        backgroundColor:
                          activeTab === "active" ? "#012844" : "white",
                        color: activeTab === "active" ? "white" : "#012844",
                      }}
                      label="Ongoing Order"
                      onClick={() => {
                        setSelectedOption("");
                        setShowStatus(true);
                        setOrderVal("active");
                        getOrderListing(orderVal);
                      }}
                    />

                    <Tab
                      style={{
                        borderTop: "1px solid #012844",
                        borderBottom: "1px solid #012844",
                        backgroundColor: "red",
                        backgroundColor:
                          activeTab === "past" ? "#012844" : "white",
                        color: activeTab === "past" ? "white" : "#012844",
                      }}
                      label="Completed Order"
                      onClick={() => {
                        setSelectedOption("DELIVERED");
                        setShowStatus(false);
                        setOrderVal("past");
                        getOrderListing(orderVal);
                      }}
                    />

                    <Tab
                      style={{
                        border: "1px solid #012844",
                        backgroundColor:
                          activeTab === "cancelled" ? "#012844" : "white",
                        color: activeTab === "cancelled" ? "white" : "#012844",
                      }}
                      label="Cancelled Order"
                      onClick={() => {
                        setSelectedOption("CANCELLED");
                        setShowStatus(false);
                        setOrderVal("cancelled");
                        getOrderListing(orderVal);
                      }}
                    />
                  </Tabs>
                </div>
                <div
                  style={{
                    zIndex: "10",
                    cursor: "pointer",
                    width: "224px",
                    color: "rgb(1,40,68)",
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                >
                  {showStatus && (
                     <div className="d-flex justify-content-end w-100 mt-3">
                     <div
                       style={{
                         zIndex: "10",
                         cursor: "pointer",
                         width: "224px",
                         color: "rgb(1,40,68)",
                         fontSize: "14px",
                         borderRadius: "5px",
                         marginRight:"10px"
                       }}
                     >
                       <Select
                         style={{ paddingRight: "14px" }}
                         // defaultValue={selectedOption}
                         placeholder={"Status"}
                         isSearchable={false}
                         onChange={handleSelectChange}
                         options={options}
                         value={selectedOption}
                       />
     
                      
                     </div>
                     <span
                                 style={{
                                  display:"flex",
                                  alignItems:"center",
                                   background: "#012844",
                                   color: "#fff",
                                   cursor: "pointer",
                                   borderRadius: "5px",
                                   padding: "5px 10px",
                                 }}
                                 onClick={() => {
                                  getOrderListing(orderVal);
                                  setSelectedOption('')
                                 }}
                               >
                                 {" "}
                                 Reset
                               </span>
                     </div>
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
              <div>
                {/* <Tabs
                  value={value}
                  onChange={handleChange}
                  className="TabCustomColor"
                  // TabIndicatorProps={{
                  //   style: {
                  //     backgroundColor: "#bb2649",
                  //   },
                  // }}
                  // indicatorColor="#bb2649"
                  textColor="primary"
                  centered
                >
                  <Tab label="Ongoing" onClick={()=>getOrderListing("ongoing")} />
                  <Tab label="Completed" onClick={()=>getOrderListing("completed")}/>
                  <Tab label="Cancelled" onClick={()=>getOrderListing("cancelled")}/>
                </Tabs> */}
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
                          Date & Time
                          {/* </TableSortLabel> */}
                        </TableCell>
                        {/* <TableCell className={classes.tablePadding}>Agent Id</TableCell> */}
                        <TableCell className={classes.tablePadding}>
                          {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "firstName" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("firstName");
                          }}
                        > */}
                          Id
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
                          User Name
                          {/* </TableSortLabel> */}
                        </TableCell>
                        {/* <TableCell className={classes.tablePadding}>
                          {/* <TableSortLabel
                            active={true}
                            direction={orderBy === "item" ? order : "asc"}
                            onClick={() => {
                              handleSortRequest("item");
                            }}
                          > */}
                        {/* Merchant Id & Shop Name */}
                        {/* </TableSortLabel> */}
                        {/* </TableCell> */}
                        {/* <TableCell className={classes.tablePadding}>
                          <TableSortLabel
                          active={true}
                          direction={orderBy === "mobileNumber" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("mobileNumber");
                          }}
                        >
                          Agent Id & Agent Name
                          </TableSortLabel>
                        </TableCell> */}
                        <TableCell className={classes.tablePadding}>
                          {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "mobileNumber" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("mobileNumber");
                          }}
                        > */}
                          Status
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
                          Amount
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
                          Action
                          {/* </TableSortLabel> */}
                        </TableCell>

                        {/* <TableCell className={classes.tablePadding}>Actions</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((category, index) => (
                        <TableRow key={category._id}>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.textMiddle}
                          >
                            {index + 1 + page * rowsPerPage}
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>
                              {" "}
                              {moment(category?.createdAt).format("DD/MM/YYYY")}
                            </div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "shippingDetails._id", "N/A")}</div>
                          </TableCell>

                          <TableCell
                            className={classes.textMiddle}
                            style={{ textTransform: "capitalize" }}
                          >
                            <div>
                              {get(category, "shippingDetails.fullName", "N/A")}
                            </div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>
                              {get(category, "status", "N/A").replace(
                                /_/g,
                                " "
                              )}
                            </div>
                          </TableCell>

                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "totalAmount", "N/A")}</div>
                          </TableCell>

                           <Tooltip title={"View Details"}>
                          <TableCell className={classes.tableFlex}>
                            <div style={{ padding: "6px" }}>
                              {" "}
                              <Button
                                aria-label="add"
                                className={classes.Marginbutton}
                              >
                                <Link
                                  to={`/adminPanel/order-details/${category._id}`}
                                >
                                  <VisibilityIcon color="#012844" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                          </Tooltip>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {tableData.length === 0 ? (
                <Nodata TextToDisplay="No Data Found." fontSize="24px" />
              ) : (
                false
              )}
              <TablePagination
                className={classes.tablePaginationStyle}
                rowsPerPageOptions={[15, 25, 100]}
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
      {/* <Modal
        maxWidth="lg"
        width="540px"
        RoundedCorners={true}
        isOpen={openModalAddress}
        onClose={(event, reason) => {
          setOpenModalAddress(false);
          setOrderDetails({
            id: "",
            status: "",
          });
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="my-3"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "22px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Order Status
            </div>
            <div className="">
              <AiOutlineClose
                style={{
                  fontSize: "1.5rem",
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#fff",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenModalAddress(false);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={orderDetails}
              enableReinitialize
              initialValues={orderDetails}
              validateOnChange
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {(formikBag) => {
                console.log(formikBag.values, "this si values");
                return (
                  <Form style={{ margin: "0.5rem 1rem 0 1rem" }}>
                    <div className="signup-cont">
                      <div className="row">
                        <div className="col-md-12 d-flex align-items-center">
                          <Field name="title">
                            {({ field }) => (
                              <div style={{ margin: "20px" }}>
                                <Input
                                  {...field}
                                  type="checkbox"
                                  checked={checkboxStates.ORDER_PLACED}
                                  value={"ORDER_PLACED"}
                                  checked={activeCheckbox >= 1}
                                
                                  onChange={() => handleCheckboxChange(1)} 
                                  onChange={() =>
                                    handleCheckboxChange("ORDER_PLACED")

                                  }
                                  value={serviceValueFoodDelivery(formikBag.values.service_type)}
                                  onChange={(e) => {}}
                                  checked={serviceValueFoodDelivery(
                                    formikBag.values.service_type
                                  )}
                                  noBorderBottom={true}
                                />
                              </div>
                            )}
                          </Field>
                          <label className={classes.offerLabel}>
                            Order Placed
                          </label>
                        </div>
                        <div className="col-md-12 d-flex align-items-center">
                          <Field name="title">
                            {({ field }) => (
                              <div style={{ margin: "20px" }}>
                                <Input
                                  {...field}
                                  type="checkbox"
                                  checked={checkboxStates.SHIPPED}
                                  checked={activeCheckbox >= 2}
                                  onChange={() => {  
                                    handleCheckboxChange(1);
                                    console.log(formikBag.values.status);
                                  }}
                                  value={"SHIPPED"} 
                                  onChange={() =>
                                    handleCheckboxChange("SHIPPED")
                                  }
                                  value={serviceValueFoodDelivery(formikBag.values.service_type)}
                                  onChange={(e) => {}}
                                  checked={serviceValueFoodDelivery(
                                    formikBag.values.service_type
                                  )}
                                  noBorderBottom={true}
                                />
                              </div>
                            )}
                          </Field>
                          <label className={classes.offerLabel}>Shipped</label>
                        </div>
                        <div className="col-md-12 d-flex align-items-center">
                          <Field name="title">
                            {({ field }) => (
                              <div style={{ margin: "20px" }}>
                                <Input
                                  {...field}
                                  type="checkbox"
                                  checked={checkboxStates.PACKED}
                                  value={formikBag.values.status}
                                  checked={activeCheckbox >= 3}
                                  onChange={() => {
                                    handleCheckboxChange(2);
                                    console.log(formikBag.values.status);
                                  }}
                                  onChange={() => handleCheckboxChange('PACKED')}
                                  value={serviceValueFoodDelivery(formikBag.values.service_type)}
                                  onChange={(e) => {}}
                                  checked={serviceValueFoodDelivery(
                                    formikBag.values.service_type
                                  )}
                                  noBorderBottom={true}
                                />
                              </div>
                            )}
                          </Field>
                          <label className={classes.offerLabel}>Packed</label>
                        </div>
                        <div className="col-md-12 d-flex align-items-center">
                          <Field name="title">
                            {({ field }) => (
                              <div style={{ margin: "20px" }}>
                                <Input
                                  {...field}
                                  type="checkbox"
                                  checked={checkboxStates.OUT_FOR_DELIVERY}
                                  value={formikBag.values.status}
                                  checked={activeCheckbox >= 4}
                                  onChange={() => {handleCheckboxChange(3)
                                    console.log(formikBag.values.status);}}
                                  onChange={() =>
                                    handleCheckboxChange("OUT_FOR_DELIVERY")
                                  }
                                  value={serviceValueFoodDelivery(formikBag.values.service_type)}
                                  onChange={(e) => {}}
                                  checked={serviceValueFoodDelivery(
                                    formikBag.values.service_type
                                  )}
                                  noBorderBottom={true}
                                />
                              </div>
                            )}
                          </Field>
                          <label className={classes.offerLabel}>
                            Out for Delivery
                          </label>
                        </div>
                        <div className="col-md-12 d-flex align-items-center">
                          <Field name="title">
                            {({ field }) => (
                              <div style={{ margin: "20px" }}>
                                <Input
                                  {...field}
                                  type="checkbox"
                                  checked={checkboxStates.DELIVERED}
                                  value={formikBag.values.status}
                                  checked={activeCheckbox >= 5}
                                  onChange={() => {handleCheckboxChange(4)
                                    console.log(formikBag.values.status);}}
                                  onChange={() =>
                                    handleCheckboxChange("DELIVERED")
                                  }
                                  value={serviceValueFoodDelivery(formikBag.values.service_type)}
                                  onChange={(e) => {}}
                                  checked={serviceValueFoodDelivery(
                                    formikBag.values.service_type
                                  )}
                                  noBorderBottom={true}
                                />
                              </div>
                            )}
                          </Field>
                          <label className={classes.offerLabel}>
                            Delivered
                          </label>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </>
        }
      /> */}

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
