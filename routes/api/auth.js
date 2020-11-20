/* 
    Handles getting jwt for auth
*/

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../../middlewares/authMiddleware');
const User = require('../../models/User');

// @route   Get api/auth
// @desc    Test route
// @access  public
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');

    }
});

// @route   Post api/auth
// @desc    authenticate a user and get token
// @access  public
router.post('/', [
    body('email', "Please include a valid Email Address").isEmail(),
    body('password', "Password is required").exists()

], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // see if user exists
        let user = await User.findOne({ email });
        // if exists, throw error
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials"}] });
        }

        // return jwt
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('JWT_SECRET'), { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    
});

module.exports = router;