import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Products from './components/Products';
import Cart from './components/Cart';
import PurchaseHistory from './components/PurchaseHistory';
import './assets/dark-theme.css'; // Importa o tema preto
import logo from './assets/logo.png'; // Importa o logo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHistory } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Controle global dos produtos
  const [view, setView] = useState('products'); // Controle da visualização atual ('products', 'cart', 'history')

  // Busca os produtos do backend ao carregar o aplicativo
  useEffect(() => {
    axios.get('http://localhost:3001/api/products')
      .then(response => setProducts(response.data))
      .catch(console.error);
  }, []);

  // Adiciona um produto ao carrinho
  const handleAddToCart = (product, quantity) => {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, units: item.units + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, units: quantity }]);
    }

    // Atualiza o estoque globalmente
    setProducts(prev =>
      prev.map(p =>
        p.id === product.id ? { ...p, units: p.units - quantity } : p
      )
    );
  };

  // Restaura o estoque globalmente
  const restoreStock = (items) => {
    setProducts(prev =>
      prev.map(product => {
        const itemToRestore = items.find(item => item.id === product.id);
        if (itemToRestore) {
          return { ...product, units: product.units + itemToRestore.units };
        }
        return product;
      })
    );
  };

  const handlePurchaseComplete = () => {
    setCart([]);
    setView('history');
  };

  const cartCount = cart.reduce((total, item) => total + item.units, 0);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <img
            src={logo}
            alt="Horvath InfoStore"
            style={{ height: '80px', marginRight: '10px' }}
          />
          <div className="d-flex ms-auto gap-3">
            <button className="btn btn-light position-relative" onClick={() => setView('products')}>
              Produtos
            </button>
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
            <button className="btn btn-danger ms-2" onClick={() => setUser(null)}>Sair</button>
          </div>
        </div>
      </nav>
      {view === 'products' && (
        <Products
          products={products}
          addToCart={handleAddToCart}
          setView={setView}
          cartCount={cartCount}
        />
      )}
      {view === 'cart' && (
        <Cart
          cart={cart}
          setCart={setCart}
          userId={user.id}
          onPurchaseComplete={handlePurchaseComplete}
          restoreStock={restoreStock}
        />
      )}
      {view === 'history' && <PurchaseHistory userId={user.id} />}
    </div>
  );
};

export default App;
