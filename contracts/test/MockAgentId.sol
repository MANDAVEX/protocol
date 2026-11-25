// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @notice Local EVM fixture only. Never use as a production identity registry.
contract MockAgentId {
    mapping(address => uint256) public balanceOf;

    function setBalance(address account, uint256 amount) external {
        balanceOf[account] = amount;
    }
}
