import axios from 'axios'
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

function AddSell (props){
  const [img, setImg] = useState('https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate(); 
  const imgchnage=(e)=>
  {
    if(e?.target?.value)
    setImg(e.target.value)
    else
    setImg("https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
  }
  let user={}
  const onSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("LOGIN PLS")
      navigate("/login");
      return;
    }
    try{
      console.log(props.email)
      const response = await axios.post("http://localhost:3000/sell/add", {
        ...data,
        seller_email:props.email
      });
      if (response?.data?.success) {
        alert("Item added successfully");
        reset();
      }
      else 
      {
        alert("nope")
      }
    }catch(err){
      console.error(err);
      navigate('/login')
    }
  }

  

  return (
    <>
      <h1 className='flex text-2xl justify-center mt-9   mb-10'>Add New Item to Sell 🤑</h1>
      <div className='flex flex-col gap-4 justify-center items-center p-12 bg-blue-50 shadow'>
        <img
          src={img}
          className='h-1/3 w-1/3 object-cover mx-auto rounded-2xl'></img>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 '>
        <input type="text" className="border rounded-xl w-100 px-10 py-2.5" placeholder="Name of The Item" 
        {...register("name")}/>
          <input type="textarea" className="border rounded-xl w-100 px-10 py-2.5" placeholder="Description" 
          {...register("description")}/>
          <input type="number" className="border rounded-xl w-100 px-10 py-2.5" placeholder="Price in (INR)" 
          {...register("price")}/>
       <select 
  className="border rounded-xl w-full px-10 py-2.5" 
  {...register("category")}
>
  <option value="" disabled selected>Category</option>
  <option value="stationary">Stationary</option>
  <option value="electronics">Electronics</option>
  <option value="food">Food</option>
  <option value="others">Others</option>
</select>

          <input type="text" className="border rounded-xl w-100 px-10 py-2.5" placeholder="Image Link" 
          {...register("image")} onChange={imgchnage}/>
          <button
            type="submit"
            className="bg-black text-amber-50 p-3 w-100 rounded-xl"
            disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </>
  ) 
}

export default AddSell