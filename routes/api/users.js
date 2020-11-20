/* 
    Handles registering users
*/

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route   Post api/users
// @desc    register a user
// @access  public
router.post('/', [
    body('name', "name is required").notEmpty(),
    body('email', "Please include a valid Email Address").isEmail(),
    body('password', "Please enter a password with 6 or more characters").isLength({ min: 6 })

], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        // see if user exists
        let user = await User.findOne({ email });
        // if exists, throw error
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }]});
        }

        // get user gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        // create instance of userSchema
        user = new User({
            name,
            email,
            avatar,
            password
        });
        // encrypt password, bcrypt
        const salt = await bcrypt.genSalt(10); // create salt
        user.password = await bcrypt.hash(password, salt);

        await user.save(); // save user with encypted password to db

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