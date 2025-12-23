import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  AppBar,
  Toolbar,
  Fab,
  useScrollTrigger,
  Slide,
  Avatar,
  Grid,
  IconButton,
  Drawer,
  ListItemButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogContent,
  Fade,
  Backdrop,
  SvgIcon,
  TextField,
} from "@mui/material";

import type { PaletteMode } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import logoImage from "./assets/header-logo.svg";
import AccessibilityWidget from "./components/AccessibilityWidget";
import AdminDashboard from "./components/Admin/AdminDashboard";
import LoginModal from "./components/Admin/LoginModal";

import meAfter1 from "./assets/me/after/IMG_5601.PNG";
import meAfter2 from "./assets/me/after/IMG_6236_1.PNG";
import meAfter3 from "./assets/me/after/IMG_7910.JPG";
import meAfter4 from "./assets/me/after/IMG_8134.JPG";
import meAfter5 from "./assets/me/after/IMG_8731.JPG";

import meBefore1 from "./assets/me/before/IMG_6046.JPG";
import meBefore2 from "./assets/me/before/IMG_6048.JPG";
import meBefore3 from "./assets/me/before/IMG_6049.JPG";
import meBefore4 from "./assets/me/before/IMG_6051.JPG";

const meImages = [
  meAfter1,
  meBefore1,
  meAfter2,
  meBefore2,
  meAfter3,
  meBefore3,
  meAfter4,
  meBefore4,
  meAfter5,
];

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TikTokIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </SvgIcon>
);

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function App() {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode === "light" || savedMode === "dark" ? savedMode : "light";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Send notification email on app load
    const sendVisitNotification = async () => {
      try {
        // Skip if in development mode or localhost
        if (
          import.meta.env.DEV ||
          window.location.hostname.includes("localhost")
        )
          return;

        // Check if we already sent a notification in this session to avoid spam
        if (sessionStorage.getItem("visitNotificationSent")) return;

        const adminEmail = import.meta.env.VITE_ADMIN_2_EMAIL;
        if (!adminEmail) return;

        // Get or create persistent Visitor ID
        let visitorId = localStorage.getItem("visitorId");
        if (!visitorId) {
          visitorId =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).substring(2) +
                Date.now().toString(36);
          localStorage.setItem("visitorId", visitorId);
        }

        // Track visit count
        let visitCount = parseInt(localStorage.getItem("visitCount") || "0");
        visitCount++;
        localStorage.setItem("visitCount", visitCount.toString());

        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const screenRes = `${window.screen.width}x${window.screen.height}`;

        await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `New Visitor Alert! (${
              visitCount > 1 ? "Returning" : "New"
            })`,
            _template: "table",
            "Visitor Status":
              visitCount > 1 ? "Returning Visitor" : "New Visitor",
            "Visit Count": visitCount,
            "Visitor ID": visitorId,
            Time: new Date().toLocaleString(),
            "Device Type": isMobile ? "Mobile" : "Desktop",
            "Screen Resolution": screenRes,
            Language: navigator.language,
            Platform: navigator.platform,
            Referrer: document.referrer || "Direct/Bookmark",
            "User Agent": navigator.userAgent,
          }),
        });

        sessionStorage.setItem("visitNotificationSent", "true");
      } catch (error) {
        console.error("Failed to send visit notification", error);
      }
    };

    sendVisitNotification();
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        direction: "rtl",
        palette: {
          mode,
          primary: {
            main: "#1f6fae",
          },
          ...(mode === "light"
            ? {
                background: {
                  default: "#f5f5f5",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#333333",
                  secondary: "#666666",
                },
              }
            : {
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#b0b0b0",
                },
              }),
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
      }),
    [mode]
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const openWhatsapp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #1f6fae 0%, #155a8a 100%)",
          color: "white",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box
            component="img"
            src={logoImage}
            alt="Roni Koshel"
            sx={{
              width: 40,
              height: 40,
              filter: "brightness(0) invert(1)",
            }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              רוני קושל
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, display: "block" }}
            >
              כושר ותזונה אונליין
            </Typography>
          </Box>
        </Toolbar>
      </Box>
      <List sx={{ flex: 1, pt: 2 }}>
        {[
          { label: "קצת עלי", id: "about", icon: <PersonIcon /> },
          { label: "מסלולים", id: "tracks", icon: <FitnessCenterIcon /> },
          // { label: "תוצאות", id: "results", icon: <EmojiEventsIcon /> },
          { label: "צור קשר", id: "contact", icon: <ContactSupportIcon /> },
        ].map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => scrollToSection(item.id)}
              sx={{
                py: 2,
                px: 3,
                "&:hover": {
                  bgcolor: "rgba(31, 111, 174, 0.08)",
                  "& .MuiListItemIcon-root": {
                    color: "#1f6fae",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "text.secondary", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textAlign: "right",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          p: 1,
          textAlign: "center",
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          © 2025 Roni Koshel
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Developed by{" "}
          <a
            href="https://www.instagram.com/biranvaron"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Biran Varon
          </a>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          direction: "rtl",
        }}
      >
        {/* Header */}
        <HideOnScroll>
          <AppBar
            position="fixed"
            sx={{
              background: "linear-gradient(90deg, #1f6fae 0%, #155a8a 100%)",
              color: "white",
              boxShadow: "0 4px 20px rgba(31, 111, 174, 0.3)",
            }}
          >
            <Toolbar
              sx={{ justifyContent: "space-between", position: "relative" }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>

              <Stack
                direction="row"
                alignItems="center"
                spacing={0}
                sx={{
                  position: { xs: "absolute", sm: "static" },
                  left: { xs: "50%", sm: "auto" },
                  transform: { xs: "translateX(-50%)", sm: "none" },
                  width: { xs: "max-content", sm: "auto" },
                }}
              >
                <Box
                  component="img"
                  src={logoImage}
                  alt="Roni Koshel Logo"
                  sx={{
                    width: { xs: 40, md: 50 },
                    height: { xs: 40, md: 50 },
                    display: { xs: "none", sm: "block" },
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: "white",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    display: "block",
                    fontSize: { xs: "0.9rem", sm: "1.25rem" },
                    whiteSpace: "nowrap",
                    mr: { sm: 3 },
                  }}
                >
                  רוני קושל - כושר ותזונה אונליין
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection("about")}
                    sx={{
                      fontWeight: 600,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    קצת עלי
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection("tracks")}
                    sx={{
                      fontWeight: 600,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    מסלולים
                  </Button>
                  {/* <Button
                    color="inherit"
                    onClick={() => scrollToSection("results")}
                    sx={{
                      fontWeight: 600,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    תוצאות
                  </Button> */}
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection("contact")}
                    sx={{
                      fontWeight: 600,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    צור קשר
                  </Button>
                </Box>
                {isAdminLoggedIn && (
                  <IconButton
                    color="inherit"
                    onClick={() => setIsAdminLoggedIn(false)}
                    title="התנתק"
                  >
                    <LogoutIcon />
                  </IconButton>
                )}
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={toggleColorMode}
                  color="inherit"
                >
                  {theme.palette.mode === "dark" ? (
                    <LightModeIcon />
                  ) : (
                    <DarkModeIcon />
                  )}
                </IconButton>
              </Stack>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Box component="nav">
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,
                direction: "rtl",
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Toolbar /> {/* Spacer */}
        {isAdminLoggedIn ? (
          <AdminDashboard />
        ) : (
          <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            {/* Hero / About Section */}
            <Box id="about" sx={{ mb: { xs: 6, md: 12 }, textAlign: "center" }}>
              <Container maxWidth="md">
                <Typography
                  variant="h2"
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: "2.5rem", md: "3.75rem" },
                  }}
                >
                  {/* ברוך הבא לאתר שלי */}
                  רוני קושל
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
                >
                  תזונה וכושר בהתאמה אישית • מגוון מסלולים • זמינות 24/7
                </Typography>

                <Box
                  sx={{
                    mb: 4,
                    mx: "auto",
                    "& .swiper": {
                      pb: 6,
                      px: 2,
                    },
                    "& .swiper-pagination-bullet": {
                      bgcolor: "primary.main",
                      opacity: 0.4,
                      transition: "all 0.3s",
                      "&.swiper-pagination-bullet-active": {
                        opacity: 1,
                        transform: "scale(1.2)",
                      },
                    },
                    "& .swiper-button-next, & .swiper-button-prev": {
                      color: "primary.main",
                      bgcolor: "transparent",
                      transition: "all 0.3s ease",
                      "--swiper-navigation-size": "32px",
                      "&:after": {
                        fontSize: "32px",
                        fontWeight: 900,
                      },
                      "&:hover": {
                        color: "primary.dark",
                        transform: "scale(1.2)",
                      },
                    },
                  }}
                >
                  <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                    }}
                  >
                    {meImages.map((img, index) => (
                      <SwiperSlide key={index}>
                        <Box
                          onClick={() => setSelectedImage(img)}
                          sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            height: 400,
                            position: "relative",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              "& .zoom-overlay": {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={img}
                            alt={`Roni Koshel ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <Box
                            className="zoom-overlay"
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              bgcolor: "rgba(0,0,0,0.3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                            }}
                          >
                            <ZoomInIcon
                              sx={{ color: "white", fontSize: "3rem" }}
                            />
                          </Box>
                        </Box>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>

                {/* Lightbox Dialog */}
                <Dialog
                  open={!!selectedImage}
                  onClose={() => setSelectedImage(null)}
                  maxWidth="lg"
                  fullWidth
                  PaperProps={{
                    sx: {
                      bgcolor: "transparent",
                      boxShadow: "none",
                      overflow: "hidden",
                    },
                  }}
                  BackdropProps={{
                    sx: {
                      bgcolor: "rgba(0, 0, 0, 0.9)",
                    },
                  }}
                >
                  <Box
                    sx={{ position: "relative", width: "100%", height: "100%" }}
                  >
                    <IconButton
                      onClick={() => setSelectedImage(null)}
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.5)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                        zIndex: 1,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Box
                      component="img"
                      src={selectedImage || ""}
                      alt="Full size"
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "90vh",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </Box>
                </Dialog>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                    color: "text.secondary",
                  }}
                >
                  אז מי אני? רוני, בן 22 מבת ים. רוב החיים שלי חייתי עם עודף
                  משקל, עד שנקודת המפנה הגיעה בצבא כשרצו לא לגייס אותי. הבנתי
                  שאין לי ברירה אלא לשנות את החיים שלי. בתוך 3.5 חודשים הורדתי
                  30 קילו, התגייסתי, והמשכתי לירידה כוללת של 50 קילו ושינוי חיים
                  אמיתי.
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                    color: "text.secondary",
                  }}
                >
                  אחרי השחרור החלטתי לעזור לאנשים שנמצאים בדיוק במקום שבו הייתי.
                  סיימתי קורס מאמני כושר ופתחתי את העסק כדי ללוות אנשים בצורה
                  מקצועית ואנושית, ולהראות להם שגם הם יכולים.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  אם אתם מרגישים תקועים ומחפשים מישהו שמבין אתכם באמת - אני כאן
                  כדי ללוות אתכם צעד-צעד לשינוי אמיתי.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection("tracks")}
                  sx={{
                    mt: 4,
                    fontSize: "1.1rem",
                    px: 6,
                    py: 1.5,
                    borderRadius: 50,
                    boxShadow: "0 10px 20px rgba(31, 111, 174, 0.3)",
                  }}
                >
                  התחל את השינוי שלך
                </Button>
              </Container>
            </Box>

            {/* Tracks Section */}
            <Box id="tracks" sx={{ mb: { xs: 6, md: 12 } }}>
              <Container maxWidth="lg">
                <Typography
                  variant="h3"
                  fontWeight={800}
                  align="center"
                  gutterBottom
                  sx={{
                    mb: { xs: 4, md: 6 },
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  המסלולים
                </Typography>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems="stretch"
                >
                  {/* Monthly Track */}
                  <Card
                    sx={{
                      flex: 1,
                      p: 4,
                      bgcolor: "background.paper",
                      borderRadius: 4,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "translateY(-10px)" },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      gutterBottom
                      color="primary"
                    >
                      מסלול חודשי
                    </Typography>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "text.secondary" }}
                    >
                      כניסה מסודרת לתהליך
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <List>
                      {[
                        "התאמה אישית ראשונית של תכנית אימונים",
                        "התאמה בסיסית של תפריט תזונה לפי מטרה",
                        "ליווי והכוונה במהלך החודש",
                        "מענה לשאלות והבהרות כדי להתחיל נכון",
                      ].map((text, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 1 }}>
                          <ListItemText
                            primary={text}
                            primaryTypographyProps={{
                              fontSize: "1.05rem",
                              textAlign: "right",
                            }}
                          />
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon sx={{ color: "#1f6fae" }} />
                          </ListItemIcon>
                        </ListItem>
                      ))}
                    </List>
                    <Box
                      sx={{
                        mt: "auto",
                        p: 2,
                        bgcolor: "rgba(31, 111, 174, 0.1)",
                        borderRadius: 2,
                        borderRight: "4px solid #1f6fae",
                      }}
                    >
                      <Typography variant="body2">
                        💡 חודש ממוקד לבניית בסיס נכון: התאמת תזונה ואימונים,
                        סדר ובהירות. מתאים למי שרוצה להתחיל נכון ולהבין אם
                        הליווי מתאים לו.
                      </Typography>
                    </Box>
                  </Card>

                  {/* 3 Months Track */}
                  <Card
                    sx={{
                      flex: 1,
                      p: 4,
                      bgcolor: "background.paper",
                      borderRadius: 4,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "translateY(-10px)" },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      gutterBottom
                      color="primary"
                    >
                      מסלול 3 חודשים
                    </Typography>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "text.secondary" }}
                    >
                      תהליך קצר עם תוצאות מורגשות
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <List>
                      {[
                        "תכנית אימונים ותזונה מותאמת אישית ומתעדכנת לאורך התקופה",
                        "ליווי צמוד ושוטף בוואטסאפ",
                        "מעקב התקדמות וביצוע התאמות לפי תוצאות",
                        "בניית שגרה, משמעת והרגלים נכונים",
                        "שיפור ניכר במראה, בכוח ובביטחון העצמי",
                      ].map((text, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 1 }}>
                          <ListItemText
                            primary={text}
                            primaryTypographyProps={{
                              fontSize: "1.05rem",
                              textAlign: "right",
                            }}
                          />
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon sx={{ color: "#1f6fae" }} />
                          </ListItemIcon>
                        </ListItem>
                      ))}
                    </List>
                    <Box
                      sx={{
                        mt: "auto",
                        p: 2,
                        bgcolor: "rgba(31, 111, 174, 0.1)",
                        borderRadius: 2,
                        borderRight: "4px solid #1f6fae",
                      }}
                    >
                      <Typography variant="body2">
                        💡 3 חודשים של עבודה עקבית ומדויקת, עם ליווי צמוד ותכנון
                        חכם. בחירה מצוינת למי שרוצה לראות שינוי אמיתי בזמן קצר.
                      </Typography>
                    </Box>
                  </Card>

                  {/* Half-Yearly Track */}
                  <Card
                    sx={{
                      flex: 1,
                      p: 4,
                      bgcolor: "background.paper",
                      borderRadius: 4,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      position: "relative",
                      overflow: "visible",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "translateY(-10px)" },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "primary.main",
                        color: "white",
                        px: 3,
                        py: 0.5,
                        borderRadius: 50,
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        boxShadow: "0 4px 10px rgba(31, 111, 174, 0.4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      מסלול מומלץ
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      gutterBottom
                      color="primary"
                    >
                      מסלול חצי שנתי
                    </Typography>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "text.secondary" }}
                    >
                      לא “זבנג וגמרנו” - תהליך שבונה תוצאות
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <List>
                      {[
                        "ליווי מקיף ומלא לאורך 6 חודשים",
                        "התאמות מתקדמות לתזונה ולאימונים לפי שלבי ההתקדמות",
                        "בניית הרגלים עמוקים ואורח חיים בריא",
                        "מעקב רציף, שליטה מלאה בתהליך ולמידה עצמאית",
                        "תוצאות יציבות שנשארות גם אחרי סיום הליווי",
                        "מתאים למי שמחפש שינוי אמיתי ולא פתרון זמני",
                      ].map((text, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={text}
                            primaryTypographyProps={{
                              fontSize: "1.05rem",
                              textAlign: "right",
                            }}
                          />
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon sx={{ color: "#1f6fae" }} />
                          </ListItemIcon>
                        </ListItem>
                      ))}
                    </List>
                    <Box
                      sx={{
                        mt: "auto",
                        p: 2,
                        bgcolor: "rgba(31, 111, 174, 0.1)",
                        borderRadius: 2,
                        borderRight: "4px solid #1f6fae",
                      }}
                    >
                      <Typography variant="body2">
                        💡 6 חודשים של תהליך מדויק, הדרגתי ומקצועי לבניית גוף
                        חזק, אסתטי והרגלים שנשארים לאורך זמן. בלי קיצורי דרך,
                        בלי בלבול - רק תוצאות אמיתיות שמחזיקות.
                      </Typography>
                    </Box>
                  </Card>
                </Stack>
              </Container>
            </Box>

            {/* Results Section */}
            {false && (
              <Box id="results" sx={{ mb: { xs: 6, md: 12 } }}>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  align="center"
                  gutterBottom
                  sx={{
                    mb: { xs: 4, md: 6 },
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  תוצאות
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: { xs: 4, md: 8 }, maxWidth: 800, mx: "auto" }}
                >
                  הנה טעימה קטנה מהשינויים המדהימים שהמתאמנים שלי עשו. בקרוב
                  תמונות נוספות!
                </Typography>

                <Box
                  sx={{
                    "& .swiper": {
                      pb: 6,
                      px: 2, // Add some padding to container so arrows don't touch edges
                    },
                    "& .swiper-pagination-bullet": {
                      bgcolor: "primary.main",
                      opacity: 0.4,
                      transition: "all 0.3s",
                      "&.swiper-pagination-bullet-active": {
                        opacity: 1,
                        transform: "scale(1.2)",
                      },
                    },
                    "& .swiper-button-next, & .swiper-button-prev": {
                      color: "primary.main",
                      bgcolor: "transparent",
                      transition: "all 0.3s ease",
                      "--swiper-navigation-size": "32px",
                      "&:after": {
                        fontSize: "32px",
                        fontWeight: 900,
                      },
                      "&:hover": {
                        color: "primary.dark",
                        transform: "scale(1.2)",
                      },
                    },
                    "& .swiper-button-next": {
                      right: { xs: 0, md: 10 }, // Closer to edge on mobile
                    },
                    "& .swiper-button-prev": {
                      left: { xs: 0, md: 10 },
                    },
                  }}
                >
                  <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <SwiperSlide key={item}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              pt: "100%", // 1:1 Aspect Ratio
                              position: "relative",
                              bgcolor: "action.hover",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "text.secondary",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                              }}
                            >
                              תמונה {item}
                            </Box>
                          </Box>
                        </Card>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </Box>
            )}

            {/* Contact Section */}
            <Box
              id="contact"
              sx={{
                textAlign: "center",
                py: 4,
                bgcolor: "background.paper",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                gutterBottom
                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
              >
                מוכנים להתחיל?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: "text.secondary",
                  maxWidth: "auto",
                  mx: "auto",
                }}
              >
                אני כאן לכל שאלה או התייעצות. שלחו לי הודעה ונתחיל את המסע שלכם
                יחד.
              </Typography>

              <Stack
                direction="row"
                // spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 2 }}
                gap={2}
              >
                <IconButton
                  component="a"
                  href="https://www.instagram.com/ronikoshel"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#E1306C",
                    bgcolor: "rgba(225, 48, 108, 0.1)",
                    width: 72,
                    height: 72,
                    transition: "all 0.3s",
                    "&:hover": {
                      bgcolor: "rgba(225, 48, 108, 0.2)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <InstagramIcon sx={{ fontSize: 40 }} />
                </IconButton>

                <IconButton
                  component="a"
                  href="https://www.tiktok.com/@ronikoshel"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.primary",
                    bgcolor: "rgba(0, 0, 0, 0.05)",
                    width: 72,
                    height: 72,
                    transition: "all 0.3s",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.1)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <TikTokIcon sx={{ fontSize: 40 }} />
                </IconButton>

                <IconButton
                  onClick={openWhatsapp}
                  sx={{
                    color: "#25D366",
                    bgcolor: "rgba(37, 211, 102, 0.1)",
                    width: 72,
                    height: 72,
                    transition: "all 0.3s",
                    "&:hover": {
                      bgcolor: "rgba(37, 211, 102, 0.2)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <WhatsAppIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Stack>

              <Box
                component="form"
                action="https://formsubmit.co/ronikoshelfit@gmail.com"
                method="POST"
                sx={{
                  mt: 4,
                  maxWidth: 350,
                  mx: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <input
                  type="hidden"
                  name="_subject"
                  value="פנייה חדשה מהאתר!"
                />
                <input type="hidden" name="_captcha" value="false" />
                <input
                  type="hidden"
                  name="_next"
                  value={window.location.href}
                />

                <TextField
                  label="שם מלא"
                  name="name"
                  required
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: "background.paper",
                    "& .MuiInputLabel-root": {
                      left: "auto",
                      right: "1.5rem",
                      transformOrigin: "top right",
                    },
                    "& .MuiOutlinedInput-notchedOutline legend": {
                      textAlign: "right",
                    },
                  }}
                />
                <TextField
                  label="טלפון"
                  name="phone"
                  required
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="tel"
                  sx={{
                    bgcolor: "background.paper",
                    "& .MuiInputLabel-root": {
                      left: "auto",
                      right: "1.5rem",
                      transformOrigin: "top right",
                    },
                    "& .MuiOutlinedInput-notchedOutline legend": {
                      textAlign: "right",
                    },
                  }}
                />
                <TextField
                  label="הודעה"
                  name="message"
                  multiline
                  rows={4}
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: "background.paper",
                    "& .MuiInputLabel-root": {
                      left: "auto",
                      right: "1.5rem",
                      transformOrigin: "top right",
                    },
                    "& .MuiOutlinedInput-notchedOutline legend": {
                      textAlign: "right",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    bgcolor: "primary.main",
                    color: "white",
                    fontSize: "1rem",
                    py: 1,
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  שלח הודעה
                </Button>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  opacity: 0.1,
                  "&:hover": { opacity: 1 },
                  transition: "opacity 0.3s",
                }}
              >
                <Button
                  size="small"
                  color="inherit"
                  endIcon={<AdminPanelSettingsIcon />}
                  onClick={() => setShowLoginModal(true)}
                  sx={{ gap: 1 }}
                >
                  כניסת מנהל
                </Button>
              </Box>
            </Box>
          </Container>
        )}
        {/* Footer */}
        <Box
          sx={{
            py: 2,
            textAlign: "center",
            bgcolor: "background.paper",
            mt: 4,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            © 2025 Roni Koshel. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Developed by{" "}
            <a
              href="https://www.instagram.com/biranvaron"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              Biran Varon
            </a>
          </Typography>
        </Box>
        {/* Floating WhatsApp Button */}
        <Fab
          color="primary"
          aria-label="whatsapp"
          onClick={openWhatsapp}
          sx={{
            position: "fixed",
            bottom: 32,
            left: 32,
            bgcolor: "#25D366",
            "&:hover": { bgcolor: "#128C7E" },
            width: 64,
            height: 64,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.7)" },
              "70%": { boxShadow: "0 0 0 20px rgba(37, 211, 102, 0)" },
              "100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0)" },
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32 }} />
        </Fab>
        <AccessibilityWidget />
        <LoginModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
        />
      </Box>
    </ThemeProvider>
  );
}
