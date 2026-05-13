const jwt = require("jsonwebtoken");
const { getCollections } = require("../config/db");

// Get user profile with stats
const getProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).send({ message: "No token found, please login" });

  try {
    const {
      userCollection,
      transactionsCollection,
      partiesCollection,
      productsCollection,
      cashbookCollection,
    } = getCollections();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const user = await userCollection.findOne(
      { email: userEmail },
      { projection: { pin: 0 } },
    );

    if (!user) return res.status(404).send({ message: "User not found" });

    // Count user stats
    const totalSales = await transactionsCollection.countDocuments({
      userEmail,
      type: "sale",
    });
    const customers = await partiesCollection.countDocuments({
      userEmail,
      type: "customer",
    });
    const inventory = await productsCollection.countDocuments({ userEmail });
    const pendingCash = await cashbookCollection.countDocuments({ userEmail });

    res.send({
      ...user,
      stats: {
        totalSales: totalSales || 0,
        customers: customers || 0,
        inventory: inventory || 0,
        pendingCash: pendingCash || 0,
      },
    });
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).send({ message: "No token found, please login" });

  try {
    const { userCollection } = getCollections();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const { name, phone, businessName, dob, gender, address } = req.body;

    const filter = { email: userEmail };
    const updateDoc = {
      $set: {
        name,
        phone,
        businessName,
        dob,
        gender,
        address,
        updatedAt: new Date(),
      },
    };

    const result = await userCollection.updateOne(filter, updateDoc);
    res.send({ message: "Profile updated successfully", result });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Failed to update profile", error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
