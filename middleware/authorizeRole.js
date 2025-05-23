const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res
        .status(403)
        .json({ error: "not enough authority for this route" });
    }
    next();
  };
};

export default checkRole;
