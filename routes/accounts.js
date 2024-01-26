const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')

/**
 * * GET ALL 
 */
router.get('/', async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json( { message: err.message })
    }
})

/**
 * * AUTHENTICATE
 */
router.get('/login', GetUsername, async (req,res) => {
    try {
        if (await bcrypt.compare(req.body.password,res.user.password)) {
            res.send("Success");
        } else {
            res.send("Failed");
        }
    } catch (err) {
        res.status(500).json( { message: err.message })
    }
})

/**
 * * GET ONE BY ID 
 */
router.get('/:id', GetUser, async (req,res) => {
    res.send(res.user);
})

/**
 * * POST ONE 
 */
router.post('/', async (req,res) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        username: req.body.username,
        password: hashedPassword
    })

    try {
        const newUser = user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.json(400).json({ message: err.message });
    }

})

/**
 * * DELETE ONE 
 */
router.delete('/:id', GetUser, async (req,res) => {
    try {
        await res.user.deleteOne();
        res.json({ message: "User Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


/**
 * * MIDDLEWARES
 */

/**
 * * GET USER USING ID
 */
async function GetUser(req,res,next) {
    let user;

    try {
        user = await User.findById(req.params.id);
        
        if (user == null) {
            return res.status(404).json({ message: "User not found"});
        }

        res.user = user;
        next();

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/**
 * * GET USER USING USERNAME
 */
async function GetUsername(req,res,next) {
    let users;
    let user;
    try {
        users = await User.find();

        users.forEach(data => {
            if (data.username === req.body.username) user = data;
        })

        if (user== null) {
            return res.status(404).json({ message: "User not found"});
        }
        
        res.user = user;
        next();

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;