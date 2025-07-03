import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import axios from 'axios';

const Buy = () => {
  const [categories, setCategories] = useState([
    { key: 'electronics', label: 'Electronics', selected: false },
    { key: 'clothing', label: 'Clothing', selected: false },
    { key: 'food', label: 'Food', selected: false },
    { key: 'stationary', label: 'Stationary', selected: false },
    { key: 'other', label: 'Other', selected: false }
  ]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [search,setSearch] = useState('');
  const toggle = (key) => {
    setCategories(categories.map(category =>
      category.key === key ? { ...category, selected: !category.selected } : category
    ));
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:3000/buy', {
          headers: { "auth-token": localStorage.getItem("authToken") }
        });
        console.log(res.data);
        setItems(res.data);
      } catch (err) {
        console.log(err);
        navigate('/login');
      }
    };
    fetch();
  }, [navigate]);

  // Get only the category keys of selected categories
  const selectedCategories = categories
    .filter(category => category.selected)
    .map(category => category.key);

  // Filter items based on selected categories and sold status
  const filtered_items = selectedCategories.length === 0 
    ? items.filter(item => !item.sold)
    : items.filter(item => !item.sold && selectedCategories.includes(item.category));
  const final_filtered_items = search === '' ? filtered_items : filtered_items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <Navbar />
      <div className="flex flex-row min-h-screen bg-gray-50">
        <div className="w-1/5 flex flex-col items-center justify-center sticky top-0 h-screen bg-white shadow-md gap-5 text-lg overflow-auto">
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold '>Categories</h1>
          <div className='flex flex-col gap-4'>
            {categories.map((category) => (
              <div key={category.key} className='flex items-center gap-2 '>
                <input 
                  type="checkbox" 
                  id={category.key} 
                  checked={category.selected} 
                  onChange={() => toggle(category.key)}
                />
                <label htmlFor={category.key} className='flex items-center gap-2 w-full text-sm'>{category.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="w-4/5 flex flex-col  bg-gray-50 items-center mt-9 ">
          <input
            type="text"
            placeholder="Search"
            className="input border border-black py-3 text-2xl rounded-4xl input-primary w-4/5 text-center justify-center"
            value={search}
            onChange= {(e)=>setSearch(e.target.value)}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10 ml-5 cursor-pointer'>
            {final_filtered_items.map((item) => (
              <Card 
                key={item._id}
                image={item.image}
                description={item.description}
                name={item.name}
                seller={item.first_name + " " + item.last_name}
                price={item.price}
                onClick = {()=>navigate('/items/'+item._id)}
                contact = {item.contact}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy;