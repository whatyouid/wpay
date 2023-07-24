const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json');
const { Riwayat } = require('./db.js');
const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const Axios = require('axios');
const {Web3} = require('web3');
const Provider = require('@truffle/hdwallet-provider');
require('dotenv').config();
const port = process.env.PORT;


const app = new Koa();
const router = new Router();

//middlewares
app.use(bodyparser());
app.use(json());

app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());


// app.use("/", (ctx, res, next) => {
//     ctx.send("Server is running");
// })


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const BASE_URL = 'https://api-stg.oyindonesia.com';

// app.use(async (ctx, next) => {
//     ctx.set('Content-Type', 'application/json');
//     ctx.set('Accept', 'application/json');
//     ctx.set('X-OY-Username', 'xxldzl13');
//     ctx.set('X-Api-Key', '96cfb5ce-7506-497a-8573-e1c4bd24c66d');
//     await next();
// });

const headers = {
    "Content-Type" : "application/json",
    Accept: "application/json",
    "X-OY-Username" : process.env.API_USERNAME,
    "X-Api-Key" : process.env.API_KEY
}

const now = new Date();
const year = now.getFullYear().toString();
const month = ('0' + (now.getMonth() + 1)).slice(-2);
const date = ('0' + now.getDate()).slice(-2);
const number = (Math.random() * 10000).toFixed(0);
const id_transaction = year + month + date + number;

function generateId () {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const date = ('0' + now.getDate()).slice(-2);
    const number = (Math.random() * 10000).toFixed(0);
    const id_transaction = year + month + date + number;

    return id_transaction;
}

router.get('/', async ctx => ctx.body = 'Server is running');
//Generate ID Transaction
router.get('/api/id-transaction/:category/:address/:jumlah_crypto/:jumlah_rupiah', async ctx => {
    const category = ctx.params.category;
    const jmlCrypto = ctx.params.jumlah_crypto;
    const jmlRupiah = ctx.params.jumlah_rupiah;
    const address = ctx.params.address;
    const id_transaction = generateId();
    const tanggal = new Date();
    const formatDate = tanggal.toLocaleDateString('id') + "," + tanggal.getHours() + ":" + tanggal.getMinutes();
    await Riwayat.create({
        id: id_transaction,
        date: null,
        jumlah_rupiah: jmlRupiah,
        jumlah_crypto: jmlCrypto,
        category: category,
        address: address,
        tanggal: new Date(),
        paid_crypto: false,
        paid_rupiah: false,
        status: "Diproses"
    });
    ctx.body = {
        "id_transaction": id_transaction,
        "category": category,
        "jumlah_crypto": jmlCrypto,
        "address": address
    };
});

//Generate Virtual Account (VA)
router.post('/api/beli/generate-va', async (ctx, next) => {
    try{
        await Axios.post(BASE_URL + "/api/generate-static-va",ctx.request.body,{
            headers:headers
        }).then( async (res) => {
            ctx.body = {
                "status": res.data.status,
                "amount": res.data.amount,
                "va_number": res.data.va_number,
                "id": res.data.id,
                "partner_user_id": res.data.partner_user_id,
                "bank_code": res.data.bank_code,
                "expiration_time": res.data.trx_expiration_time,
                "va_status": res.data.va_status,
                "trx_counter": res.data.trx_counter
            };
            const riwayat = await Riwayat.findOne({id: res.data.partner_trx_id});
                if(riwayat) {
                riwayat.jumlah_rupiah = res.data.amount;
                await riwayat.save()}
        })
    }catch(e){
        ctx.body = e.message;
    }
});

//Proses Pembelian
router.post('/api/beli/process', async (ctx, next) => {
    try{
        await Axios.get(BASE_URL + '/api/static-virtual-account/' + ctx.request.body.va_id,{
            headers:headers
        }).then( async (res)=> {
            const status = res.data.va_status;
            if(status == "COMPLETE"){
                    const riwayat = await Riwayat.findOne({id: res.data.partner_trx_id});
                    if(riwayat){
                        riwayat.paid_rupiah = true;
                        await riwayat.save();
                        if(riwayat.paid_crypto === false){
                            buy(riwayat.jumlah_crypto, riwayat.id, riwayat.address)
                            riwayat.status = "Selesai";
                            await riwayat.save();
                            ctx.body = {
                                "id_transaction": res.data.partner_trx_id,
                                "category": "beli",
                                "jumlah_rupiah": res.data.amount,
                                "jumlah_crypto": riwayat.jumlah_crypto,
                                "rupiah_status": "Selesai", 
                                "crypto_status": "Selesai",
                                "status": "Selesai"
                            }
                        }else{
                            ctx.body = {
                                "id_transaction": res.data.partner_trx_id,
                                "category": "beli",
                                "jumlah_rupiah": res.data.amount,
                                "jumlah_crypto": riwayat.jumlah_crypto,
                                "rupiah_status": "Selesai", 
                                "crypto_status": "Selesai",
                                "status": "Selesai"
                            }
                        }
                        
                    }
            }else{
                ctx.body = {
                    "id_transaction": res.data.partner_trx_id,
                    "category": "beli",
                    "jumlah_rupiah": res.data.amount,
                    "jumlah_crypto":'',
                    "va_status": res.data.va_status, 
                    "crypto_status": "Diproses",
                    "status": "Diproses"
                }
            }
        })
    }catch(e){
        ctx.body = e.message;
    }
});

// //Proses Pembelian
// router.get('/api/beli/process/:id', async (ctx, next) => {
//     try{
//         await Axios.get(BASE_URL + '/api/static-virtual-account/' + ctx.params.id,{
//             headers:headers
//         }).then( async (res)=> {
//             const status = res.data.va_status;
//             if(status == "COMPLETE"){
//                     const payment = await Payment.findOne({id: res.data.partner_trx_id});
//                     if(payment){
//                         payment.paid_rupiah = true;
//                         await payment.save();
//                         if(payment.paid_crypto === false){
//                             buy(payment.jumlah_crypto, payment.id, payment.address)
//                             payment.status = "Selesai";
//                             await payment.save();
//                             ctx.body = {
//                                 "id_transaction": res.data.partner_trx_id,
//                                 "category": "beli",
//                                 "jumlah_rupiah": res.data.amount,
//                                 "jumlah_crypto": payment.jumlah_crypto,
//                                 "va_status": res.data.va_status, 
//                                 "crypto_status": "Selesai",
//                                 "status": "Selesai"
//                             }
//                         }else{
//                             ctx.body = {
//                                 "id_transaction": res.data.partner_trx_id,
//                                 "category": "beli",
//                                 "jumlah_rupiah": res.data.amount,
//                                 "jumlah_crypto": payment.jumlah_crypto,
//                                 "va_status": res.data.va_status, 
//                                 "crypto_status": "Selesai",
//                                 "status": "Selesai"
//                             }
//                         }
                        
//                     }
//             }else{
//                 ctx.body = {
//                     "id_transaction": res.data.partner_trx_id,
//                     "category": "beli",
//                     "jumlah_rupiah": res.data.amount,
//                     "jumlah_crypto":'',
//                     "va_status": res.data.va_status, 
//                     "crypto_status": "Diproses",
//                     "status": "Diproses"
//                 }
//             }
//         })
//     }catch(e){
//         ctx.body = e.message;
//     }
// });

//Check Bank Account
router.post('/api/check-bank-account', async ctx => {
    try{
        await Axios.post(BASE_URL + "/api/account-inquiry",ctx.request.body,{
            headers:headers
        }).then((res) => {
            ctx.body = res.data;
        })
    }catch(e){
        ctx.body = e.message;
    }
});

//Proses Penjualan
router.post('/api/jual/process/:idTransaction', async (ctx, next) => {
    const riwayat = await Riwayat.findOne({id: ctx.params.idTransaction});
    if(riwayat && riwayat.paid_crypto === true) {
        try{
            const sendRupiah = await Axios.post(BASE_URL + "/api/remit",ctx.request.body,{
                headers:headers
            }).then( async (res) => {
                console.log(res.data)
                const riwayat = await Riwayat.findOne({id: ctx.params.idTransaction});
                if(riwayat) {
                    riwayat.jumlah_rupiah = res.data.amount;
                    riwayat.paid_rupiah = true;
                    riwayat.status = "Selesai";
                await riwayat.save();
                ctx.body = {
                    "id_transaction": res.data.partner_trx_id,
                    "category": "jual",
                    "jumlah_rupiah": res.data.amount,
                    "jumlah_crypto": riwayat.jumlah_crypto,
                    "rupiah_status": res.data.status.message, 
                    "crypto_status": "Selesai",
                    "status": "Diproses"
                }
            }
            })
        
        }catch(e){
            ctx.body = e.message;
        }
    } else {
        ctx.body = {
            message:'Transaksi cryto tidak ditemukan'
        };
    }
    
});

//Get History Transaction
router.get('/api/history/:address', async ctx => {
    try{
        const history = await Riwayat.find({address: `${ctx.params.address}`}).sort({"tanggal": -1});
        ctx.body = history;
    }catch(e){
        ctx.body = "data tidak ditemukan";
    }
});

//Batalkan transaksi
router.post('/api/batal/:idTransaction', async ctx => {
    const riwayat = await Riwayat.findOne({id: ctx.params.idTransaction})
    .then( async (riwayat) => {
        if(riwayat) {
            riwayat.status = "Dibatalkan";
        await riwayat.save();
        ctx.body = "data brhasil dihapus"
        }
    })
    .catch(err => ctx.body = "Transaction ID tidak ditemukan")
});

// router.post('/api/remit-status', async (ctx, next) => {
//     try{
//         await Axios.post(BASE_URL + "/api/remit-status",ctx.request.body,{
//             headers:headers
//         }).then( async (res) => {
//             ctx.body = res.data;
//         })
//     }catch(e){
//         ctx.body = e.message;
//     }
// });







// router.post('/api/jual/callback', async (ctx, next) => {
//     console.log(ctx);
// });

// router.post('/api/beli/callback', async (ctx, next) => {
//     console.log(ctx);
// });



//send Transaction



const buy = async (amount, paymentId, recipient) => {
    const provider = new Provider(process.env.PRIVATE_KEY, process.env.RPC_URL);
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const paymentProcessor = new web3.eth.Contract(
        PaymentProcessor.abi,
        PaymentProcessor.networks[networkId].address
    );

    try{
        const receipt = await paymentProcessor.methods.buy(ethers.utils.parseUnits(amount, 18).toString(),paymentId,recipient).send({ from: process.env.ADMIN_ADDRESS});
        console.log(receipt);
    }catch(e){
        console.log(e);   
    }
}

const listenToEvents = () => {
    const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/bsc/testnet/public');
    const networkId = '97';

    const paymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[networkId].address,
        PaymentProcessor.abi,
        provider
    );

    paymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {
            console.log(`
                from ${payer}
                amount ${amount}
                paymentId ${paymentId}
                date ${(new Date(date.toNumber() * 1000)).toLocaleString()}
            `);
            const riwayat = await Riwayat.findOne({id: paymentId.toString()});
                if(riwayat) {
                riwayat.paid_crypto = true;
                // riwayat.tanggal = `${(new Date(date.toNumber() * 1000)).toLocaleString()}`
                // payment.address = `${payer}`;
                await riwayat.save();
            }
        });
};
listenToEvents();
