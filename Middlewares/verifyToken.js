const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodPayload;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "No Token Provided " });
  }
}
// verify token and admin

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access Denied, you are not admin" });
    }
  });
}
// verify token and only user
function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      res.status(403).json({ message: "Not Authorized,only user himself" });
    }
  });
}
function verifyTokenAndAuthrization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Not Authorized,only user himself or admin" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndOnlyUser,
  verifyTokenAndAdmin,
  verifyTokenAndAuthrization,
};
