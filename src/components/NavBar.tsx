import { Component } from "solid-js";
import { A } from "@solidjs/router";
import MenuIcon from "@suid/icons-material/Menu";
import { FaBrandsGithub } from 'solid-icons/fa'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,

} from "@suid/material";
import { useLocation } from "@solidjs/router";

// NavButton.tsx
interface NavButtonProps {
  href: string;
  label: string;
}

const NavButton: Component<NavButtonProps> = (props) => {
  const location = useLocation();
  const isActive = () => location.pathname === props.href;

  return (
    <Button
      color="inherit"
      href={props.href}
      sx={{
        bgcolor: isActive() ? "rgba(255, 255, 255, 0.12)" : "transparent",
        "&:hover": {
          bgcolor: isActive()
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.08)",
        },
      }}
    >
      {props.label}
    </Button>
  );
};

export function NavBar() {

  const base = import.meta.env.MODE === 'production' ? '/data_manager' : '';
  
  const navItems = [{ href: "/business-editor", label: "Business Editor" }];
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            DemoApp
          </Typography>
          <NavButton href={`${base}/`} label="Home" />

          {navItems.map((item) => (
            <NavButton href={`${base}${item.href}`} label={item.label} />
          ))}

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            component={A}
            size="large"
            edge="start"
            color="inherit"
            aria-label="github repository"
            
            href="https://github.com/jlcanela/data_manager"
            sx={{ mr: 2 }}
            target="_blank"
          >
            <FaBrandsGithub />
          </IconButton>


        </Toolbar>
      </AppBar>
    </Box>
  );
}
