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
} from "../BlogManagement/BlogElements";
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
// import { extractDate } from "../../utils/functions";
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
import { AboutDataValidator } from "../../utils/validators";
import TextArea from "../../components/TextArea";
import FileInput from "../../components/FileInput";
// import { uploadImage } from "../../utils/functions";
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
import LexicalEditor from "../../LexicalEditor/index";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

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

const OfferManagement = ({ history, setUsers, userData }) => {
  console.log("jsdjsjdsjdjsdjsdsd",history)
  const classes = useStyles();
  // const {
  //   location: { state },
  // } = history;

  const [searchValue, setSearchValue] = useState("");
  const [datefiltervalue, setDateFilter] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [NameText, setNameText] = useState(null);
  const [NameTextTitle, setNameTextTitle] = useState(null);

  const [LinkNameText, setLinkNameText] = useState(null);
  const [LinkText, setLinkText] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [total_data, setTotalData] = useState(90);
  const [categoryList, setCategoryList] = useState([]);
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [AboutData, setAboutData] = useState({
   
    OurStoryImage:  [],
    OurStoryDescription:  null,
    OurAimImage:  [],
    OurAimDescription:  null,
  
    _id:  "",
  });

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    getAboutUs();

    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    getAboutUs(newPage + 1, rowsPerPage, searchValue);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(+event.target.value);
    // setPage(0);

    getAboutUs(1, event.target.value, searchValue);
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
          getAboutUs(page + 1, rowsPerPage, searchValue);
          // getAboutUs()
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
          getAboutUs(page + 1, rowsPerPage, searchValue);
          // getAboutUs();
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
  const deleteBlog = async (e) => {
    // console.log(e);

    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const { data } = await axios.delete(`/admin/delete_blog?blog_id=${e.categoryId}`);
        getAboutUs(page + 1, rowsPerPage, searchValue);
        // getAboutUs()
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
  const getAboutUs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/admin/get_about_us`);
      setTableData(data.data);
    console.log("aboutus",data)
    console.log( get(data.data, "our_story.description", null))
    setAboutData({...AboutData,
      OurStoryImage: get(data.data, "our_story.image", "") ? [get(data.data, "our_story.image", "")] : [],
      OurStoryDescription: get(data.data, "our_story.description", null),
      OurAimImage:  get(data.data, "our_aim.image", "") ? [get(data.data, "our_aim.image", "")] : [],
      OurAimDescription:  get(data.data, "our_aim.description", null),
      _id:get(data.data,"_id","")
    
    })
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
    getAboutUs(page + 1, rowsPerPage, value.toLowerCase());
    // console.log(value)
  });
  console.log("page", page);
  const handleSubmit = async (values) => {
    console.log(values);
    // if (!id) {
    //   //add profile

    let addUrl = `/admin/create_about_us`;
    let AboutData;

    AboutData = {
      our_story:{
        name:"Our Story",
        image: values.OurStoryImage[0],
        description:values.OurStoryDescription,
       
      },
      our_aim:{
        name:"Our Aim",
        image: values.OurAimImage[0],
        description:values.OurAimDescription,
      }
    };

    try {
      const { data } = await axios.post(addUrl, AboutData);
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getAboutUs()
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
  const handleEditAboutUs = async (values) => {
    //   //update profile

    let updateUrl = `/admin/update_about_us`;
    let AboutData;

    AboutData = {
      _id:values._id,
      our_story:{
      name:"Our Story",
      image: values.OurStoryImage[0],
      description:values.OurStoryDescription,
     
    },
    our_aim:{
      name:"Our Aim",
      image: values.OurAimImage[0],
      description:values.OurAimDescription,
    }
  };

    try {
      const { data } = await axios.patch(updateUrl, AboutData);
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
     getAboutUs()
    } catch (err) {
      if (err.response.status == "400") {
        toast.error(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      console.log(err.response);
    }
  };

  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading>
              <MenuAndBack>
              {/* <Button
                      // variant="outlined"
                      aria-label="add"
                      // style={{c}}
                      // className={classes.iconMargin}
                      onClick={() => {
                        // if (window.confirm("Leave without saving changes?")) {
                          history.push({
                            pathname: "/adminPanel/blog",
                          });
                        // }
                      }}
                    >
                      <ArrowBackIcon />
                    </Button> */}
                <DashHeading>About Us</DashHeading>
              </MenuAndBack>
             
            </DashboardHeading>

            <Paper className={classes.paperTableHeight} style={{ overflow: "auto", height: "100%", marginBottom: "0.5rem" ,padding:"1rem 4rem"}}>
             
            <Formik
              key={AboutData._id}
              enableReinitialize
              initialValues={AboutData}
              validate={AboutDataValidator}
              validateOnChange
              // onSubmit={handleSubmit}
              onSubmit={(values) => {
                if (values._id) {
                  handleEditAboutUs(values);
                } else {
                  handleSubmit(values);
                }
              }}
            >
              {(formikBag) => {
                return (
                  <Form style={{ margin: "1rem 1rem 0 1rem" }}>
                    <div className="signup-cont">
                    <div className="row" style={{fontSize:"1.5rem",fontWeight:500,padding:"1rem 0"}}>Our Story</div>
                      <div className="row">
                        {/* <div className="col-md-12"> */}
                       
                       
                       
                        <div className="col-md-9" style={{ marginBottom: "2rem" }}>
                          <div className="editor-container-1">
                            <label className="label-text" style={{ marginBottom: "1rem" }}>
                              Detailed Description
                            </label>
                          </div>

                          {/* lexical */}
                          <LexicalEditor
                          key={AboutData._id}
                            initialEditorState={formikBag.values.OurStoryDescription}
                            onChange={(editorState, editorInstance) => {
                              formikBag.setFieldValue("OurStoryDescription", editorState);
                            }}
                          />
                          {formikBag.errors.OurStoryDescription ? (
                            <p
                              style={{
                                paddingTop: 5,
                                fontSize: 13,
                                color: "red",
                              }}
                            >
                              {formikBag.errors.OurStoryDescription}
                            </p>
                          ) : null}
                        </div>
                     

                        <div className="col-md-3">
                          <label>Image</label>
                          <Field name="OurStoryImage">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={formikBag.values.OurStoryImage}
                                  onDelete={(image) => {
                                    var images = [...formikBag.values.OurStoryImage];
                                    images.splice(images.indexOf(image), 1);
                                    formikBag.setFieldValue("OurStoryImage", images);
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
                                      var images = [...formikBag.values.OurStoryImage];
                                      console.log("images..........", images.path);
                                      images.push(image);
                                      formikBag.setFieldValue("OurStoryImage", images);

                                      // setIsLoading(false);
                                    }
                                  }}
                                  error={formikBag.touched.OurStoryImage && formikBag.errors.OurStoryImage ? formikBag.errors.OurStoryImage : null}
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                      </div>
                      {/* Our Aim */}
                      <div className="row" style={{fontSize:"1.5rem",fontWeight:500,padding:"1rem 0"}}>Our Aim</div>
                      <div className="row">
                        {/* <div className="col-md-12"> */}
                       
                       
                       
                        <div className="col-md-9" style={{ marginBottom: "2rem" }}>
                          <div className="editor-container-1">
                            <label className="label-text" style={{ marginBottom: "1rem" }}>
                              Detailed Description
                            </label>
                          </div>

                          {/* lexical */}
                          <LexicalEditor
                           key={AboutData._id}
                            initialEditorState={formikBag.values.OurAimDescription}
                            onChange={(editorState, editorInstance) => {
                              formikBag.setFieldValue("OurAimDescription", editorState);
                            }}
                          />
                          {formikBag.errors.OurAimDescription ? (
                            <p
                              style={{
                                paddingTop: 5,
                                fontSize: 13,
                                color: "red",
                              }}
                            >
                              {formikBag.errors.OurAimDescription}
                            </p>
                          ) : null}
                        </div>
                     

                        <div className="col-md-3">
                          <label>Image</label>
                          <Field name="OurAimImage">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={formikBag.values.OurAimImage}
                                  onDelete={(image) => {
                                    var images = [...formikBag.values.OurAimImage];
                                    images.splice(images.indexOf(image), 1);
                                    formikBag.setFieldValue("OurAimImage", images);
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
                                      var images = [...formikBag.values.OurAimImage];
                                      console.log("images..........", images.path);
                                      images.push(image);
                                      formikBag.setFieldValue("OurAimImage", images);

                                      // setIsLoading(false);
                                    }
                                  }}
                                  error={formikBag.touched.OurAimImage && formikBag.errors.OurAimImage ? formikBag.errors.OurAimImage : null}
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
