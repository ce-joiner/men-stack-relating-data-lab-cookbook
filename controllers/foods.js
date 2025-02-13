// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// INDEX 

router.get("/:userId/foods", async (req, res) => {
    // console.log("Route Hit! UserId:", req.params.userId); // Debugging log
    try {
        const currentUser = await User.findById(req.params.userId);

        if (!currentUser) {
            console.log("User not found!");
            return res.redirect("/");
        }

        // Store pantry in res.locals for use in EJS
        res.locals.pantry = currentUser.pantry;

        // console.log("User's Pantry:", res.locals.pantry); // Debugging log

        // Render the pantry page
        res.render("foods/index", { user: currentUser });
    } catch (error) {
        console.error("Error fetching pantry:", error);
        res.redirect("/");
    }
});


// NEW 


router.get("/:userId/foods/new", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);

        if (!currentUser) {
            console.log("User not found!");
            return res.redirect("/");
        }

        res.render("foods/new.ejs", { user: currentUser });
    } catch (error) {
        console.error("Error rendering new food form:", error);
        res.redirect("/");
    }
});


// DELETE 

router.delete('/:userId/foods/:itemId', async (req, res) => {
    try {
      // Look up the user from req.session
      const currentUser = await User.findById(req.session.user._id);
  
      if (!currentUser) {
        console.log("User not found!");
        return res.redirect("/");
      }
  
      // Find the food item in the pantry array and delete it
      const foodItem = currentUser.pantry.id(req.params.itemId);
      
      if (!foodItem) {
        console.log("Food item not found!");
        return res.redirect(`/users/${currentUser._id}/foods`);
      }
  
      foodItem.deleteOne(); // Remove the food item
  
      // Save changes to the user
      await currentUser.save();
  
      console.log(`Food item ${req.params.itemId} deleted successfully!`);
      res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
      // Log any errors and redirect home
      console.error("Error deleting food item:", error);
      res.redirect("/");
    }
  });


// UPDATE 

router.put("/:userId/foods/:itemId", async (req, res) => {
    try {
        // Find the user from session
        const currentUser = await User.findById(req.session.user._id);
        
        // Find the specific food item in the user's pantry
        const foodItem = currentUser.pantry.id(req.params.itemId);

        if (!foodItem) {
            console.log("Food item not found!");
            return res.redirect(`/users/${currentUser._id}/foods`);
        }

        // Use .set() to update fields with new form data from req.body
        foodItem.set(req.body);

        // Save the updated user document
        await currentUser.save();

        // Redirect back to the pantry index page
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log("Error updating food item:", error);
        res.redirect("/");
    }
});


// CREATE 

router.post("/:userId/foods", async (req, res) => {
    try {
        //  Get userId from params 
        const currentUser = await User.findById(req.params.userId);

        if (!currentUser) {
            console.log("User not found!");
            return res.redirect("/");
        }

        // Create new food item
        const newFood = {
            name: req.body.name,
            category: req.body.category,
            quantity: Number(req.body.quantity),
            unit: req.body.unit,
            expirationDate: req.body.expirationDate || null,
            notes: req.body.notes || "No notes provided"
        };

        // Add to pantry array and save
        currentUser.pantry.push(newFood);
        await currentUser.save();

        console.log("✅ New food added:", newFood);

        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.error("Error creating food item:", error);
        res.redirect("/");
    }
});
// EDIT 

router.get('/:userId/foods/:itemId/edit', async (req, res) => {
    try {
      // Look up the user from the session
      const currentUser = await User.findById(req.session.user._id);
  
      // Find the specific food item by its id
      const foodItem = currentUser.pantry.id(req.params.itemId);
  
      // Render the edit page with the food item details
      res.render('foods/edit.ejs', {
        foodItem: foodItem,  // Send the food item to the view
      });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });


// SHOW 




module.exports = router;
