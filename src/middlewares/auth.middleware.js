import jwt from 'jsonwebtoken';
import "dotenv/config";

const Auth = async (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    req.flash('error', 'Unauthorized access');
    return res.redirect('/');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    // throw error;
    req.flash('error', 'Invalid Token');
    return res.redirect('/');
  }
}

export default Auth;
