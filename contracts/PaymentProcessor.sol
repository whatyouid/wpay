// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract PaymentProcessor {
    address public admin;
    IERC20 public usdt;

    event PaymentDone(
        address payer,
        uint amount,
        uint paymentId,
        uint date
    );

    event BuyDone(
        address payer, 
        uint amount,
        uint paymentId,
        uint date
    );

    constructor(address adminAddress, address usdtAddress){
        admin = adminAddress;
        usdt = IERC20(usdtAddress);
    }

    function sell(uint amount, uint paymentId) external {
        usdt.transferFrom(msg.sender, admin, amount);
        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    }

    function buy(uint amount, uint paymentId, address recipient) external {
        usdt.transferFrom(msg.sender, recipient, amount);
        emit PaymentDone(recipient, amount, paymentId, block.timestamp);
    }
}
