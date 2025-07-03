 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import AddSell from './AddSell'
import OnSell from './OnSell'

// const Sell = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({});
//   const [selectedComponent, setSelectedComponent] = useState("addSale");
  
//   useEffect(() => {
//     const validateToken = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:3000/home", {
//           headers: { "auth-token": token },
//         });
//         if (!response?.data?.success) {
//           localStorage.removeItem("authToken");
//           navigate("/login");
//         } else {
//           const person = response.data.person;
//           setUser(person);
//         }
//       } catch (error) {
//         localStorage.removeItem("authToken");
//         navigate("/login");
//       }
//     };

//     validateToken();
//   }, [navigate])

//   const renderComponent = () => {
//     switch (selectedComponent) {
//       case "prevSale":
//         return <Prevsold email={user.email}/>;
//       case "currently": 
//         return <OnSell email={user.email}/>;
//       case "addSale":
//         return <AddSell email={user.email}/>;
//       default:
//         return <AddSell  email={user.email}/>;
//     }
//   };
  


//   return (
//     <div>
//       <Navbar />
//       <div className="flex flex-row min-h-screen bg-gray-50">
//         <div className="w-1/6px  flex flex-col p-8 bg-white shadow justify-center">
//           <div className="flex flex-col items-center gap-20 text-2xl">
//             <button
//               onClick={() => setSelectedComponent("prevSale")}
//               className={`p-3 w-90 cursor-pointer shadow-xl ${
//                 selectedComponent === "prevSale" ? "bg-gray-900 text-white" : ""}`}
//             >
//               Previously Sold 
//             </button>
//             <button
//               onClick={() => setSelectedComponent("currently")}
//               className={`p-3 w-90 cursor-pointer shadow-xl ${selectedComponent === "currently" ? "bg-gray-900 text-white" : ""}`}
//             >
//               Currently Selling
//             </button>
//             <button
//               onClick={() => setSelectedComponent("addSale")}
//               className={`p-3 w-90 cursor-pointer shadow-xl ${selectedComponent === "addSale" ? "bg-gray-900 text-white" : ""}`}

//             >
//               Add new to Sell
//             </button>
//           </div>
//         </div>

//         <div className="w-5/6 flexflex-col p-8 text-center bg-gray-50">
//           {renderComponent()}
//           </div>
        
//       </div>

//     </div>
//   )
// }

// export default Sell

const Sell = () => {
  const [user, setUser] = useState({});
  const [selectedComponent, setSelectedComponent] = useState("addSale");
  const navigate = useNavigate();
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
          });//actually u know u can send to home it will just come up with verification 
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
        } //the main work here is to set the props 
      };

      validateToken();
    }, [navigate]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "prevSale":
        return <Prevsold email={user.email} />;
      case "currently":
        return <OnSell email={user.email} />;
      case "addSale":
        return <AddSell email={user.email} />;
      default:
        return <AddSell email={user.email} />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row min-h-screen bg-gray-50">
        <div className="w-1/5 flex flex-col p-4 items-center justify-center sticky  top-0 h-screen bg-white shadow-md">
          <div className="flex flex-col  items-center gap-6 text-lg">
            
            <button
              onClick={() => setSelectedComponent("currently")}
              className={`p-3 w-full text-center rounded-md shadow ${
                selectedComponent === "currently"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200"
              }`}
            >
              Currently Selling
            </button>
            <button
              onClick={() => setSelectedComponent("addSale")}
              className={`p-3 w-full text-center rounded-md shadow ${
                selectedComponent === "addSale"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200"
              }`}
            >
              Add new to Sell
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-4/5 flex flex-col p-6 bg-gray-50">
          {renderComponent()}
        </div>
      </div>
    </>
  );
};

export default Sell;
