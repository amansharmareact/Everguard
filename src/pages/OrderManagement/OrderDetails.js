import React, { useEffect, useState } from "react";
import {
  DashboardContainer,
  DashboardWrapper,
  DashboardHeading,
  DashHeading,
  MenuAndBack,
} from "./OrderElements";
import moment from "moment";

import "./OrderDetails.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const OrderDetails = () => {
  const [viewData, setViewData] = useState([]);
  const history = useHistory();
  const { categoryID } = useParams();
  //   console.log("subs data", categoryID);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`/admin/order/${categoryID}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setViewData(data.data);
      
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
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
                onClick={() => history.push("/adminPanel/order")}
              />
              <DashHeading
                style={{ color: "white", flex: "1", padding: "8px" }}
              >
                Order Details
              </DashHeading>
            </MenuAndBack>
          </DashboardHeading>
          <div
            className="container"
            style={{
              color: "black",
              gap: "15px",
              width: "95%",
              marginLeft: "2rem",
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
            }}
          >
            <div className="order-details" style={{marginTop:"80px"}}>
              <div
                style={{
                  height: "5vh",
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  paddingLeft: "10px",
                  paddingTop: "3px",
                  
                }}
              >
                Order Details
              </div>
              {/* <div className="container"> */}
              <table class="table table-borderless">
                <tr className="row">
                  <th className="col-4 pt-3" scope="col">
                    Order Id
                  </th>
                  <th className="col-4 pt-3" scope="col">
                    Date
                  </th>
                  <th className="col-4 pt-3" scope="col">
                    Time
                  </th>
                </tr>

                <tr className="row pt-3">
                  <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                  {/* <div>{get(category, "shippingDetails._id", "N/A")}</div> */}

                    {viewData?.shippingDetails?._id?.slice(-4)}
                  </td>
                  <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                    {moment(viewData?.date).format("MMM DD, YYYY")}
                  </td>
                  <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                    {" "}
                    {moment(viewData?.date).format("hh:mm")}
                  </td>
                </tr>

                <tr className="row pt-3">
                  <th className="col-4" scope="col-4">Product Name</th>
                  <th className="col-4" scope="col-4">Subscription Plan</th>
                  <th className="col-4" scope="col-4"> Amount</th>
                </tr>

                <tr className="row pt-3">
                  <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                    {viewData.product?.name}
                  </td>
                  <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                    {viewData.totalAmount}
                  </td>
                  <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                    {" "}
                    {viewData.totalAmount}
                  </td>
                </tr>

                <tr className="row pt-3">
                  <th className="col-12" scope="col"> Order Status</th>
                </tr>

                <tr className="row pt-3">
                  <td className="col-12" style={{ color: "black", fontSize: "16px" }}>
                    {viewData?.status?.replace(/_/g, " ") ?? "N/A"}
                  </td>
                </tr>
              </table>
            </div>

            <div className="order-details">
              <div
                style={{
                  height: "5vh",
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  paddingLeft: "10px",
                  paddingTop: "3px",
                }}
              >
                Delivery Address
              </div>
              <table class="table table-borderless">
                <thead>
                  <tr className="row pt-3">
                    <th className="col-4" scope="col">State</th>
                    <th className="col-4" scope="col">City</th>
                    <th className="col-4" scope="col">Zip Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row">
                    <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                      {" "}
                      {viewData.shippingDetails?.state}
                    </td>
                    <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                      {viewData.shippingDetails?.city}
                    </td>
                    <td className="col-4" style={{ color: "black", fontSize: "16px" }}>
                      {" "}
                      {viewData.shippingDetails?.zipCode}
                    </td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th scope="col">Address</th>
                  </tr>
                </thead>
                {/* <span
                  style={{
                    width: "100%",
                    marginLeft: "10vh",
                    marginBottom: "20px",
                  }}
                >
                  {" "}
                  {viewData.shippingDetails?.streetAddress},{" "}
                  {viewData.shippingDetails?.apartment},{" "}
                  {viewData.shippingDetails?.city},{" "}
                  {viewData.shippingDetails?.state}
                </span> */}
                <tbody>
                  <tr>
                    <td style={{ color: "black", fontSize: "16px" }}>
                      {" "}
                      {viewData.shippingDetails?.streetAddress}
                      {/* ,{" "}
                   {viewData.shippingDetails?.apartment} */}
                      {/* ,{" "}
                  {viewData.shippingDetails?.city},{" "}
                  {viewData.shippingDetails?.state}  */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="order-details"
              style={{
                height: "20vh",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  height: "5vh",
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  paddingLeft: "10px",
                  paddingTop: "3px",
                }}
              >
                Payment Details
              </div>
              <div className="container pt-3 pb-3">Payment Details</div>
            </div>
          </div>
        </DashboardWrapper>
      </DashboardContainer>
    </div>
  );
};

export default OrderDetails;
