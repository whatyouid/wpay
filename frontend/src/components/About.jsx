import React from 'react'
import { Link } from 'react-router-dom'
import Service1 from '../assets/img1.jpg'
import Features1 from '../assets/Features1.png'
import Features2 from '../assets/Features2.png'
import Features3 from '../assets/Features3.png'

const About = () => {
    return (
        <div>
            <section className='section'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 text-center'>
                            <h3 className='main-heading'>About W-Pay</h3>
                            <div className='underline mx-auto'></div>
                            <p>
                                W-Pay adalah aplikasi terdesentralisasi (Dapps) yang menyediakan layanan pertukaran aset digital kripto ke mata uang fiat (Rupiah).
                                W-Pay sudah bekerjasama dengan OY Indonesia / PT DOMPET HARAPAN BANGSA yang merupakan salah satu layanan payment gateway terdaftar dan diawasi oleh Bank Indonesia. Nomor PKS: 12/DHB/03/MI/2020

                            </p>
                            <Link to='/about' className='btn btn-warning shadow'>Read More</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section className='section bg-c-light border-top'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mb-4 text-center'>
                            <h3 className='main-heading'>Visi dan Misi</h3>
                            <div className='underline mx-auto'></div>
                        </div>
                        <div className='col-md-6 text-center'>
                            <h6>Visi Kami</h6>
                            <p>
                                Menjadi penyedia layanan pertukaran pertama yang dibangun untuk Web3 di Indonesia
                            </p>
                        </div>
                        <div className='col-md-6 text-center'>
                            <h6>Misi Kami</h6>
                            <p>
                                Memberikan pengalaman web3 dan meningkatkan adopsi blockchain di Indonesia.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </section>


            {/* Services */}
            <section className='section border-top'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mb-4 text-center'>
                            <h3 className='main-heading'>Fitur kami</h3>
                            <div className='underline mx-auto'></div>
                        </div>

                        <div className='col-md-4'>
                            <div className='card shadow'>
                                <img src={Features1} className='w-108 border-bottom rounded-top-2' alt='services' />
                                <div className='card-body'>
                                    <h6>Non-Custodial</h6>
                                    <div className='undeline'></div>
                                    <p>
                                        Bertransaksi langsung menggunakan dompet terdesentralisasi seperti metamask / trust wallet. 
                                    </p>
                                    <Link to='/services' className='btn btn-link'>Read more</Link>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className='card shadow'>
                                <img src={Features2} className='w-108 border-bottom rounded-top-2' alt='services' />
                                <div className='card-body'>
                                    <h6>Beli / Jual Kripto</h6>
                                    <div className='undeline'></div>
                                    <p>
                                        Beli / Jual kripto langsung dengan mata uang fiat (Rupiah).
                                    </p>
                                    <Link to='/services' className='btn btn-link'>Read more</Link>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className='card shadow'>
                                <img src={Features3} className='w-108 border-bottom rounded-top-2' alt='services' />
                                <div className='card-body'>
                                    <h6>Metode Pembayaran</h6>
                                    <div className='undeline'></div>
                                    <p>
                                        W-Pay menyediakan berbagai macam metode pembayaran sesuai dengan kebutuhan anda.
                                    </p>
                                    <Link to='/services' className='btn btn-link'>Read more</Link>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About