import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: true,
  credentials: true               
}));

const PORT = 3000;

const ACCESS_SECRET = "access_token_secret_key_123";
const REFRESH_SECRET = "refresh_token_secret_key_456";

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email && email.trim().toLowerCase() === "student@gmail.com" && password === "123456") {
    const user = { id: '1', email: email.trim().toLowerCase() };

    const accessToken = jwt.sign(user, ACCESS_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.json({ message: "Login successful", accessToken });
  }

  res.status(401).json({ message: "Invalid email or password" });
});

app.post('/api/refresh', (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }

  const refreshToken = cookies.refreshToken;

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: '10m' });
    res.json({ accessToken: newAccessToken });
  });
});

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired or invalid" });
    req.user = user;
    next();
  });
};

app.get('/api/dashboard-data', verifyAccessToken, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));