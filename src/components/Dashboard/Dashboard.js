import React, { useState, useEffect } from "react";
import {
  DashboardContainer,
  DashboardWrapper,
  DashboardHeading,
  DashHeading,
} from "./DashboardElement";
import { Paper, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../axios";
import Overlay from "../Overlay";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";
import { MenuAndBack } from "../../pages/UserManagement/UserElements";
import DashboardCard from "./DashboardCard";
import { MdDashboard } from "react-icons/md";


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
  },
  tableFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentHeight: {
    fontSize: "1rem",
  },
  displayFlex: {
    height: "auto",
    width: "95%",
    marginLeft: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0px",
  },
}));

const Dashboard = ({ history, userData }) => {

  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userData) {
    
      history.push("/adminPanel");
    }
    // getCount();
  }, []);

  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showFilter, setShowFilter] = useState(false);
  const [datefiltervalue, setDateFilter] = useState();
  const closeFilterMenu = (event) => {
    if (showFilter && !event.target.closest('#yourFilterMenuId')) {
      console.log('clicked')
      setShowFilter(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', closeFilterMenu);
    return () => {
      document.removeEventListener('click', closeFilterMenu);
    };
  }, [showFilter]);
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
                <MdDashboard style={{ fontSize: "25px", margin: "8px" }} />
                
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Dashboard
                </DashHeading>
              </MenuAndBack>

              <div
                className="d-flex flex-column align-items-end"
                style={{ width: "100%" }}
              >
                <div>
                  <Tooltip
                    title={
                      <span style={{ color: "white", fontSize: "16px" }}>
                        Filter
                      </span>
                    }
                    arrow
                  >
                    <div
                      class="dropdown"
                    id="yourFilterMenuId"
                      style={{ width: "124px", height: " 45px" }}
                    >
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-mdb-toggle="dropdown"
                        aria-expanded="false"
                        onClick={() => {
                          setShowFilter(!showFilter);
                        }}
                        style={{
                          color: "white",
                          backgroundColor: "#012844",
                          width: "100%",
                          height: "100%",
                          padding: "5px",
                        }}
                      >
                        Filter
                      </button>
                    </div>
                  </Tooltip>

                  {showFilter ? (
                    <div
                      className="box arrow-top"
                      id="yourFilterMenuId"
                      style={{
                        display: "flex",
                        position: "absolute",
                        backgroundColor: "whitesmoke",
                        zIndex: 5,
                        borderRadius: "10px",
                        marginLeft: "-125px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          padding: "5px",
                          margin: "20px",
                          // width: "250px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "5px",
                          }}
                        >
                          <input
                            type="radio"
                            id="week"
                            name="dateFilter"
                            value="1"
                            onClickCapture={(e) =>
                              setDateFilter(e.target.value)
                            }
                            style={{ cursor: "pointer" }}
                          />
                          <label
                            style={{
                              color: "black",
                              cursor: "pointer",
                              flex: 1,
                            }}
                            for="week"
                          >
                            This Week
                          </label>
                          <br />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "5px",
                          }}
                        >
                          <input
                            type="radio"
                            id="month"
                            name="dateFilter"
                            value="2"
                            onClickCapture={(e) =>
                              setDateFilter(e.target.value)
                            }
                            style={{ cursor: "pointer" }}
                          />
                          <label
                            style={{
                              color: "black",
                              cursor: "pointer",
                              flex: 1,
                            }}
                            for="month"
                          >
                            This Month
                          </label>
                          <br />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "5px",
                          }}
                        >
                          <input
                            type="radio"
                            id="custom"
                            name="dateFilter"
                            value="3"
                            onClickCapture={(e) =>
                              setDateFilter(e.target.value)
                            }
                            style={{ cursor: "pointer" }}
                          />
                          <label
                            style={{
                              color: "black",
                              cursor: "pointer",
                              flex: 1,
                            }}
                            for="custom"
                          >
                            Custom
                          </label>
                          <br />
                        </div>

                        {datefiltervalue == 3 ? (
                          <div>
                            <div>
                              <span style={{ color: "black" }}>From:</span>
                              <DatePicker
                                value={startDate}
                                format="yyyy/mm/dd"
                                onChange={(date) => {
                                  setStartDate(date);
                                }}
                              />
                            </div>
                            <div>
                              <span style={{ color: "black" }}>To:</span>
                              <DatePicker
                                onChange={(date) => {
                                  setEndDate(date);
                                }}
                                minDate={startDate}
                                value={endDate}
                                format="yyyy/mm/dd"
                              />
                            </div>
                          </div>
                        ) : (
                          false
                        )}

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            marginTop: "15px",
                          }}
                        >
                          <span
                            style={{
                              background: "#012844",

                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              // getFilteredOrderListing();
                              setShowFilter(!showFilter);
                            }}
                          >
                            {" "}
                            Apply
                          </span>
                          <span
                            style={{
                              background: "#012844",
                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              setStartDate(null);
                              setEndDate(null);
                              setDateFilter();
                              // getOrderListing();
                              setShowFilter(false);
                            }}
                          >
                            {" "}
                            Reset
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                </div>
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
            <div className="d-flex flex-wrap">
             <DashboardCard title={"Total Users"} value={"850k"} icon={"fa-user"}/>
             <DashboardCard  title={"Total Orders"} value={"850k"} icon={"fa-cart-shopping"}/>
             <DashboardCard  title={"Total Orders Returns"} value={"850k"} icon={"fa-rotate-left"}/>
             <DashboardCard  title={"Total Orders Refunds"} value={"850k"} icon={"fa-right-left"}/>
             <DashboardCard  title={"Total Revenue"} value={"850k"} icon={"fa-dollar-sign"}/>
             </div>
             <div>
              <div>Revenue Graph</div>
            
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
    sidebar: state.sidebar,
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
    setSidebar: (updatedValue) => {
      dispatch({
        type: actionTypes.UPDATE_SIDEBAR,
        updateSidebar: updatedValue,
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
