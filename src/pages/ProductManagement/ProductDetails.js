import React, { useEffect, useState } from "react";
import {
  DashboardContainer,
  DashboardWrapper,
  DashboardHeading,
  DashHeading,
  MenuAndBack,
} from "./ProductElements";
import "./ProductDetails.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
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
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
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
const ProductDetails = () => {
  const [viewData, setViewData] = useState({
    id: "",
    name: "",
    image: "",
    description: "",
    inventoryLevels: "",
    tax: "",
    shipping: "",
  });
  const history = useHistory();
  const classes = useStyles();

  const { categoryID } = useParams();
  console.log("subs data", categoryID);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.get(`/admin/product/${categoryID}`, {
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
                onClick={() => history.push("/adminPanel/product-management")}
              />
              <DashHeading
                style={{ color: "white", flex: "1", padding: "8px" }}
              >
                Product Details
              </DashHeading>
            </MenuAndBack>
          </DashboardHeading>
       
      <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",
                height: "100%",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{padding:"2rem 6rem 2rem 2rem"}}>

          <table className="table table-bordered m-5">
            <thead>
              <tr>
                <th scope="col">Product Name</th>
                <td style={{ color: "black", fontSize: "16px" }}>{viewData.name}</td>
               
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Description</th>
                <td style={{ color: "black", fontSize: "16px" }}>{viewData.description}</td>
               
              </tr>
              <tr>
                <th scope="row">Icon</th>
                <td><img
                  src={viewData.image}
                  alt="Icon"
                  style={{ width: "50px", height: "50px" }}
                /></td>
                
              </tr>
              <tr>
                <th scope="row">Inventory Levels</th>
                <td style={{ color: "black", fontSize: "16px" }}>{viewData.inventoryLevels}</td>
                
              </tr>
              <tr>
                <th scope="row">Tax</th>
                <td style={{ color: "black", fontSize: "16px" }}>{viewData.tax}</td>
                
              </tr>
              <tr>
                <th scope="row">Shipping</th>
                <td style={{ color: "black", fontSize: "16px" }}>{viewData.shipping}</td>
              
              </tr>
            </tbody>
          </table>
              </div>

          </Paper>
          </DashboardWrapper>
      </DashboardContainer>
    </div>
  );
};

export default ProductDetails;
