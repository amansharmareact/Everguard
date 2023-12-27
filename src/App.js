import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./index.css";
import Navbar from "./components/Navbar";

import axios from "./axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginSection from "./components/LoginSection";

import Sidebar from "./components/SidebarHaydii/Sidebar";

import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actionTypes from "./store/actions";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import ProfileManagement from "./components/DashboardProfile/Profile_Management";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import PersonalDetails from "./components/LoginSection/PersonalDetails";
import Forgot from "./components/LoginSection/Forgot";
import ResetPassword from "./components/LoginSection/ResetPassword";

import UserManagement from "./pages/UserManagement/User_Management";
// import AgentManagement from "./pages/UserManagement/Agent_Management";
import OwnerManagement from "./pages/UserManagement/Owner_Management";

import AgentInformation from "./pages/UserManagement/Agent_Information";
import OwnerInformation from "./pages/UserManagement/Owner_Information";

//Agent Import
import AgentApprove from "./pages/UserManagement/AgentSection/AgentApprove";
import AgentApproveView from "./pages/UserManagement/AgentSection/AgentApproveView";
import AgentDisapprove from "./pages/UserManagement/AgentSection/AgentDisapprove";
import AgentDisapproveView from "./pages/UserManagement/AgentSection/AgentDisapproveView";
import AgentPending from "./pages/UserManagement/AgentSection/AgentPending";
import AgentPendingView from "./pages/UserManagement/AgentSection/AgentPendingView";
import NotificationManagement from "./pages/NotificationSection/Notification_Management";
// import SubscriptionManagement from "./pages/SubscriptionSection/SubscriptionPlanManagement";
import AgentApproveNewView from "./pages/UserManagement/AgentSection/AgentApproveNewView";
import ViewPropertyList from "./pages/PropertySection/ViewPropertyList";
import ViewProperty from "./pages/PropertySection/ViewProperty";
import ManageServiceArea from "./pages/ManageServiceSection/ManageService";
import PropertyManagement from "./pages/PropertySection/PropertyManagement";
import PropertyStatusView from "./pages/PropertySection/PropertyStatusView";
import ContentManagement from "./pages/ContentManagement/ContentManagement";
import FaqManagement from "./pages/FaqSection/FaqManagement";
import LeadManagement from "./pages/LeadSection/LeadManagement";
import LeadRequest from "./pages/LeadSection/LeadRequested";
import LeadAssigned from "./pages/LeadSection/LeadAssigned";

import AgentManagement from "./pages/AgentManagement/AgentManagement";
import AddEditAgent from "./pages/AgentManagement/AddEditAgent";
import MerchantManagement from "./pages/MerchantManagement/MerchantManagement";
import MerchantApprove from "./pages/MerchantManagement/MerchantApprove";
import MerchantDisapprove from "./pages/MerchantManagement/MerchantDisapprove";
import MerchantPending from "./pages/MerchantManagement/MerchantPending";
import SubscriptionPlanManagement from "./pages/SubscriptionPlan/SubscriptionPlanManagement";
import AddEditSubscriptionPlan from "./pages/SubscriptionPlan/AddEditSubscriptionPlan";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import MerchantDetailsPending from "./pages/MerchantManagement/MerchantDetailsPending";
import MerchantDetailsApproved from "./pages/MerchantManagement/MerchantDetailsApproved";
import MerchantDetailsDisapproved from "./pages/MerchantManagement/MerchantDetailsDisapproved";
import CouponManagement from "./pages/CouponManagement/CouponManagement";
import OrderManagement from "./pages/OrderManagement/OrderManagement";
import OrderOngoingDetails from "./pages/OrderManagement/OrderOngoingDetails";
import OrderCompletedDetails from "./pages/OrderManagement/OrderCompletedDetails";
import OrderCancelledDetails from "./pages/OrderManagement/OrderCancelledDetails";
import SubAdminManagement from "./pages/SubAdminManagement/SubAdminManagement";
import AddEditSubAdmin from "./pages/SubAdminManagement/AddEditSubAdmin";
import ContactUs from "./pages/ContactUS/ContactUS";
import BannerManagement from "./pages/BannerManagement/BannerManagement";
import BlogManagement from "./pages/BlogManagement/BlogManagement";
import FAQManagement from "./pages/FAQManagement/FAQManagement";
import AssociateManagement from "./pages/AssociateManagement/AssociateManagement";
import ApprovalManagement from "./pages/AssociateManagement/ApprovalManagement";
import PreferredManagement from "./pages/PreferredManagement/PreferredManagement";
import StoreManagement from "./pages/StoreManagement/StoreManagement";
import VideoManagement from "./pages/VideoManagement/VideoManagement";
import ReferANdEarnManagement from "./pages/ReferAndEarnManagement/ReferANdEarnManagement";
import ReferAndEarnList from "./pages/ReferAndEarnManagement/ReferAndEarnList";
import TestimonialManagement from "./pages/TestimonialManagement/TestimonialManagement";
import ReferAndEarnList2 from "./pages/ReferAndEarnManagement/ReferAndEarnList2";
import PreferredListing from "./pages/PreferredManagement/PreferredListing";
import EmailManagement from "./pages/EmailManagement/EmailManagement";
import AssociateListing from "./pages/AssociateManagement/AssociateListing";
import AssociateSubscription from "./pages/AssociateManagement/AssociateSubscription";
import PreferredSubscription from "./pages/PreferredManagement/PreferredSubscription";
import AddEditBlog from "./pages/BlogManagement/AddEditBlog"

import OurTeam from "./pages/AboutUs/OurTeam";
import AboutUs from "./pages/AboutUs/AboutUs";
import SubscribedUserListing from "./pages/SubscribedUser/SubscribedUserListing";
import AssociateTerms from "./pages/AssociateManagement/AssociateTerms";
import PreferredTerms from "./pages/PreferredManagement/PreferredTerms";
import User_Information from "./pages/UserManagement/User_Information";
import ViewSubscriptionPlan from "./pages/SubscriptionPlan/ViewSubscriptionPlan";
import ProductDetails from "./pages/ProductManagement/ProductDetails";
import OrderDetails from "./pages/OrderManagement/OrderDetails";
import User_Orders from "./pages/UserManagement/User_Orders";
const PublicRoute = (props) => {
  const { defaultState, setDefaultState } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Switch>
      <Route path="/adminPanel" exact>
        <LoginSection {...defaultState} />
      </Route>
      <Route path="/">
        <Redirect to="/adminPanel" />
      </Route>
    </Switch>
  );
};

const PrivateRoute = (props) => {
  const { defaultState, setDefaultState, userData } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return userData ? (
    <Switch>
      <Route path="/adminPanel/dashboard" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <Dashboard />
      </Route>
      {/* <Route path="/adminPanel/personaldetails" exact>
      <PersonalDetails />
    </Route> */}
      <Route path="/adminPanel/forgot" exact>
        <Forgot />
      </Route>
      <Route path="/adminPanel/resetpassword" exact>
        <ResetPassword />
      </Route>
      <Route path="/adminPanel/product-management" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <ProductManagement />
    </Route>
    <Route path="/adminPanel/product-details/:categoryID" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ProductDetails/>
      </Route>
      <Route path="/adminPanel/order-details/:categoryID" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <OrderDetails/>
      </Route>
      <Route path="/adminPanel/user" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <UserManagement />  
        </Route>
        <Route path="/adminPanel/review-rating" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
      </Route>
      {/* <Route path="/adminPanel/agent" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentManagement />
      </Route>
      <Route path="/adminPanel/agent/AddEditAgent" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditAgent />
      </Route>
      <Route path="/adminPanel/agent/AddEditAgent/:id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditAgent />
      </Route> */}
      {/* <Route path="/adminPanel/merchant" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <MerchantManagement />
      </Route>
      <Route path="/adminPanel/merchant_approve" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <MerchantApprove />
      </Route>
      <Route path="/adminPanel/merchant_disapprove" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <MerchantDisapprove />
      </Route>
      <Route path="/adminPanel/merchant_pending" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <MerchantPending />
      </Route> */}
      {/* <Route path="/adminPanel/merchant_details_pending/:merchant_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <MerchantDetailsPending />
      </Route>
      <Route path="/adminPanel/merchant_details_approved/:merchant_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <MerchantDetailsApproved />
      </Route>
      <Route path="/adminPanel/merchant_details_disapproved/:merchant_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <MerchantDetailsDisapproved />
      </Route> */}
      <Route path="/adminPanel/subscription" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <SubscriptionPlanManagement />
      </Route>
      <Route path="/adminPanel/view-subscription/:categoryID" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ViewSubscriptionPlan/>
      </Route>
      <Route path="/adminPanel/ingredients-benefits" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        
      </Route>
      {/* <Route path="/adminPanel/subscription/AddEditSubscriptionPlan" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditSubscriptionPlan />
      </Route>
      <Route path="/adminPanel/subscription/AddEditSubscriptionPlan/:id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditSubscriptionPlan />
      </Route>
      <Route path="/adminPanel/category" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <CategoryManagement />
      </Route>
      <Route path="/adminPanel/category/AddEditCategory" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditCategory />
      </Route>
      <Route path="/adminPanel/category/AddEditCategory/:id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditCategory />
      </Route> */}
      {/* <Route path="/adminPanel/merchant_details_approved/view_products/:merchant_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ProductManagement />
      </Route>
      <Route path="/adminPanel/merchant_details_approved/view_coupons/:merchant_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <CouponManagement />
      </Route> */}
      <Route path="/adminPanel/webinar" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        {/* <SubscriptionPlanManagement /> */}
        
      </Route>
      <Route path="/adminPanel/podcast" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        {/* <SubscriptionPlanManagement /> */}
        
      </Route>
      
      <Route path="/adminPanel/user-orders" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <User_Orders/>
      </Route>
      <Route path="/adminPanel/contact-us" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ContactUs/>
      </Route>
      <Route path="/adminPanel/order" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
     <OrderManagement/>
      </Route>

     {/* <Route path="/adminPanel/order_details_ongoing/:order_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <OrderOngoingDetails />
      </Route>
      <Route path="/adminPanel/order_details_completed/:order_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <OrderCompletedDetails />
      </Route>
      <Route path="/adminPanel/order_details_cancelled/:order_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <OrderCancelledDetails />
      </Route> */}
      <Route path="/adminPanel/category" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <CategoryManagement />
      </Route>
      <Route path="/adminPanel/content" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ContentManagement />
      </Route>
      <Route path="/adminPanel/userorder">
        <Navbar toggle={toggle} />
        <Sidebar />
        <User_Information />
      </Route>
     
      <Route path="/adminPanel/subAdmin" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <SubAdminManagement />
      </Route>
      <Route path="/adminPanel/subAdminAddEdit" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditSubAdmin />
      </Route>
      <Route path="/adminPanel/subAdminAddEdit/:subAdmin_id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditSubAdmin />
      </Route>
      <Route path="/adminPanel/contact" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ContactUs />
      </Route>
      <Route path="/adminPanel/banner" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <BannerManagement />
      </Route>
      <Route path="/adminPanel/blog" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <BlogManagement />
      </Route>
      <Route path="/adminPanel/blog/AddEdit" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AddEditBlog />
      </Route>
      {/* <Route path="/adminPanel/agent" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentApprove />
      </Route>
      <Route path="/adminPanel/agent-approve" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentApprove />
      </Route>
      <Route path="/adminPanel/agent-disapprove" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentDisapprove />
      </Route>
      <Route path="/adminPanel/agent-pending" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentPending />
      </Route> */}
      {/* <Route path="/adminPanel/owner" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <OwnerManagement />
    </Route> */}
      {/* <Route path="/adminPanel/user/:id">
        <Navbar toggle={toggle} />
        <Sidebar />
        <UserInformation />
      </Route>
      <Route path="/adminPanel/agent-approve/:id">
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentApproveView />
      </Route>
      <Route path="/adminPanel/agent-approve-new/:id">
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentApproveNewView />
      </Route>
      <Route path="/adminPanel/agent-disapprove/:id">
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentDisapproveView />
      </Route>
      <Route path="/adminPanel/agent-pending/:id">
        <Navbar toggle={toggle} />
        <Sidebar />
        <AgentPendingView />
      </Route> */}
      {/* <Route path="/adminPanel/owner/:id">
      <Navbar toggle={toggle} />
      <Sidebar />
      <OwnerInformation />
    </Route> */}
      <Route path="/adminPanel/change-password" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ProfileManagement />
      </Route>
      <Route path="/adminPanel/notification" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <NotificationManagement />
      </Route>
      {/* <Route path="/adminPanel/subscription" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <SubscriptionManagement />
    </Route> */}
      {/* <Route path="/adminPanel/view-property/:id" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <ViewProperty />
    </Route> */}
      {/* <Route path="/adminPanel/view-property-list/:id" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <ViewPropertyList />
    </Route> */}
      {/* <Route path="/adminPanel/manage-service-area" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <ManageServiceArea />
    </Route> */}
      {/* <Route path="/adminPanel/property" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <PropertyManagement/>
    </Route> */}
      <Route path="/adminPanel/content" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <ContentManagement/>
    </Route>
      <Route path="/adminPanel/faq" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        {/* <FaqManagement/> */}
        <FAQManagement />
      </Route>
      {/* <Route path="/adminPanel/lead" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <LeadManagement/>
    </Route> */}
      {/* <Route path="/adminPanel/lead/:id" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <LeadRequest/>
    </Route> */}
      {/* <Route path="/adminPanel/lead/assigned/:id" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <LeadAssigned/>
    </Route> */}
      {/* <Route path="/adminPanel/property/status/:id" exact>
      <Navbar toggle={toggle} />
      <Sidebar />
      <PropertyStatusView/>
    </Route> */}
      <Route path="/adminPanel/store" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <StoreManagement />
      </Route>
      <Route path="/adminPanel/refer" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ReferANdEarnManagement />
      </Route>
      <Route path="/adminPanel/referList" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ReferAndEarnList />
      </Route>
      <Route path="/adminPanel/referList2/:id" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ReferAndEarnList2 />
      </Route>
      <Route path="/adminPanel/video" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <VideoManagement />
      </Route>
      <Route path="/adminPanel/associate" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AssociateManagement />
      </Route>
      {/* <Route path="/adminPanel/approval" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ApprovalManagement />
      </Route> */}
      <Route path="/adminPanel/associateListing" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AssociateListing />
      </Route>
      <Route path="/adminPanel/associateSubscription" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AssociateSubscription />
      </Route>
      <Route path="/adminPanel/preferred" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <PreferredManagement />
      </Route>
      <Route path="/adminPanel/preferredListing" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <PreferredListing />
      </Route>
      <Route path="/adminPanel/preferredSubscription" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <PreferredSubscription />
      </Route>
      <Route path="/adminPanel/testimonial" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <TestimonialManagement />
      </Route>
      <Route path="/adminPanel/email" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <EmailManagement />
      </Route>
      <Route path="/adminPanel/contactUs" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <ContactUs />
      </Route>
      <Route path="/adminPanel/about" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AboutUs />
      </Route>
      
      
      <Route path="/adminPanel/ourTeam" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <OurTeam />
      </Route>
      <Route path="/adminPanel/subscribedUsers" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <SubscribedUserListing />
      </Route>
      <Route path="/adminPanel/associatePay" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <AssociateTerms />
      </Route>
      <Route path="/adminPanel/preferredPay" exact>
        <Navbar toggle={toggle} />
        <Sidebar />
        <PreferredTerms />
      </Route>
      {/* <Route path="/webPanel/property/:id" exact> */}
      {/* <Redirect to="/webPanel/property/:id" /> */}
      {/* </Route> */}
      {/* <Route path="/">
        <Redirect to="/adminPanel" />
      </Route> */}
      <Route path="/adminPanel" exact>
        <LoginSection {...defaultState} />
      </Route>
      <Route path="/">
        <Redirect to="/adminPanel" />
      </Route>
    </Switch>
  ) : (
    <PublicRoute />
  );
};

function App(props) {
  const { defaultState, setDefaultState, userData } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Router>{userData ? <PrivateRoute userData={userData} /> : <PublicRoute />}</Router>
      <ToastContainer theme="colored" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    locationData: state.locations,
    defaultState: state.defaultState,
    userData: state.userData,
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
    setLocations: (updatedValue) => {
      dispatch({
        type: actionTypes.GET_LOCATIONS,
        locationData: updatedValue,
      });
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
