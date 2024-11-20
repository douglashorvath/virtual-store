import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHistory } from '@fortawesome/free-solid-svg-icons';

const Products = ({ products, addToCart, setView, cartCount }) => {
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (id, value, max) => {
        if (value > 0 && value <= max) {
            setQuantities(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1;

        if (quantity > product.units) {
            Swal.fire({
                icon: 'error',
                title: 'Estoque Insuficiente',
                text: `Você não pode adicionar mais do que o estoque disponível (${product.units})!`,
            });
            return;
        }

        addToCart({ ...product, units: quantity });

        Swal.fire({
            icon: 'success',
            title: 'Adicionado!',
            text: `${quantity} unidade(s) de "${product.name}" foram adicionadas ao carrinho.`,
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Produtos</h2>
                <div className="d-flex gap-3">
                    <button className="btn btn-light position-relative" onClick={() => setView('cart')}>
                        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
                        {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button className="btn btn-light" onClick={() => setView('history')}>
                        <FontAwesomeIcon icon={faHistory} size="2x" />
                    </button>
                </div>
            </div>
            <div className="row">
                {products.map(product => (
                    <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
                        <div className="card h-100">
                            <img src={product.image} className="card-img-top" alt={product.name} />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">Preço: R$ {Number(product.price).toFixed(2)}</p>
                                <p className="card-text">Estoque: {product.units}</p>
                                <div className="mb-3">
                                    <label htmlFor={`quantity-${product.id}`} className="form-label">Quantidade:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`quantity-${product.id}`}
                                        value={quantities[product.id] || 1}
                                        min={1}
                                        max={product.units}
                                        onChange={(e) =>
                                            handleQuantityChange(product.id, Number(e.target.value), product.units)
                                        }
                                    />
                                </div>
                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.units === 0}
                                >
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
