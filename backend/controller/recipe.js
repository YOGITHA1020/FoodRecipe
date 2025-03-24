const path = require("path");
const Recipes = require("../models/recipe");
const multer = require("multer");

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images")); // ✅ Make sure this folder exists!
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
// File Upload Middleware (with validation)
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images (JPG, PNG) are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }  // 2MB file size limit
});

// Fetch All Recipes
const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find();
        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Error fetching recipes" });
    }
};

// Fetch Single Recipe
const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipe" });
    }
};

const addRecipe = async (req, res) => {
    try {
        console.log("Received request:", req.body);
        console.log("Uploaded file:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const { title, time, ingredients, instructions } = req.body;
        
        if (!title || !time || !ingredients || !instructions) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRecipe = new Recipes({
            title,
            time,
            ingredients: JSON.parse(ingredients),
            instructions,
            coverImage: req.file.filename  // Store the image filename
        });

        await newRecipe.save();
        res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });

    } catch (error) {
        console.error("Error adding recipe:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// Edit Recipe (with Authorization)
//const editRecipe = async (req, res) => { /* Updated Code Above */ };
const editRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, time } = req.body;
        let recipe = await Recipes.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Ensure only the creator can edit
        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Update cover image only if a new file is uploaded
        const coverImage = req.file ? req.file.filename : recipe.coverImage;

        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            { title, ingredients, instructions, time, coverImage },
            { new: true }
        );

        return res.json(updatedRecipe);
    } catch (error) {
        console.error("Error editing recipe:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Recipe (with Authorization)
 const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Ensure only the creator can delete
        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await Recipes.deleteOne({ _id: req.params.id });
        return res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Export All Functions
module.exports = {
    getRecipes,
    getRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe,
    upload
};
