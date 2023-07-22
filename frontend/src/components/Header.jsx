import React from 'react'
import {Link} from 'react-router-dom'
import { useGlobalState } from '../store/index'
import {connectWallet, getCurrentWalletConnected, addWalletListener, Price } from '../Blockchain'
import { useEffect } from 'react'
import { getPrice } from './api'
// import Logo from '../assets/Logo.png'
import Logo from '../assets/logo/wpay-white.png';


const Header = () => {
    const [connectedAccount] = useGlobalState('connectedAccount')

    useEffect(() =>{
        getCurrentWalletConnected();
        addWalletListener();
    },[]);
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
            <div className="container">
                <Link to="/" className="">
                    <img src={Logo} alt="Logo" className="logo"/>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/beliCrypto" className="nav-link active">Beli Crypto</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/jualCrypto" className="nav-link active">Jual Crypto</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/riwayat" className="nav-link active">Riwayat Transaksi</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <button className='btn btn-primary rounded-pill mx-2'
                    onClick={connectWallet}>
                        {connectedAccount && connectedAccount.length > 0 
                        ? `${connectedAccount.substring(0,4)}...${connectedAccount.substring(38)}`
                        : "Connect"}
                    </button>
                </div>
                
            </div>
        </nav>
    )
}

export default Header