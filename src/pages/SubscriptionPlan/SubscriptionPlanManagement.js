import React, { useState, useEffect, useRef } from "react";
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
} from "./SubscriptionPlanElements";
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
import * as AiIcons from "react-icons/ai";

import YearInput from "../../components/YearInput";
import { extractDate } from "../../utils/functions";
import { handleImageUpload } from "../../utils/functions";

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
import { Modal } from "../../components/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { SubscriptionDataValidator } from "../../utils/validators";
import SelectInput from "../../components/Select";
import Nodata from "../../components/Nodata";
// import { TfiClose } from "react-icons/tfi";
import { SlClose } from "react-icons/sl";
import { useCallback } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "0.5rem",
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: "800",
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
  // flex:{
  //   display:"flex",
  // }
}));
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
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
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
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
}));
const OfferManagement = ({ history, setUsers, userData }) => {
  const classes = useStyles();
  const exportRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [NameText, setNameText] = useState(null);
  const [PlanDuration, setPlanDuration] = useState();

  const [SubscriptionPlanData, setSubscriptionPlanData] = useState({
    name: "",
    featuresPack: [""],
    discountPrice: "",
    price: "",
    icon : "",
    id: "",
  });
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
  const [offerRadio, setOfferRadio] = useState([
    {
      label: "spend more earn more",
      isActive: false,
    },
    {
      label: "free/heavy discount",
      isActive: false,
    },
  ]);
  const [categoryList, setCategoryList] = useState([]);
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const colourStyles = {
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#757d85",
      };
    },
  };
  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    // getPlanDuration();
    getsubscriptionPlanList();
    // getOffers();
    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

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

  const cancelSearch = () => {
    setSearched("");
  };

  const recordsAfterPagingAndSorting = () => {
    return stableSort(tableData, getComparator(order, orderBy));
    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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

  const userBlocked = async (e) => {
    // console.log(e);
    if (e.categoryBlocked === true) {
      if (window.confirm("Are you sure you want to unblock this agent?")) {
        try {
          await axios.post("/admin/updateAgent", {
            id: e.categoryId,
            isBlocked: false,
          });
          // getDeliverBoysList();
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
      if (window.confirm("Are you sure you want to block this agent?")) {
        try {
          await axios.post("/admin/updateAgent", {
            id: e.categoryId,
            isBlocked: true,
          });
          // getDeliverBoysList();
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

  const getsubscriptionPlanList = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.get(`/admin/get-membership`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setTableData(data.data);
      setSearchedData(data.data);
      console.log(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      console.log("errorrrr", err.response);
      // if (err.response.status === 401 || err.response.status === 500) {
      //   localStorage.removeItem("accessToken");
      //   localStorage.removeItem("userData");
      // }
    }
  };
  const DeleteMembership = async (id) => {
    // console.log(id);
    if (window.confirm("Are you sure you want to delete this membership?")) {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.delete(`/admin/del-membership/${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // getDeliverBoysList();
        getsubscriptionPlanList();
      } catch (err) {
        console.log(err);
      }
    }
   
  };

  const handleSubmit = async (values) => {
    console.log(values);
    

      let addUrl = `/admin/add-membership`;
      let subscriptionData;

      subscriptionData = {
     
        name: values.name,
        icon: values.icon,
        discountPrice: values.discountPrice,
        price: values.price,
        featuresPack: values.featuresPack,
      };
      console.log(subscriptionData, "data is sneding")
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.post(addUrl, subscriptionData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        console.log(data, "sent data");
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getsubscriptionPlanList();
        setOpenModal(false);
        setSubscriptionPlanData({
          name: "",
          featuresPack: [""],
          discountPrice: "",
          price: "",
          icon : "",
          
        });
      } catch (err) {
        if (err.response.status == "400") {
          toast.error(`${err.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (
          err.response.status == "401" ||
          err.response.status == "500"
        ) {
          toast.error(`${err.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });

          // history.push("/adminPanel");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userData");
        }
        console.log(err.response);
      }
    // } else {
    //   //update profile
    // }
  };
  // const getPlanDuration = async () => {
  //   const { data } = await axios.get(`/admin/planTypes`);
  //   let plans = data.data.map((ele) => ({ label: ele, value: ele }));
  //   setPlanDuration(plans);
  // };
  const handleEditSubcription = async (values) => {
    let updateUrl = `/admin/edit-membership`;
    let subscriptionData;

    subscriptionData = {
      id: values.id,
      name: values.name,
      discountPrice: values.discountPrice,
      price: values.price,
      featuresPack: values.featuresPack,
      icon: values.icon,
    };

    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.post(updateUrl, subscriptionData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log(data, "this is sent data");
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getsubscriptionPlanList();
      setOpenModal(false);
      setSubscriptionPlanData({
        name: "",
        featuresPack: [""],
        discountPrice: "",
        price: "",
    icon : "",
        id: "",
      });
    } catch (err) {
      if (err.response.status == "400") {
        toast.error(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (err.response.status == "500" || err.response.status == "401") {
        toast.error(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        // history.push("/adminPanel");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
      console.log(err.response);
    }
  };
  // const statusSwitch = async (e, id) => {
  //   try {
  //     console.log(id);

  //     const { data } = await axios.post(
  //       "/admin/block_unblock_subscription_plan",
  //       {
  //         planid: id,
  //         isBlocked: !e.target.checked,
  //       }
  //     );
  //     // props.history.push({
  //     //     pathname: "/Category_Management",
  //     //   });
  //     getsubscriptionPlanList();
  //     toast.success(data.message, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }

  // console.log(e.target.checked);
  // console.log(checked);
  // console.log(id);
  // };

  // function runOnceOnChange(callback) {
  //   let hasRun = false; // variable to track if the function has been executed

  //   return function (event) {
  //     if (!hasRun) {
  //       // check if the function has been executed before
  //       hasRun = true; // mark the function as executed
  //       callback(event); // call the provided callback function
  //     }
  //   };
  // }

  // // Example usage
  // function handleChange(event) {
  //   alert("Please make sure that price should be change first in Stripe.");
  // }

  // const onChangeOnce = runOnceOnChange(handleChange);

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
                <FaIcons.FaUserFriends style={{ fontSize: "25px", margin: "8px" }}/>
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Subscription Management
                </DashHeading>
              </MenuAndBack>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ background: "#012844", border: "#012844" }}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  ADD NEW
                </button>
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
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tablePadding}
                        style={{ fontWeight: "800" }}
                      >
                        S.&nbsp;No.
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Plan Name
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Icon
                      </TableCell>

                      <TableCell className={classes.tablePadding}>
                        Actual Price
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Discounted Price
                      </TableCell>

                      <TableCell className={classes.tablePadding}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recordsAfterPagingAndSorting().map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          className={classes.textMiddle}
                        >
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>{category.name}</div>
                        </TableCell>
                        {/* <Tooltip title={NameText === category.id ? "Click to Hide" : "Click to View"} arrow> */}
                        <TableCell className={classes.textMiddle}>
                          <img
                            src={get(category, "icon", "")}
                            alt="icon"
                            style={{ width: "30px", height: "30px" }}
                          />
                        </TableCell>
                        {/* </Tooltip> */}
                        <TableCell
                          className={classes.textMiddle}
                          style={{ textTransform: "capitalize" }}
                        >
                          <div>{get(category, "price", "")}</div>
                        </TableCell>
                        <TableCell
                          className={classes.textMiddle}
                          style={{ textTransform: "capitalize" }}
                        >
                          <div>{get(category, "discountPrice", "")}</div>
                        </TableCell>
                        {/* <TableCell className={classes.textMiddle}>
                        
                          <div>{get(category, "planType", "")}</div>
                        </TableCell> */}
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

                        <TableCell className={classNames(classes.textMiddle)}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <Tooltip title="Edit" arrow>
                                <Button
                                  // variant="outlined"
                                  aria-label="add"
                                  className={classes.iconMargin}
                                  onClick={() => {
                                    setOpenModal(true);
                                    setSubscriptionPlanData({
                                      name: get(category, "name", ""),
                                      featuresPack: get(
                                        category,
                                        "featuresPack",
                                        [""]
                                      ),
                                      icon: get(category, "icon", ""),
                                      discountPrice: get(
                                        category,
                                        "discountPrice",
                                        ""
                                      ),
                                      price: get(category, "price", ""),
                                      id: get(category, "id", ""),
                                    });
                                    // history.push({
                                    //   // pathname: `/adminPanel/user/${category.id}`,
                                    //   pathname: `/adminPanel/subscription/AddEditSubscriptionPlan/${category.id}`,
                                    // });
                                  }}
                                >
                                  <Edit color="primary" />
                                </Button>
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip title={"View Subscription"} arrow>
                                <Button
                                  aria-label="add"
                                  className={classes.Marginbutton}
                                >
                                  <Link
                                    to={`/adminPanel/view-subscription/${category.id}`}
                                  >
                                    <AiIcons.AiFillEye
                                      style={{ fontSize: "1.5rem" }}
                                    />
                                  </Link>
                                </Button>
                                {/* <Button
                                  // variant="outlined"
                                  aria-label="add"
                                  className={classes.Marginbutton}
                                  onClick={() => {
                                    ViewSubscriptionPlan(category.id);
                                    <Link to="/adminPanel/view-subscription" />;
                                  }}
                                >
                                  <AiIcons.AiFillEye
                                    style={{ fontSize: "1.5rem" }}
                                  />
                                </Button> */}
                              </Tooltip>
                            </div>
                            <div>
                            <Tooltip title="Delete" arrow>
                              <Button
                                // variant="outlined"
                                aria-label="add"
                                className={classes.Marginbutton}
                                onClick={() => {
                                  DeleteMembership(category.id);
                                }}
                              >
                                <DeleteOutline />
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
      <Modal
        maxWidth="lg"
        width="540px"
        RoundedCorners={true}
        isOpen={openModal}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
            setSubscriptionPlanData({
              name: "",
              featuresPack: [""],
              discountPrice: "",
              price: "",
              icon : "",
              id: "",
            });
          }
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
              {!SubscriptionPlanData.id
                ? `Add Subscription`
                : `Edit Subscription`}
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
                  setSubscriptionPlanData({
                    name: "",
                    featuresPack: [""],
                    discountPrice: "",
                    price: "",
                   icon : "",
                    id: "",
                  });
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={SubscriptionPlanData}
              enableReinitialize
              initialValues={
                SubscriptionPlanData
                // {
                // name: get(SubscriptionPlanData, "planName", ""),
                // description: get(SubscriptionPlanData, "description", ""),
                // planType: !SubscriptionPlanData
                //   ? ""
                //   : PlanDuration.filter((ele) => SubscriptionPlanData?.planType === ele.value)[0],
                // price: get(SubscriptionPlanData, "price", ""),
                // }
              }
              validate={SubscriptionDataValidator}
              validateOnChange
              onSubmit={(values) => {
                console.log(values)
                if (values.id) {
                  handleEditSubcription(values);
                } else {
                  handleSubmit(values);
                }
              }}
            >
              {(formikBag) => {
                // console.log(formikBag.values, "this si valie");
                return (
                  <Form style={{ margin: "0.5rem 1rem 0 1rem" }}>
                    <div className="signup-cont">
                      <div className="row">
                        {/* <div className="col-md-12"> */}
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>
                            Plan Name
                          </label>
                          <Field name="name">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.name}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "name",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.name &&
                                    formikBag.errors.name
                                      ? formikBag.errors.name
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Plan Name"
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Features</label>
                          <Field name="featuresPack">
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
                                        formikBag.setFieldValue(
                                          "featuresPack",
                                          [...arr]
                                        );
                                      }} 
                                      error={
                                        formikBag.touched.featuresPack &&
                                        formikBag.errors.featuresPack
                                          ? formikBag.errors.featuresPack
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Features"
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
                                          formikBag.setFieldValue(
                                            "featuresPack",
                                            [...arr]
                                          );
                                        }}
                                      >
                                        Remove Feature
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12">
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
                              onClick={() =>
                                formikBag.setFieldValue("featuresPack", [
                                  ...formikBag.values.featuresPack,
                                  "",
                                ])
                              }
                            >
                              Add Feature
                            </button>
                          </div>
                        </div>

                        <div className="col-md-12 mt-2">
                          <label>Subscription Plan Image</label>
                          <Field name="icon">
                            {({ field }) => (
                              <div className="py-2">
                                {console.log(formikBag.values)}
                              
                                 <FileInput
                                  className="file-input"
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={
                                    formikBag.values.icon
                                      ? [formikBag.values.icon]
                                      : 
                                      []
                                  }
                                  onDelete={(icon) => {
                                    formikBag.setFieldValue("icon", "");
                                  }}
                                  type="text"
                                  label="upload_products_facility_photos"
                                  info="eg_img"
                                  error={
                                    formikBag.touched.icon &&
                                    formikBag.errors.icon
                                      ? formikBag.errors.icon
                                      : []
                                  }
                                  onChange={async (e) => {
                                    const fileSize =
                                      e.target.files[0].size / 1024 / 1024; // in MiB
                                    if (fileSize > 2) {
                                      alert("ex_2mb");
                                    } else {
                                      var icon = await handleImageUpload(
                                        e.target.files[0]
                                      );
                                      // console.log("this is image url", image);
                                      formikBag.setFieldValue("icon", icon);
                                    }
                                  }}
                                />
                                 {formikBag.touched.icon &&
                                  formikBag.errors.icon && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.icon}
                                    </div>
                                  )}
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Price</label>
                          <Field name="price">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="number"
                                  // inputmode="numeric"
                                  variant="outlined"
                                  value={formikBag.values.price}
                                  onChange={(e) => {
                                    // onChangeOnce();
                                    formikBag.setFieldValue(
                                      "price",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.price &&
                                    formikBag.errors.price
                                      ? formikBag.errors.price
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Price"
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12" style={{}}>
                          <label className={classes.offerLabel}>
                            Discounted Price
                          </label>
                          <Field name="discountPrice">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="number"
                                  // inputmode="numeric"
                                  variant="outlined"
                                  value={formikBag.values.discountPrice}
                                  onChange={(e) => {
                                    // onChangeOnce();
                                    formikBag.setFieldValue(
                                      "discountPrice",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.discountPrice &&
                                    formikBag.errors.discountPrice
                                      ? formikBag.errors.discountPrice
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Discounted Price"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div
                        className="col-md-12"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <HeadingButton
                          type="submit"
                          style={{ padding: "0.5em 2em" }}
                        >
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferManagement));
