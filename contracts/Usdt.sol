// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract USDT is ERC20 {
  constructor() ERC20('Testnet USDT Stablecoin', 'tUSDT') {}

  function faucet(address to, uint amount) external {
    _mint(to, amount);
  }
}