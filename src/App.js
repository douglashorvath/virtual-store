import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Products from './components/Products';
import Cart from './components/Cart';
import PurchaseHistory from './components/PurchaseHistory';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]); // Estado global para produtos
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products'); // 'products', 'cart', 'history'

  useEffect(() => {
    if (products.length === 0) {
      // Busca produtos da API apenas na primeira vez
      axios.get('http://localhost:3001/api/products')
        .then(response => setProducts(response.data))
        .catch(console.error);
    }
  }, [products]);

  const handleAddToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    const quantityInCart = existing ? existing.units : 0;

    if (product.units <= quantityInCart) {
      alert('Você não pode adicionar mais do que o estoque disponível!');
      return;
    }

    const updatedCart = existing
      ? cart.map(item =>
        item.id === product.id
          ? { ...item, units: item.units + 1 }
          : item
      )
      : [...cart, { ...product, units: 1 }];

    setCart(updatedCart);

    // Atualiza o estoque do produto
    setProducts(prev =>
      prev.map(p =>
        p.id === product.id
          ? { ...p, units: p.units - 1 }
          : p
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    const itemToRemove = cart.find(item => item.id === productId);

    if (!itemToRemove) return;

    setCart(cart.filter(item => item.id !== productId));

    // Restaura o estoque do produto
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, units: p.units + itemToRemove.units }
          : p
      )
    );
  };

  const handlePurchaseComplete = () => {
    setCart([]); // Esvazia o carrinho
    setView('history'); // Muda para o histórico
  };

  const cartCount = cart.reduce((total, item) => total + item.units, 0);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">Loja Virtual</span>
          <button className="btn btn-light" onClick={() => setView('products')}>Produtos</button>
          <div className="d-flex ms-auto gap-3">
            <button className="btn btn-light position-relative" onClick={() => setView('cart')}>
              <i className="fa fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="btn btn-light" onClick={() => setView('history')}>
              <i className="fa fa-history"></i>
            </button>
          </div>
          <button className="btn btn-danger ms-2" onClick={() => setUser(null)}>Sair</button>
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
          removeFromCart={handleRemoveFromCart}
        />
      )}
      {view === 'history' && <PurchaseHistory userId={user.id} />}
    </div>
  );
};

export default App;
