import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";
import * as AiIcons from "react-icons/ai";
import { FaUserCheck } from "react-icons/fa";
import { FaUserTimes } from "react-icons/fa";
import { handleImageUpload } from "../../utils/functions";
import ModalImage from "react-modal-image";
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
} from "./ProductElements";
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
import { get, isEmpty } from "lodash";
import classNames from "classnames";
import Select from "../../components/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter } from "react-router-dom";
// import SearchBar from "material-ui-search-bar";
import { productValidator } from "../../utils/validators";
import TextArea from "../../components/TextArea";
import FileInput from "../../components/FileInput";
import { uploadImage } from "../../utils/functions";
import { FaSearch } from "react-icons/fa";
import "./ProductDetails.css";
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
import { productDetailsValidator } from "../../utils/validators";
import { RiLockPasswordFill } from "react-icons/ri";
import Nodata from "../../components/Nodata";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ProductDetails from "./ProductDetails";
import TooltipN from "../../components/Tooltip";

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
  tableContainerHeight: {
    // maxHeight: "50vh",
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
  const {
    location: { state },
  } = history;
  const classes = useStyles();
  const exportRef = useRef(null);
  let { merchant_id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen]=useState(false)
  const [NameText, setNameText] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    image: "",
    description: "",
    inventoryLevels: "",
    tax: "",
    shipping: "",
  });

  const [edit, setEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
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

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  // useEffect(() => {
  //   merchant_id && getMerchantProductList();
  //   // getOffers();
  //   // fetchCategoryList();
  //   // fetchSubcategoryList();
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

  const handleDeleteOffers = async (id) => {
    if (window.confirm("Are you sure you want to delete this Product ?")) {
      try {
        const { data } = await axios.post("/superMarket/delete_product", {
          id: id,
        });
        // getOffers();
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
      // getOffers();
    }
  };

  const cancelSearch = () => {
    setSearched("");
    // getOffers();
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
  const recordsAfterPagingAndSorting = () => {
    const sortedData = stableSort(tableData, getComparator(order, orderBy));
    const slicedData = sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    // console.log('Sorted and Sliced Data:', slicedData);
    return slicedData;
  };
  const mappedData = recordsAfterPagingAndSorting();

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
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
  const handleSubmit = async (values) => {
    console.log("clicked submit");

    let addUrl = `/admin/add-product`;
    let productData;

    productData = {
      name: values.name,
      image: values.image,
      description: values.description,
      inventoryLevels: values.inventoryLevels,
      tax: values.tax,
      shipping: values.shipping,
    };

    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.post(addUrl, productData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getProductList();
      setProductDetails({
        id: "",
        name: "",
        image: "",
        description: "",
        inventoryLevels: "",
        tax: "",
        shipping: "",
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
  const handleEditProduct = async (values) => {
    //   //update profile
    console.log("clicked edit");
    let updateUrl = `/admin/edit-product`;
    let productData;

    productData = {
      id: values.id,
      name: values.name,
      image: values.image,
      description: values.description,
      inventoryLevels: values.inventoryLevels,
      tax: values.tax,
      shipping: values.shipping,
    };
    console.log(productData);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(updateUrl, productData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getProductList();
      setProductDetails({
        id: "",
        name: "",
        image: "",
        description: "",
        inventoryLevels: "",
        tax: "",
        shipping: "",
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

  const dateOfJoining = (e) => {
    var date = new Date(e).toLocaleDateString();
    return date;
  };
  useEffect(() => {
    getProductList();
  }, []);
  const DeleteProduct = async (id) => {
    // console.log(id);
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.delete(`/admin/delete-product/${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getProductList();
      } catch (err) {
        console.log(err);
      }
    }
   
  };

  const getProductList = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`/admin/get-product`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setTableData(data.data);
      // console.log("this is product list");
      setSearchedData(data.data);

      console.log(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      console.log("errorrrr", err.response);
    }
  };

  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper style={{ height: "140vh" }}>
            <DashboardHeading
              style={{ display: "flex", flexDirection: "column" }}
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
                <i
                  className="fa-solid fa-cart-shopping"
                  style={{ fontSize: "25px", margin: "5px" }}
                ></i>
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Product Management
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
              {/* <div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "900",
                  marginLeft:"20px",
                  marginTop:"20px"
                }}
              >
                Product Details
              </span>
              <ProductDetails />
              </div> */}

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
                      <TableCell className={classes.tablePadding}>Id</TableCell>
                      <TableCell className={classes.tablePadding}>
                        Name
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Image
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Description
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Tax
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Inventory Levels
                      </TableCell>

                      <TableCell className={classes.tablePadding}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {mappedData.map((category, index) => (
                      <TableRow key={category.id}>
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
                          <div>{get(category, "id", "")}</div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "name", "")}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{ textTransform: "capitalize" }}
                          className="text-center"
                        >
                            <div style={{ width: "35px", margin: "auto" }}>
                              <img
                                src={get(category, "image", "")}
                                width="35px"
                                alt="product" 
                              />
                              {/* <ModalImage
                              small={get(category, "image", "")}
                              large={get(category, "image", "")}
                              alt="Image Preview"
                              hideDownload
                              hideZoom
                            /> */}
                            </div>
                        </TableCell>
                        <Tooltip title={"View Detail Description"} arrow>
                          {/* <TableCell
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className={classes.textMiddle}
                          >
                            <div style={{ textTransform: "capitalize" }}>
                              {get(category, "description", "").slice(0, 35)}
                            </div>
                            <Button
                              style={{
                                fontSize: "14px",
                                paddingLeft: "0px",
                                paddingTop: "0.5rem",
                                color: "blue",
                              }}
                              class="btn"
                              onClick={() =>

                               {console.log('firts')
                                  setOpen(!open)}}
                            >
                              ...more
                            </Button>
                            <div>
                              {open && (
                                <div class="modal-container">
                                  <div class="modal-content">
                                    <div className="close">
                                      <i
                                        style={{ cursor: "pointer" }}
                                        onClick={()=>{setOpen(false)}}
                                        class="fa-regular fa-circle-xmark"
                                      ></i>
                                    </div>
                                    <p>{get(category, "description", "")}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell> */}
                          <TableCell className={classes.textMiddle}>
                              {" "}
                              <MoreLess desc={category.description} />
                            </TableCell>
                        </Tooltip>

                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "tax", "")}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div style={{ textTransform: "capitalize" }}>
                            {get(category, "inventoryLevels", "")}
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
                            <div style={{ display: "flex" }}>
                              <Tooltip title="Edit" arrow>
                                <Button
                                  // variant="outlined"
                                  aria-label="add"
                                  className={classes.iconMargin}
                                  onClick={() => {
                                    // history.push({
                                    //   // pathname: `/adminPanel/user/${category.id}`,
                                    //   pathname: `/adminPanel/category/AddEditCategory/${category._id}`,
                                    // });
                                    setProductDetails({
                                      name: get(category, "name", ""),

                                      image: category?.image,
                                      id: get(category, "id", ""),
                                      description: get(
                                        category,
                                        "description",
                                        ""
                                      ),
                                      tax: get(category, "tax", ""),
                                      inventoryLevels: get(
                                        category,
                                        "inventoryLevels",
                                        ""
                                      ),
                                      shipping: get(category, "shipping", ""),
                                    });
                                    setOpenModal(true);
                                  }}
                                >
                                  <Edit color="primary" />
                                </Button>
                              </Tooltip>
                            </div>
                            <Tooltip title={"Product Details"} arrow>
                              <Button
                                aria-label="add"
                                className={classes.Marginbutton}
                              >
                                <Link
                                  to={`/adminPanel/product-details/${category.id}`}
                                >
                                  <AiIcons.AiFillEye
                                    style={{ fontSize: "1.5rem" }}
                                  />
                                </Link>
                              </Button>
                            </Tooltip>
                            <div>
                            <Tooltip title="Delete" arrow>
                              <Button
                                // variant="outlined"
                                aria-label="add"
                                className={classes.Marginbutton}
                                onClick={() => {
                                  DeleteProduct(category.id);
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
      <Modal
        maxWidth="lg"
        width="540px"
        RoundedCorners={true}
        isOpen={openModal}
        onClose={(event, reason) => {
          setOpenModal(false);
          setProductDetails({
            id: "",
            name: "",
            image: "",
            description: "",
            inventoryLevels: "",
            tax: "",
            shipping: "",
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
              {!productDetails.id ? `Add Product` : `Edit Product`}
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
                  backgroundColor: "#012844",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenModal(false);
                  setProductDetails({
                    id: "",
                    name: "",
                    image: "",
                    description: "",
                    inventoryLevels: "",
                    tax: "",
                    shipping: "",
                  });
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={productDetails}
              enableReinitialize
              initialValues={productDetails}
              validate={productValidator}
              validateOnChange
              onSubmit={(values) => {
                if (values.id) {
                  handleEditProduct(values);
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

                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Name</label>
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
                                  placeholder="Name"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12 mt-2">
                          <label>Product Image</label>
                          <Field name="image">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  className="file-input"
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={
                                    formikBag.values.image
                                      ? [formikBag.values.image]
                                      : []
                                  }
                                  onDelete={(image) => {
                                    formikBag.setFieldValue("image", "");
                                  }}
                                  type="text"
                                  label="upload_products_facility_photos"
                                  info="eg_img"
                                  error={
                                    formikBag.touched.image &&
                                    formikBag.errors.image
                                      ? formikBag.errors.image
                                      : null
                                  }
                                  onChange={async (e) => {
                                    const fileSize =
                                      e.target.files[0].size / 1024 / 1024; // in MiB
                                    if (fileSize > 2) {
                                      alert("ex_2mb");
                                    } else {
                                      var image = await handleImageUpload(
                                        e.target.files[0]
                                      );
                                      // console.log("this is image url", image);
                                      formikBag.setFieldValue("image", image);
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>
                            Description
                          </label>
                          <Field name="description">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.description}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "description",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.description &&
                                    formikBag.errors.description
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
                          <label className={classes.offerLabel}>
                            Inventory Levels
                          </label>
                          <Field name="inventoryLevels">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="number"
                                  variant="outlined"
                                  value={formikBag.values.inventoryLevels}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "inventoryLevels",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.inventoryLevels &&
                                    formikBag.errors.inventoryLevels
                                      ? formikBag.errors.inventoryLevels
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Inventory Levels"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Tax</label>
                          <Field name="tax">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="number"
                                  variant="outlined"
                                  value={formikBag.values.tax}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "tax",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.tax &&
                                    formikBag.errors.tax
                                      ? formikBag.errors.tax
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Tax"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Shipping</label>
                          <Field name="shipping">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="number"
                                  variant="outlined"
                                  value={formikBag.values.shipping}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "shipping",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.shipping &&
                                    formikBag.errors.shipping
                                      ? formikBag.errors.shipping
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Shipping"
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
                          style={{
                            padding: "0.5em 2em",
                            background: "#012844",
                          }}
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
