import  mongoose  from 'mongoose';


const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "please enter product name"],
        trim:true,
        
    },
    photos:[
        {
            type:String,
            required:[true, "please enter product photos"],
        }
    ],
    price:{
        type:Number,
        required:[true, "please enter product price"],
    },
    stock:{
        type:Number,
        required:[true, "please enter product stock"],
    },
    category:{
        type:String,
        required:[true, "please enter product category"],
        trim:true,
        lowercase:true,
    },
    rating:{
        type:Number,
        default:0,
    },
    description:{
        type: String,
        required:[true, "please enter product description"]
    },
    numOfReviews:{
        type:Number,
        default:0,
    }, 
    productBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
    
}, 
    {timestamps: true}
);


const Product = mongoose.model("Product", ProductSchema);

export default Product;