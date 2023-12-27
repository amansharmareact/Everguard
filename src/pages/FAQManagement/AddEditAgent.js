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
} from "./AgentElements";
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
import { useParams, withRouter } from "react-router-dom";
// import SearchBar from "material-ui-search-bar";
import { ProductValidator } from "../../utils/validators";
import TextArea from "../../components/TextArea";
import FileInput from "../../components/FileInput";
import { uploadImage } from "../../utils/functions";
import { FaSearch } from "react-icons/fa";
import BlockIcon from "@material-ui/icons/Block";
import { SearchContainer, SearchBar, SearchIcon, SearchInput } from "../../components/SearchBar/SearchElements";
import PhoneInput from "../../components/PhoneInput";
import { deliveryBoyDataValidator } from "../../utils/validators";
import { RiLockPasswordFill } from "react-icons/ri";

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
}));

const OfferManagement = ({ history, setUsers, userData }) => {
  const classes = useStyles();
  const { id } = useParams();
  const [deliveryBoyData, setDeliveryBoydata] = useState();
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

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    id && getDeliverBoysList();
    // getOffers();
    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getOffers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/admin/get-users/BUYER");
      console.log("buyer", data);
      setTableData(data.data);
      setSearchedData(data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setUsers("");
      history.push("/adminPanel");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
    }
  };

  const handleOfferProfile = async (values) => {
    console.log(values);

    var fromData = {
      product_name: values.product_name,
      quantity: values.quantity,
      unit: values.unit,
      price: values.price,
      images: values.images,
      superMarket_id: get(userData, "_id", ""),
      category: values.category,
      subCategory: values.subCategory,
      product_description: values.product_description,
      barcode_number: values.barcode_number,
      unit_measurement: values.unit_measurement,
      selling_price: values.selling_price,
      discount_price: values.price - values.selling_price,
    };

    console.log(fromData);
    setIsLoading(true);
    // setDefaultState((prevState) => {
    //     return {
    //         ...prevState,
    //         isDishAdd: false,
    //     };
    // });

    try {
      if (values._id) {
        const { data } = await axios.post("/superMarket/update_product", {
          _id: values._id,
          product_name: values.product_name,
          quantity: values.quantity,
          unit: values.unit,
          price: values.price,
          images: values.images,
          superMarket_id: get(userData, "_id", ""),
          category: values.category,
          subCategory: values.subCategory,
          product_description: values.product_description,
          barcode_number: values.barcode_number,
          unit_measurement: values.unit_measurement,
          selling_price: values.selling_price,
          discount_price: values.price - values.selling_price,
        });
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false);
        getOffers();
      } else {
        const { data } = await axios.post("/superMarket/add_product", fromData);
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false);
        getOffers();
      }
      setMenuState({
        isOfferVoucher: true,
        isAddOffer: false,
      });
    } catch (error) {
      setIsLoading(false);
      setMenuState({
        isOfferVoucher: true,
        isAddOffer: false,
      });
      toast.error(`${error.response.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (error.response.status === 401) {
        history.push("/");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
    }
  };

  const handleDeleteOffers = async (id) => {
    if (window.confirm("Are you sure you want to delete this Product ?")) {
      try {
        const { data } = await axios.post("/superMarket/delete_product", {
          _id: id,
        });
        getOffers();
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
        toast.error(`${error.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      getOffers();
    }
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
      let name = row.first_name + " " + row.last_name;
      let mobileNumber = JSON.stringify(get(row, "phone_number", ""));
      let unitId = JSON.stringify(get(row, "unit_id", ""));
      return (
        name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        mobileNumber.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        unitId.toLowerCase().includes(searchedVal.target.value.toLowerCase())
      );
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    getOffers();
  };

  const recordsAfterPagingAndSorting = () => {
    return stableSort(tableData, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
      if (window.confirm("Are you sure you want to unblock this user?")) {
        try {
          await axios.post("/admin/users-block-status", {
            user_id: e.categoryId,
            is_blocked: false,
          });
          getOffers();
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
          await axios.post("/admin/users-block-status", {
            user_id: e.categoryId,
            is_blocked: true,
          });
          getOffers();
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

  const getDeliverBoysList = async () => {
    try {
      const { data } = await axios.get(`/admin/listAgents?id=${id}`);
      setDeliveryBoydata(data.data[0]);
      console.log(data.data[0]);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (values) => {
    console.log(values);
    if (!id) {
      //add profile

      let addUrl = `/admin/createAgent`;
      let agentData;
      if (!values.email) {
        agentData = {
          firstName: values.firstName,
          lastName: values.lastName,

          password: values.password,
          countryCode: values.countryCode,
          mobileNumber: values.mobileNum,
        };
      } else {
        agentData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          countryCode: values.countryCode,
          mobileNumber: values.mobileNum,
        };
      }

      try {
        const { data } = await axios.post(addUrl, agentData);
        console.log(data);
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push({
          pathname: "/adminPanel/agent",
        });
      } catch (err) {}
    } else {
      //update profile

      let updateUrl = `/admin/updateAgent`;
      let agentData;
      if (!values.email) {
        agentData = {
          _id: id,
          firstName: values.firstName,
          lastName: values.lastName,

          //  password: values.password,
          countryCode: values.countryCode,
          mobileNumber: values.mobileNum,
        };
      } else {
        agentData = {
          _id: id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          //  password: values.password,
          countryCode: values.countryCode,
          mobileNumber: values.mobileNum,
        };
      }

      try {
        const { data } = await axios.post(updateUrl, agentData);
        console.log(data);
        toast.success(`${data.code == 200 ? "Success" : data.code}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push({
          pathname: "/adminPanel/agent",
        });
      } catch (err) {}
    }
  };
  function generateP() {
    var pass = "";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  console.log(deliveryBoyData);
  {
    console.log(id);
  }
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading>
              <MenuAndBack>
                <DashHeading>{id ? `Edit Agent` : `Add Agent`}</DashHeading>
              </MenuAndBack>

              {/* <SearchBar
                                className={classes.searchDesign}
                                value={searched}
                                onChange={(searchVal) => requestSearch(searchVal)}
                                onCancelSearch={() => cancelSearch()}
                                placeholder="Search by Product Name"
                                 /> */}
            </DashboardHeading>

            <Paper className={classes.paperTableHeight} style={{ overflow: "hidden", height: "100%" }}>
              {/* insert formik here */}
              <Formik
                key={deliveryBoyData}
                enableReinitialize
                initialValues={{
                  firstName: get(deliveryBoyData, "firstName", ""),
                  lastName: get(deliveryBoyData, "lastName", ""),
                  mobile: get(deliveryBoyData, "countryCode", "") + get(deliveryBoyData, "mobileNumber", ""),
                  mobileNum: get(deliveryBoyData, "mobileNumber", ""),
                  password: get(deliveryBoyData, "password", ""),
                  email: get(deliveryBoyData, "email", ""),
                  countryCode: get(deliveryBoyData, "countryCode", ""),
                }}
                validate={deliveryBoyDataValidator}
                validateOnChange
                onSubmit={handleSubmit}
              >
                {(formikBag) => {
                  return (
                    <Form style={{ margin: "2rem 5rem 0 5rem" }}>
                      <div className="signup-cont">
                        <div className="row">
                          {/* <div className="col-md-12"> */}
                          <div className="col-md-12">
                            <label className={classes.offerLabel}>First Name</label>
                            <Field name="firstName">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    value={formikBag.values.firstName}
                                    onChange={(e) => {
                                      formikBag.setFieldValue("firstName", e.target.value);
                                    }}
                                    error={
                                      formikBag.touched.firstName && formikBag.errors.firstName
                                        ? formikBag.errors.firstName
                                        : null
                                    }
                                    className="form-control"
                                    placeholder="First Name"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-12">
                            <label className={classes.offerLabel}>Last Name</label>
                            <Field name="lastName">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    value={formikBag.values.lastName}
                                    onChange={(e) => {
                                      formikBag.setFieldValue("lastName", e.target.value);
                                    }}
                                    error={
                                      formikBag.touched.lastName && formikBag.errors.lastName ? formikBag.errors.lastName : null
                                    }
                                    className="form-control"
                                    placeholder="Last Name"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>

                          <div className="col-md-12">
                            <label className={classes.offerLabel}>Email ID (Optional)</label>
                            <Field name="email">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="email"
                                    variant="outlined"
                                    value={formikBag.values.email}
                                    onChange={(e) => {
                                      formikBag.setFieldValue("email", e.target.value);
                                    }}
                                    error={formikBag.touched.email && formikBag.errors.email ? formikBag.errors.email : null}
                                    className="form-control"
                                    placeholder="Email ID"
                                  />
                                </div>
                              )}
                            </Field>
                            {/* <Field name="email">
                              {({ field }) => (
                                <div className="py-1">
                                  <Select
                                    // defaultValue={
                                    //   !isEmpty(formikBag.values.type)
                                    //     ? { label: subscriptionFun(formikBag.values.type), value: formikBag.values.type }
                                    //     : ""
                                    // }
                                    // className="mt-1"
                                    className="select-padding"
                                    style={{ padding: "0.3rem" }}
                                    // options={showUnitOptions}
                                    isSearchable={false}
                                    isClearable={false}
                                    placeholder="Email ID"
                                    onChange={(option) => {
                                      formikBag.setFieldValue("email", option.value);
                                    }}
                                    error={formikBag.touched.type && formikBag.errors.type ? formikBag.errors.type : null}
                                  />
                                </div>
                              )}
                            </Field> */}
                          </div>

                          <div className="col-md-12">
                            <label className={classes.offerLabel}>Mobile Number</label>
                            <Field name="mobile">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  {/* <Input
                                    {...field}
                                    type="tel"
                                    variant="outlined"
                                    value={formikBag.values.mobile}
                                    onChange={(e) => {
                                      formikBag.setFieldValue("mobile", e.target.value);
                                    }}
                                    error={formikBag.touched.mobile && formikBag.errors.mobile ? formikBag.errors.mobile : null}
                                    className="form-control"
                                    placeholder="Mobile Number"
                                  /> */}
                                  <PhoneInput
                                    {...field}
                                    country="in"
                                    type="mobile"
                                    countryCodeEditable={false}
                                    value={formikBag.values.mobile}
                                    onChange={(phone, data) => {
                                      formikBag.setFieldValue("countryCode", data.format.slice(0, 1) + data.dialCode);
                                      formikBag.setFieldValue("mobileNum", phone.slice(data.dialCode.length));
                                    }}
                                    error={formikBag.touched.mobile && formikBag.errors.mobile ? formikBag.errors.mobile : null}
                                    className="form-control"
                                    placeholder="Mobile Number"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>

                          <div className="col-md-11" style={{ pointerEvents: id ? "none" : "" }}>
                            <label className={classes.offerLabel}>Password</label>
                            <Field name="password">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    disabled={id ? true : false}
                                    type="password"
                                    variant="outlined"
                                    value={formikBag.values.password}
                                    onChange={(e) => {
                                      formikBag.setFieldValue("password", e.target.value);
                                    }}
                                    error={
                                      formikBag.touched.password && formikBag.errors.password ? formikBag.errors.password : null
                                    }
                                    className="form-control"
                                    placeholder="Password"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>

                          <div className="col-md-1" style={{ pointerEvents: id ? "none" : "" }}>
                            <label className={classes.offerLabel}></label>
                            <Field name="">
                              {({ field }) => (
                                <div className="d-flex justify-content-center align-items-center pt-2">
                                  {/* <Input {...field} type="button" className="form-control" value="Button" /> */}

                                  <Tooltip title={<span style={{ fontSize: "18px" }}>Auto Generate Password</span>} arrow>
                                    <Button
                                      onClick={() => {
                                        formikBag.setFieldValue("password", generateP());
                                      }}
                                    >
                                      <RiLockPasswordFill style={{ fontSize: "22px" }} />
                                    </Button>
                                  </Tooltip>
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
                          <HeadingButton type="submit" style={{ padding: "1em 3.3em" }}>
                            Save
                          </HeadingButton>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
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
