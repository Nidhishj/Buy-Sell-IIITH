import { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

const StarRating = (params) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canRate = !isSubmitted && params.review === 0;
  
  console.log("PARAMS", params);
  console.log("Can Rate:", canRate);
  console.log("Is Submitted:", isSubmitted);

  const handleRating = async (value) => {
      console.log("handleRating called with value:", value);
    console.log("Current canRate status:", canRate);

    console.log("LADDER",value)
    setRating(value);
    
    try {
      console.log("TRYING TO RATE");
      const response = await axios.post('http://localhost:3000/order/rate', {
        order_id: params.order_id,
        seller_email: params.seller_email,
        rating: value
      });
  
      console.log("Response from server:", response.data);
      
      if (response.data.success) {
        alert(`Thank you for rating ${value} stars!`);
        setIsSubmitted(true);
        window.location.reload(); // Reload the page
      } else {
        setRating(0);
        alert('Failed to submit rating. Please try again.');
      }
    } catch (err) {
      console.error('Rating submission error:', err);
      setRating(0);
      alert('Error submitting rating. Please try again.');
    }
  };

  const displayRating = params.review || (isSubmitted ? rating : 0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`p-1 ${canRate && 'hover:scale-110'} transition-transform`}
          onClick={() => {
            console.log(`Star ${star} clicked`);
            handleRating(star);
          }}
          onMouseEnter={() => canRate && setHover(star)}
          onMouseLeave={() => canRate && setHover(0)}
          disabled={!canRate}
        >
          <Star
            size={24}
            className={`${
              star <= (hover || displayRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } transition-colors ${canRate ? 'cursor-pointer' : 'cursor-default'}`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;