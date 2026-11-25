// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @notice Experimental immutable authorization-bound demo counter. Holds no assets and makes no arbitrary calls.
/// @dev Agent ID balance is checked for both issuer and executor at execution time. Not audited.
contract MandavexGuard {
    address public immutable agentId;
    uint256 public immutable deploymentChainId;
    bytes32 private constant MANDATE_TYPEHASH = keccak256(
        "Mandate(address issuer,address executor,bytes32 action,bytes32 payloadHash,uint64 validAfter,uint64 expiry,uint256 nonce,uint32 maxUses)"
    );
    bytes32 private constant NAME_HASH = keccak256("MANDAVEX");
    bytes32 private constant VERSION_HASH = keccak256("1");
    uint256 private constant SECP256K1N_HALF = 0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;

    struct Mandate {
        address issuer;
        address executor;
        bytes32 action;
        bytes32 payloadHash;
        uint64 validAfter;
        uint64 expiry;
        uint256 nonce;
        uint32 maxUses;
    }

    mapping(address => mapping(uint256 => bytes32)) public nonceMandate;
    mapping(bytes32 => bool) public revoked;
    mapping(bytes32 => uint32) public uses;
    uint256 public demoCounter;

    event ActionAuthorized(bytes32 indexed mandateId, address indexed issuer, address indexed executor,
        bytes32 action, bytes32 payloadHash, uint32 useNumber, uint256 counterAfter);
    event MandateRevoked(bytes32 indexed mandateId, address indexed issuer);

    error InvalidIdentity();
    error InvalidMandate();
    error InvalidSignature();
    error Unauthorized();
    error InvalidTime();
    error Replay();
    error Revoked();
    error ScopeMismatch();
    error UseLimit();

    constructor(address registry) {
        if (registry == address(0) || registry.code.length == 0) revert InvalidIdentity();
        agentId = registry;
        deploymentChainId = block.chainid;
    }

    function mandateId(Mandate calldata m) public view returns (bytes32) {
        return keccak256(abi.encodePacked("MANDAVEX_MANDATE_V1", block.chainid, address(this), _structHash(m)));
    }

    function revoke(Mandate calldata m) external {
        if (msg.sender != m.issuer) revert Unauthorized();
        bytes32 id = mandateId(m);
        if (revoked[id]) revert Revoked();
        revoked[id] = true;
        emit MandateRevoked(id, msg.sender);
    }

    function execute(Mandate calldata m, bytes calldata payload, bytes calldata signature) external returns (bytes32 id) {
        if (msg.sender != m.executor || m.issuer == address(0) || m.executor == address(0)) revert Unauthorized();
        if (!_hasAgentId(m.issuer) || !_hasAgentId(m.executor)) revert InvalidIdentity();
        if (m.maxUses == 0 || m.expiry <= m.validAfter) revert InvalidMandate();
        if (block.timestamp < m.validAfter || block.timestamp > m.expiry) revert InvalidTime();
        if (m.action != keccak256("MANDAVEX_DEMO_INCREMENT_V1") || m.payloadHash != keccak256(payload)) revert ScopeMismatch();
        id = mandateId(m);
        bytes32 reserved = nonceMandate[m.issuer][m.nonce];
        if (reserved != bytes32(0) && reserved != id) revert Replay();
        if (revoked[id]) revert Revoked();
        if (_recover(_digest(_structHash(m)), signature) != m.issuer) revert InvalidSignature();
        uint32 nextUse = uses[id] + 1;
        if (nextUse > m.maxUses) revert UseLimit();
        nonceMandate[m.issuer][m.nonce] = id;
        uses[id] = nextUse;
        uint256 updated = ++demoCounter;
        emit ActionAuthorized(id, m.issuer, m.executor, m.action, m.payloadHash, nextUse, updated);
    }

    function _hasAgentId(address account) private view returns (bool) {
        (bool ok, bytes memory result) = agentId.staticcall(abi.encodeWithSignature("balanceOf(address)", account));
        if (!ok || result.length < 32) revert InvalidIdentity();
        return abi.decode(result, (uint256)) > 0;
    }

    function _structHash(Mandate calldata m) private pure returns (bytes32) {
        return keccak256(abi.encode(MANDATE_TYPEHASH, m.issuer, m.executor, m.action, m.payloadHash,
            m.validAfter, m.expiry, m.nonce, m.maxUses));
    }

    function _digest(bytes32 structHash) private view returns (bytes32) {
        if (block.chainid != deploymentChainId) revert InvalidMandate();
        bytes32 domain = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            NAME_HASH, VERSION_HASH, deploymentChainId, address(this)
        ));
        return keccak256(abi.encodePacked("\x19\x01", domain, structHash));
    }

    function _recover(bytes32 digest, bytes calldata sig) private pure returns (address signer) {
        if (sig.length != 65) revert InvalidSignature();
        bytes32 r; bytes32 s; uint8 v;
        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }
        if (uint256(s) > SECP256K1N_HALF || (v != 27 && v != 28)) revert InvalidSignature();
        signer = ecrecover(digest, v, r, s);
        if (signer == address(0)) revert InvalidSignature();
    }
}
