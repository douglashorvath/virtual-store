import React from 'react';
import axios from 'axios';

const Cart = ({ cart, setCart, userId, onPurchaseComplete }) => {
    const handleRemove = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
    };

    const handleCheckout = () => {
        const purchasePromises = cart.map(item => {
            return axios.post('http://localhost:3001/api/purchase', {
                userId,
                productId: item.id,
                units: item.units,
            });
        });

        Promise.all(purchasePromises)
            .then(() => {
                alert('Compra finalizada com sucesso!');
                setCart([]);
                onPurchaseComplete();
            })
            .catch(err => alert('Erro ao finalizar a compra: ' + err));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.units, 0);

    return (
        <div className="container mt-5">
            <h2>Carrinho</h2>
            {cart.length === 0 ? (
                <p>O carrinho está vazio.</p>
            ) : (
                <>
                    <ul className="list-group mb-3">
                        {cart.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {item.name} (x{item.units})
                                </div>
                                <div>
                                    R$ {(item.price * item.units).toFixed(2)}
                                    <button className="btn btn-danger btn-sm ms-3" onClick={() => handleRemove(item.id)}>Remover</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h4>Total: R$ {total.toFixed(2)}</h4>
                    <button className="btn btn-primary" onClick={handleCheckout}>Finalizar Compra</button>
                </>
            )}
        </div>
    );
};

export default Cart;
