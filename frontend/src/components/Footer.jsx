import React from 'react'
import {Link} from 'react-router-dom'
import {FaTwitter} from 'react-icons/fa'


const Footer = () => {
    return (
        <section className='section footer bg-dark text-white'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <h6>About W-Pay</h6>
                            <hr/>
                            <p className='text-white'>
                                W-Pay adalah aplikasi terdesentralisasi (Dapps) yang menyediakan layanan pertukaran aset digital kripto ke mata uang fiat (Rupiah).
                            </p>
                        </div>

                        <div className='col-md-4'>
                            <h6>Quick Links</h6>
                            <hr />
                            <div><Link to='/'>Home</Link></div>
                            <div><Link to='/beliCrypto'>Beli Crypto</Link></div>
                            <div><Link to='/jualCrypto'>Jual Crypto</Link></div>
                            <div><Link to='/hitory'>Riwayat Transaksi</Link></div>
                        </div>

                        <div className='col-md-4'>
                            <h6>Social Media Links</h6>
                            <hr />
                            <div><Link to='/'>Twitter</Link></div>
                            <div><Link to='/beliCrypto'>Telegram</Link></div>
                            <div><Link to='/jualCrypto'>Discord</Link></div>
                        </div>
                    </div>
                </div>
            </section>
    )
}

export default Footer