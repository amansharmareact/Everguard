import React, { useState, useEffect, useRef } from "react";
import { FaQuestion } from "react-icons/fa";

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
} from "./FAQElements";
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

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { SlClose } from "react-icons/sl";
import JoditEditor from "jodit-react";

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
  const exportRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  const [menuState, setMenuState] = useState({
    isOfferVoucher: true,
    isAddOffer: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [FaqData, setFaqData] = useState({
    question: "",
    answer: "",

    _id: "",
  });
  const [search, setSearch] = useState("");
  const [totalData, setTotalData] = useState(90);

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    getFaqData();
    // getOffers();
    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    getFaqData(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(+event.target.value);
    // setPage(0);

    getFaqData(1, event.target.value);
    console.log("checkrows");
    console.log(parseInt(event.target.value, 10));
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
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
            _id: e.categoryId,
            isBlocked: false,
          });
          getFaqData();
          toast.success("Agent unblocked successfully", {
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
          getFaqData();
          toast.success("Agent blocked successfully", {
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

  const getFaqData = async (page = 1, rowsPerPage = 15, search = "") => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(
        `/get-faq?page=${page}&pageSize=${rowsPerPage}&searchTerm=${search}`
     , {
      headers: {
        Authorization: "Bearer " + token,
      },
    } );
    // console.log(data)
      setTableData(data.data);
      setSearchedData(data.data);
    setIsLoading(false);

      setPage(page - 1);
      setTotalData(data.data.length);
      // console.log(data.data.docs,"djdjjjdjdjjdjdjh");
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      console.log("errorrrr", err.response);
   
    }
  };

  const DeleteFaq = async (id) => {
    
    if (window.confirm("Are you sure you want to delete this question?"))
    { 
      try {
        // console.log(id) 
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.delete(`/admin/delete-faq/${id}`,  {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getFaqData();
    } catch (err) {
      console.log(err);
    }}
  };

  const handleSubmit = async (values) => {
    let addUrl = `/admin/create-faq`;
    let faqData = {
      question: values.question,
      answer: values.answer,
    };
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(addUrl, faqData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      getFaqData();
      setOpenModal(false);
      getFaqData();
      setFaqData({
        question: "",
        answer: "",
        _id: "",
      });
    } catch (err) {
      console.log(err)
    }
  };

  const handleEdit = async (values) => {
    console.log(values, 'this is values')
    let editUrl = `/admin/edit-faq`;
    let faqData = {
      question: values.question,
      answer: values.answer,
      id: values._id,
    };
    console.log(editUrl, 'this is url')
    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.put(editUrl, faqData,  {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      getFaqData();
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setOpenModal(false);
      setFaqData({
        question: "",
        answer: "",

        _id: "",
      });
    } catch (err) {
      console.log(err)
    }
  };
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
                  backgroundColor: "#012844",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaQuestion style={{ fontSize: "25px", margin: "8px" }} />
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  FAQ Management
                </DashHeading>
              </MenuAndBack>

              {/* <SearchBar
                                className={classes.searchDesign}
                                value={searched}
                                onChange={(searchVal) => requestSearch(searchVal)}
                                onCancelSearch={() => cancelSearch()}
                                placeholder="Search by Product Name"
                                 /> */}

              <div style={{ display: "flex", gap: "1rem" , width:"100%", justifyContent:"end"}}>
               
                <Tooltip
                  title={
                    <span style={{ color: "white", fontSize: "16px" }}>
                      Add Faq
                    </span>
                  }
                  arrow
                >
                  <IconButton
                    className=""
                    style={{
                      background:
                        "transparent linear-gradient(90deg, #012844 0%, #012844 100%) 0% 0% no-repeat padding-box",
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
                  <TableBody>
                    {
                      // tableData
                      recordsAfterPagingAndSorting().map((category, index) => (
                        <TableRow key={category._id}>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              className="my-2"
                              style={{minHeight:"0px"}}
                            >
                              <Typography>
                                {" "}
                                <strong style={{width:"100%"}}>Question:</strong>&emsp;
                              </Typography>
                              <Typography>
                                {/* <Field
                                  type="text"
                                  name="question"
                                  className="form-control"
                                  placeholder="Question"
                                /> */}
                                {category?.question}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              
                              <Typography>
                                <div className="d-flex ">
                                <div>
                                <strong>Answer:</strong>
                                </div>
                                <div style={{marginLeft:"1rem"}}
                                  dangerouslySetInnerHTML={{
                                    __html: category?.answer,
                                  }}
                                />
                                </div>

                                <br />
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: " #012844 ",
                                    color: "white",
                                  }}
                                  // onClick={()=>{
                                  //   handleCreate_Update2(category)
                                  // }}
                                  // type="submit"
                                  // disabled={isSubmitting}
                                  onClick={() => {
                                    // props.history.push({
                                    //   pathname: "/adminPanel/AddEditFAQ",
                                    //   state: [storeType, "EDIT FAQ", category],
                                    // });
                                    setOpenModal(true);
                                    setFaqData({
                                      question: get(category, "question", ""),
                                      answer: get(category, "answer", ""),

                                      _id: get(category, "_id", ""),
                                    });
                                  }}
                                >
                                  <Edit />
                                </Button>
                                &emsp;
                                <Button
                                  variant="contained"
                                  type="button"
                                  style={{
                                    backgroundColor: " #012844 ",
                                    color: "white",
                                  }}
                                  onClick={() => {
                                    // handle_Deletion(category._id);
                                    // getCategoriesContent(storeType);
                                    DeleteFaq(category._id);
                                  }}
                                >
                                  <DeleteOutline />
                                </Button>
                                <br />
                                <br />
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              {
                // totalData === 0
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
                count={totalData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {/* {tableData?.map((category, index) => (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="my-2"
                  >
                    <Typography>
                      {" "}
                      <strong>Question:</strong>&emsp;
                    </Typography>
                    <Typography>
                     
                      {category?.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                   
                      <strong>Answer :</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: category?.answer,
                        }}
                      />
                      <br />
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: " #012844 ",
                          color: "white",
                        }}
                        // onClick={()=>{
                        //   handleCreate_Update2(category)
                        // }}
                        // type="submit"
                        // disabled={isSubmitting}
                        onClick={() => {
                          // props.history.push({
                          //   pathname: "/adminPanel/AddEditFAQ",
                          //   state: [storeType, "EDIT FAQ", category],
                          // });
                          setOpenModal(true);
                          setFaqData({
                            question: get(category, "question", ""),
                            answer: get(category, "answer", ""),

                            _id: get(category, "_id", ""),
                          });
                        }}
                      >
                        <Edit />
                      </Button>
                      &emsp;
                      <Button
                        variant="contained"
                        type="button"
                        style={{
                          backgroundColor: " #012844 ",
                          color: "white",
                        }}
                        onClick={() => {
                          // handle_Deletion(category._id);
                          // getCategoriesContent(storeType);
                          DeleteFaq(category._id);
                        }}
                      >
                        <DeleteOutline />
                      </Button>
                      <br />
                      <br />
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))} */}
            </Paper>
          </DashboardWrapper>
        </DashboardContainer>
      </div>
      <Modal
        maxWidth="lg"
        width="740px"
        RoundedCorners={true}
        isOpen={openModal}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
            setFaqData({
              question: "",
              answer: "",

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
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "22px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {!FaqData._id ? `Add Faq` : `Edit Faq`}
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
                  setFaqData({
                    question: "",
                    answer: "",

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
              key={FaqData}
              enableReinitialize
              initialValues={
                FaqData
                // {
                // name: get(FaqData, "planName", ""),
                // features: get(FaqData, "features", ""),
                // planType: !FaqData
                //   ? ""
                //   : PlanDuration.filter((ele) => FaqData?.planType === ele.value)[0],
                // price: get(FaqData, "price", ""),
                // }
              }
              validate={(values) => {
                const errors = {};
                console.log(values);
                if (!values.question) {
                  errors.question = "Required";
                }
                if (
                  //  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  values.answer === "" ||
                  values.answer === "<p><br></p>"
                ) {
                  errors.answer = "Required";
                }
                return errors;
              }}
              validateOnChange
              onSubmit={(values) => {
                if (values._id) {
                  handleEdit(values);
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
                          <label className={classes.offerLabel}>Question</label>
                          <Field name="question">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.question}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "question",
                                      e.target.value
                                    );
                                  }}
                                  // error={
                                  //   formikBag.touched.question && formikBag.errors.question ? formikBag.errors.question : null
                                  // }
                                  className="form-control"
                                  placeholder="Question"
                                />
                                <ErrorMessage
                                  name="question"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12">
                          <div className="editor-container-1">
                            <label className="label-text">Answer</label>
                            <JoditEditor
                              value={formikBag.values.answer}
                              name="answer"
                              onChange={(newContent) => {
                                // SettingData(newContent);

                                formikBag.setFieldValue(
                                  "answer",
                                  newContent
                                );
                              }}
                            />
                          </div>
                          <ErrorMessage
                            name="answer"
                            component="div"
                            className="text-danger"
                          />
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
