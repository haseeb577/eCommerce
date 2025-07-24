import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [variantSelections, setVariantSelections] = useState({});
  const dispatch = useDispatch();

  const addProduct = (product) => {
    const selectedVariant = variantSelections[product.id] || "Medium";
    const productWithVariant = { ...product, selectedVariant };
    dispatch(addCart(productWithVariant));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      const result = await response.json();

      const withStock = result.map((p) => ({
        ...p,
        stock: Math.floor(Math.random() * 5),
      }));

      setData(withStock);
      setFilter(withStock);
      setLoading(false);
    };
    getProducts();
  }, []);

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const handleVariantChange = (productId, value) => {
    setVariantSelections((prev) => ({ ...prev, [productId]: value }));
  };

  const Loading = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="col-md-4 col-sm-6 mb-4">
          <Skeleton height={600} />
        </div>
      ))}
    </>
  );

  const ShowProducts = () => (
    <>
      <div className="buttons text-center py-4">
        {["All", "men's clothing", "women's clothing", "jewelery", "electronics"].map((cat, i) => (
          <button
            key={i}
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => cat === "All" ? setFilter(data) : filterProduct(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filter.map((product) => {
        const isOutOfStock = product.stock === 0;

        return (
          <div key={product.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card h-100 shadow rounded-4 border-0">
              <img
                src={product.image}
                alt={product.title}
                className="card-img-top p-4"
                height={300}
                style={{ objectFit: "contain" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-semibold">{product.title.substring(0, 40)}...</h5>
                <p className="card-text text-muted small">{product.description.substring(0, 70)}...</p>

                <label htmlFor={`variant-${product.id}`} className="form-label mt-3 mb-1 fw-semibold">
                  Variant
                </label>
                <select
                  id={`variant-${product.id}`}
                  className="form-select form-select-sm mb-3"
                  value={variantSelections[product.id] || "Medium"}
                  onChange={(e) => handleVariantChange(product.id, e.target.value)}
                  disabled={isOutOfStock}
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold fs-5">${product.price}</span>
                  <span className={`badge px-3 py-2 ${isOutOfStock ? "bg-danger" : "bg-success"}`}>
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </span>
                </div>

                <div className="mt-auto d-flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className={`btn btn-outline-dark w-50 ${isOutOfStock ? "disabled" : ""}`}
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark w-50"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                    disabled={isOutOfStock}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="container my-4 py-3">
      <div className="row">
        <div className="col-12 text-center mb-3">
          <h2 className="display-5 fw-bold">🛍️ Latest Products</h2>
          <hr className="w-25 mx-auto" />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );

  
};


export default Products;
