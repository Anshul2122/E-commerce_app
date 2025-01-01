
// import { FaHeadset } from 'react-icons/fa';
// import { LuShieldCheck } from 'react-icons/lu';
// import { TbTruckDelivery } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product-card';

// const clients = [
//   {
//     src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
//     alt: "react",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
//     alt: "node",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
//     alt: "mongodb",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
//     alt: "express",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/js_redux/js_redux-ar21.svg",
//     alt: "redux",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg",
//     alt: "typescript",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-ar21.svg",
//     alt: "sass",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
//     alt: "firebase",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg",
//     alt: "figma",
//   },

//   {
//     src: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
//     alt: "github",
//   },

//   {
//     src: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
//     alt: "Docker",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
//     alt: "Kubernetes",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/nestjs/nestjs-ar21.svg",
//     alt: "Nest.js",
//   },

//   {
//     src: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg",
//     alt: "GraphQL",
//   },

//   {
//     src: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg",
//     alt: "Jest",
//   },

//   {
//     src: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
//     alt: "Redis",
//   },

//   {
//     src: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
//     alt: "PostgreSQL",
//   },
//   {
//     src: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
//     alt: "Jenkins",
//   },
// ];

// const banners = [
//   "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
//   "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png",
// ];
// const categories = [
//   "Electronics",
//   "Mobiles",
//   "Laptops",
//   "Books",
//   "Fashion",
//   "Appliances",
//   "Furniture",
//   "Home Decor",
//   "Grocery",
//   "Beauty",
//   "Toys",
//   "Fitness",
// ];

// const services = [
//   {
//     icon: <TbTruckDelivery />,
//     title: "FREE AND FAST DELIVERY",
//     description: "Free delivery for all orders over $200",
//   },
//   {
//     icon: <LuShieldCheck />,
//     title: "SECURE PAYMENT",
//     description: "100% secure payment",
//   },
//   {
//     icon: <FaHeadset />,
//     title: "24/7 SUPPORT",
//     description: "Get support 24/7",
//   },
// ];
const Home = () => {
  const addToCartHandler = () => {
    console.log('Add to cart clicked');
   }
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Product
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCard
          productId="aksjbf"
          name="MackBook"
          price={373}
          stock={0}
          handler={addToCartHandler}
          photo={"https://m.media-amazon.com/images/I/71jG+e7roXL._SX569_.jpg"}
        />
      </main>
    </div>
  );
}

export default Home