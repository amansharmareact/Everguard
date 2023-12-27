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
} from "./UserElements";
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
import "./User_Info.css";
import { Link } from "react-router-dom";
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
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import * as IoIcons from "react-icons/io";
import * as HiIcons from "react-icons/hi";
import { get, isEmpty } from "lodash";
import classNames from "classnames";
import Select from "../../components/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter, useParams } from "react-router-dom";
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
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "0.5rem",
    textAlign: "center",
    fontSize: "0.8rem",
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

const User_Information = ({ history, setUsers, userData }) => {
  const classes = useStyles();

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
  const [shortId, setShortId] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("id");

  useEffect(() => {
    if (!userData) {
      history.push("/adminPanel");
    }
  }, []);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const userDetails = await axios.get(`/admin/user/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setSearchedData(userDetails.data.data);
      setIsLoading(false);

      // console.log(userDetails.data.data);

      
      // console.log(userDetails.data.data, 'this is user details')
    } catch (e) {
      console.log(e);
    }
  };

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
                <ArrowBackIosIcon
                  style={{ color: "white", margin: "8px", cursor: "pointer" }}
                  onClick={() => history.push("/adminPanel/user")}
                />
                <DashHeading style={{ color: "white", flex: "1" }}>
                  View
                </DashHeading>
              </MenuAndBack>
            </DashboardHeading>

            <Paper
              className={classes.paperTableHeight}
              style={{ overflow: "hidden", height: "100%" }}
            >
              <div className="view-body">
                <div className="section1 row">
                  <div className="total-orders col-5">
                    <span
                      style={{
                        fontSize: "18px",
                        margin: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Total Order :{" "}
                    </span>
                    <span>{searchedData.total_orders}</span>

                    <Link to={`/adminPanel/user-orders?id=${id}`}>
                      <button type="button" className="btn btn-link">
                        See all orders
                      </button>
                    </Link>
                    {/* <button style={{ width: "110px", height: "30px" }}>See all orders</button> */}
                  </div>
                  <div className="total-orders col-5">
                    <span
                      style={{
                        fontSize: "18px",
                        margin: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Total Revenue :{" "}
                    </span>
                    <span>$400</span>
                  </div>
                </div>
                <div className="user-details row justify-content-between">
                  <div
                    className="col-5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {Object.hasOwn(searchedData, "profile_image") ? (
                      <img className="rounded-circle" src={searchedData.profile_image} width="180px" height='180px'  />
                    ) : (
                      <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" width='230px'/>
                    )}
                  </div>

                  <div className="col-5">
                    <div className="details">
                      <span>Date of Joining</span>
                      <span>
                        {" "}
                        {moment(searchedData?.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="details">
                      <span>Name</span>
                      <span>
                        {searchedData.first_name + " " + searchedData.last_name}
                      </span>
                    </div>
                    <div className="details">
                      <span>User ID</span>
                      <span>{searchedData._id}</span>
                    </div>

                    <div className="details" style={{marginBottom:"32px"}}>
                      <span>Email Address</span>
                      <span>{searchedData.email}</span>
                    </div>
                  </div>
                </div>
              </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(User_Information));
