import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';
import MainNavigation from './components/MainNavigation';
import axios from 'axios';
import AddfoodRecipe from './pages/AddfoodRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';

// Function definitions
const getAllRecipes = async () => {
  try {
    const res = await axios.get('http://localhost:5000/recipe');
    return res.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const allRecipes = await getAllRecipes();
  return allRecipes.filter(item => item.createdBy === user._id);
};

const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem('fav')) || [];
};

const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(`http://localhost:5000/recipe/${params.id}`);
    const recipe = recipeRes.data;

    const userRes = await axios.get(`http://localhost:5000/user/${recipe.createdBy}`);
    return { ...recipe, email: userRes.data.email };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainNavigation />}>
      <Route index element={<Home />} loader={getAllRecipes} />
      <Route path="/myRecipe" element={<Home />} loader={getMyRecipes} />
      <Route path="/favRecipe" element={<Home />} loader={getFavRecipes} />
      <Route path="/addRecipe" element={<AddfoodRecipe />} />
      <Route path="/editRecipe/:id" element={<EditRecipe />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} loader={getRecipe} />
    </Route>
  )
);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
