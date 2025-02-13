const express = require("express");
const router = express.Router();
const User = require("../models/user");


// INDEX - Show all users

router.get("/", async (req, res) => {
    try {
        const users = await User.find({}, "username pantry"); // Fetch users with their username and pantry
        res.render("users/index", { users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.redirect("/");
    }
});


// SHOW - View a specific user's pantry

router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log("User not found!");
            return res.redirect("/users");
        }
        res.render("users/show", { user });
    } catch (error) {
        console.log("Error fetching user pantry:", error);
        res.redirect("/users");
    }
});


module.exports = router;