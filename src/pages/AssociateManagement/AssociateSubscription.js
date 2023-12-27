import React, { useState, useEffect, useRef } from "react";
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
import { ProductValidator } from "../../utils/validators";
import TextArea from "../../components/TextArea";
import FileInput from "../../components/FileInput";
import { uploadImage } from "../../utils/functions";
import { FaSearch } from "react-icons/fa";
import BlockIcon from "@material-ui/icons/Block";
import { SearchContainer, SearchBar, SearchIcon, SearchInput } from "../../components/SearchBar/SearchElements";
import { DeleteOutline, Edit, EditAttributesOutlined } from "@material-ui/icons";
import moment from "moment";
import { CSVLink, CSVDownload } from "react-csv";
import { TiExport } from "react-icons/ti";
import AddIcon from "@material-ui/icons/Add";
import { Modal } from "../../components/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { AssociateSubscriptionDataValidator } from "../../utils/validators";
import SelectInput from "../../components/Select";
import Nodata from "../../components/Nodata";
// import { TfiClose } from "react-icons/tfi";
import { SlClose } from "react-icons/sl";

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
  const exportRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [NameText, setNameText] = useState(null);
  const [PlanDuration, setPlanDuration] = useState();

  const [SubscriptionPlanData, setSubscriptionPlanData] = useState({
    // name: "",
    description: [""],
    // planType: "",
    price: "",
    _id: "",
  });
  const [defaultState, setDefaultState] = useState({ isAddMenu: "", isRestaurantDetails: "" });
  const [menuState, setMenuState] = useState({ isOfferVoucher: true, isAddOffer: false });
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
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [buyerData, setBuyerData] = useState([]);

  const [offerValues, setOfferValues] = useState({
    product_name: "",
    category: "",
    category_name: "",
    subCategory: "",
    subcategory_name: "",
    quantity: "",
    unit: "",
    price: "",
    selling_price: "",
    discount_price: "",
    barcode_number: "",
    product_description: "",
    unit_measurement: "",
    images: [],
  });
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

  const getsubscriptionPlanList = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/admin/get_associate_membership_content`);
      if (data.data) {
        setTableData([data.data]);
        setSearchedData([data.data]);
        console.log(data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setTableData([]);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      console.log("errorrrr", err.response);
      if (err.response.status === 401 || err.response.status === 500) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
    }
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

  const userBlocked = async (e) => {
    // console.log(e);
    if (e.categoryBlocked === true) {
      if (window.confirm("Are you sure you want to unblock this agent?")) {
        try {
          await axios.post("/admin/updateAgent", {
            _id: e.categoryId,
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
            _id: e.categoryId,
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

  const DeleteSubscriptionPlan = async (id) => {
    if (window.confirm("Are you sure you want to delete this Associate Subscription ?")) {
      try {
        const { data } = await axios.delete(`/admin/remove_associate_membership_content?memberContent_id=${id}`);
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // getDeliverBoysList();
        getsubscriptionPlanList();
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

  const handleSubmit = async (values) => {
    console.log(values);
    if (!values._id) {
      //add profile

      let addUrl = `/admin/create_associate_membership_content`;
      let subscriptionData;

      subscriptionData = {
        // planName: values.name,
        // planType: values.planType.value,
        price: values.price,
        features: values.description,
      };

      try {
        const { data } = await axios.post(addUrl, subscriptionData);
        console.log(data);
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getsubscriptionPlanList();
        setOpenModal(false);
        setSubscriptionPlanData({
          // name: "",
          description: [""],
          // planType: "",
          price: "",
          _id: "",
        });
      } catch (err) {
        if (err.response.status == "400") {
          toast.error(`${err.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (err.response.status == "401" || err.response.status == "500") {
          toast.error(`${err.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });

          history.push("/adminPanel");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userData");
        }
        console.log(err.response);
      }
    } else {
      //update profile
    }
  };
  // const getPlanDuration = async () => {
  //   const { data } = await axios.get(`/admin/planTypes`);
  //   let plans = data.data.map((ele) => ({ label: ele, value: ele }));
  //   setPlanDuration(plans);
  // };
  const handleEditSubcription = async (values) => {
    let updateUrl = `/admin/update_associate_membership_content`;
    let subscriptionData;

    subscriptionData = {
      memberContent_id: values._id,
      // planName: values.name,
      // planType: values.planType.value,
      price: values.price,
      features: values.description,
    };

    try {
      const { data } = await axios.patch(updateUrl, subscriptionData);
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getsubscriptionPlanList();
      setOpenModal(false);
      setSubscriptionPlanData({
        // name: "",
        description: [""],
        // planType: "",
        price: "",
        _id: "",
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

        history.push("/adminPanel");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
      console.log(err.response);
    }
  };
  const statusSwitch = async (e, id) => {
    try {
      console.log(id);

      const { data } = await axios.post("/admin/block_unblock_subscription_plan", {
        plan_id: id,
        isBlocked: !e.target.checked,
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });
      getsubscriptionPlanList();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // console.log(e.target.checked);
    // console.log(checked);
    // console.log(id);
  };

  const addFeature = () => {};
  function runOnceOnChange(callback) {
    let hasRun = false; // variable to track if the function has been executed

    return function (event) {
      if (!hasRun) {
        // check if the function has been executed before
        hasRun = true; // mark the function as executed
        callback(event); // call the provided callback function
      }
    };
  }

  // Example usage
  function handleChange(event) {
    alert("Please make sure that price should be change first in Stripe.");
  }

  const onChangeOnce = runOnceOnChange(handleChange);
  console.log(tableData);
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading>
              <MenuAndBack>
                <DashHeading>Associate Subscription</DashHeading>
              </MenuAndBack>

              {/* <SearchBar
                                className={classes.searchDesign}
                                value={searched}
                                onChange={(searchVal) => requestSearch(searchVal)}
                                onCancelSearch={() => cancelSearch()}
                                placeholder="Search by Product Name"
                                 /> */}

              {tableData.length >= 1 ? (
                false
              ) : (
                <div style={{ display: "flex", gap: "1rem" }}>
                  {/* <SearchContainer>
                  <SearchBar>
                    <SearchIcon>
                      <FaSearch style={{ color: "#c4c4c4" }} />
                 
                    </SearchIcon>
                    <SearchInput
                      type="text"
                      onChange={(searchVal) => requestSearch(searchVal)}
                      //   value={searched}
                      placeholder="Search"
                    ></SearchInput>
                  </SearchBar>
                </SearchContainer> */}
                  <Tooltip
                    title={<span style={{ color: "white", fontSize: "16px" }}>Create Associate Subscription </span>}
                    arrow
                  >
                    <IconButton
                      className=""
                      style={{
                        background: "transparent linear-gradient(90deg, #012844 0%, #012844 100%) 0% 0% no-repeat padding-box",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setOpenModal(true);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </DashboardHeading>

            <Paper className={classes.paperTableHeight} style={{ overflow: "hidden", height: "100%", marginBottom: "0.5rem" }}>
              <TableContainer className={classes.tableContainerHeight}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tablePadding} style={{ fontWeight: "800" }}>
                        S.&nbsp;No.
                      </TableCell>

                      <TableCell className={classes.tablePadding}>Features</TableCell>
                      {/* <TableCell className={classes.tablePadding}>
                        <TableSortLabel
                          active={true}
                          direction={orderBy === "features" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("features");
                          }}
                        >
                          Features
                        </TableSortLabel>
                      </TableCell> */}
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "planPrice" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("planPrice");
                          }}
                        > */}
                        Price
                        {/* </TableSortLabel> */}
                      </TableCell>
                      {/* <TableCell className={classes.tablePadding}>Status</TableCell> */}

                      <TableCell className={classes.tablePadding}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recordsAfterPagingAndSorting().map((category, index) => (
                      <TableRow key={category._id}>
                        <TableCell component="th" scope="row" className={classes.textMiddle}>
                          {index + 1 + page * rowsPerPage}
                        </TableCell>

                        {/* <Tooltip title={NameText === category._id ? "Click to Hide" : "Click to View"} arrow> */}
                        <TableCell
                          // onClick={() => setNameText(NameText === category._id ? null : category._id)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            //  textAlign: "center",
                            // whiteSpace: NameText === category._id ? "" : "nowrap",
                            // maxWidth: "150px",
                            //
                            // overflow: NameText === category._id ? "" : "hidden",
                            // textOverflow: NameText === category._id ? "" : "ellipsis",
                            // cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                          className={classes.textMiddle}
                        >
                          {get(category, "features", ["N/A"]).length > 0
                            ? get(category, "features", ["N/A"]).map((ele, i) => (
                                <div style={{ padding: "8px 0" }} index={i}>
                                  {ele}
                                </div>
                              ))
                            : ["N/A"].map((ele, i) => (
                                <div style={{ padding: "8px 0" }} index={i}>
                                  {ele}
                                </div>
                              ))}
                          {/* <CroppedText text={`${get(category, "location", "N/A")}`} bool={locationText} /> */}
                        </TableCell>
                        {/* </Tooltip> */}
                        <TableCell className={classes.textMiddle} style={{ textTransform: "capitalize" }}>
                          <div>{!get(category, "price", "") ? "N/A" : get(category, "price", "")}</div>
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
                        {/* <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
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
                        </TableCell> */}
                        <TableCell className={classNames(classes.textMiddle)}>
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div>
                              <Tooltip title="Edit" arrow>
                                <Button
                                  // variant="outlined"
                                  aria-label="add"
                                  className={classes.iconMargin}
                                  onClick={() => {
                                    setOpenModal(true);
                                    setSubscriptionPlanData({
                                      // name: get(category, "planName", ""),
                                      description: get(category, "features", [""]),
                                      // planType: {
                                      //   label: get(category, "planType", ""),
                                      //   value: get(category, "planType", ""),
                                      // },
                                      price: get(category, "price", ""),
                                      _id: get(category, "_id", ""),
                                    });
                                    // history.push({
                                    //   // pathname: `/adminPanel/user/${category.id}`,
                                    //   pathname: `/adminPanel/subscription/AddEditSubscriptionPlan/${category._id}`,
                                    // });
                                  }}
                                >
                                  <Edit color="primary" />
                                </Button>
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip title="Delete" arrow>
                                <Button
                                  // variant="outlined"
                                  aria-label="add"
                                  className={classes.Marginbutton}
                                  onClick={() => {
                                    DeleteSubscriptionPlan(category._id);
                                  }}
                                >
                                  <DeleteOutline />
                                </Button>
                              </Tooltip>
                            </div>
                            {/* <div>
                            <Tooltip title="Block" arrow>
                              <Button
                                variant="outlined"
                                aria-label="add"
                                className={classes.Marginbutton}
                                onClick={() => {
                                  userBlocked({ categoryId: category._id, categoryBlocked: category.isBlocked });
                                }}
                              >
                                <BlockIcon style={{ color: category.isBlocked === true ? "red" : "green" }} />
                              </Button>
                            </Tooltip>
                          </div> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {tableData.length === 0 ? <Nodata TextToDisplay="No Data Found." fontSize="24px" /> : false}
              {/* <TablePagination
                className={classes.tablePaginationStyle}
                rowsPerPageOptions={[15, 25, 100]}
                component="div"
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              /> */}
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
              // name: "",
              description: [""],
              // planType: "",
              price: "",
              _id: "",
            });
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
              {!SubscriptionPlanData._id ? `Add Subscription` : `Edit Subscription`}
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
                    // name: "",
                    description: [""],
                    // planType: "",
                    price: "",
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
              key={SubscriptionPlanData}
              enableReinitialize
              initialValues={
                SubscriptionPlanData
                // {
                // name: get(SubscriptionPlanData, "planName", ""),
                // features: get(SubscriptionPlanData, "features", ""),
                // planType: !SubscriptionPlanData
                //   ? ""
                //   : PlanDuration.filter((ele) => SubscriptionPlanData?.planType === ele.value)[0],
                // price: get(SubscriptionPlanData, "price", ""),
                // }
              }
              validate={AssociateSubscriptionDataValidator}
              validateOnChange
              onSubmit={(values) => {
                if (values._id) {
                  handleEditSubcription(values);
                } else {
                  handleSubmit(values);
                }
              }}
            >
              {(formikBag) => {
                return (
                  <Form style={{ margin: "0.5rem 1rem 0 1rem" }}>
                    <div className="signup-cont">
                      <div className="row">
                        {/* <div className="col-md-12"> */}
                        {/* <div className="col-md-12">
                          <label className={classes.offerLabel}>Plan Name</label>
                          <Field name="name">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.name}
                                  onChange={(e) => {
                                    formikBag.setFieldValue("name", e.target.value);
                                  }}
                                  error={formikBag.touched.name && formikBag.errors.name ? formikBag.errors.name : null}
                                  className="form-control"
                                  placeholder="Plan Name"
                                />
                              </div>
                            )}
                          </Field>
                        </div> */}

                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Features</label>
                          <Field name="description">
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
                                        formikBag.setFieldValue("description", [...arr]);
                                      }}
                                      error={
                                        get(formikBag, "touched.description[" + idx + "]", false) &&
                                        get(formikBag, "errors.description[" + idx + "]", null)
                                      }
                                      className="form-control"
                                      placeholder="Feature"
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
                                          formikBag.setFieldValue("description", [...arr]);
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
                              onClick={() => formikBag.setFieldValue("description", [...formikBag.values.description, ""])}
                            >
                              Add Feature
                            </button>
                          </div>
                        </div>

                        {/* <div className="col-md-12">
                          <label className={classes.offerLabel}>Plan Duration</label>
                          <Field name="planType">
                            {({ field }) => (
                              <div className="pb-2 mt-1 changeHeightOfSelect">
                                <SelectInput
                                  {...field}
                                  // type="select"
                                  // variant="outlined"
                                  value={formikBag.values.planType}
                                  options={PlanDuration}
                                  styles={colourStyles}
                                  
                                  onChange={(e) => {
                                    formikBag.setFieldValue("planType", e);
                                  }}
                                  error={
                                    formikBag.touched.planType && formikBag.errors.planType ? formikBag.errors.planType : null
                                  }
                                  // className="form-control"
                                  placeholder="Select Time Period"
                                />
                              </div>
                            )}
                          </Field>
                        </div> */}

                        <div className="col-md-12" style={{}}>
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
                                    onChangeOnce();
                                    formikBag.setFieldValue("price", e.target.value);
                                  }}
                                  error={formikBag.touched.price && formikBag.errors.price ? formikBag.errors.price : null}
                                  className="form-control"
                                  placeholder="Price"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
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
