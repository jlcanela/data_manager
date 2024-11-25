/* @refresh reload */

import Home from "./pages/Home";
import { Route, Router } from "@solidjs/router";

import { Box } from "@suid/material";
import { NavBar } from "./components/NavBar";


import BusinessEditor from "./pages/BusinessEditor";
// theme.ts
import { createTheme } from "@suid/material/styles";

// First, extend the Breakpoint type
declare module "@suid/material/styles" {
  interface BreakpointOverrides {
    xxl: true; // adds the xxl breakpoint
  }
}

// Create the custom theme
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920, // add your custom breakpoint value
    },
  },
});

// App.tsx
import { ThemeProvider } from "@suid/material/styles";

function Layout(props) {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          maxWidth: "80%", // Set maximum width
          margin: "30px auto", // Center the box
        }}
      >
        {props.children}
      </Box>
    </>
  );
}

export function App() {
  const base = import.meta.env.MODE === 'production' 
  ? '/data_manager' 
  : '';

  return (
    <ThemeProvider theme={theme}>
        <Router root={Layout} base={base}>
          <Route path="/" component={Home} />       
          <Route path="/business-editor" component={BusinessEditor} />
        </Router>
    </ThemeProvider>
  );
}
