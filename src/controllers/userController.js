const express = require('express');
const { createUserOnMikroTik } = require('../api/mikrotik');
const router = express.Router();

// Handle user creation
router.post('/create-user', async (req, res, next) => {
  const { email, plan, paymentReference } = req.body;

  try {
    const userResult = await createUserOnMikroTik(email, plan);
    console.log(`Payment Reference: ${paymentReference}, User Added: ${userResult}`);

    res.status(200).json({ message: "User created successfully and payment recorded!" });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

module.exports = router;