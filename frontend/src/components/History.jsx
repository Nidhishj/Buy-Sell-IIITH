import Navbar from './Navbar'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import Sold from './Sold'
import Bought from './Bought'
import Pending from './Pending'

const History = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Changed initial state to null
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [activeTab, setActiveTab] = useState("Pending");
  const tabs = ["Pending", "Bought", "Sold"];

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true); // Set loading to true before API call
        const response = await axios.get("http://localhost:3000/home", {
          headers: { "auth-token": token },
        });
        if (!response?.data?.success) {
          alert("You are not authorized to view this page.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          const person = response.data.person;
          setUser(person);
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    validateToken();
  }, [navigate]);

  // Show loading state while user data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900">RUKK</div>
        </div>
      </div>
    );
  }

  // Only render content if we have user data
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="w-full flex justify-center mt-10">
          <div className="w-120 relative">
            <div className="relative flex justify-around bg-gray-200 p-2 rounded-full">
              <div
                className="absolute top-0 left-0 w-1/3 h-full bg-white rounded-full transition-all duration-300 shadow-md"
                style={{ transform: `translateX(${tabs.indexOf(activeTab) * 100}%)` }}
              ></div>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className="relative z-10 flex-1 py-2 text-center text-lg font-medium transition-all duration-300"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full px-4 mt-10">
          {activeTab === "Sold" && <Sold email={user.email} />}
          {activeTab === "Pending" && <Pending email={user.email} />}
          {activeTab === "Bought" && <Bought email={user.email} />}
        </div>
      </div>
    </div>
  );
};

export default History;