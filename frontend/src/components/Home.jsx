import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

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
          console.log("User:", person); 
          setValue("first_name", person.first_name);
          setValue("last_name", person.last_name);
          setValue("Contact", person.Contact);
          setValue("age", person.age);
          setValue("email", person.email);
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate, setValue]);

  const onSubmit = async (data) => {
    const updatedFields = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== "") {
        updatedFields[key] = data[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes to update.");
      return;
    }
    
    updatedFields.email = user.email;

    try {
      const response = await axios.put(
        "http://localhost:3000/signup/change",
        updatedFields
      );
      if (response?.data?.success) {
        console.log("Update successful:", response.data.message);
        // Update token if server returns a new one
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        // Update user locally
        setUser((prevUser) => ({ ...prevUser, ...updatedFields }));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="w-full bg-gradient-to-r from-cyan-800 to-blue-900 text-white py-16 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in">
            Welcome back
          </h1>
          <h2 className="text-4xl font-light text-center">
            {user.first_name} {user.last_name}
          </h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Your Profile Details
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {[
            { label: "First Name", field: "first_name", value: user.first_name, type: "text" },
            { label: "Last Name", field: "last_name", value: user.last_name, type: "text" },
            { label: "Contact", field: "Contact", value: user.Contact, type: "number" },
            { label: "Age", field: "age", value: user.age, type: "number" },
            { label: "Password", field: "Password", value: "********", type: "password" }
          ].map((item) => (
            <div key={item.field} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <p className="text-xl text-gray-700 font-medium">
                  {item.label}: {item.field !== "Password" && <span className="text-gray-600">{item.value}</span>}
                </p>
                <input
                  type={item.type}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Change?"
                  {...register(item.field, item.field === "Contact" 
                    ? {
                        validate: (value) =>
                          value === "" || /^[0-9]{10}$/.test(value) || "Must be a 10 digit number",
                      }
                    : item.field === "Password"
                    ? {
                        validate: (value) =>
                          value === "" || value.length >= 6 || "Password should be at least 6 characters",
                      }
                    : {}
                  )}
                />
              </div>
              {errors[item.field] && (
                <p className="mt-2 text-red-500 text-sm">{errors[item.field].message}</p>
              )}
            </div>
          ))}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mt-4">
  <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Your Ratings</h2>
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
    <p className="text-xl text-gray-700 font-medium">
      Rating: <span className="text-gray-600">{user.Review || "Not Rated"}</span>
    </p>
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((starPosition) => {
        const difference = user.Review - Math.floor(starPosition);
        const fillPercentage = difference <= 0 ? 0 : difference >= 1 ? 100 : Math.round(difference * 100);
        
        return (
          <div key={starPosition} className="relative inline-block w-8 h-8">
            <span className="absolute inset-0 text-2xl text-gray-300">★</span>
            <span 
              className="absolute inset-0 text-2xl text-yellow-500 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`
              }}
            >
              ★
            </span>
          </div>
        );
      })}
    </div>
  </div>
  <p className="text-lg text-gray-600 mt-2">
    Rated by <strong>{user.Rated_by || 0}</strong> user(s)
  </p>
</div>
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-800 to-blue-900 text-white py-3 px-12 rounded-lg font-medium
                hover:from-cyan-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
