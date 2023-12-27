import React, { useEffect, useState } from "react";
import {
  DashboardContainer,
  DashboardWrapper,
  DashboardHeading,
  DashHeading,
  MenuAndBack,
} from "./SubscriptionPlanElements";
import "./ViewSubscriptionPlan.css";
import { makeStyles } from "@material-ui/core/styles";

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
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Overlay from "../../components/Overlay";

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

const ViewSubscriptionPlan = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const [viewData, setViewData] = useState({
    name: "",
    featuresPack: [""],
    discountPrice: "",
    price: "",
    icon: [],
    id: "",
  });
  const history = useHistory();
  const { categoryID } = useParams();
  // console.log("subs data", categoryID);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.get(`/admin/membership/${categoryID}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setViewData(data.data);
    setIsLoading(false)

    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setIsLoading(true)
    fetchData();
  }, [categoryID]);
  return (
    <div>
      <DashboardContainer>
        <DashboardWrapper>
          <DashboardHeading
            style={{
              display: "flex",
              flexDirection: "column",
              // marginLeft: "2rem",
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
                onClick={() => history.push("/adminPanel/subscription")}
              />
              <DashHeading
                style={{ color: "white", flex: "1", padding: "8px" }}
              >
                View
              </DashHeading>
            </MenuAndBack>
          </DashboardHeading>

          <div className="view-container">
            <div className="subs-container">
              <div className="plan-name row">
                <div className="col-4">
                  <span style={{ fontWeight: "700" }}>Plan Name</span>
                </div>
                <div className="col-4">
                  <span style={{ fontWeight: "700" }}>:</span>
                </div>
                <div className="col-4">
                  <span>{viewData.name}</span>
                </div>
              </div>
              <div
                className="features-pack row"
                style={{ marginBottom: "30px" }}
              >
                <div className="col-4">
                  <span
                    style={{
                      // margin:"140px",
                      fontWeight: "700",
                      marginBottom: "50px",
                    }}
                  >
                    Features Pack
                  </span>
                </div>
                <div className="col-4">
                  <span style={{ fontWeight: "700" }}>:</span>
                </div>
                <div className="col-4">
                  <div
                    className="features-pack-list"
                    style={{ width: "180px" }}
                  >
                    {viewData.featuresPack.map((feature, index) => (
                      <span
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          margin: "3px",
                        }}
                        key={index}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="plan-name row " style={{ marginBottom: "30px" }}>
                <div className="col-4">
                  <span style={{ fontWeight: "700" }}>Icon</span>
                </div>
                <div className="col-4">
                  <span style={{ fontWeight: "700" }}>:</span>
                </div>

                <div className="col-4">
                  {/* <img
                    src={viewData.icon}
                    alt="Icon"
                    style={{ width: "50px", height: "50px" }}
                  /> */}
                    {Object.hasOwn(viewData, "icon") ? (
                      <img src={viewData.icon} width="140px"/>
                    ) : (
                      <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" width='30px'/>
                    )}
                </div>
              </div>
              <div className="plan-name row">
              <div className="col-4">
              <span style={{ fontWeight: "700" }}>Actual Price</span>

              </div>
              <div className="col-4">
              <span style={{ fontWeight: "700" }}>:</span>

              </div>
              <div className="col-4">
              <span>{viewData.price}</span>

              </div>

              </div>
              <div className="plan-name row">
              <div className="col-4">
              <span style={{ fontWeight: "700" }}>Discounted Price</span>

              </div>

              <div className="col-4">
              <span style={{ fontWeight: "700" }}>:</span>

              </div>
              <div className="col-4">
              <span>{viewData.discountPrice}</span>

              </div>

              </div>
            </div>
          </div>
        </DashboardWrapper>
      </DashboardContainer>
      {isLoading && <Overlay />}

    </div>
  );
};

export default ViewSubscriptionPlan;
