const User = require("../models/userModel");
async function createAdminUser() {
  try {
    const adminUserData = {
      username: "admin",
      password: "admin", // Don't forget to hash this password in a real scenario
      email: "admin@admin.com",
      firstName: "Admin",
      lastName: "admin",
      role: "admin", // Set the role to "admin"
    };

    const existingUser = await User.findOne({
      username: adminUserData.username,
    });

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const adminUser = await User.create(adminUserData);

    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Call the function to create an admin user
module.exports = createAdminUser;
