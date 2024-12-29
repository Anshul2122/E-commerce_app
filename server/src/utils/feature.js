import Product from "../models/product.model.js";

export const findAverageRatings = async(productId)=>{
    let totalRating = 0;

}


export const invalidateCache = async({product, order, admin, review, userId, orderId, productId
})=>{
    if(review){
        
    }
}


export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) { 
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) { throw new Error("Product not found") }
        product.stock -= order.quantity;
    }
}