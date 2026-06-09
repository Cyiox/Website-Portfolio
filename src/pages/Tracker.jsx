import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Tracker = () => {
    const [meals, setMeals] = useState([]);
    const [food, setFood] = useState('');
    const [calories, setCalories] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        setLoading(true);
        const today = new Date().toLocaleDateString();
        const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('date', today)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching meals:', error);
        } else {
            setMeals(data || []);
        }
        setLoading(false);
    };

    const addMeal = async (e) => {
        e.preventDefault();
        if (!food || !calories) return;
        
        const today = new Date().toLocaleDateString();
        const newMeal = { 
            food, 
            calories: parseInt(calories), 
            date: today 
        };

        const { data, error } = await supabase
            .from('meals')
            .insert([newMeal])
            .select();

        if (error) {
            console.error('Error adding meal:', error);
            alert('Failed to add meal');
        } else if (data) {
            setMeals([...meals, data[0]]);
            setFood('');
            setCalories('');
        }
    };

    const deleteMeal = async (id) => {
        const { error } = await supabase
            .from('meals')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting meal:', error);
        } else {
            setMeals(meals.filter(meal => meal.id !== id));
        }
    };

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '600px', margin: '0 auto', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Calorie Tracker</h1>
            
            <form onSubmit={addMeal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', background: '#222', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Food Item</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Chicken Salad" 
                        value={food} 
                        onChange={(e) => setFood(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#111', color: 'white' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Calories</label>
                    <input 
                        type="number" 
                        placeholder="e.g. 450" 
                        value={calories} 
                        onChange={(e) => setCalories(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#111', color: 'white' }}
                    />
                </div>
                <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                    Add Meal
                </button>
            </form>

            <div className="meal-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Today's Meals</h3>
                    <span style={{ fontSize: '0.9rem', color: '#aaa' }}>{new Date().toLocaleDateString()}</span>
                </div>

                {loading ? <p>Loading...</p> : meals.length === 0 ? <p style={{ color: '#888' }}>No meals logged yet today.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {meals.map(meal => (
                            <li key={meal.id} style={{ background: '#333', padding: '1rem', marginBottom: '0.75rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{meal.food}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{meal.calories} kcal</div>
                                </div>
                                <button 
                                    onClick={() => deleteMeal(meal.id)}
                                    style={{ background: 'transparent', color: '#ff4444', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                    title="Delete"
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {!loading && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', borderTop: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', borderRadius: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>Total Calories:</span>
                    <strong style={{ fontSize: '1.5rem', color: '#4CAF50' }}>{meals.reduce((acc, m) => acc + m.calories, 0)} kcal</strong>
                </div>
            )}
        </div>
    );
};

export default Tracker;
