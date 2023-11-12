// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./ConvertLib.sol";

contract IdentitySystem {

    struct Identity {
        string name;
        string dateOfBirth;
        string nationality;
        bool isVerified;
    }

    mapping(address => Identity) public identities;
    mapping(address => bool) public verifiers;

    event IdentityCreated(address indexed user, string name);
    event IdentityVerified(address indexed user, address indexed verifier);

    constructor() {
        // Устанавливаем заданный адрес как верификатор
        verifiers[0x7f94a8dFaf3e1b18D893CB5e890d47Fb0f5104C7] = true;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifiers can call this function.");
        _;
    }

    function registerVerifier(address _verifier) public {
        verifiers[_verifier] = true;
    }

    function createIdentity(string memory _name, string memory _dob, string memory _nationality) public {
        require(bytes(identities[msg.sender].name).length == 0, "Identity already exists.");

        identities[msg.sender] = Identity(_name, _dob, _nationality, false);
        emit IdentityCreated(msg.sender, _name);
    }

    function verifyIdentity(address _user) public onlyVerifier {
        require(bytes(identities[_user].name).length > 0, "Identity does not exist.");
        require(!identities[_user].isVerified, "Identity already verified.");

        identities[_user].isVerified = true;
        emit IdentityVerified(_user, msg.sender);
    }

    function getIdentity(address _user) public view returns (string memory name, bool isVerified) {
        require(identities[_user].isVerified, "Identity not verified or does not exist.");

        return (identities[_user].name, identities[_user].isVerified);
    }
}
