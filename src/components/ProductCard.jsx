import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductCard = ({ product, onAddToCart }) => {
  const inStock = product?.rating?.count > 0;

  return (
    <div className="card h-100 shadow rounded-4 border-0 overflow-hidden transition-transform hover:scale-105" style={{ maxWidth: "300px" }}>
      <div className="position-relative overflow-hidden">
        <img
          src={product.image}
          className="card-img-top p-3 object-fit-contain"
          alt={product.title}
          style={{ height: "250px", objectFit: "contain" }}
        />
        {!inStock && (
          <span className="position-absolute top-0 start-0 badge bg-danger m-2">
            Out of Stock
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column justify-content-between">
        <h6 className="card-title fw-bold text-dark">
          {product.title?.length > 45
            ? product.title.substring(0, 45) + "..."
            : product.title}
        </h6>

        <p className="text-primary fw-semibold mb-1 fs-5">
          ${product.price?.toFixed(2)}
        </p>

        {product?.variants?.length > 1 ? (
          <select className="form-select form-select-sm mb-3">
            {product.variants.map((variant, index) => (
              <option key={index}>{variant}</option>
            ))}
          </select>
        ) : product?.variants?.length === 1 ? (
          <div className="text-muted small mb-3">
            Variant: {product.variants[0]}
          </div>
        ) : null}

        <button
          className={`btn btn-sm fw-bold mt-auto ${inStock ? "btn-dark" : "btn-secondary"}`}
          onClick={() => onAddToCart(product)}
          disabled={!inStock}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
