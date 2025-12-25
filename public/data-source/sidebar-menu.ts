import Dashboardicon from "../assests/menuicon/Dashboardicon.svg";
import Traveller from "../assests/menuicon/Travellericon.svg";
import Partial from "../assests/menuicon/Partialicon.svg";
import Reports from "../assests/menuicon/Reportsicon.svg";
import Staff from "../assests/menuicon/Stafficon.svg";
import Setting from "../assests/menuicon/Settingsicon.svg";
import Ledger from "../assests/menuicon/Ledgericon.svg";
import Deposit from "../assests/menuicon/Depositicon.svg";
import Credit from "../assests/menuicon/Crediticon.svg";
import Bookings from "../assests/menuicon/BookingsIcon.svg";

export const sidebarMenu = [
  {
    name: "Dashboard",
    tag: "dashboard",
    isEnabled: true,
    isAccessable: true,
    icon: Dashboardicon,
    path: "/dashboard",
  },
  {
    name: "My Cart",
    tag: "cart",
    isEnabled: true,
    isAccessable: true,
    icon: Bookings,
    path: "/cart",
  },
  {
    name: "Orders",
    tag: "orders",
    isEnabled: true,
    isAccessable: true,
    icon: Bookings,
    path: "/orders",
  },
  {
    name: "Deposit",
    tag: "deposit",
    isEnabled: true,
    isAccessable: true,
    icon: Deposit,
    path: "/deposit-requests/create",
  },
  {
    name: "Credit",
    tag: "credit",
    isEnabled: true,
    isAccessable: true,
    icon: Credit,
    path: "/credit-requests",
  },
  {
    name: "Partial Due",
    tag: "partial_due",
    isEnabled: true,
    isAccessable: true,
    icon: Partial,
    path: "/partial-due",
  },
  {
    name: "Ledger",
    tag: "account_ledger",
    isEnabled: true,
    isAccessable: true,
    icon: Ledger,
    path: "/account-ledger",
  },

  {
    name: "Staff",
    tag: "staff",
    isEnabled: true,
    isAccessable: true,
    icon: Staff,
    path: "/staffs",
  },
  // {
  //   name: "Reports",
  //   tag: "report",
  //   isEnabled: true,
  //   isAccessable: true,
  //   icon: Reports,
  //   path: "/reports/login-activity",
  // },
  {
    name: "Settings",
    tag: "settings",
    isEnabled: true,
    isAccessable: true,
    icon: Setting,
    path: "/settings/company",
  },
  {
    name: "Shop Now",
    tag: "shop-now",
    isEnabled: true,
    isAccessable: true,
    icon: Setting,
    path: "/",
  },
];
