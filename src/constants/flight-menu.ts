import onewayBlack from "../../public/assests/searchIcon/onewayBlack.svg";
import onewayColor from "../../public/assests/searchIcon/onewayColor.svg";
import roundwayBlack from "../../public/assests/searchIcon/roundwayBlack.svg";
import roundwayColor from "../../public/assests/searchIcon/roundwayColor.svg";
import multicityBlack from "../../public/assests/searchIcon/multicityBlack.svg";
import multicityColor from "../../public/assests/searchIcon/multicityColor.svg";

type FlightMenu = {
  name: string;
  icon: string;
  icon2: string;
};

export const flightMenu: FlightMenu[] = [
  {
    name: "Oneway",
    icon: onewayBlack,
    icon2: onewayColor,
  },
  {
    name: "Round Trip",
    icon: roundwayBlack,
    icon2: roundwayColor,
  },
  {
    name: "Multi City",
    icon: multicityBlack,
    icon2: multicityColor,
  },
];
