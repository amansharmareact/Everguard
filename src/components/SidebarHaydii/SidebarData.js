import React from "react";
import { BiSolidBookContent } from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { MdReviews } from "react-icons/md";
import { MdFastfood } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaBloggerB } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdGroups2 } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";
import { IoMdContact } from "react-icons/io";




import { SiWebtrees } from "react-icons/si";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/adminPanel/dashboard",
    icon: <MdDashboard />,
  },

  {
    title: "Banner Management",
    path: "/adminPanel/banner",
    icon: <BsIcons.BsFillImageFill />,
  },
  {
    title: "User Management",
    path: "/adminPanel/user",
    icon: <FaIcons.FaUser />,
  },
  {
    title: "Order Management",
    path: "/adminPanel/order",
    icon: <FaIcons.FaListOl/>,
  },
  {
    title: "Product Management",
    path: "/adminPanel/product-management",
    icon: <FaCartShopping />,
  },
  {
    title: "Reviews and Ratings Management",
    path: "/adminPanel/review-rating",
    icon: <MdReviews />,
  },
  {
    title: "Subscription Management",
    path: "/adminPanel/subscription",
    icon: <FaIcons.FaUserFriends />,
  },
 
  {
    title: "Ingredients and Benefits Management",
    path: "/adminPanel/ingredients-benefits",
    icon: <MdFastfood />    ,
  },
  {
    title: "Webinar Management",
    path: "/adminPanel/webinar",
    icon: <i class="fa-solid fa-people-group"></i>
    ,
  },
  {
    title: "FAQ Management",
    path: "/adminPanel/faq",
    icon:<FaQuestion />,
  },
  {
    title: "Podcast Management",
    path: "/adminPanel/podcast",
    icon: <FaMicrophone/>,
  },
  

  {
    title: "Blog Management",
    path: "/adminPanel/blog",
    icon: <FaBloggerB />,
  },

  {
    title: "Email Management",
    path: "/adminPanel/email",
    icon:<MdEmail />
    ,
  },
 
  {
    title: "Content Management",
    path: "/adminPanel/content",
    icon: <BiSolidBookContent />    ,
  },
  {
    title: "Notification Management",
    path: "/adminPanel/notification",
    icon: <IoNotifications />,
  },
  {
    title: "Contact Us",
    path: "/adminPanel/contact-us",
    icon: <IoMdContact />

    ,
  },
];
