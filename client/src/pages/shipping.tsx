import { ChangeEvent, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const Shipping = () => {
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    })
  const navigate = useNavigate();
  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo(prev=>({...prev, [e.target.name]:e.target.value}))
  }
  return (
    <div className="shipping">
      <button className='back-btn' onClick={()=>navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form action="">
        <h1>Shipping Address</h1>
        <input
          required
          name="address"
          type="text"
          placeholder="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          name="city"
          placeholder="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          name="state"
          placeholder="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">choose Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="ENGLAND">England</option>
        </select>
        <input
          required
          type="text"
          name="pinCode"
          placeholder="pincode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type='submit'>PLACE ORDER</button>
      </form>
    </div>
  );
}

export default Shipping