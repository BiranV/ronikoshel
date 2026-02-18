import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

interface UserCredentials {
  pass: string;
  phone: string;
}

const ADMIN_1_EMAIL = "ronikoshelfit@gmail.com";
const ADMIN_1_PHONE = "0543299789";

const USERS: Record<string, UserCredentials> = {
  [ADMIN_1_EMAIL]: {
    pass: import.meta.env.VITE_ADMIN_1_PASSWORD as string,
    phone: ADMIN_1_PHONE,
  },
  [import.meta.env.VITE_ADMIN_2_EMAIL as string]: {
    pass: import.meta.env.VITE_ADMIN_2_PASSWORD as string,
    phone: import.meta.env.VITE_ADMIN_2_PHONE as string,
  },
};

export default function LoginModal({
  open,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2FA State
  const [verificationCode, setVerificationCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [targetPhone, setTargetPhone] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const user = USERS[email];

      if (user && user.pass === password) {
        // Success - Generate Code
        /* 2FA DISABLED TEMPORARILY
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationCode(code);
        setTargetPhone(user.phone);
        setStep("2fa");

        // SIMULATE SENDING WHATSAPP
        // In a real app, this would call a backend API
        alert(
          `[SIMULATION] WhatsApp Message to ${user.phone}:\nYour verification code is: ${code}`
        );
        console.log(`Code for ${user.phone}: ${code}`);
        */

        // Direct Login
        onLoginSuccess();
        onClose();
        setEmail("");
        setPassword("");
      } else {
        setError("שם משתמש או סיסמה שגויים");
      }
      setLoading(false);
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (userCode === verificationCode) {
        onLoginSuccess();
        onClose();
        // Reset state
        setStep("login");
        setEmail("");
        setPassword("");
        setUserCode("");
      } else {
        setError("קוד שגוי, נסה שנית");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
        },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {step === "login" ? "התחברות למערכת" : "אימות דו-שלבי"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {step === "login"
            ? "אזור ניהול בלבד"
            : `שלחנו קוד אימות למספר המסתיים ב-${targetPhone.slice(-4)}`}
        </Typography>
      </Box>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === "login" ? (
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="אימייל"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": {
                  left: "auto",
                  right: "1.5rem",
                  transformOrigin: "top right",
                },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": {
                  left: "auto",
                  right: "1.5rem",
                  transformOrigin: "top right",
                },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "התחבר"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <Box sx={{ textAlign: "center", py: 2 }}>
              <WhatsAppIcon
                sx={{ fontSize: 48, color: "#25D366", mb: 2 }}
                className="pulse"
              />
              <TextField
                fullWidth
                label="קוד אימות (6 ספרות)"
                variant="outlined"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                sx={{
                  "& .MuiInputLabel-root": {
                    left: "auto",
                    right: "1.5rem",
                    transformOrigin: "top right",
                  },
                  "& .MuiOutlinedInput-notchedOutline legend": {
                    textAlign: "right",
                  },
                }}
                inputProps={{
                  maxLength: 6,
                  style: { textAlign: "center", letterSpacing: "0.5em" },
                }}
              />
            </Box>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "אמת קוד"}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setStep("login")}
              sx={{ mt: 1 }}
            >
              חזרה להתחברות
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
