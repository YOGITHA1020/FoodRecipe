const express = require("express");
const { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload } = require("../controller/recipe");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Get all recipes
router.get("/", getRecipes);

// Get a recipe by ID
router.get("/:id", getRecipe);

// Add a new recipe
router.post("/", upload.single('coverImage'), verifyToken, addRecipe);

// Edit an existing recipe
router.put("/:id", upload.single('coverImage'), verifyToken, editRecipe);

// Delete a recipe
router.delete("/:id", verifyToken, deleteRecipe);

module.exports = router;
