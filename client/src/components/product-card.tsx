import { FaPlus } from "react-icons/fa";


type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
}

const ProductCard = ({ productId, photo, name, price, stock, handler }: ProductsProps) => {
  console.log(productId);
  
  return (
    <div className="product_card">
      <img src={`${photo}`} alt={name} />
      <p>{name}</p>
      <span> ₹ {price}</span>
      {stock>0? <span>stock : {stock}</span> : <span className="out_of_stock_span">out of stock</span>}
      <div>
        <button onClick={()=>handler()}><FaPlus/></button>
      </div>
    </div>
  )
}

export default ProductCard