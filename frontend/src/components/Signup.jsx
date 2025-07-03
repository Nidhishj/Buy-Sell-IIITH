import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCaptcha from "react-google-recaptcha"

const Signup = () => {
    const navigate = useNavigate();

  const [db_error, setDbError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  function set_db_error(err) {
    setDbError(err);
  }
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const onSubmit = async (data) => {
    if(!recaptchaToken){
      set_db_error("Please verify that you are not a robot");
      return;
    }
    try {
      const resp = await axios.post("http://localhost:3000/signup", {
        ...data,
        recaptchaToken  
      });
      if (resp?.data?.success) {
        // console.log(resp.data.token);
        localStorage.setItem("authToken", resp.data.token);
        // navigate("/home")
        reset();
        navigate("/home");

        set_db_error("");
      }
    } catch (err) {
      console.error(err);
      set_db_error(err?.response?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Signup</h1>
        {db_error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {db_error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("first_name", { required: "First name is required" })}
              placeholder="First Name"
            />
            {errors.first_name && (
              <span className="text-red-500 text-sm">{errors.first_name.message}</span>
            )}
          

            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("last_name", { required: "Last name is required" })}
              placeholder="Last Name"
            />
            {errors.last_name && (
              <span className="text-red-500 text-sm">{errors.last_name.message}</span>
            )}

            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("Contact", {
                required: "Contact is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid contact number",
                },
              })}
              placeholder="Contact"
            />
            {errors.Contact && (
              <span className="text-red-500 text-sm">{errors.Contact.message}</span>
            )}

            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("age", { required: "Age is required" })}
              placeholder="Age"
            />
            {errors.age && (
              <span className="text-red-500 text-sm">{errors.age.message}</span>
            )}

            <input
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("email", { required: "IIIT email is required" })}
              placeholder="IIIT Email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}

            <input
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("Password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should have at least 6 characters",
                },
              })}
              placeholder="Password"
            />
            {errors.Password && (
              <span className="text-red-500 text-sm">{errors.Password.message}</span>
            )}
             <div className="flex justify-center">
            <ReCaptcha sitekey="YOUR SITE KEY"
            onChange={(token) => setRecaptchaToken(token)}  
            onExpired={()=>setRecaptchaToken(null)}
            ></ReCaptcha>
          </div>
            <div className="flex justify-center"> 
          <button
            type="submit"
            className=" bg-black text-white py-2 px-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Signup"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
