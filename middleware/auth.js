const jwt = require('jsonwebtoken');

// Protects routes that need a logged-in user.
// Expects the header:  Authorization: Bearer <token>
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorised: no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorised: token is invalid or expired.' });
  }
}

module.exports = auth;
