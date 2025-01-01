import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItems from './../components/cart_items';
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "akjnaknv",
    name: "macBook",
    price: 2000,
    photo:"https://m.media-amazon.com/images/I/71jG+e7roXL._SX569_.jpg",
    quantity: 0
  }
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
let shippingCharges = 50;
if (subtotal + tax >= 500) { 
  shippingCharges = 0;
}
const discount = 40;
const total = subtotal + tax + shippingCharges - discount;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setisValidCouponCode] = useState<boolean>(false);

  useEffect(() => { 
    const timeOutID = setTimeout(() => {
      if (Math.random() > 0.5) setisValidCouponCode(true)
      else setisValidCouponCode(false);
     }, 1000);
    return () => {
      clearTimeout(timeOutID);
      setisValidCouponCode(false);
    }
  }, [couponCode]);

  

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? cartItems.map((i, index) => (
            <CartItems key={index} cartItem={i} />
          ))  : <h1>Cart is Empty</h1>
        }
      </main>
      <aside>
        <p>Subtotal : ₹ {subtotal}</p>
        <p>Tax : ₹ {tax}</p>
        <p>Shipping cost : ₹ {shippingCharges}</p>
        <p>
          discount : <em>- ₹ {discount}</em>
        </p>
        <p> ₹ {total}</p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              {" "}
              Invalid coupon code <VscError />{" "}
            </span>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link> }
      </aside>
    </div>
  );
}

export default Cart