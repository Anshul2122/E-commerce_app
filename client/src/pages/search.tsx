import React, { useState } from 'react'
import ProductCard from '../components/product-card';

const Search = () => {

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(100000);
  const addToCartHandler = () => {
    // Add to cart logic here
    console.log('Adding to cart');
  }

  const isPrevPage = page > 1;
  const isNextPage = page < 4;


  return (
    <div className="product-search-page">
      <aside>
        <h2>filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price:{maxPrice || ""}</h4>
          <input
            type="range"
            min={0}
            max={100000}
            value={maxPrice}
            step={2000}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="camera">Camera</option>
            <option value="laptop">Laptop</option>
            <option value="tv">TV</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search or ask a question"
        />
        <div className="search-product-list">
          <ProductCard
            productId="aksals"
            name="MacBook"
            price={8383}
            stock={73}
            handler={addToCartHandler}
            photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SX569_.jpg"
          />
        </div>
        <article>
          <button onClick={() => setPage(page - 1)} disabled={!isPrevPage}>
            Prev
          </button>
          <span>{page} of 4</span>
          <button onClick={() => setPage(page + 1)} disabled={!isNextPage}>
            Next
          </button>
        </article>
      </main>
    </div>
  );
}
export default Search