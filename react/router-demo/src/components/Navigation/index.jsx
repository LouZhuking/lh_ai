import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/user/:id">UserProfile</Link></li>
        <li><Link to="/products">Products</Link>
          <ul>
            <li><Link to="/products/productId">ProductDetails</Link></li>
            <li><Link to="/products/new">NewProduct</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;