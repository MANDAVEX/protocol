// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @notice Local EVM fixture only. Never use as a production identity registry.
contract MockAgentId {
    mapping(address => uint256) private balances;
    bool public shouldRevert;

    function setBalance(address account, uint256 amount) external {
        balances[account] = amount;
    }

    function setShouldRevert(bool value) external {
        shouldRevert = value;
    }

    function balanceOf(address account) external view returns (uint256) {
        require(!shouldRevert, "mock registry failure");
        return balances[account];
    }
}
