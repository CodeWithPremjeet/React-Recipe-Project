import { useEffect, useState } from 'react';
import axios from "axios"
import RecipeCard from '../Components/RecipeCard';


function Homepage() {

    const [recipes, setRecipes] = useState([]);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(true);

    async function FetchRecipes(skipCount, query) {
        setLoading(true);
        try {
            let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`;
            if (query) {
                url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`;
            }
            const { data } = await axios.get(url);
            setRecipes((prev) => skipCount === 0 ? data.recipes : [...prev, ...data.recipes])
            setTotal(data.total)
        } catch (error) {
            setErrMsg("Please Try Again Later.")
        }
        setLoading(false)
    }

    useEffect(() => {
        FetchRecipes(0)
    }, [])

    if (errMsg) {
        return (
            <main className='max-w-6xl mx-auto px-4 py-8'>
                <p className='text-accent'>{errMsg}</p>
            </main>
        )
    }

    function handleSearch(e) {
        e.preventDefault()
        const form = new FormData(e.target);
        let query = form.get("query").trim();
        setSearchQuery(query);
        FetchRecipes(0, query)

    }
    return (
        <main className="max-w-6xl mx-auto px-4 py-8">

            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
                <input
                    type="text"
                    name='query'
                    placeholder="Search recipes..."
                    className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
                />
                <button type="submit" className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
                    Search
                </button>
            </form>
            {loading &&<p className='text-center py-6 text-muted'>Loding...</p>}
            {
                !loading && recipes.length === 0 && (<p className='text-center text-muted py-6'>{`Recipes not found for "${searchQuery}"`}</p>)
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}

            </div>

            {recipes.length < total && <div className="text-center mt-8">
                <button
                    type="button"
                    onClick={() => FetchRecipes(recipes.length, searchQuery)}
                    className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
                >
                    Load More
                </button>
            </div>}

        </main>
    );
}

export default Homepage;