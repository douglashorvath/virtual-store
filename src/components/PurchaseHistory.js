import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PurchaseHistory = ({ userId }) => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/purchases/${userId}`)
            .then(response => setPurchases(response.data))
            .catch(console.error);
    }, [userId]);

    return (
        <div className="container mt-5">
            <h2>Histórico de Compras</h2>
            {purchases.length === 0 ? (
                <p>Você ainda não realizou nenhuma compra.</p>
            ) : (
                <ul className="list-group">
                    {purchases.map((purchase, index) => (
                        <li key={index} className="list-group-item">
                            <div><strong>Produto:</strong> {purchase.name}</div>
                            <div><strong>Quantidade:</strong> {purchase.units}</div>
                            <div><strong>Total:</strong> R$ {purchase.total.toFixed(2)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PurchaseHistory;
