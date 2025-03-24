import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddfoodRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const navigate = useNavigate()

    const onHandleChange = (e) => {
        let val = e.target.value;
        if (e.target.name === "ingredients") {
            val = e.target.value.split(",");
        } else if (e.target.name === "file") {
            val = e.target.files[0];
        }
        setRecipeData(prev => ({ ...prev, [e.target.name]: val }));
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        console.log("Recipe Data:", recipeData);

        const formData = new FormData();
        formData.append("title", recipeData.title || "");
        formData.append("time", recipeData.time || "");
        formData.append("ingredients", JSON.stringify(recipeData.ingredients || []));
        formData.append("instructions", recipeData.instructions || "");
        
        if (recipeData.file) {
            formData.append("coverImage", recipeData.file);
        }

        // Log formData contents correctly
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        try {
            const response = await axios.post("http://localhost:5000/recipe", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            });
            console.log("Recipe added successfully:", response.data);
            navigate("/");
        } catch (err) {
            console.error("Error adding recipe:", err.response?.data || err.message);
            alert("Failed to add recipe. Check the console for more details.");
        }
    }

    return (
        <>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange} required></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange} required></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients (comma separated)</label>
                        <textarea className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} required></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} required></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image (Optional)</label>
                        <input type="file" className='input' name="file" accept="image/*" onChange={onHandleChange}></input>
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </>
    )
}
