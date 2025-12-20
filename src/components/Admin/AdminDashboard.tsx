import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Paper,
  Alert,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Mock Data Generator
const generateMockVisits = () => {
  const visits = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    visits.push({
      date: date.toLocaleDateString("he-IL"),
      count: Math.floor(Math.random() * 50) + 10,
      unique: Math.floor(Math.random() * 30) + 5,
    });
  }
  return visits;
};

const mockVisits = generateMockVisits();

export default function AdminDashboard() {
  const [currentIP, setCurrentIP] = useState<string>("טוען...");

  useEffect(() => {
    // Fetch real IP
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setCurrentIP(data.ip))
      .catch(() => setCurrentIP("לא זמין"));
  }, []);

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        לוח בקרה - סטטיסטיקות
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        שים לב: נתונים היסטוריים הם להדגמה בלבד (Demo). ללא שרת אחורי (Backend),
        לא ניתן לשמור ולעקוב אחר מבקרים אמיתיים לאורך זמן.
        <br />
        כתובת ה-IP הנוכחית שלך היא אמיתית.
      </Alert>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #1f6fae 0%, #155a8a 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">סה"כ ביקורים</Typography>
                <PublicIcon sx={{ opacity: 0.8 }} />
              </Box>
              <Typography variant="h3" fontWeight="bold">
                1,245
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                +12% מהחודש שעבר
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  משתמשים ייחודיים
                </Typography>
                <GroupIcon color="primary" />
              </Box>
              <Typography variant="h3" fontWeight="bold" color="text.primary">
                850
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                <TrendingUpIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                />
                עלייה קבועה
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  זמן שהייה ממוצע
                </Typography>
                <AccessTimeIcon color="primary" />
              </Box>
              <Typography variant="h3" fontWeight="bold" color="text.primary">
                2:45
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                דקות
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              תנועה ב-30 הימים האחרונים
            </Typography>
            <Box sx={{ mt: 3 }}>
              {mockVisits.slice(0, 7).map((day, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{day.date}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {day.count} ביקורים
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(day.count / 60) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "rgba(31, 111, 174, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              כתובות IP אחרונות
            </Typography>
            <List>
              <ListItem divider>
                <ListItemIcon>
                  <PublicIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={currentIP}
                  secondary="הביקור הנוכחי שלך"
                  sx={{ textAlign: "center" }}
                  primaryTypographyProps={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                />
                <Chip
                  label="אונליין"
                  color="success"
                  size="small"
                  variant="filled"
                />
              </ListItem>
              {[
                "85.64.22.11",
                "212.143.55.89",
                "147.235.1.12",
                "31.154.88.90",
              ].map((ip, index) => (
                <ListItem key={index} divider={index !== 3}>
                  <ListItemIcon>
                    <PublicIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={ip}
                    secondary="לפני מספר דקות (הדגמה)"
                    sx={{ textAlign: "center" }}
                    primaryTypographyProps={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label="פעיל"
                    color="default"
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
