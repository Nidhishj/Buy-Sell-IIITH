import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCaptcha from "react-google-recaptcha"

const Login = () => {

  const navigate = useNavigate();

  const [db_error, setDbError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  function set_db_error(err) {
    setDbError(err);
  }

  useEffect(()=>{
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      try{
        const response = await axios.get("http://localhost:3000/home",{
          headers: { "auth-token": token },
        })
        if(response?.data?.success)
        {
          navigate('/home')
        }
        else
        {
          localStorage.removeItem("authToken");
        }
      }
      catch(err)
      {
        localStorage.removeItem("authToken"); 
      }
  }
  validateToken()
},[navigate]
)  
  const onSubmit = async (data) => {
    if(!recaptchaToken){
      set_db_error("Please verify that you are not a robot");
      return;
    }
    try {
      const resp = await axios.post("http://localhost:3000/login", {
      ...data,
    recaptchaToken});
      if (resp?.data?.success) {
        console.log(resp.data.token);
        localStorage.setItem("authToken", resp.data.token);
      
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
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {db_error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {db_error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              {...register("Password", { required: "Password is required" })}
              placeholder="Password"
            />
            {errors.Password && (
              <span className="text-red-500 text-sm">{errors.Password.message}</span>
            )}
          </div>
          <div className="flex justify-center">
            <ReCaptcha sitekey="YOUR SITE KEY"
            onChange={(token) => setRecaptchaToken(token)}  
            onExpired={()=>setRecaptchaToken(null)}
            ></ReCaptcha>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
