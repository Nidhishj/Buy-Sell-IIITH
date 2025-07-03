import axios from 'axios'
import { useEffect, useState } from "react"
import StarRating from './Star'
function Card(params) {

  const [yes, setYes] = useState(false)
  const [popup, setPopup] = useState(false)
  const [otp, setOtp] = useState('')
  console.log(params)

  async function generateOTP() {
    try {
      setYes(true)
      let otp_gen = Math.floor(1000 + Math.random() * 9000)
      const res = await axios.post('http://localhost:3000/order/otp', {
        order_id: params.order_id,
        otp: otp_gen
      })
      if (res.data.success) {
        setYes(false)
        setPopup(true)
        setOtp(otp_gen)
      }
      else {
        alert("Could not generate OTP")
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  async function submitOTP(otp) {
    try{
      const res = await axios.post('http://localhost:3000/deliver/otp', {
        order_id: params.order_id,
        otp: otp
      })
      if(res.data.success){
        alert("OTP verified")
        window.location.reload()
      }
      else
      {
        alert("WRONG OTP")
      }
    }
    catch(err){
      console.log(err)
    }
  }
  return (
   <div className="card w-[300px] bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow" onClick={()=>params.onClick()}>
  <figure className='card-image flex justify-center'>
    <img className='h-50 w-full object-cover rounded-xl'
      src={params.image ? params.image : 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
      alt={params.name} />
  </figure>
  <div className="card-body flex flex-col gap-1 justify-center items-center">
    <h2 className="card-title mt-3">{params.name}</h2>
    <p className='line-clamp-2'>{params.description}</p>
  </div>
  <div className="card-actions flex flex-col gap-2 text-gray-500 mt-5">
    <span className='text-xl font-bold'>Price: Rs {params.price}</span>
    <div className="flex items-center justify-between w-full">
      <span className="truncate max-w-[200px]" title={`${params.bought==='sold' ? "SOLD TO: " : ""}${params.seller}`}>
        {params.bought==='sold' ? `SOLD TO: ${params.seller}` : ""}
        {params.bought==='deliver' ? `ORDERED BY : ${params.buyer}` : ""}
      </span>
    </div>
  </div>
      {params.order_id &&
        (<div className='flex flex-col mt-2 justify-center items-center'>
          Order ID : {params.order_id}
          {params.bought === 'pending' && <button className='bg-gray-300 p-3 rounded-2xl w-1/2 hover:bg-gray-500 pointer hover:cursor-pointer mt-2' onClick={(e) => { e.stopPropagation()
generateOTP()}}  disabled={yes}>Generate OTP</button>}
          {params.bought === 'bought' && (params.review===0) && <div className="rating flex justify-center mt-2" onClick={(e) => e.stopPropagation()}>
            <StarRating review={params.review} seller_email = {params.seller_email} order_id = {params.order_id}/>
          </div>
          }
      
        </div>)}
        {params.bought === 'deliver' && (
  <div className='flex flex-col mt-2 justify-center items-center'>
    
    <label className='mt-4 text-lg'>Enter OTP:</label>
    <input 
      type='text' 
      placeholder='Enter OTP' 
      className='border-2 border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
    <button className='bg-gray-300 p-3 rounded-2xl w-1/2 hover:bg-gray-500 pointer hover:cursor-pointer mt-2' onClick={(e) => { e.stopPropagation() 
      submitOTP(otp)
    }}>Submit OTP</button>  
  </div>
)}

      {popup && (
        <div className='fixed inset-0 flex items-center justify-center backdrop-blur-md'>
          <div className='bg-white p-8 rounded-lg shadow-lg border'>
            <h1 className='text-3xl text-center'>OTP :{otp}</h1>
            <div className='flex justify-center mt-4 mr-4'>
              <button
                className='bg-black text-white px-8 py-2 text-2xl rounded-lg hover:bg-green-700 ml-4 mt-3'
                onClick={(e) => {
                  e.stopPropagation()
                   setPopup(false) }}
              >
                OK
              </button>
            </div>
          </div>
        </div>

      )}
    </div>
  )
}

export default Card