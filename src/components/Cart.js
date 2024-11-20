import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Cart = ({ cart, setCart, userId, onPurchaseComplete, restoreStock }) => {
    const handleRemove = (id) => {
        const itemToRemove = cart.find(item => item.id === id);
        if (itemToRemove) {
            restoreStock([{ id: itemToRemove.id, units: itemToRemove.units }]);
        }
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
    };

    const handleClearCart = () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Isso irá remover todos os itens do carrinho!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, limpar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                restoreStock(cart.map(item => ({ id: item.id, units: item.units })));
                setCart([]);
                Swal.fire('Carrinho limpo!', 'Todos os itens foram removidos e o estoque foi restaurado.', 'success');
            }
        });
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
                Swal.fire('Sucesso!', 'Compra finalizada com sucesso!', 'success');
                setCart([]);
                onPurchaseComplete();
            })
            .catch(err => Swal.fire('Erro!', `Erro ao finalizar a compra: ${err}`, 'error'));
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
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-danger" onClick={handleClearCart}>Limpar Carrinho</button>
                        <button className="btn btn-primary" onClick={handleCheckout}>Finalizar Compra</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
