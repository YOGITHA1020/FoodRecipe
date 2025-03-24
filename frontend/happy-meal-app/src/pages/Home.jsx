import React, { useState } from 'react'
import foodRecipe from '../assets/foodRecipe.png'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RecipeItems from '../components/Recipeitem'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import Inputform from '../components/Inputform'  // Ensure case matches file name

export default function Home() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const addRecipe = () => {
        let token = localStorage.getItem("token")
        if (token) {
            navigate("/addRecipe")
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <section className='home'>
                <div className='left'>
                    <h1>Happy-Meal</h1>
                    <h5>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</h5>
                    <button onClick={addRecipe}>Share your recipe</button>
                </div>
                <div className='right'>
                    <img src="https://images-platform.99static.com//6VjMCbp7IYLsJEGzucFaIcRd3Vk=/500x1341:1000x1841/fit-in/590x590/99designs-contests-attachments/95/95653/attachment_95653835" width="320px" height="300px" alt="Food Recipe" />
                </div>
            </section>
            <div className='bg'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#cfa8e9" fill-opacity="1" d="M0,96L48,117.3C96,139,192,181,288,208C384,235,480,245,576,208C672,171,768,85,864,90.7C960,96,1056,192,1152,234.7C1248,277,1344,267,1392,261.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            </div>
            {(isOpen) && (
                <Modal onClose={() => setIsOpen(false)}>
                    <Inputform setIsOpen={setIsOpen} />
                </Modal>
            )}
            <div className='recipe'>
                <RecipeItems />
            </div>
        </>
    )
}
