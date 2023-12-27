import React, { useState, useEffect } from "react";
import { IoMdContact } from "react-icons/io";

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
} from "./ContactUSElements";
import { IoIosContact } from "react-icons/io";

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
import { StoreDataValidator } from "../../utils/validators";
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
const OfferManagement = ({ history, setUsers, userData }) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [datefiltervalue, setDateFilter] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [NameText, setNameText] = useState(null);
  const [LinkText, setLinkText] = useState(null);
  const [LinkNameText, setLinkNameText] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [totaldata, setTotaldata] = useState(90);
  const [categoryList, setCategoryList] = useState([]);
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [StoreData, setStoreData] = useState({
    name: "",
    category: "",
    file: [],
    link: "",
    description: "",
    _id: "",
  });
  const [categoryListData, setCategoryListData] = useState([]);
  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    getStoreList();
    // getCategoryList();

    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    getStoreList(newPage + 1, rowsPerPage, searchValue);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(+event.target.value);
    // setPage(0);

    getStoreList(1, event.target.value, searchValue);
    console.log("checkrows");
    console.log(parseInt(event.target.value, 10));
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
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
  const getStoreList = async (page = 1, rowsPerPage = 15, searchValue = "", startDate = "", endDate = "", dateFilter = "") => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/admin/get-contacts?page=${page}&pageSize=${rowsPerPage}&searchTerm=${searchValue}`
      , {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setTableData(data.data);
      setSearchedData(data.data);
      setTotaldata(data.data.length);
      console.log(data.data)
      setPage(page - 1);
      setRowsPerPage(rowsPerPage);
      setIsLoading(false);

      console.log(data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
     
    }
  };



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
      let first_name = row.first_name;
      let last_name = row.last_name;
      let phone=row.phone_number;
      let email=row.email;

  
      return (
        first_name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        last_name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        email.includes(searchedVal.target.value.toLowerCase()) ||
        phone.toString().includes(searchedVal.target.value.toLowerCase())
      );
    });
      setTableData(filteredRows);
  };
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading style={{flexDirection:"column"}}>
            <MenuAndBack
                style={{
                  backgroundColor: "#012844",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoMdContact style={{ fontSize: "25px", margin: "8px" }}/>

              <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Contact Us
                </DashHeading>
              </MenuAndBack>
           
              <div style={{
                
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent:"end",
                }}>
                <SearchContainer>
                  <SearchBar>
                    <SearchIcon>
                      <FaSearch style={{ color: "#c4c4c4" }} />
                    </SearchIcon>
                    <SearchInput
                      type="text"
                      onChange={(searchVal) => SearchUser(searchVal)}
              
                      placeholder="Search by Name, Email & Phone"

                    ></SearchInput>
                  </SearchBar>
                </SearchContainer>
               
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
                      
                        Date
                      </TableCell>
                  
                      <TableCell className={classes.tablePadding}>
                      
                        Name
                    
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                       
                        Email
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                       
                        Phone Number
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                       
                        Description
                      </TableCell>

                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                     
                      recordsAfterPagingAndSorting().map((category, index) => (
                        <TableRow key={category._id}>
                          <TableCell component="th" scope="row" className={classes.textMiddle}>
                            {index + 1 + page * rowsPerPage}
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                          <div>
                            
                              {moment(category?.createdAt).format("DD/MM/YYYY")}
                            </div>{" "}
                          </TableCell>

                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "first_name", "N/A")}  {" "} {get(category, "last_name", "N/A")}</div>
                           

                          </TableCell>
                          <TableCell className={classes.textMiddle}>{get(category, "email", "N/A")}</TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>
                              {!get(category, "country_code", "") ? "" : get(category, "country_code", "")}
                              {!get(category, "phone_number", "N/A") ? "N/A" : get(category, "phone_number", "N/A")}
                            </div>
                          </TableCell>
                        
                          <Tooltip title={NameText === category._id ? "Click to Hide" : "Click to View"} arrow>
                            <TableCell
                              onClick={() => setNameText(NameText === category._id ? null : category._id)}
                              style={{
                                textAlign: "center",
                                whiteSpace: NameText === category._id ? "" : "nowrap",
                                maxWidth: "160px",
                                overflow: NameText === category._id ? "" : "hidden",
                                textOverflow: NameText === category._id ? "" : "ellipsis",
                                cursor: "pointer",
                                textTransform: "capitalize",
                              }}
                              className={classes.textMiddle}
                            >
                              {get(category, "comments", "N/A")}
                            </TableCell>
                          </Tooltip>
                       

                       
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              {
                tableData.length === 0 ? <Nodata TextToDisplay="No Data Found." fontSize="24px" /> : false
              }
              <TablePagination
                className={classes.tablePaginationStyle}
                rowsPerPageOptions={[15, 30, 100]}
                component="div"
                count={totaldata}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OfferManagement));
