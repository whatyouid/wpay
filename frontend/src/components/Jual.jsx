import { useGlobalState, setGlobalState } from "../store/index"
import { useState, useEffect } from "react"
import axios from "axios"
import { ethers } from 'ethers'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import * as $ from 'jquery'
import 'jquery-ui-dist/jquery-ui'
import 'bootstrap';

window["$"] = $;
window["jQuery"] = $;

const Jual = ({ paymentProcessor, usdt }) => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr'
    const [usdtPrice] = useGlobalState('usdtPrice')
    const [jmlCrypto, setJmlcrypto] = useState('')
    const [jmlIdr, setJmlidr] = useState('')
    const biayaTrx = 5000
    const API_URL = 'http://localhost:4000'
    const [crypto, setCrypto] = useState('USDT')
    const [isLoading, setIsloading] = useState('false')
    const navigate = useNavigate();
    const [connectedAccount] = useGlobalState('connectedAccount')
    const [transactionId, setTransactionid] = useState('');

    const handleChange = (e, param1) => {
        if (e.target.value === "") {
            setJmlcrypto("");
            setJmlidr("");
        } else if (param1 === "crypto") {
            setJmlcrypto(e.target.value);
            setJmlidr(Math.round((e.target.value * usdtPrice) - biayaTrx));

        } else if (param1 === "fiat") {
            setJmlidr(e.target.value);
            setJmlcrypto(((e.target.value / usdtPrice) + (biayaTrx / usdtPrice)).toFixed(2));
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

    useEffect(() => {
        console.log(transactionId);
    }, [transactionId])

    const [bankCode, setBankcode] = useState("014");
    const [bankName, setBankname] = useState("Bank Central Asia (BCA)");
    const [account, setAccount] = useState("");
    const [accountName, setAccountname] = useState("....");

    //Validation
    function validation() {
        if(jmlIdr === ''){
            Swal.fire({
                    title: "Info!",
                    text: "Masukan jumlah penjualan!",
                    icon: "warning",
                    allowOutsideClick: false,
            })
        }else if(account === ''){
            Swal.fire({
                    title: "Info!",
                    text: "Masukan nomor rekening!",
                    icon: "warning",
                    allowOutsideClick: false,
            })
        }else{
            $('#modalJual').modal('show');
            checkAccount();
        }
    }

    //Bank name
    const checkAccount = async (e) => {
        try {
            const response = await axios.post('http://localhost:4000/api/check-bank-account', {
                "bank_code": bankCode,
                "account_number": account

            });
            console.log(response)
            if (response.data.bank_code === "014") {
                setBankname("BCA")
            } else if (response.data.bank_code === "002") {
                setBankname("BRI")
            } else {
                setBankname("Bank Tidak Valid")
            }
            setAccountname(response.data.account_name);

        } catch (error) {
            Swal.fire({
                title: "Info!",
                text: "data tidak ditemukan!",
                icon: "warning",
                allowOutsideClick: false,
            });
        }
    };

    const jual = async (e) => {
        //Generate id_transaction
        const getTransactionId = await axios.get(`${API_URL}/api/id-transaction/jual/${connectedAccount}/${jmlCrypto}/${jmlIdr}`)
        setTransactionid(getTransactionId.data.id_transaction);
        console.log(getTransactionId);
        
        try {
            setIsloading("true");
            
                // .then((res) => {
                //     setTransactionid(res.data.id_transaction);
                //     console.log(res);
                // })
                // .catch(err => console.log(err));

            //Approve Token
            const approve= await usdt.approve(paymentProcessor.address, ethers.utils.parseEther(jmlCrypto));
            await approve.wait();

            //Seller kirim crypto
            const sendCrypto = await paymentProcessor.sell(ethers.utils.parseEther(jmlCrypto), getTransactionId.data.id_transaction);
            await sendCrypto.wait();

            await new Promise(resolve => setTimeout(resolve, 5000))

            //Kirim Rupiah ke seller
            const sendRupiah = await axios.post(`${API_URL}/api/jual/process/${getTransactionId.data.id_transaction}`, {
                "recipient_bank": bankCode,
                "recipient_account": account,
                "amount": jmlIdr,
                "partner_trx_id": getTransactionId.data.id_transaction
            });
            console.log(sendRupiah)
            await Swal.fire({
                title: "Berhasil!",
                text: "Transaksi anda sedang di proses!",
                icon: "success",
                allowOutsideClick: false,
            }).then((result) => {
                navigate('/jualCrypto')
                navigate(0)
            });
        } catch (error) {
            console.log(transactionId);
            console.log(error);
            // console.log(transactionId);
            const batal = await axios.post(`${API_URL}/api/batal/${getTransactionId.data.id_transaction}`)
            console.log(batal)
            setIsloading("false");
            console.log(error);
            Swal.fire({
            title: "Gagal!",
            text: "Transaksi dibatalkan!",
            icon: "warning",
            allowOutsideClick: false,
            }).then((result) => {
                navigate('/jualCrypto')
                navigate(0)
            });
            // .then(async (res) => {
            //         setIsloading("false");
            //         console.log(error);
            //         Swal.fire({
            //         title: "Gagal!",
            //         text: "Transaksi dibatalkan!",
            //         icon: "warning",
            //         allowOutsideClick: false,
            //         }).then((result) => {
            //             navigate('/jualCrypto')
            //             navigate(0)
            //         });
            //     })
            // .catch(err => console.log(err));
        }
    }


    return (
        <section className='section'>
            <div className='container mb-5'>
                <div className='row'>
                    <div className='col text-center'>
                        <h3 className='jual-heading'>Jual Crypto</h3>
                        <div className="container">
                            <div className="row align-items-start">
                                <div className="col-md">
                                    <form>
                                        <div className="row text-start mb-3">
                                            <label htmlFor="disabledSelect" className="col-12 mb-2">Pilih crypto</label>
                                            {/* Crypto */}
                                            <div className="input-group">
                                                <input type="text" className="form-control"  value={jmlCrypto}
                                                    onChange={e => handleChange(e, "crypto")} placeholder="Masukan jumlah crypto" />
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

                                        <div className="row text-start mb-3">
                                            <label htmlFor="disabledSelect" className="col-12 mb-2">Jumlah yang diterima</label>
                                            {/* Crypto */}
                                            <div className="input-group">
                                                <input type="text" className="form-control" value={jmlIdr}
                                                    onChange={e => handleChange(e, "fiat")} placeholder="Masukan jumlah rupiah" />
                                            </div>
                                        </div>

                                        <div className="row text-start">
                                            <label htmlFor="disabledSelect" className="col-12 mb-2">Metode Pembayaran</label>
                                            {/* Crypto */}
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={account}
                                                    onChange={(e) => setAccount(e.target.value)}
                                                    placeholder="Masukan no rekening"
                                                />
                                                <div className="input-group-btn">
                                                    <select
                                                        className="form-select rounded-start-0 border-start-0"
                                                        value={bankCode}
                                                        onChange={(e) => setBankcode(e.target.value)}
                                                    >
                                                        <option value="014">BCA</option>
                                                        <option value="002">BRI</option>
                                                        <option value="009">BNI</option>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>






                                        <div className='d-grid mt-3'>
                                            {connectedAccount === '' ? 
                                            <button disabled type="button" className="btn btn-danger rounded-pill" onClick={() => validation()}>Jual</button>
                                            :
                                            <button type="button" className="btn btn-danger rounded-pill" onClick={() => validation()}>Jual</button>
                                            }
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
            <div className="modal fade" id="modalJual" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Konfirmasi Transaksi</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                    <div className="col">Bank/E-wallet</div>
                                    <div className="col">: {bankName}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Nomer rekening</div>
                                    <div className="col">: {account}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Nama akun</div>
                                    <div className="col">: {accountName}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Jumlah diterima</div>
                                    <div className="col">: {jmlIdr} IDR</div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer ">

                            <button
                                type="button"
                                className={`btn btn-danger rounded-pill col-12 ${isLoading === "true" ? 'd-none' : ''}`}
                                onClick={() => jual()}
                            >
                                Konfirmasi
                            </button>

                            <button className={`btn btn-danger rounded-pill col-12 ${isLoading === "true" ? '' : 'd-none'}`} type="button" disabled>
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

export default Jual