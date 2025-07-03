import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Card from './Card'
import { useNavigate } from 'react-router-dom'

function OnSell(props) {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate(); 

  useEffect(() => {

    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:3000/sell', {
          headers: { "auth-token": localStorage.getItem("authToken") },
          params: {
            email: props.email
          }
        },)
        console.log(res.data)
        setItems(res.data)
        setLoading(false)
        // console.log(items)
      } catch (err) {
        console.log(err)
        navigate('/login')
        setLoading(false)
      }
    }
    fetch()
  },
    [])



  return (
    <>
      <h1 className='justify-center flex p-10 text-3xl'>Your Listings</h1>
      {loading ? <h1 className='mt-30'>Loading...</h1> :
        (
          items.length===0 ? (
            <h1 className='mt-30 text-3xl text-center' >Skill Issue Not Selling Anything </h1>
          ) :
          (
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
          {items.filter(item => item.sold === false).map((item) => (<Card key={item._id}
            image={item.image} description={item.description} name={item.name} seller={item.first_name + " " + item.last_name} price={item.price} ></Card>)
          )}</div>))}
    </>
  )
}

export default OnSell