import { useGlobalState, setGlobalState } from "../store/index";
import { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import copyClipboard from '../assets/copy.png'
import {CopyToClipboard} from "react-copy-to-clipboard";
import * as $ from 'jquery'
import 'jquery-ui-dist/jquery-ui'
import 'bootstrap';

window["$"] = $;
window["jQuery"] = $;

const Beli = ({ paymentProcessor, dai }) => {

    const API_URL = 'https://wpay-api.vercel.app/';

    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr'
    const [usdtPrice] = useGlobalState('usdtPrice')
    const [crypto, setCrypto] = useState('USDT')
    const [jmlCrypto, setJmlcrypto] = useState('')
    const [jmlIdr, setJmlidr] = useState('')
    const biayaTrx = 5000
    // const API_URL = 'http://localhost:4000'
    const [bankCode, setBankcode] = useState("014");
    const [bank, setBank] = useState("BCA");
    const [va, setVa] = useState([]);
    const [connectedAccount] = useGlobalState('connectedAccount')
    const [transactionId, setTransactionId] = useState(0);
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState('false');
    const [valid, setValid] = useState(false);
    

    const handleChange = (e, param1) => {
        if (e.target.value === "") {
            setJmlcrypto("");
            setJmlidr("");
        } else if (param1 === "fiat") {
            setJmlidr(e.target.value);
            setJmlcrypto(((e.target.value - 5000) / usdtPrice).toFixed(2))
        } else if (param1 === "crypto") {
            setJmlcrypto(e.target.value);
            setJmlidr(Math.round((e.target.value * usdtPrice) + 5000))
        } 

    }

    const bankChange = (e) => {
        setBankcode(e.target.value)
        if (e.target.value === "014") {
            setBank("BCA");
        } else if (e.target.value === "002") {
            setBank("BRI");
        } else if (e.target.value === "009") {
            setBank("BNI");
        } else {
            setBank("Invalid");
        }
    }

    useEffect(() => {
        async function getPrice() {
            const price = await axios.get(url);
            setGlobalState('usdtPrice', Math.round((price.data.tether.idr) * 99.5 / 100))
            console.log(price.data.tether.idr)
        }

        let interval = setInterval(async () => {
            const res = await axios.get(url);
            setGlobalState('usdtPrice', Math.round((res.data.tether.idr) * 99.5 / 100))
            console.log(res.data.tether.idr)
        }, 30000);
        return () => {
            getPrice();
            clearInterval(interval);
        };
    }, []);

    function validation() {
        if(jmlIdr === ''){
            Swal.fire({
                    title: "Info!",
                    text: "Masukan jumlah pembelian!",
                    icon: "warning",
                    allowOutsideClick: false,
            })
        }else{
            $('#modalBeli').modal('show');
            beli()
        }
    }

    const beli = async (e) => {

        const getTransactionID = await axios.get(`${API_URL}/api/id-transaction/beli/${connectedAccount}/${jmlCrypto}/${jmlIdr}`);
        console.log(getTransactionID);
        setTransactionId(getTransactionID.data.id_transaction);
        
        const va = await axios.post(`${API_URL}/api/beli/generate-va`, {
            "partner_user_id": getTransactionID.data.id_transaction,
            "bank_code": bankCode,
            "amount": jmlIdr,
            "is_open": true,
            "is_single_use": true,
            "is_lifetime": false,
            "expiration_time": 30,
            "partner_trx_id": getTransactionID.data.id_transaction,
            "trx_counter": 1
        });
        console.log(va)
        setVa(va.data);
    }

    //Proses Pembelian
    const transfer = async () => {
        setIsloading("true");
        const prosesBeli = await axios.post(`${API_URL}/api/beli/process`, {
            "id_transaction": va.partner_user_id,
            "va_id": va.id,
            "bank_code": bankCode,
            "jumlah_rupiah": jmlIdr,
            "jumlah_crypto": jmlCrypto
        });
        console.log(prosesBeli);
            const status = await prosesBeli.data.status;
            if(status === "Selesai"){
                Swal.fire({
                    title: "Berhasil!",
                    text: "Transaksi selesai diproses!",
                    icon: "success",
                    allowOutsideClick: false,
                }).then((result) => {
                    navigate('/beliCrypto')
                    navigate(0)
                });
            }else(
                Swal.fire({
                    title: "Info!",
                    text: "Pembayaran belum ditemukan!",
                    icon: "warning",
                    allowOutsideClick: false,
                }).then((result) => {
                    setIsloading("false");
                }).catch((error)=> {
                    setIsloading("false");
                })
            );       
    };

    // const transfer = async () => {
    //     setIsloading("true");
    //     const prosesBeli = await axios.get(`${API_URL}/api/beli/process/${va.id}`).then((res) => {
    //         console.log(res);
    //         const status = res.data.status;
    //         if(status === "Selesai"){
    //             Swal.fire({
    //                 title: "Berhasil!",
    //                 text: "Transaksi selesai diproses!",
    //                 icon: "success",
    //                 allowOutsideClick: false,
    //             }).then((result) => {
    //                 navigate('/beliCrypto')
    //                 navigate(0)
    //             });
    //         }else(
    //             Swal.fire({
    //                 title: "Info!",
    //                 text: "Pembayaran belum ditemukan!",
    //                 icon: "warning",
    //                 allowOutsideClick: false,
    //             }).then((result) => {
    //                 setIsloading("false");
    //             }).catch((error)=> {
    //                 setIsloading("false");
    //             })
    //         );
    //     });        
    // };

    const copyAlert = () => {
        let timerInterval
        Swal.fire({
        position: 'top-end',
        title: '',
        html: 'VA berhasil di copy',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
        clearInterval(timerInterval)
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
        }
        })
    }   

    const batal = async () => {
        const prosesBatal = await axios.post(`${API_URL}/api/batal/${transactionId}`);
        setValid("false");
    }

    return (
        <section className='section'>
            <div className='container mb-5'>
                <div className='row'>
                    <div className='col text-center'>
                        <h3 className='beli-heading'>Beli Crypto</h3>

                        <div className="container">
                            <div className="row align-items-start">
                                <div className="col-md">
                                    <form>
                                        <div className="row text-start">
                                            <label htmlFor="disabledSelect" className="col-12 mb-2">Jumlah pembelian</label>
                                            {/* Crypto */}
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" value={jmlIdr}
                                                    onChange={e => handleChange(e, "fiat")} placeholder="Masukan jumlah rupiah" required/>

                                            </div>
                                        </div>

                                        <div className="row text-start mb-3">
                                            <label htmlFor="disabledSelect" className="col-12 mb-2">Jumlah yang diterima</label>
                                            {/* Crypto */}
                                            <div className="input-group">
                                                <input type="text" className="form-control" value={jmlCrypto}
                                                    onChange={e => handleChange(e, "crypto")} placeholder="Masukan jumlah crypto" required/>
                                                <div className="input-group-btn">
                                                    <select
                                                        className="form-select rounded-start-0 border-start-0" onChange={(e) => setCrypto(e.target.value)}
                                                    >
                                                        <option value="USDT">USDT</option>
                                                        <option value="BUSD">BUSD</option>
                                                        <option value="USDC">USDC</option>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-2 text-start">
                                            <label htmlFor="disabledSelect" className="form-label">Metode pembayaran</label>
                                            <select
                                                className="form-select"
                                                value={bankCode}
                                                onChange={e => bankChange(e)}
                                            >
                                                <option value="014">Bank BCA</option>
                                                <option value="002">Bank BRI</option>
                                                <option value="009">Bank BNI</option>
                                                <option value="008">Bank Mandiri</option>
                                                <option value="011">Bank Danamon</option>
                                            </select>
                                        </div>






                                        <div className='d-grid mt-3'>
                                            {connectedAccount === '' ? 
                                            <button disabled type="button" className="btn btn-success rounded-pill"   onClick={(e) => validation()} >Beli</button> 
                                            : 
                                            <button type="button" className="btn btn-success rounded-pill" onClick={(e) => validation()} >Beli</button>}
                                        </div>

                                    </form>
                                </div>

                                <div className="col-md">
                                    <div className="row p-3">
                                        <div className="col-6 text-start border-bottom py-2">Rate Harga</div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{usdtPrice} IDR</div>
                                        <div className="col-6 text-start border-bottom py-2">Biaya Transaksi </div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{biayaTrx} IDR</div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* Modal */}
            <div className="modal fade" id="modalBeli"  data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Konfirmasi Transaksi</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => batal()}></button>
                        </div>
                        <div className="modal-body">
                            <div className="container text-start">
                                <div className="row border-bottom py-2">
                                    <div className="col">Crypto</div>
                                    <div className="col">: {crypto}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Jumlah crypto</div>
                                    <div className="col">: {jmlCrypto} {crypto}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Jumlah rupiah</div>
                                    <div className="col">: {jmlIdr}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Metode pembayaran</div>
                                    <div className="col">: {bank} </div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Alamat VA</div>
                                    <div className="col">: {va.va_number}
                                        <CopyToClipboard text={va.va_number}
                                        onCopy={() => copyAlert()}>
                                            <img src={copyClipboard} className='copy-clipboard' alt='copy-clipboard' />
                                        </CopyToClipboard>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer ">
                            <button
                                type="button"
                                className={`btn btn-success rounded-pill col-12 ${isLoading === "true" ? 'd-none' : ''}`}
                                onClick={() => transfer()}
                            >
                                Konfirmasi
                            </button>

                            <button className={`btn btn-success rounded-pill col-12 ${isLoading === "true" ? '' : 'd-none'}`} type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </section>
        
    )
}

export default Beli