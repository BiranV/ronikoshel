import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#1f6fae",
    },
    background: {
      default: "#f5f5f5", // Light gray background
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "Rubik, system-ui, sans-serif",
    h1: {
      fontWeight: 700,
      lineHeight: 1.2,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
