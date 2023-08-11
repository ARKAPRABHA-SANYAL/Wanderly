const express = require('express');
const router = express.Router();
const User = require('./models/user');

// Define admin routes here
router.get('/', (req, res) => {
  res.send('Admin Panel Home');
});

router.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database and send the data as a response
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error while fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Delete the user with the specified id from the database
    await User.deleteUserById(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error while deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
