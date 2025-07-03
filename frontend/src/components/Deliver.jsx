import Navbar from './Navbar'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Card from './Card';

const Deliver = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {   console.log("TOKEN form alldla",localStorage.getItem("authToken"))
                const res = await axios.get('http://localhost:3000/deliver', {
                    headers: { "auth-token": localStorage.getItem("authToken") 
                    }
                })
                console.log("REss_RIZZ",res.data)
                setItems(res.data)
                setLoading(false)
            } catch (err) {
                console.log(err)
                navigate('/login')
            }
        }
        fetch()
    }, [navigate])


    useEffect(() => {
        console.log("Updated items of DELIVER:", items);
    }, [items])
    return (
    <>
    <Navbar />  
    <h1 className='justify-center flex p-10 text-3xl'>Your Deliveries</h1>
    {loading ? <h1 className='mt-30'>Loading...</h1> :
        (
          items.length===0 ? (
            <h1 className='mt-30 text-3xl text-center' >Nothing to be delivered right now!</h1>
          ) :
          (
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-20'>
            {items.map((item)=>(<Card key={item._id} 
      image={item.image} description={item.description} name={item.name} buyer={item.buyer_name} bought="deliver" price={item.price} order_id={item._id} review={item.review} onClick={()=>navigate('/items/'+item.item_id)}>
          Order ID : {item.order_id} 
        </Card>)
    )}
          </div>))}
    </>
  )
}

export default Deliver