let getAllUser = (req, res) => {
  return res.status(200).json({
    message: "Why you call me",
  });
};

module.exports = {
  getAllUser,
};
