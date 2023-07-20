const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true}
);

const paymentSchema = new mongoose.Schema({
    id: String,
    jumlah_rupiah: String,
    jumlah_crypto: String,
    category: String,
    address: String,
    tanggal: Date,
    paid_crypto: Boolean,
    paid_rupiah: Boolean,
    status: String
});

const Riwayat = mongoose.model('Riwayat', paymentSchema);

module.exports = {
    Riwayat
};