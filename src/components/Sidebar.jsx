import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/components/Sidebar.module.scss";
import { ListsContext } from "@/components/lists/ListsContext";
import { signIn, signOut } from "next-auth/react";
import { SidebarContext } from "@/pages/_app";
import Image from "next/image";
import {
  createTheme,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  ThemeProvider,
  Tooltip,
} from "@mui/material/";
import {
  Api as ApiIcon,
  Cake as CakeIcon,
  CalendarMonth as CalendarMonthIcon,
  ChecklistRtl as ChecklistRtlIcon,
  House as HouseIcon,
  IosShare as IosShareIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardDoubleArrowLeft as DoubleArrowLeftIcon,
  KeyboardDoubleArrowRight as DoubleArrowRightIcon,
  Logout as LogoutIcon,
  LunchDining as LunchDiningIcon,
  Settings as SettingsIcon,
  Support as SupportIcon,
} from "@mui/icons-material";

const FireNav = styled(List)({
  "& .MuiListItemButton-root": {
    width: "100%",
    paddingLeft: 15,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 33,
  },
});

function Sidebar({ toggleSidebar }) {
  const { sidebarOpen: contextSidebarOpen, setSidebarOpen } =
    useContext(SidebarContext);
  const [isHovering, setIsHovering] = useState(false);
  const [open, setOpen] = useState({});
  const router = useRouter();

  const sidebarClass = `${styles.sidebar} ${
    contextSidebarOpen ? styles.sidebarExpanded : ""
  }`;

  const handleClick = (index, link) => {
    // if (link.subLinks) {
    //   setOpen((prevOpen) => ({
    //     ...prevOpen,
    //     [index]: !prevOpen[index],
    //   }));
    // } else {
    link.onClick ? link.onClick() : router.push(link.href);
    // }
  };

  const { lists, fetchListsUpdate } =
    useContext(ListsContext);

  const links = [
    {
      primary: "Dashboard",
      icon: <HouseIcon />,
      // href: "/lists",
      href: "#",
    },
    {
      primary: "Lists",
      icon: <ChecklistRtlIcon />,
      // href: "/lists",
      href: "#",
      // subLinks: lists.map((list) => ({
      //   label: list.listName.charAt(0).toUpperCase() + list.listName.slice(1), // Title case
      //   href: `/lists/${list.listName.toLowerCase()}`, // Lowercase
      // })),
    },
    {
      primary: "Calendar",
      icon: <CalendarMonthIcon />,
      // href: "/calendar",
      href: "#",
    },
    {
      primary: "Recipes",
      icon: <LunchDiningIcon />,
      // href: "/recipes",
      href: "#",
    },
    {
      primary: "Birthdays",
      icon: <CakeIcon />,
      // href: "/birthdays",
      href: "#",
    },
    {
      primary: "Settings",
      icon: <SettingsIcon />,
      // href: "/settings",
      href: "#",
    },
    {
      primary: "Share",
      icon: <IosShareIcon />,
      // href: "/share",
      href: "#",
    },
    {
      primary: "Help",
      icon: <SupportIcon />,
      // href: "/help",
      href: "#",
    },
    {
      primary: "API",
      icon: <ApiIcon />,
      // href: "/apiconfig",
      href: "#",
    },
    {
      primary: "Sign out",
      icon: <LogoutIcon />,
      onClick: () => signOut(),
    },
    // Add more main links as needed
  ];

  useEffect(() => {
    fetchListsUpdate();
  }, []);

  return (
    <div
      className={sidebarClass}
      onMouseEnter={() => !contextSidebarOpen && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box sx={{ display: "flex" }}>
        <ThemeProvider
          theme={createTheme({
            components: {
              MuiListItemButton: {
                defaultProps: {
                  disableTouchRipple: true,
                },
              },
            },
            palette: {
              mode: "dark",
              primary: { main: "rgb(102, 157, 246)" },
              background: { paper: "rgba(15, 25, 36, 0.0)" },
            },
          })}
        >
          <Paper
            elevation={0}
            sx={{
              width: contextSidebarOpen
                ? "300px"
                : isHovering
                  ? "300px"
                  : "70px",
              transition: "width 0.3s",
              backgroundColor: isHovering
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.0)",

              color: isHovering ? "rgb(102,102,102)" : "rgb(255, 255, 255)",
            }}
          >
            <FireNav component="nav" disablePadding>
              <ListItemButton
                component="a"
                href="#customized-list"
                onClick={toggleSidebar}
                sx={{
                  width: "100%",
                  height: "75px",
                }}
              >
                {!contextSidebarOpen && (
                  <>
                    <ListItemIcon
                      sx={{
                        fontSize: 33,
                        color: isHovering
                          ? "rgb(102,102,102)"
                          : "rgb(255, 255, 255)",
                      }}
                    >
                      <DoubleArrowRightIcon />
                    </ListItemIcon>
                  </>
                )}
                {contextSidebarOpen && (
                  <>
                    <ListItemIcon
                      sx={{
                        fontSize: 33,
                      }}
                    >
                      <DoubleArrowLeftIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ my: 0 }}
                      primary=""
                      primaryTypographyProps={{
                        fontSize: 33,
                        fontWeight: "medium",
                        letterSpacing: 0,
                        color: isHovering
                          ? "rgb(102,102,102)"
                          : "rgb(255, 255, 255)",
                      }}
                    />
                  </>
                )}
              </ListItemButton>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <List>
                  {links.map((link, index) => (
                    <Box key={index}>
                      <ListItem disablePadding sx={{ width: "100%" }}>
                        <ListItemButton
                          sx={{ width: "100%" }}
                          onClick={() => handleClick(index, link)}
                        >
                          {link.icon && (
                            <ListItemIcon
                              sx={{
                                color: isHovering
                                  ? "rgb(102,102,102)"
                                  : "rgb(255, 255, 255)",
                              }}
                            >
                              {link.icon}
                            </ListItemIcon>
                          )}
                          {contextSidebarOpen || isHovering ? (
                            <ListItemText
                              primary={link.primary}
                              primaryTypographyProps={{
                                fontSize: 20,
                                letterSpacing: 0,
                              }}
                            />
                          ) : null}
                          {(contextSidebarOpen || isHovering) &&
                            link.subLinks && <ArrowDownIcon />}
                        </ListItemButton>
                      </ListItem>
                      {(contextSidebarOpen || isHovering) &&
                        open[index] &&
                        link.subLinks?.length > 0 && <Divider />}
                      {(contextSidebarOpen || isHovering) &&
                        open[index] &&
                        link.subLinks?.map((subLink, subIndex) => (
                          <ListItem key={subIndex}>
                            <ListItemButton
                              sx={{
                                pl: 4,
                                width: "100%",
                              }}
                              onClick={() => router.push(subLink.href)}
                            >
                              <ListItemText primary={subLink.label} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      {(contextSidebarOpen || isHovering) &&
                        open[index] &&
                        link.subLinks?.length > 0 && <Divider />}
                    </Box>
                  ))}
                </List>
              </Box>
            </FireNav>
          </Paper>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default Sidebar;
