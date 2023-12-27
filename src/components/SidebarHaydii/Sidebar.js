import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter, NavLink } from "react-router-dom";
import "./sidebarScrollDesign.css";
import { get, isEmpty } from "lodash";

// const Nav = styled.div`
//     background: #15171c;
//     height: 80px;
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
// `
const NavIcon = styled.div`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const SidebarNav = styled.nav`
  background: #ffffff;
  width: 280px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 100ms;
  z-index: 8;
  @media screen and (max-width: 780px) {
    left: ${({ sidebar }) => (sidebar ? "-100%" : "0")};
  }
  @media screen and (max-width: 480px) {
    left: ${({ sidebar }) => (sidebar ? "-100%" : "0")};
  }
`;

const SidebarWrap = styled.div`
  width: 100%;
  ${"" /* overflow: scroll; */}

  overflow-x: hidden;
  /* overflow-y: hidden; */
  box-shadow: rgb(0 0 0 / 10%) 0px 4px 12px;
`;

const BannerImage = styled.div`
  margin-left: 2rem;
  font-size: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaebee;
  margin-right: 1rem;
  height: 100px;
`;

const RestaurantImage = styled.img`
  width: 60px;
  height: 60px;
  margin-top: 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
`;
export const BannerContent = styled.div`
  width: 100%;
  height: 60px;
  margin-top: 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const BannerCity = styled.div`
  text-align: left;
  font-size: 17px;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
  width: 100%;
`;
export const BannerState = styled.div`
  text-align: left;
  font-size: 14px;
  letter-spacing: 0px;
  color: #000000;
  opacity: 0.5;
  // width: 100%;
  text-overflow: ellipsis;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
`;

// export const StartLogo = styled.div`
//      height: auto;
//      width: auto;
//      display: flex;
//      align-items: center;
// `

export const Rating = styled.p`
  color: #878997;
  font-size: 0.8rem;
`;

export const SidebarDiv = styled.p`
  margin-top: 5rem;
`;

const Sidebar = ({ userData, sidebar, setSidebar }) => {
  // const {restaurant_name, restaurant_address, restaurant_location, rest_AvgRating } = userData;
  // console.log(setSidebar);

  // const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  let stateAccessModule = [
    "Dashboard", "User Management", "Product Management",  "Reviews and Ratings Management",
    "Order Management", "Content Management", "Blog Management", "Banner Management", "Email Management",
    "Podcast Management", "Ingredients and Benefits Management", "Webinar Management", "FAQ Management","Subscription Management", "Notification Management", "Contact Us"
  ];

  // console.log("userdata", userData)


  // userData?.access_module.map((user) => {
  //   if (user === "dashboard") {
  //     stateAccessModule.push("Dashboard");
  //   }
  //   if (user === "user-mgmt") {
  //     stateAccessModule.push("User Management"); 
  //   }

  //   if (user === "product-mgmt") {
  //     stateAccessModule.push("Product Management");
  //   }
  //   if (user === "Membership-mgmt") {
  //     stateAccessModule.push("Membership Plans");
  //   }
  //   if (user === "reviews-and-rating-mgmt") {
  //     stateAccessModule.push("Reviews and Ratings Management");
  //   }
  //   if (user === "order-mgmt") {
  //     stateAccessModule.push("Order Management");
  //   }
  //   if (user === "content-mgmt") {
  //     stateAccessModule.push("Content Management");
  //   }
  //   if (user === "subadmin-mgmt") {
  //     stateAccessModule.push("SubAdmin Management");
  //   }
  //   if (user === "Blog-mgmt") {
  //     stateAccessModule.push("Blog Management");
  //   }
  //   if (user === "support-mgmt") {
  //     stateAccessModule.push("Contact Us");
  //   }
  //   if (user === "banner-mgmt") {
  //     stateAccessModule.push("Banner Management");
  //   }
  //   if (user === "email-mgmt") {
  //     stateAccessModule.push("Email Management");
  //   }
  //   if (user === "podcast-mgmt") {
  //     stateAccessModule.push("Podcast Management");
  //   }
  //   if (user === "ingredients-and-benefits-mgmt") {
  //     stateAccessModule.push("Ingredients and Benefits Management");
  //   }
  //   if (user === "webinar-mgmt") {
  //     stateAccessModule.push("Webinar Management");
  //   }
  //   if (user === "faq-mgmt") {
  //     stateAccessModule.push("FAQ Management");
  //   }
  //   if (user === "notification-mgmt") {
  //     stateAccessModule.push("Notification Management");
  //   }

  //   if (user === "all") {
  //     stateAccessModule.push("Dashboard");
  //     stateAccessModule.push("User Management");
  //     // stateAccessModule.push("Agent Management");
  //     // stateAccessModule.push("Merchant Management");
  //     // stateAccessModule.push("Subscription Plans");
  //     // stateAccessModule.push("Category Management");
  //     stateAccessModule.push("Order Management");
  //     stateAccessModule.push("Content Management");
  //     stateAccessModule.push("SubAdmin Management");
  //     stateAccessModule.push("Notification Management");
  //     // stateAccessModule.push("Contact Us");
  //     stateAccessModule.push("FAQ Management");
  //     stateAccessModule.push("Banner Management");
  //     stateAccessModule.push("Blog Management");
  //     stateAccessModule.push("Product Management");
  //     stateAccessModule.push("Membership Management");
  //     stateAccessModule.push("Ingredients and Benefits Management");
  //     stateAccessModule.push("Reviews and Ratings Management");
  //     stateAccessModule.push("Webinar Management");
  //     stateAccessModule.push("Podcast Management");
  //     // stateAccessModule.push("Faq Management");
  //     // stateAccessModule.push("Associate Management");
  //     // stateAccessModule.push("Preferred Management");
  //     // stateAccessModule.push("Category Management");
  //     // stateAccessModule.push("Store Management");
  //     // stateAccessModule.push("Video Management");
  //     // stateAccessModule.push("Say Something Earn Something");
  //     // stateAccessModule.push("Testimonial Management");
  //     stateAccessModule.push("Email Management");
  //     stateAccessModule.push("Contact Us");
  //     stateAccessModule.push("About Us");
  //     stateAccessModule.push("Subscribed User Listing");

  //   }
  // });
  // console.log(stateAccessModule, 'this is array')
  return (
    <IconContext.Provider value={{ color: "#fffff" }}>
      {/*<Nav>
                <NavIcon to="#">
                    <FaIcons.FaBars 
                    onClick={showSidebar}
                    />
                </NavIcon>
            </Nav>*/}
      <SidebarNav sidebar={sidebar}>
        {/* <SidebarWrap className="designScrollbarSide">
                    <SidebarDiv></SidebarDiv>
                    {SidebarData.map((item, index) => {
                        return <SubMenu item={item} key={index} />;
                    })}
                </SidebarWrap> */}
        <SidebarWrap className="designScrollbarSide">
          <SidebarDiv></SidebarDiv>
          {/* {SidebarData.map((item, index) => {
            return <SubMenu item={item} key={index} />
          })} */}
          {SidebarData.filter((data, index) => stateAccessModule.includes(data.title)).map((item, index) => {
            return <SubMenu item={item} key={index} />;
          })}
        </SidebarWrap>
      </SidebarNav>
    </IconContext.Provider>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sidebar));
