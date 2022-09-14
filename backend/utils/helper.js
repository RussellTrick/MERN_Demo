exports.sendError = (res, error, status = 401) => {
  return res.status(status).json({ success: false, error });
};
