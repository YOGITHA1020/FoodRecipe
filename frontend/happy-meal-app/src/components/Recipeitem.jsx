import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import foodImg from '../assets/foodRecipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
    const [allRecipes, setAllRecipes] = useState([]);
    const [isFavRecipe, setIsFavRecipe] = useState(false);
    const navigate = useNavigate();

    let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
    let path = window.location.pathname === "/myRecipe";

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/recipe");
                let recipes = response.data;
    
                // ✅ If on Favourites page, filter recipes to show only existing favs
                if (window.location.pathname === "/favRecipe") {
                    let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
    
                    let validFavs = favItems.filter(fav => 
                        recipes.some(recipe => recipe._id === fav._id)
                    );
    
                    
                    localStorage.setItem("fav", JSON.stringify(validFavs));
    
                    
                    recipes = validFavs;
                }
    
                setAllRecipes(recipes);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };
    
        fetchRecipes();
    }, [window.location.pathname]); 
    
    const onDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/recipe/${id}`);
            
            
            setAllRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
    
           
            let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
            const updatedFavs = favItems.filter(recipe => recipe._id !== id);
            localStorage.setItem("fav", JSON.stringify(updatedFavs));
    
            
            if (window.location.pathname === "/favRecipe") {
                setAllRecipes(updatedFavs);
            }
            
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe. Please try again.");
        }
    };
    

    
    const favRecipe = (item) => {
        let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
        let isFavorited = favItems.some(recipe => recipe._id === item._id);
    
        let updatedFavs = isFavorited
            ? favItems.filter(recipe => recipe._id !== item._id)  // ❌ Remove from favorites
            : [...favItems, item];  
    
        localStorage.setItem("fav", JSON.stringify(updatedFavs));
        setIsFavRecipe(prev => !prev);  
        if (window.location.pathname === "/favRecipe") {
            setAllRecipes(updatedFavs);  
        }
    };
    
    return (
        <div className='card-container'>
            {allRecipes.length > 0 ? allRecipes.map((item, index) => (
                <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
                    <img src={item.coverImage ? `http://localhost:5000/images/${item.coverImage}` : foodImg} 
                         width="120px" height="100px" alt={item.title || "Recipe"} />
                    <div className='card-body'>
                        <div className='title'>{item.title}</div>
                        <div className='icons'>
                            <div className='timer'><BsStopwatchFill /> {item.time}</div>
                            {(!path) ? (
                                <FaHeart 
                                    onClick={() => favRecipe(item)} 
                                    style={{ color: favItems.some(res => res._id === item._id) ? "red" : "" }} 
                                />
                            ) : (
                                <div className='action'>
                                    <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                                    <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )) : <p>No recipes found.</p>}
        </div>
    );
}
