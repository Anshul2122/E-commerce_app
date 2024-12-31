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
        
        await product.save();
    }
}

export const calculatepercentage = async (thisMonth, lastMonth) => {
    const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
    return percent.toFixed(0);
}

export const getInventories = async ({ categories, productsCount }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount = [];

    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.rount((categoriesCount[i]/productsCount)*100)
        })
    })

    return categoryCount;
}


export const getChartData = (length, docArr, today, property) => {
    const data = new Array(length).fill(0);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            } else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};


