import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import Navbar from './Navbar'
import { useEffect, useState } from "react"

const Items = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [user,setUser] = useState({})
    const [item,setItem] = useState({})
    const [present,setPresent] = useState(false)
    const [loading,setLoading] = useState(false)
    const [sold,setSold] = useState(false)
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
        };
        validateToken()
    },[navigate])


    const get_item = async () => {
      if(!user.email) 
      {
       
        return
      }
      setLoading(true)
      try{
      const res = await axios.get('http://localhost:3000/item', {
          params: {
              id: id,
              email: user.email
          }
      })
      console.log("RESPONSEeeeee", res.data)
      setItem(res.data.item)  
      console.log(res.data.item.present)        // Set item data
      setPresent(res.data.item.present)   
      setSold(res.data.item.sold)
     }
     catch(err){
      console.log(err)
      alert("An error occurred wait kr")
     } // Set present status
     finally{
      setLoading(false) 
     }
  }


    useEffect(() => {
       
        get_item()
    },[id,user.email])



    async function add_to_cart()
    {
        try{
            const res = await axios.post('http://localhost:3000/cart/add', {
                item_id: item._id,
                email: user.email
            })
            console.log("ADDEDD?????",res.data)
            if(res.data.success)
            {
              setPresent(true)
              await get_item()              
            }
        }
        catch(err)
        {
            console.log(err)
            alert("An error occurred")
        }

    }



    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar/>
            
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-40">
                    <div className="md:flex">
                    <div className="md:w-1/2 p-6 flex justify-center">
    <div className="max-w-xs w-auto h-auto rounded-lg overflow-hidde">
        {item.image ? (
            <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-contain"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Image Available
            </div>
        )}
    </div>
</div>

                        <div className="md:w-1/2 p-6 md:p-8">
                            <div className="space-y-4">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {item.name}
                                </h1>

                                <div className="flex items-center space-x-2 text-gray-600">
                                    <span className="font-medium">Category:</span>
                                    <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-800">
                                        {item.category}
                                    </span>
                                </div>

                                <div className="text-gray-600">
                                    <span className="font-medium">Seller: </span>
                                    <p>{item.seller_name}</p>
                                </div>
                                
                                <div className="text-gray-600">
                                    <span className="font-medium">Contact </span>
                                    <p>{item.Contact}</p>
                                </div>

                                <div className="text-3xl font-bold text-blue-600">
                                    ₹{item.price}
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>

  

                                <button
  onClick={add_to_cart}
  className={`w-full mt-6 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200
    ${sold ? 'bg-red-500 cursor-not-allowed' : present ? 'bg-green-600 cursor-not-allowed' : loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
  `}
  disabled={present || sold}
>
  {sold ? "SOLD" : loading ? "Loading..." : present ? "Added to Cart" : "Add to Cart"}
</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Items