
import "../styles/_orderDetails.scss"

const OrderDetails = () => {
  const productDetails = {
    productId: "akjnaknv",
    name: "macBook",
    price: 2000,
    stock: 55,
    photo: "https://m.media-amazon.com/images/I/71jG+e7roXL._SX569_.jpg",
    discription:
      "Apple 2020 Macbook Air Apple M1 - (8 GB/256 GB SSD/Mac OS Big Sur) MGN93HN/A  (13.3 inch, Silver, 1.29 kg)",
    rating: "4.5",
    numberOfReviews: 555,
    productBy: "aspapasv",
  };

  return (
    <div className="order-details-container">
      <h1>Order Details</h1>
      <div className="container">
        <div className="img">
          <img src={productDetails.photo} alt="Product" />
          <div className="button">
            <button className="btn">Buy Now</button>
            <button className="btn">Add to cart</button>
          </div>
        </div>

        <div className="details">
          <p className="name">{productDetails.name}</p>
          <p>{productDetails.discription}</p>

          <p>
            <strong>Amount:</strong> ${productDetails.price}
          </p>
          <p>
            <strong>In Stock:</strong>{" "}
            <span
              className={productDetails.stock > 0 ? "stock" : "out-of-stock"}
            >
              {productDetails.stock} left
            </span>
          </p>
          <p className="rating">
            <strong>Rating:</strong> {productDetails.rating}
          </p>
          <p className="reviews">
            <strong>Reviews:</strong> {productDetails.numberOfReviews}
          </p>
          <p className="seller">
            <strong>Seller:</strong> {productDetails.productBy}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
