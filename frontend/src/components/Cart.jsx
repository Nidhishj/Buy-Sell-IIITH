import React from 'react'
import {useParams,useNavigate} from "react-router-dom"
import axios from 'axios'
import { useEffect, useState } from "react"
import Navbar from './Navbar'
import Listy from './List'
const Cart = () => {

  const navigate = useNavigate()
  const [user,setUser] = useState({})
  const [items,setItems] = useState([])
  const [total,setTotal] = useState(0)  
  const [popup,setPopup] = useState(false)
  const [yes,setYes] = useState(false)
  useEffect(() => {
    const validateToken = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
  
        try {
            const response = await axios.get("http://localhost:3000/home", {
                headers: { "auth-token": token },
            });
            if (!response?.data?.success) {
              alert
                localStorage.removeItem("authToken");
                navigate("/login");
            } else {
                const person = response.data.person;
                setUser(person);
            }
        } catch (error) {
            localStorage.removeItem("authToken");
            navigate("/login");
        }
    };   validateToken()
},[navigate])

  useEffect(() => {
    const fetch = async () => {
      if(!user.email) {
        return}
      try {
        const res = await axios.get('http://localhost:3000/cart', {
          params: {
            email: user.email
          }
        })
        setItems(res.data)
        setTotal(0)
        for(let i=0;i<res.data.length;i++){
          setTotal(total=>total+res.data[i].price)
        }
      } catch (err) {
        console.log(err)
        navigate('/login')
      }
    }
    fetch()
  }
  , [user.email,navigate])


  async function handle_delete(itemId){
    if(!user.email) {
      return
    }
    try{
      console.log("WELCOMEEEEEEEEEEEEEEEEEEEEE")
      var price_to_rem = items.filter(item=>item._id===itemId)[0].price
      const res = await axios.delete('http://localhost:3000/cart/delete',{
        data:{
          email:user.email,
          item_id:itemId
        }
      })
      if(res.data.success){
        setTotal(total-price_to_rem)
        setItems(items.filter(item=>item._id!==itemId))
      }

    }
    catch(err){
      alert("COULD NOT DELETE")
    }
  }
    
  async function order(){
    if(!user.email) {
      return
    }
    setYes(true)
    try{
          const res = await axios.post('http://localhost:3000/order/add',{
            email:user.email,
            items:items
          }) 
          if(res.data.success)
          {
            alert("Order Placed Successfully")
            //now we need to make itemstobuy empty
            const res = await axios.put('http://localhost:3000/cart/empty',{
              email:user.email
            })
            setItems([])
            setTotal(0)
          }
          else{
            alert("Order Could Not Be Placed")
          }
      }catch(err){
        alert("Order Could Not Be Placed")
        console.log(err)
    }
    finally{
      setPopup(false)
      setYes(false)
    }
  } 

  return (
    <>
    <Navbar />

    <h1 className='text-center text-3xl mt-30 mb-10'>Your Cart</h1>
   {(items.length===0) ? (
    <h1 className='mt-30 text-3xl text-center' >Cart is Empty </h1>
  ) : (
    <div className='max-w-19/20 mx-auto px-4'> {/* Container for centering */}
      <div className='grid grid-cols-1 gap-10'>
        {items.map((item) => (
          <Listy
            key={item._id}
            id={item._id} 
            image={item.image}
            name={item.name}
            price={item.price}
            handle_delete={handle_delete}
          />
        ))}
      </div>
        <hr className='mt-10 bg-gray-400'></hr>
        <div className='flex flex-col items-end mt-10'>
          <h1 className='text-3xl text-right'>Total: ₹{total}</h1>
          <button className='bg-green-500 text-white px-8 py-2 text-2xl rounded-lg hover:bg-green-700 ml-4 mt-3' onClick={()=>{
            if(items.length>0)setPopup(true)
            else alert("EMPTY CART!")}}>Order</button>
        </div>
    </div>
  )  }
    {popup && (
  <div className='fixed inset-0 flex items-center justify-center backdrop-blur-md'>
    <div className='bg-white p-8 rounded-lg shadow-lg border'>
      <h1 className='text-3xl text-center'>Are You Sure ? </h1>
      <div className='flex justify-center mt-4'>
        <button 
          className='bg-green-500 text-white px-8 py-2 text-2xl rounded-lg hover:bg-green-700 ml-4 mt-3' 
          onClick={order} 
          disabled={yes}
        >
          Yes
        </button>
        <button 
          className='bg-red-500 text-white px-8 py-2 text-2xl rounded-lg hover:bg-red-700 ml-4 mt-3' 
          onClick={() => setPopup(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
    
)}

  </>
  )

}
export default Cart 