import { createTheme } from "@mui/material";

export const PaginationTheme = createTheme({
  palette: {
    primary: {
      main: "#01783B",
      dark: "#01783B",
    },
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: "12px",
          fontWeight: 500,
          margin: "0 2px",
          color: "#292F36",
          background: "#fff",
          fontFamily: '"Outfit", sans-serif',
          border: "2px solid #C7CACF",

          "&:hover": {
            backgroundColor: "#01783B",
            color: "#fff",
          },

          "&.Mui-selected": {
            color: "#01783B",
            border: "2px solid #01783B",
          },

          "&.Mui-selected:hover": {
            backgroundColor: "#01783B",
            color: "#fff",
          },
        },
      },
    },
  },
});
