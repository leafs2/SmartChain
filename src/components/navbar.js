import logo from './smartchain-logo.png';
import { FaShoppingCart } from 'react-icons/fa';
const ethers = require("ethers")

const Navbar = ({ account, setAccount, cartItems }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
    }

    return (
        <nav>
            <ul className='nav__links'>
                <li><a href="#">Develop</a></li>
                <li><a href="#">Rent</a></li>
            </ul>

            <div className='nav__brand'>
                <img src={logo} alt="Logo" />
            </div>

            {account ? (
                <div className="nav__actions">
                    <button
                        type="button"
                        className='nav__connect'
                    >
                        {account.slice(0, 6) + '...' + account.slice(38, 42)}
                    </button>
                    <div className="nav__cart">
                        <FaShoppingCart />
                        {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    Connect
                </button>
            )}
        </nav>
    );
}

export default Navbar;

