import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Modal } from "../../components/Modal";
import ModalImage from "react-modal-image";
import Select from "react-select";

import MoreLess from "../../components/MoreLess";
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
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import "./User_Info.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "4px",
  boxShadow: 24,
  padding: "8px 24px 22px",
};
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
    maxHeight: "60vh",
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
  const [open, setOpen] = React.useState(false);
  const [orderVal, setOrderVal] = useState("active");
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [statusTitle, setStatusTitle] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");

  const id = searchParams.get("id");


  const handleSelectChange = async (selectedOption) => {
    
    setSelectedOption(selectedOption);
    setStatusTitle(false);
    try{
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/admin-user-order-filter?&orderType=${selectedOption.value}&user_id=${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setTableData(data.data);
      setSearchedData(data.data);
    }
    catch(e){
      console.log(e)
    }
  };


  const options = [
    { value: "ORDER_PLACED", label: "ORDER PLACED" },
    { value: "SHIPPED", label: "SHIPPED" },
    { value: "PACKED", label: "PACKED" },
    { value: "OUT_FOR_DELIVERY", label: "OUT FOR DELIVERY" },
    { value: "CANCELLED", label: "CANCELLED" },
    { value: "DELIVERED", label: "DELIVERED" },


  ];
  useEffect(() => {
    // if (!userData) {
    //   history.push("/adminPanel");
    // }
    getProductList();
  }, []);

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

  const getProductList = async (
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
        `/admin/see-user-order/${id}?page=0&limit=10`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(data.data);
      if (data.data != null) {
        setTableData(data.data);
        setSearchedData(data.data);
        setTotalData(data.data);
      }

      setPage(page - 1);
      setRowsPerPage(rowsPerPage);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  const getFilteredOrderListing = async () => {
    const formatStartDate = moment(startDate).format("YYYY-MM-DD");
    const formatEndDate = moment(endDate).format("YYYY-MM-DD");
    
      if(datefiltervalue==3)
      {
        console.log('triny')
        try{
          const token = localStorage.getItem("accessToken");
          const { data } = await axios.get(
            `/admin/admin-user-order-filter?filterType=${datefiltervalue}&user_id=${id}&to_date=${formatEndDate}&from_date=${formatStartDate}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          setTableData(data.data);
          setSearchedData(data.data);
        }
        catch(e){
          console.log(e)
        }
      }
       else {
          try {
          const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(
              `/admin/admin-user-order-filter?filterType=${datefiltervalue}&user_id=${id} `,
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
            setTableData(data.data);
            setSearchedData(data.data);
          } catch (err) {
            console.log(err);
          }
        }
      
    }
  

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
      // let id = row._id.slice(-4);
      let name = row.product.name;
      let id = row._id;
      return (
        name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        id.toLowerCase().includes(searchedVal.target.value.toLowerCase())
      );
    });
    // console.log(filteredRows, "nivbe");
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
                <ArrowBackIosIcon
                  style={{ color: "white", margin: "8px", cursor: "pointer" }}
                  onClick={() => history.push(`/adminPanel/userorder?id=${id}`)}
                />
                <DashHeading style={{ color: "white", flex: "1" }}>
                  View orders
                </DashHeading>
              </MenuAndBack>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems:"flex-end",
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
                              getProductList();
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
                              background: "#012844",
                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              getProductList();
                              setSelectedOption('')
                            }}
                          >
                            {" "}
                            Reset
                          </span>
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
                        Date
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "createdAt" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("createdAt");
                          }}
                        > */}
                        Id
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
                        Name
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
                        Image
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
                        Description
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
                        Status
                        {/* </TableSortLabel>  */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Sub Amount
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Tax Amount
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Shipping Amount
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Total Amount
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
                            {moment(category?.createdAt).format("DD/MM/YYYY")}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          {/* <div>{dateOfJoining(category.createdAt)}</div> */}
                          <div>{get(category, "_id", "")}</div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "product.name", "")}
                          </div>
                        </TableCell>
                        {/* <Tooltip title="Click to View" arrow> */}
                        <TableCell
                          style={{ textTransform: "capitalize" }}
                          className="text-center"
                        >
                          <div>
                            <img
                              src={get(category, "product.image", "")}
                              width="35px"
                            />
                            {/* <ModalImage
                                small={get(category, "product.image", "")}
                                large={get(category, "product.image", "")}
                                alt="Image Preview"
                                hideDownload
                                hideZoom
                              /> */}
                          </div>
                        </TableCell>
                        {/* </Tooltip> */}
                        {/* <TableCell
                          className={classes.textMiddle}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "product.description", "").slice(
                              0,
                              35
                            )}
                          </div>
                          <div>
                            <Button
                              style={{ fontSize: "14px", paddingLeft: "0px" }}
                              class="btn btn-link"
                              onClick={() => setOpen(!open)}
                            >
                              ...more
                            </Button>

                            {open && (
                              <div class="modal-container">
                                <div class="modal-content">
                                  <div className="close">
                                <i style={{cursor:"pointer"}} onClick={()=>{setOpen(false)}} class="fa-regular fa-circle-xmark"></i>

                                  </div>
                                  <p>
                                    {get(category, "product.description", "")}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell> */}
                        <Tooltip title={"View Detail Description"} arrow>
                          <TableCell className={classes.textMiddle}>
                            {" "}
                            <MoreLess desc={category.product.description} />
                          </TableCell>
                        </Tooltip>

                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "status", "").replace(/_/g, " ")}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "subAmount", "")}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "taxAmount", "")}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "shippingAmount", "")}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "totalAmount", "")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {tableData.length === 0 || tableData === null ? (
                <Nodata TextToDisplay="No Data Found." fontSize="24px" />
              ) : (
                false
              )}
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
