import { useState, useEffect, useRef } from "react";
import {
  Box,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CloseIcon from "@mui/icons-material/Close";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import ContrastIcon from "@mui/icons-material/Contrast";
import LinkIcon from "@mui/icons-material/Link";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterBAndWIcon from "@mui/icons-material/FilterBAndW";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);

  // Dragging state
  const [position, setPosition] = useState({ left: 36, bottom: 110 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ left: 36, bottom: 110 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid scrolling on touch devices while dragging
    // e.preventDefault(); // Note: Calling preventDefault on touchstart might block scrolling entirely if not careful, but for a button it's usually okay.

    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    isDragging.current = false;
    dragStart.current = { x: clientX, y: clientY };
    initialPos.current = { ...position };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    // Threshold to distinguish click from drag
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      let newLeft = initialPos.current.left + dx;
      let newBottom = initialPos.current.bottom - dy;

      const headerHeight = 50; // Approx 64px + padding
      const buttonSize = 70; // FAB size + margin

      // Vertical constraints
      const maxBottom = window.innerHeight - headerHeight - buttonSize;
      if (newBottom < 0) newBottom = 0;
      if (newBottom > maxBottom) newBottom = maxBottom;

      // Horizontal constraints
      const maxLeft = window.innerWidth - buttonSize;
      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;

      // WhatsApp Button Zone (Bottom-Left)
      // WhatsApp is at bottom: 32, left: 32, size: 64.
      // Zone edge = 32 + 64 = 96. Add margin.
      const waZoneSize = 110;

      if (newLeft < waZoneSize && newBottom < waZoneSize) {
        // Collision with WhatsApp button area
        // Determine which boundary to enforce based on where we started
        if (initialPos.current.bottom >= waZoneSize) {
          newBottom = waZoneSize;
        } else if (initialPos.current.left >= waZoneSize) {
          newLeft = waZoneSize;
        }
      }

      setPosition({
        left: newLeft,
        bottom: newBottom,
      });
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleMouseUp);

    if (!isDragging.current) {
      setOpen(true);
    }

    // Reset flag after a short delay to prevent accidental clicks if any
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  const [settings, setSettings] = useState({
    grayscale: false,
    highContrast: false,
    highlightLinks: false,
    largeFont: false,
  });

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      applySettings(newSettings);
      return newSettings;
    });
  };

  const resetSettings = () => {
    const newSettings = {
      grayscale: false,
      highContrast: false,
      highlightLinks: false,
      largeFont: false,
    };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const applySettings = (currentSettings: typeof settings) => {
    const body = document.body;

    if (currentSettings.grayscale) body.classList.add("access-grayscale");
    else body.classList.remove("access-grayscale");

    if (currentSettings.highContrast)
      body.classList.add("access-high-contrast");
    else body.classList.remove("access-high-contrast");

    if (currentSettings.highlightLinks)
      body.classList.add("access-highlight-links");
    else body.classList.remove("access-highlight-links");

    if (currentSettings.largeFont) body.classList.add("access-large-font");
    else body.classList.remove("access-large-font");
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="accessibility menu"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        sx={{
          position: "fixed",
          bottom: position.bottom,
          left: position.left,
          zIndex: 1000,
          bgcolor: "#1f6fae",
          "&:hover": { bgcolor: "#155a8a" },
          cursor: "move",
          touchAction: "none", // Prevent browser handling gestures
        }}
      >
        <AccessibilityNewIcon />
      </Fab>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: 300, p: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            נגישות
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => toggleSetting("largeFont")}
              selected={settings.largeFont}
            >
              <ListItemIcon>
                <FormatSizeIcon />
              </ListItemIcon>
              <ListItemText primary="הגדל טקסט" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => toggleSetting("grayscale")}
              selected={settings.grayscale}
            >
              <ListItemIcon>
                <FilterBAndWIcon />
              </ListItemIcon>
              <ListItemText primary="גווני אפור" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => toggleSetting("highContrast")}
              selected={settings.highContrast}
            >
              <ListItemIcon>
                <ContrastIcon />
              </ListItemIcon>
              <ListItemText primary="ניגודיות גבוהה" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => toggleSetting("highlightLinks")}
              selected={settings.highlightLinks}
            >
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary="הדגשת קישורים" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 2 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={resetSettings}>
              <ListItemIcon>
                <RestartAltIcon />
              </ListItemIcon>
              <ListItemText primary="איפוס הגדרות" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setStatementOpen(true)}>
              <ListItemText
                primary="הצהרת נגישות"
                primaryTypographyProps={{
                  variant: "body2",
                  color: "primary",
                  style: { textDecoration: "underline" },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Dialog
        open={statementOpen}
        onClose={() => setStatementOpen(false)}
        maxWidth="md"
        dir="rtl"
      >
        <DialogTitle>הצהרת נגישות</DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            <strong>כללי</strong>
            <br />
            אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הלקוחות והגולשים
            ובשיפור השירות הניתן ללקוחות עם מוגבלות. לשם כך הושקעו משאבים רבים
            בהנגשת האתר, במטרה להקל על השימוש בו וכן להפוך את שירותינו לזמינים
            יותר עבור אנשים עם מוגבלות.
          </Typography>
          <Typography paragraph>
            <strong>הנגשת האתר</strong>
            <br />
            האתר נבנה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות
            נגישות לשירות), תשע"ג-2013. התאמות הנגישות בוצעו עפ"י המלצות התקן
            הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA ומסמך WCAG2.0
            הבינלאומי.
          </Typography>
          <Typography paragraph>
            <strong>כיצד עובדת ההנגשה באתר?</strong>
            <br />
            באתר מוצב תפריט הנגשה. לחיצה על התפריט מאפשרת פתיחת כפתורי ההנגשה.
            לאחר בחירת נושא בתפריט יש להמתין לטעינת הדף.
          </Typography>
          <Typography paragraph>
            <strong>אפשרויות הנגישות בתפריט:</strong>
            <br />
            - הגדלת הטקסט באתר
            <br />
            - שינוי ניגודיות צבעים (גבוהה/כהה)
            <br />
            - גווני אפור
            <br />- הדגשת קישורים
          </Typography>
          <Typography paragraph>
            <strong>פניה לרכז הנגישות</strong>
            <br />
            אם במהלך הגלישה באתר נתקלתם בבעיה בנושא נגישות, נשמח לקבל מכם הערות
            ובקשות. ניתן לפנות אלינו באמצעים הבאים:
            <br />
            שם: רוני קושל
            <br />
            טלפון: 050-924-9858
            <br />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatementOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
