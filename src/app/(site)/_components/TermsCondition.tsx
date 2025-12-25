import React, { useState } from "react";
import { Box } from "@mui/material";

import "../../../scss/terms-conditions.scss";
import TermsConditionEng from "./TermsConditionEng";
import TermsConditionBng from "./TermsConditionBng";

const TermsConditions = () => {
  const [isBangla, setIsBangla] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBangla(event.target.checked);
  };

  return (
    <Box>
      {/* <Box
          display="flex"
          alignItems="center"
          gap={1}
          justifyContent={"flex-end"}
        >
          <Typography sx={{ fontFamily: "Outfit", fontSize: "14px" }}>
            EN
          </Typography>
          <Switch
            checked={isBangla}
            onChange={handleChange}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#A56EB4",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#A56EB4",
                opacity: 1,
              },
            }}
          />
          <Typography sx={{ fontFamily: "Outfit", fontSize: "14px" }}>
            BN
          </Typography>
        </Box> */}

      {isBangla ? <TermsConditionBng /> : <TermsConditionEng />}
    </Box>
  );
};

export default TermsConditions;
