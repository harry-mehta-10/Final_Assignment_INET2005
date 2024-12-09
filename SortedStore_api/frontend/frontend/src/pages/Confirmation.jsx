import { useNavigate } from 'react-router-dom';
import './confirmation.css';

function Confirmation() {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/');  // Navigate back to the homepage
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-semibold text-green-600 mb-4">Thank you for your purchase!</h2>
        <p className="text-lg text-gray-700 mb-6">Your order has been successfully processed.</p>
        <button
          onClick={handleContinueShopping}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
