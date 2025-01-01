import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type CartItemsProps = {
    cartItem: {
        productId: string,
        name: string,
        photo: string,
        price: number,
        quantity: number,
    },
}

const CartItems = ({ cartItem }: CartItemsProps) => {
    const [quantity, setQuantity] = useState<number>(0);
    const handleQuantityADD = () => { 
        setQuantity(quantity + 1);
    }
    const handleQuantitySUB = () => {
        if (quantity > 0) setQuantity(quantity - 1);
     }
    
  return (
    <div className="cart-item">
      <img src={cartItem.photo} alt={cartItem.name} />
      <article>
        <Link to={`/product/${cartItem.productId}`}></Link>
      </article>
      {/* <p>item : {cartItem.name}</p>
        <span> amount: ₹ {cartItem.price}</span>
      */}
      <div>
        <button onClick={handleQuantitySUB}>-</button>
        <p>{cartItem.quantity + quantity}</p>
        <button onClick={handleQuantityADD}>+</button>
      </div>
      <button>
        <FaTrash />
      </button>
    </div>
  );
}

export default CartItems