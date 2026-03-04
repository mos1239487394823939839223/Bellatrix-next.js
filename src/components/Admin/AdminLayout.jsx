'use client'
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Pages as PagesIcon,
  ViewModule as TemplatesIcon,
  Settings as SettingsIcon,
  AccountCircle,
  ExitToApp,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Message as MessageIcon,
} from "@mui/icons-material";

const drawerWidth = 280;

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExitAdmin = () => {
    // Use the centralized logout function from useAuth
    logout();
    router.push('/auth/login');
    handleProfileMenuClose();
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin",
      active: pathname === "/admin" || pathname === "/admin/",
      description: "Overview & Analytics",
    },
    {
      text: "Pages",
      icon: <PagesIcon />,
      path: "/admin/pages",
      active: pathname.startsWith("/admin/pages"),
      description: "Content Management",
    },
    {
      text: "Messages",
      icon: <MessageIcon />,
      path: "/admin/messages",
      active: pathname.startsWith("/admin/messages"),
      description: "Contact Messages",
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/admin/settings",
      active: pathname.startsWith("/admin/settings"),
      description: "System Configuration",
    },
  ];

  const getCurrentPageTitle = () => {
    const activeItem = menuItems.find((item) => item.active);
    return activeItem ? activeItem.text : "Dashboard";
  };

  const drawer = (
    <div className="h-full border-r border-gray-800" style={{ backgroundColor: '#001038' }}>
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-gray-800" style={{ backgroundColor: '#001038' }}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <Typography
              variant="h6"
              className="text-white font-bold text-xl"
            >
              Bellatrix
            </Typography>
            <Typography variant="caption" className="text-gray-300 font-medium">
              Admin Panel
            </Typography>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-6">
        <Typography
          variant="caption"
          className="text-gray-400 font-semibold uppercase tracking-wider px-3 mb-6 block"
        >
          Navigation
        </Typography>

        <List className="space-y-2">
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => router.push(item.path)}
              className={`rounded-2xl mx-2 transition-all duration-200 ${
                  item.active
                  ? "bg-[#0b163a] text-blue-300 shadow border border-gray-700"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                sx={{
                  minHeight: 64,
                  px: 3,
                  py: 1.5,
                  borderRadius: "16px",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    color: item.active ? "#93c5fd" : "#9ca3af",
                    fontSize: "1.25rem",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <div>
                      <Typography
                        variant="body1"
                        className={`font-semibold ${
                          item.active ? "text-blue-300" : "text-gray-300"
                        }`}
                      >
                        {item.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={`${
                          item.active ? "text-blue-400" : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </Typography>
                    </div>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>

      {/* Quick Actions */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="rounded-2xl p-5 border border-gray-700" style={{ backgroundColor: '#0b163a' }}>
          <Typography
            variant="caption"
            className="text-gray-200 font-semibold block mb-4 uppercase tracking-wider"
          >
            Quick Actions
          </Typography>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-200 w-full text-left p-3 rounded-xl hover:bg-white/10"
            >
              <HomeIcon fontSize="small" />
              <span className="text-sm font-medium">View Live Site</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#111827", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              backgroundColor: "transparent",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              backgroundColor: "transparent",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "#111827",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
            borderBottom: "1px solid rgba(55, 65, 81, 0.5)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Toolbar className="py-4">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { lg: "none" }, 
                color: "#9ca3af",
                "&:hover": { backgroundColor: "rgba(75, 85, 99, 0.1)" }
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Page Title */}
            <div className="flex-1">
              <Typography variant="h5" className="text-white font-bold text-2xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {getCurrentPageTitle()}
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </div>

            {/* Search Bar */}
            <div className="mx-6 hidden md:block">
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: "rgba(55, 65, 81, 0.5)",
                    color: "white",
                    borderRadius: "12px",
                    border: "1px solid rgba(75, 85, 99, 0.5)",
                    backdropFilter: "blur(16px)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid rgba(59, 130, 246, 0.5)",
                    },
                    "& input::placeholder": {
                      color: "#9ca3af",
                    },
                  },
                }}
                sx={{ minWidth: 280 }}
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <IconButton
                size="large"
                aria-label="notifications"
                onClick={handleNotificationMenuOpen}
                className="text-gray-300 hover:text-white transition-all duration-300"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <Typography
                    variant="body2"
                    className="text-white font-semibold"
                  >
                    Admin User
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Super Admin
                  </Typography>
                </div>
                <IconButton
                  size="large"
                  aria-label="account menu"
                  onClick={handleProfileMenuOpen}
                  sx={{
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    A
                  </Avatar>
                </IconButton>
              </div>
            </div>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 240,
                  background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.25), 0 4px 6px -2px rgb(0 0 0 / 0.1)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  borderRadius: "16px",
                  backdropFilter: "blur(16px)",
                },
              }}
            >
              <div className="px-4 py-4 border-b border-gray-700/50">
                <Typography
                  variant="body2"
                  className="text-white font-semibold"
                >
                  Admin User
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  admin@bellatrix.com
                </Typography>
              </div>
              <MenuItem 
                onClick={handleProfileMenuClose} 
                className="py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
              >
                <ListItemIcon>
                  <AccountCircle fontSize="small" className="text-gray-400" />
                </ListItemIcon>
                <span>Profile Settings</span>
              </MenuItem>
              <Divider sx={{ borderColor: "rgba(55, 65, 81, 0.5)" }} />
              <MenuItem 
                onClick={handleExitAdmin} 
                className="py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
              >
                <ListItemIcon>
                  <ExitToApp fontSize="small" className="text-red-400" />
                </ListItemIcon>
                <span>Exit Admin Panel</span>
              </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 360,
                  maxHeight: 480,
                  background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.25), 0 4px 6px -2px rgb(0 0 0 / 0.1)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  borderRadius: "16px",
                  backdropFilter: "blur(16px)",
                },
              }}
            >
              <div className="px-4 py-4 border-b border-gray-700/50">
                <Typography
                  variant="h6"
                  className="text-white font-bold"
                >
                  Notifications
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  You have 3 unread notifications
                </Typography>
              </div>
              <div className="py-2">
                <MenuItem className="px-4 py-4 hover:bg-gray-700/50 transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 shadow-sm shadow-blue-500/50"></div>
                    <div className="flex-1">
                      <Typography
                        variant="body2"
                        className="text-white font-medium"
                      >
                        New page created
                      </Typography>
                      <Typography variant="caption" className="text-gray-400">
                        Homepage updated 5 minutes ago
                      </Typography>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem className="px-4 py-4 hover:bg-gray-700/50 transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 shadow-sm shadow-emerald-500/50"></div>
                    <div className="flex-1">
                      <Typography
                        variant="body2"
                        className="text-white font-medium"
                      >
                        Template saved
                      </Typography>
                      <Typography variant="caption" className="text-gray-400">
                        Hero section template updated
                      </Typography>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem className="px-4 py-4 hover:bg-gray-700/50 transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 shadow-sm shadow-amber-500/50"></div>
                    <div className="flex-1">
                      <Typography
                        variant="body2"
                        className="text-white font-medium"
                      >
                        System backup
                      </Typography>
                      <Typography variant="caption" className="text-gray-400">
                        Daily backup completed successfully
                      </Typography>
                    </div>
                  </div>
                </MenuItem>
              </div>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <div className="flex-1 bg-gray-900">
          {children}
        </div>
      </Box>
    </Box>
  );
};

export default AdminLayout;
