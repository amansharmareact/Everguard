import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { BiSolidBookContent } from "react-icons/bi";
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
} from "./ContentElements";
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
import RSelect from "react-select";
import JoditEditor from "jodit-react";
import "./Content.css";

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
  const {
    location: { state },
  } = history;
  const classes = useStyles();
  const editor = useRef(null);

  const exportRef = useRef(null);
  let { merchant_id } = useParams();
  const [inputData, setInputData] = useState();
  const [panelName, setPanelName] = useState("user");
  const [heading, setHeading] = useState("PRIVACY_POLICY");
  const [openModal, setOpenModal] = useState(false);
  const [deliveryBoyData, setDeliveryBoydata] = useState({
    firstName: "",
    lastName: "",

    mobileNum: "",
    password: "",
    email: "",
    countryCode: "",
    id: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const panelOptions = [
    { label: "USER", value: "user" },
    { label: "MERCHANT", value: "merchant" },
    { label: "AGENT", value: "agent" },
  ];
  const headingOptions = [
    { label: "Privacy Policy", value: "PRIVACY_POLICY" },
    { label: "Terms And Conditions", value: "TERMS_CONDITIONS" },
    { label: "Return Policy", value: "RETURN_POLICY" },
    { label: "About Us", value: "ABOUT_US" },
    // { label: "Our Services", value: "ourServices" },
  ];

  const initial_values = {
    select1: "PRIVACY_POLICY",
    //  select2: "user",
  };

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
    // console.log(userData);
  }, []);

  useEffect(() => {
    getContent(initial_values);
    // getOffers();
    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination

  const handleSubmit = async (values) => {
    // console.log(values, "print this");
    let addUrl = `/admin/add-content`;
    if (inputData !== "" && inputData !== "<p><br></p>" && heading) {

      try {
        const token = localStorage.getItem("accessToken");
        // const body = editor.current.value;
        // console.log(values.id);
        const { data } = await axios.post(
          addUrl,
          {
            content: `${inputData}`,
            type: heading,
            // createdFor: panelName,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log(data, "this is sent data");
        toast.success(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
  
        // setOpenModal(false);
      } catch (err) {
        console.log(err);
      }
    }
    else {
      alert("Text and Selection fields cannot be blank");
    }
    
  };

  //get content
  const getContent = async (values) => {
    // console.log(values);
    const token = localStorage.getItem("accessToken");
    if (values?.select1 !== "") {
      try {
        const { data } = await axios.get(`/admin/content/${values.select1}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        console.log(data.data);
        setInputData(data.data.content);
      } catch (error) {
        console.log(error);
      }
    } else if (values.select1 === "") {
      toast.info("Please Select Heading", {
        position: "top-right",
      });
      setInputData("");
    }
  };
  // creation and updation
  const Create_Update = async (values) => {
    // if (
    //   inputData !== "" &&
    //   inputData !== "<p><br></p>" &&
    //   heading &&
    //   panelName
    // ) {
    if (inputData !== "" && inputData !== "<p><br></p>" && heading) {
      try {
        // console.log(heading,panelName);
        const token = localStorage.getItem("accessToken");

        const { data } = await axios.post(
          `/admin/add-content`,
          {
            content: `${inputData}`,
            // createdFor: panelName,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(data);
        toast.success("Content Saved Successfully");
        getContent();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Text and Selection fields cannot be blank");
    }
  };

  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading style={{ display: "flex", flexDirection:"column" }}>
              <MenuAndBack
                style={{
                  backgroundColor: "#012844",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BiSolidBookContent
                  style={{ fontSize: "25px", margin: "8px" }}
                />
                <DashHeading
                  style={{
                    color: "white",
                    flex: "1",
                    padding: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  Content Management
                  </DashHeading>
                  </MenuAndBack>
                  <div style={{width:"100%"}}>
                    {" "}
                    <Formik
                      //   validationSchema={validationSchema}
                      initialValues={initial_values}
                      onSubmit={(values) => {
                        // if (values.select1 === "" && values.select2 === "") {
                        if (values.select1 === "") {
                          // toast.info("Please select Panel and Heading", {
                          toast.info("Please select Heading", {
                            position: toast.POSITION.TOP_RIGHT,
                          });
                        } else {
                          getContent(values);
                        }

                        console.log(values);
                      }}
                    >
                      {({ values, setFieldValue, handleSubmit }) => (
                        <Form
                          style={{
                            display: "flex",
                            justifyContent:"end",
                            color: "black",
                            fontSize: "15px",
                          }}
                        >
                          &emsp;
                       
                          <div
                            style={{
                              width: "220px",
                            }}
                          >
                            <RSelect
                              defaultValue={{
                                label: "Privacy Policy",
                                value: "PRIVACY_POLICY",
                              }}
                              options={headingOptions}
                              isSearchable={false}
                              onChange={(e) => {
                                setFieldValue("select1", e.value);
                                setHeading(e.value);
                                // console.log(e.value, 'thisisinwb')
                                handleSubmit(e.value);
                              }}
                            />
                          </div>
                          <br />
                        </Form>
                      )}
                    </Formik>
                  </div>
             
            </DashboardHeading>

            <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",
                height: "100%",
                marginBottom: "0.5rem",
                backgroundColor: "transparent",
              }}
              elevation={0}
            >
              <div>
                <div className="customHeight">
                  <JoditEditor
                    config={{
                      askBeforePasteFromWord: false,
                      askBeforePasteHTML: false,
                      defaultActionOnPaste: "insert_only_text",
                      readonly: false,
                    }}
                    value={inputData}
                    onBlur={(newContent) => {
                      setInputData(newContent);
                    }}
                    // value={category.data?.answer}
                    // config={config}
                    ref={editor}
                    // value={content}
                    // config={config}
                    //tabIndex={1} // tabIndex of textarea
                    //onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                  />
                </div>
                {/* <br /> */}

                {/* <Button
                    variant="contained"
                    style={{ color: "white", backgroundColor: "#0e3f37" }}
                    onClick={() => {
                      Create_Update();
                    }}
                  >
                    Save
                  </Button>
                  <br />
                  <br /> */}
              </div>
            </Paper>
            <div className="row my-2 " style={{ width: "95%" }}>
              <div
                className="col-md-12"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <HeadingButton
                  onClick={() => {
                    // Create_Update();
                    handleSubmit();
                  }}
                  style={{ padding: "0.5em 2em" }}
                >
                  Save
                </HeadingButton>
              </div>
            </div>
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
