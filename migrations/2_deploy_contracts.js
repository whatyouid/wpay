const Usdt = artifacts.require('Usdt.sol');
const PaymentProcessor = artifacts.require('PaymentProcessor.sol');

module.exports = async function (deployer, network, address) {
    const [admin, payer, _] = address;

    if(network === 'develop') {
        await deployer.deploy(Usdt);
        const usdt = await Usdt.deployed();
        await usdt.faucet(payer, web3.utils.toWei('10000'));

        await deployer.deploy(PaymentProcessor, admin, usdt.address);
    }   else {
        await deployer.deploy(Usdt);
        const usdt = await Usdt.deployed();
        await usdt.faucet(payer, web3.utils.toWei('10000'));
        const ADMIN_ADDRESS = '0xD90919b7218886dD451A44ce2657702B6A5D20Fd';
        await deployer.deploy(PaymentProcessor, ADMIN_ADDRESS, usdt.address);
    }
};
