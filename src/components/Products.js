import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Products = ({ products, addToCart, setView, cartCount }) => {
    const [quantities, setQuantities] = useState({}); // Armazena as quantidades selecionadas para cada produto

    // Atualiza a quantidade selecionada de um produto
    const handleQuantityChange = (id, value, max) => {
        if (value > 0 && value <= max) {
            setQuantities(prev => ({ ...prev, [id]: value }));
        }
    };

    // Lida com a adição de um produto ao carrinho
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

        Swal.fire({
            title: 'Adicionar ao Carrinho?',
            html: `
                <strong>Produto:</strong> ${product.name}<br/>
                <strong>Quantidade:</strong> ${quantity}<br/>
                <strong>Total:</strong> R$ ${(quantity * product.price).toFixed(2)}
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Adicionar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                addToCart(product, quantity);

                Swal.fire({
                    icon: 'success',
                    title: 'Adicionado!',
                    text: `${quantity} unidade(s) de "${product.name}" foram adicionadas ao carrinho.`,
                });
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Produtos</h2>
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
