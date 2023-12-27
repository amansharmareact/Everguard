import React, { useState, useEffect, Component, useRef, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import EditIcon from "@material-ui/icons/Edit";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Swal from "sweetalert2";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  styled,
  Tooltip,
} from "@material-ui/core";
import "./FAQ_Management.css";
// import { Delete } from '@material-ui/icons';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import BlockIcon from '@material-ui/icons/Block';
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
// import SearchBar from "material-ui-search-bar";
// import { orderBy } from "lodash";

//history
// import {useHistory} from 'react-router-dom'
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
// import EditIcon from '@material-ui/icons/Edit';
// import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
// import React, { Component } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
// import { EditorState, convertToRaw, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import QNA from "./QNA_Component";
import JoditEditor from "jodit-react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { get } from "lodash";
import RSelect from "react-select";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    // marginTop: '5rem',
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  paperHeading: {
    padding: "1rem 0rem",
  },
  table: {
    minWidth: 650,
  },
  textMiddle: {
    verticalAlign: "middle !important",
  },
  iconMargin: {
    margin: "0.5rem",
    color: "#696969",
    backgroundColor: "#fff",
  },
  iconcolor: {
    margin: "0.5rem",
    color: "#fff",
    backgroundColor: "#0e3f37 !important",
  },
  headingButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "10px",
  },
  headingAlignment: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: "0 2rem 0 2rem"
    alignItems: "center",
    flexWrap: "wrap",
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  Marginbutton: {
    margin: "0.5rem",
  },
  container: {
    maxHeight: "58vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
}));

export default function FAQ_Management(props) {
  const classes = useStyles();
  // const registrationForm = useRef();

  useEffect(() => {
    // getactivemenuitem();
  }, []);
  const {
    location: { state },
  } = props;
  console.log(props);
  // const getactivemenuitem = () => {
  //   const result = [...document.getElementsByTagName("a")];
  //   const newres = result.filter((ele) => {
  //     if (ele.innerText === "Manage FAQ") {
  //       return ele;
  //     }
  //   });
  //   newres[0].classList.add("activate");
  //   console.log(newres);
  //   console.log(result);
  // };
  const [tableData, setTableData] = useState([]);
  // const [inputData, setInputData] = useState("");
  // const [inputData2, setInputData2] = useState("");

  // const [inputquestion, setInputquestion] = useState("");
  // const [inputquestion2, setInputquestion2] = useState("");
  const [buttonDisabling, setButtonDisabling] = useState(false);

  const [storeType, setType] = useState("USER");
  //   const [tabColor, setTabColor] = useState("1");

  const [show, setShow] = useState(true);

  useEffect(() => {
    getCategoriesContent("USER");
    //  setInputData2("");
  }, []);

  //get content
  const getCategoriesContent = async (type) => {
    console.log("type", type);
    setType(type);

    try {
      if (type === "USER") {
        setTableData([]);
        const { data } = await axios.post(`/private/faqList`, { faq_type: "user" });
        console.log(data);
        setTableData(data.data);

        setButtonDisabling(false);
        // setSearchedData(data.user)
        // setIsLoading(false)
      } else if (type === "DRIVER") {
        setTableData([]);
        const { data } = await axios.post(`/private/faqList`, { faq_type: "driver" });
        console.log(data);
        setTableData(data.data);

        setButtonDisabling(false);
      }
      // else if (type === "DRIVER") {
      //   setTableData([]);
      //   const { data } = await axios.get(`/user/getFaqByPanel?panel=DRIVER`);
      //   console.log(data);
      //   setTableData(data.data);

      //   setButtonDisabling(false);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tableData);

  const handleUpdate = async (values) => {
    // console.log(category);
    // if (category){
    // let check = /(<([^>]+)>)/gi;
    // let checktags = values.newAnswer.replace(check, " ");
    try {
      setButtonDisabling(true);
      const { data } = await axios.put(`/private/faqUpdate/${values.id}`, {
        // _id: values.id,
        question: values.newQuestion,
        // answer: checktags,
        answer: values.newAnswer,
        faq_type: state[0] === "USER" ? "user" : "driver",
      });

      // window.location.reload();
      // getCategoriesContent();
      toast.success("Updated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      props.history.push({
        pathname: "/adminPanel/FAQ_Management",
        state: state[0],
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = async (values) => {
    try {
      setButtonDisabling(true);
      // let panelName = "USER";
      // let check = /(<([^>]+)>)/gi;
      // let checktags = values.newAnswer.replace(check, " ");
      // console.log(checktags);
      const { data } = await axios.post("/private/faqCreate", {
        // _id: category.data._id,
        question: values.newQuestion,
        // answer: checktags,
        answer: values.newAnswer,
        faq_type: state[0] === "USER" ? "user" : "driver",
      });

      // window.location.reload();
      //   getCategoriesContent(storeType);
      //   setTimeout(() => {
      //     setShow(true);
      //   }, 401);
      toast.success("Added Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      props.history.push({
        pathname: "/adminPanel/FAQ_Management",
        state: state[0],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handle_Deletion = async (id) => {
    try {
      const { data } = await axios.post("/admin/deleteFaq", {
        _id: id,
      });
      // window.location.reload();
      // getCategoriesContent();
      toast.success("Deleted Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const options = [
    { value: "USER", label: "USER" },
    { value: "DRIVER", label: "DRIVER" },
    // { value: "DRIVER", label: "DRIVER" },
  ];
  console.log(state[2]);

  const handleBackButton = () => {
    Swal.fire({
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      title: "Do you want to save the changes?",
      showConfirmButton: false,
      showDenyButton: true,
      showCloseButton: true,
      showCancelButton: false,
      // confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        props.history.push({
          pathname: "/adminPanel/FAQ_Management",
          state: state[0],
        });
      } else if (result.isCancelled) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-4">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <Button
                    // variant="outlined"
                    // aria-label="add"
                    // className={classes.iconMargin}
                    onClick={() => {
                      handleBackButton();
                      // if (window.confirm("Leave without saving changes?")) {
                      //   props.history.push({
                      //     pathname: "/adminPanel/FAQ_Management",
                      //     state: state[0],
                      //   });
                      // }
                    }}
                  >
                    <ArrowBackIosIcon />
                    BACK
                  </Button>
                  <h3 style={{}}>{`${state[0] === "DRIVER" ? "DRIVER" : "USER"} ${state[1]}`}</h3>
                  <div style={{ width: "20%" }}>
                    {/* <RSelect
                      defaultValue={{ label: "USER", value: "USER" }}
                      options={options}
                      onChange={(e) => {
                        getCategoriesContent(e.value);
                      }}
                    /> */}
                    {/* <Button
                      variant="contained"
                      className="buttoncss"
                      style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/AddEditFAQ",
                          state: panelName,
                        });
                      }}
                    >
                      Add
                    </Button> */}
                  </div>
                </Paper>
                <Paper elevation={0}>
                  <div>
                    {/* <Button variant="contained" style={{ backgroundColor: '#0e3f37', color: "white" }}  onClick={()=>{getCategoriesContent("all")}}>All</Button>&emsp; */}
                    {/* <Button
                      variant="contained"
                      className={`${
                        tabColor === "1" ? "customButton" : "defaultButton"
                      }`}
                      onClick={() => {
                        getCategoriesContent("price");
                        setTabColor("1");
                      }}
                    >
                      Price
                    </Button>
                    &emsp;
                    <Button
                      variant="contained"
                      className={`${
                        tabColor === "2" ? "customButton" : "defaultButton"
                      }`}
                      onClick={() => {
                        setTabColor("2");
                        getCategoriesContent("service");
                      }}
                    >
                      Service
                    </Button> */}
                  </div>
                  <br />
                </Paper>
                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper elevation={0}>
                  {/* <Formik
                      key={index}
                      initialValues={{
                        question: get(category, "question", ""),
                        answer: get(category, "answer", ""),
                        id: get(category, "_id", ""),
                      }}
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
                      onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                          //  alert(JSON.stringify(values, null, 2));
                          handleUpdate(values);
                          setSubmitting(false);
                        }, 400);
                      }}
                    >
                       */}

                  {show && (
                    <Formik
                      initialValues={{
                        newQuestion: get(state[2], "question", ""),
                        newAnswer: get(state[2], "answer", ""),
                        id: get(state[2], "_id", ""),
                      }}
                      validate={(values) => {
                        const errors = {};
                        console.log(values);
                        if (!values.newQuestion) {
                          errors.newQuestion = "Required";
                        }
                        if (
                          //  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                          values.newAnswer === "" ||
                          values.newAnswer === "<p><br></p>"
                        ) {
                          errors.newAnswer = "Required";
                        }
                        return errors;
                      }}
                      onSubmit={(values, { setSubmitting }) => {
                        // setTimeout(() => {
                        //  alert(JSON.stringify(values, null, 2));
                        state[1] === "ADD FAQ" ? handleAdd(values) : handleUpdate(values);

                        // setSubmitting(false);
                        // }, 400);

                        //  getCategoriesContent(storeType);
                        // window.location.reload();
                        setShow(false);
                      }}
                    >
                      {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                          <label className="label-text">QUESTION</label>
                          <Field type="text" name="newQuestion" className="form-control" placeholder="New Question" />
                          <ErrorMessage name="newQuestion" component="div" className="text-danger" />
                          <br />
                          <div className="editor-container-1">
                            <label className="label-text">ANSWER</label>
                            <JoditEditor
                              value={values.newAnswer}
                              name="newAnswer"
                              onChange={(newContent) => {
                                // SettingData(newContent);

                                setFieldValue("newAnswer", newContent);
                              }}
                            />
                          </div>
                          <ErrorMessage name="newAnswer" component="div" className="text-danger" />
                          <br />
                          <Button
                            variant="contained"
                            type="submit"
                            // style={{ backgroundColor: `${buttonDisabling?'#696969':'#0e3f37'}`, color: "white" }}
                            // onClick={()=>{handleAdd()}}
                            style={{
                              backgroundColor: "#0059cd",
                              color: "white",
                            }}
                            disabled={isSubmitting}
                          >
                            {state[1] === "ADD FAQ" ? "ADD" : "SAVE"}
                          </Button>
                          <br />
                          <br />
                        </Form>
                      )}
                    </Formik>
                  )}
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
