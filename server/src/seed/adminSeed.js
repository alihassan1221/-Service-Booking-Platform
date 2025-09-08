const bcrypt = require('bcryptjs');
const User = require('../models/User.js')

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@servicebooking.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "aliHassan@1";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    // check if admin exists
    const existing = await User.findOne({ email: adminEmail, role: "admin" });
    if (existing) {
      console.log("✅ Admin already exists:", existing.email);
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("🌱 Admin seeded:", admin.email);
  } catch (err) {
    console.error("❌ Failed to seed admin:", err.message);
  }
};

module.exports = seedAdmin;