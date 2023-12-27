import React, { useState, useEffect, useRef } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ModalImage from "react-modal-image";
import Tippy from "@tippyjs/react";
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
} from "./BannerElements";
import JoditEditor from "jodit-react";

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
  Switch,
  styled,
} from "@material-ui/core";
import { handleImageUpload } from "../../utils/functions";
import * as BsIcons from "react-icons/bs";

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

import Nodata from "../../components/Nodata";
import { SlClose } from "react-icons/sl";
import { BannerDataValidator } from "../../utils/validators";
import { AiOutlineBorderInner } from "react-icons/ai";

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
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [BannerData, setBannerData] = useState({
    title: "",
    //  icon: get(CategoryData, "icon", ""),
    // icon:"",
    //  editIcon: "",
    description: "",
    icon: "",
    status: "",
    id: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const editor = useRef(null);
  const [tableData, setTableData] = useState([]);

  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [plaintext, setPlaintext] = useState("");

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    getBannerList();
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

  // const getOffers = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data } = await axios.get("/admin/get-users/BUYER");
  //     console.log("buyer", data);
  //     setTableData(data.data);
  //     setSearchedData(data.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setUsers("");
  //     history.push("/adminPanel");
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("userData");
  //   }
  // };

  // const handleDeleteOffers = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this Product ?")) {
  //     try {
  //       const { data } = await axios.post("/superMarket/delete_product", {
  //         _id: id,
  //       });
  //       getOffers();
  //       toast.success(`${data.message}`, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       toast.error(`${error.response.data.message}`, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     }
  //   } else {
  //     getOffers();
  //   }
  // };

  const requestSearch = (searchedVal) => {
    console.log("searchedVal", searchedVal);
    console.log("searchedVal", searchedData);
    const filteredRows = searchedData.filter((row) => {
      let name = row.name;
      // let mobileNumber = JSON.stringify(get(row, "mobileNumber", ""));
      // let unitId = JSON.stringify(get(row, "sequenceId", ""));
      return name
        .toLowerCase()
        .includes(searchedVal.target.value.toLowerCase());
      // mobileNumber.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
      // unitId.toLowerCase().includes(searchedVal.target.value.toLowerCase())
    });
    setTableData(filteredRows);
  };

  // const cancelSearch = () => {
  //   setSearched("");
  //   getOffers();
  // };

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

  // const userBlocked = async (e) => {
  //   // console.log(e);
  //   if (e.categoryBlocked === true) {
  //     if (window.confirm("Are you sure you want to unblock this agent?")) {
  //       try {
  //         await axios.post("/admin/updateAgent", {
  //           _id: e.categoryId,
  //           isBlocked: false,
  //         });
  //         // getDeliverBoysList();
  //         toast.success("User unblocked successfully", {
  //           position: toast.POSITION.TOP_RIGHT,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       // getCategory();
  //     }
  //   } else if (e.categoryBlocked === false) {
  //     if (window.confirm("Are you sure you want to block this agent?")) {
  //       try {
  //         await axios.post("/admin/updateAgent", {
  //           _id: e.categoryId,
  //           isBlocked: true,
  //         });
  //         // getDeliverBoysList();
  //         toast.success("User blocked successfully", {
  //           position: toast.POSITION.TOP_RIGHT,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       // getCategory();
  //     }
  //   } else {
  //     return "error";
  //   }
  // };

  const dateOfJoining = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const getBannerList = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`/admin/get-banners`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setTableData(data.data);
      setSearchedData(data.data);
      // console.log("this is bnr data", data.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      console.log("errorrrr", err.response);
      if (err.response.status === 401 || err.response.status === 500) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
    }
  };

  const DeleteBanner = async (id) => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.delete(`/admin/delete-banner/${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // getDeliverBoysList();
        getBannerList();
      } catch (err) {
        console.log(err);
      }
    }
    //  else {
    //   toast.error(`Error`, {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }
  };

  const statusSwitch = async (e, category) => {
    console.log("category", category);

    if (category.status) {
      if (window.confirm("Are you sure you want to block?")) {
        try {
          const token = localStorage.getItem("accessToken");
          const { data } = await axios.post(
            `/admin/edit-banner-status`,
            {
              id: category.id,
              status: !e.target.checked,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          // console.log(data);
          // console.log(e.target.checked);
          toast.error(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getBannerList();
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (!category.status) {
      if (window.confirm("Are you sure you want to unblock?")) {
        try {
          const token = localStorage.getItem("accessToken");
          const { data } = await axios.post(
            `/admin/edit-banner-status`,
            {
              id: category.id,
              status: !e.target.checked,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          // console.log(data);
          // console.log(e.target.checked);
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getBannerList();
        } catch (error) {
          console.log(error);
        }
      }
    }

    //  else {
    // toast.error("Please add fare first", {
    //   position: toast.POSITION.TOP_RIGHT,
    // });
    // }
  };
  const handleSubmit = async (values) => {
    // console.log("clicked submit");

    // if (!id) {
    //   //add profile

    let addUrl = `/admin/add-banner`;
    let bannerData;

    bannerData = {
      description: values.description,
      title: values.title,
      image: values.icon,
    };
    // console.log(bannerData)
    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.post(addUrl, bannerData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getBannerList();
      setBannerData({
        name: "",
        description: "",
        icon: "",
        id: "",
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
  const handleEditBanner = async (values) => {
    //   //update profile
    // console.log("clicked edit");
    let updateUrl = `/admin/edit-banner`;
    let bannerData;

    bannerData = {
      id: values.id,
      title: values.title,
      description: values.description,
      image: values.icon,
    };
    // console.log(bannerData)
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(updateUrl, bannerData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getBannerList();
      setBannerData({
        title: "",
        description: "",
        icon: "",
        id: "",
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

  function convertHtmlToPlainText(html) {
    const temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = html;
    return temporaryElement.textContent || temporaryElement.innerText || "";
  }
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading
              style={{ display: "flex", flexDirection: "column" }}
            >
              <MenuAndBack
                style={{
                  height: "50px",
                  backgroundColor: "#012844",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BsIcons.BsFillImageFill
                  style={{ fontSize: "25px", margin: "8px" }}
                />

                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Banner Management
                </DashHeading>
              </MenuAndBack>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "10px",
                  marginBottom: "10px",
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
                        direction={orderBy === "planName" ? order : "asc"}
                        onClick={() => {
                          handleSortRequest("planName");
                        }}
                        > */}
                        Date
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                        active={true}
                        direction={orderBy === "planName" ? order : "asc"}
                        onClick={() => {
                          handleSortRequest("planName");
                        }}
                        > */}
                        Image
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Description
                      </TableCell>
                      {/* <TableCell className={classes.tablePadding}>Agent Id</TableCell> */}
                      {/* <TableCell className={classes.tablePadding}> */}
                      {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "name" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("name");
                          }}
                        > */}
                      {/* Banner Name */}
                      {/* </TableSortLabel> */}
                      {/* </TableCell> */}
                      <TableCell className={classes.tablePadding}>
                        Status
                      </TableCell>
                      {/* <TableCell className={classes.tablePadding}>
                        <TableSortLabel
                          active={true}
                          direction={orderBy === "price" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("price");
                          }}
                        >
                          Price
                        </TableSortLabel>
                      </TableCell> */}
                      {/* <TableCell className={classes.tablePadding}>
                        <TableSortLabel
                          active={true}
                          direction={orderBy === "planType" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("planType");
                          }}
                        >
                          Time Period
                        </TableSortLabel>
                      </TableCell> */}

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
                          <div>{dateOfJoining(category.createdAt)}</div>
                          {/* <img src={get(category, "image", "")} alt="icon" style={{ width: "30px", height: "30px" }} /> */}
                        </TableCell>
                        {/* <Tippy content="Click to view"> */}
                        <TableCell
                          className={` ${classes.textMiddle} d-flex align-items-center justify-content-center`}
                        >
                          {/* <Tooltip
                            title="Click to view"
                            arrow
                          > */}
                            <div
                              onClick={() => {
                                setIsOpen(true);
                              }}
                              style={{ cursor:"pointer", marginBottom:"4px" }}
                            >
                              <img src={get(category, "image", "")} alt="" width="52px"  />
                              {/* <ModalImage
                                small={get(category, "image", "")}
                                large={get(category, "image", "")}
                                alt="Image Preview"
                                hideDownload
                                hideZoom
                              /> */}
                            </div>
                          {/* </Tooltip> */}
                        </TableCell>
                        {/* </Tippy> */}

                        <TableCell className={classes.textMiddle}>
                          <div>
                            {convertHtmlToPlainText(
                              get(category, "description", "")
                            )}
                          </div>
                        </TableCell>

                        <Tooltip
                          title={category.status ? "Block" : "Unblock"}
                          arrow
                        >
                          <TableCell
                            className={classes.textMiddle}
                            style={{ textAlign: "center" }}
                          >
                            <IOSSwitch
                              onChange={(e) => {
                                statusSwitch(e, category);
                              }}
                              checked={!category.status}
                            />
                          </TableCell>
                        </Tooltip>

                        <TableCell className={classes.tableFlex}>
                          <div>
                            <Tooltip title="Edit" arrow>
                              <Button
                                // variant="outlined"
                                aria-label="add"
                                className={classes.iconMargin}
                                onClick={() => {
                                  // console.log('clcljc')
                                  // history.push({
                                  //   // pathname: `/adminPanel/user/${category.id}`,
                                  //   pathname: `/adminPanel/category/AddEditCategory/${category._id}`,
                                  // });
                                  setBannerData({
                                    title: get(category, "title", ""),
                                    description: get(
                                      category,
                                      "description",
                                      ""
                                    ),

                                    icon: category?.image,
                                    id: get(category, "id", ""),
                                  });
                                  setOpenModal(true);
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
                                  DeleteBanner(category.id);
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
        width="440px"
        RoundedCorners={true}
        isOpen={openModal}
        // RoundedCorners={true}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
            setBannerData({
              title: "",
              //  icon:"",
              //  editIcon: "",
              icon: "",
              id: "",
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
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "22px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {!BannerData.id ? `Add Banner` : `Edit Banner`}
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
                  setBannerData({
                    title: "",
                    description: "",
                    icon: "",
                    id: "",
                  });
                  // setSelectedPetCategoryData(null);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={BannerData}
              enableReinitialize
              initialValues={BannerData}
              validate={BannerDataValidator}
              validateOnChange
              onSubmit={(values) => {
                // console.log('banner claade')
                if (values.id) {
                  handleEditBanner(values);
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
                            Banner Name
                          </label>
                          <Field name="title">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.title}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "title",
                                      e.target.value
                                    );
                                  }}
                                  className="form-control"
                                  placeholder="Banner Name"
                                />
                                {formikBag.touched.title &&
                                  formikBag.errors.title && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.title}
                                    </div>
                                  )}
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>
                            Banner Description
                          </label>
                          <Field name="description">
                            {({ field, form }) => (
                              <div className="pb-2 mt-1">
                                <JoditEditor
                                  style={{
                                    padding: "0.375rem 0.75rem",
                                    fontSize: "1rem",
                                    fontWeight: "400",
                                  }}
                                  ref={editor}
                                  value={formikBag.values.description}
                                  onChange={(newContent) => {
                                    form.setFieldValue(
                                      "description",
                                      newContent
                                    );
                                  }}
                                />

                                {form.touched.description &&
                                  form.errors.description && (
                                    <div style={{ color: "red" }}>
                                      {form.errors.description}
                                    </div>
                                  )}
                              </div>
                            )}
                          </Field>
                          {/* <Field name="description">
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
                                  placeholder="Banner Description"
                                />
                              </div>
                            )}
                          </Field> */}
                        </div>
                        <div className="col-md-12 mt-2">
                          <label>Banner Image</label>
                          <Field name="icon">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  className="file-input"
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={
                                    formikBag.values.icon
                                      ? [formikBag.values.icon]
                                      : []
                                  }
                                  onDelete={(image) => {
                                    formikBag.setFieldValue("icon", "");
                                  }}
                                  type="text"
                                  label="upload_products_facility_photos"
                                  info="eg_img"
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
                                      formikBag.setFieldValue("icon", image);
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
