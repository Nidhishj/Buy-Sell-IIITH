import { useState ,useEffect} from 'react'
import axios from 'axios'
import Card from './Card'
import { useNavigate } from 'react-router-dom';


function Sold(params)
{  const navigate = useNavigate();

    const [items,setItems] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        const fetch = async()=>{
            try{
                console.log("BOUGHT KI EMAIL",params.email)
                   const res = await axios.get('http://localhost:3000/order/sold',{
                    params:{
                        email:params.email
                    }
                })
                console.log("BRUH",res.data)
                setItems(res.data)
                console.log("CHECK",items)
                setLoading(false)
            }catch(err){
                console.log(err)
                setLoading(false)
            }
        }
        fetch()
    },[])

    useEffect(() => {
      console.log("Updated items:", items);
  }, [items]) 
return(
    <>
    <h1 className='justify-center flex p-10 text-3xl'>What You Sold</h1>
      {loading ? <h1 className='mt-30'>Loading...</h1> :
        (
          items.length===0 ? (
            <h1 className='mt-30 text-3xl text-center' >Skill Issue Not Sold Anything </h1>
          ) :
          (
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-20'>
            {items.map((item)=>(<Card key={item.order_id} 
        image={item.image} description={item.description} name={item.name} seller={item.first_name+" "+item.last_name} bought="sold" price={item.price} order_id={item.order_id} onClick={()=>navigate('/items/'+item._id)}>
          Order ID : {item.order_id} 
        </Card>)
    )}
          </div>))}
    </>
)

}


export default Sold