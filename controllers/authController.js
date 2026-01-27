const User = require("../models/user");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already registered" });

  await User.create({ name, email, password });

  res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  req.session.userId = user._id;
  res.status(200).json({ message: "Login successful" });
};

exports.profile = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(req.session.userId).select("-password");
  res.json(user);
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};
