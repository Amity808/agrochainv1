// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract AgroChain is AccessControl {

    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant INTERMEDIARY_ROLE = keccak256("INTERMEDIARY_ROLE");

    error Unauthorized(bytes32 role);
    error InvalidQuantity();
    error ProductNotFound();
    error OrderNotFound();
    error InsufficientFunds();
    // 0x06B3cE0De6bD0eB7E565324d592b7Cab86461519
    // 0x69EE724Ca2F17A188af0E2De03142Dfe37972bBf
    // 0x9263742fd1f16f0E6Af5A147B562036256d22e42

    struct Product {
        string url;
        uint price;
        uint quantity;
        address payable seller;
        address intermediary;
    }

    struct Order {
        uint productId;
        uint quantity;
        address buyer;
        address seller;
        address intermediary;
        Status status;
    }

    enum Status { Pending, Shipped, Delivered, Completed, Disputed }

    uint public productCount;
    uint public orderCount;
    mapping(uint => Product) public products;
    mapping (address => bool) public accountRoles;
    // mapping (address => bool) public  consumerRole;
    // mapping (address => bool) public manufacturerRole;
    mapping(uint => Order) public orders;

    event ProductAdded(uint productId, string name, address seller);
    event OrderPlaced(uint orderId, uint productId, address buyer);
    event OrderStatusUpdated(uint orderId, Status status);

    constructor() {
        _setRoleAdmin(FARMER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(FARMER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(CONSUMER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(CONSUMER_ROLE, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyFarmer() {
        if (!hasRole(FARMER_ROLE, msg.sender)) {
            revert Unauthorized(FARMER_ROLE);
        }
        _;
    }

    modifier onlyConsumer() {
        if (!hasRole(CONSUMER_ROLE, msg.sender)) {
            revert Unauthorized(CONSUMER_ROLE);
        }
        _;
    }

    modifier onlyManufacturer() {
        if (!hasRole(MANUFACTURER_ROLE, msg.sender)) {
            revert Unauthorized(MANUFACTURER_ROLE);
        }
        _;
    }

  

    function addProduct(string memory _URL, uint _price, uint _quantity) public onlyFarmer {
        if (_quantity == 0) {
            revert InvalidQuantity();
        }
        productCount++;
        products[productCount] = Product({
            url: _URL,
            price: _price,
            quantity: _quantity,
            seller: payable(msg.sender),
            intermediary: address(0)
        });

        emit ProductAdded(productCount, _URL, msg.sender);
    }


    //  TODO: will change this to grantAccoount Role
    function grantRoleFarmer(bytes32 role, address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(accountRoles[user] == false, "Already has role");
        grantRole(role, user);
        accountRoles[user] = true;
    }

    // function grantRoleConsumer(bytes32 role, address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
    //     require(consumerRole[user] == false, "Already has manufacturer role");
    //     grantRole(role, user);
    //     consumerRole[user] = true;
    // }

    // function grantRoleManufacturer(bytes32 role, address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
    //     require(manufacturerRole[user] == false, "Already has manufacturer role");
    //     grantRole(role, user);
    //     manufacturerRole[user] = true;
    // }



    function revokeRoleFromUser(bytes32 role, address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(role, user);
    }

 
    function calculateIntermediaryFee(uint amount, bytes32 buyerRole) internal pure returns (uint) {
        if (buyerRole == CONSUMER_ROLE) {
            return amount * 5 / 100; 
        } else if (buyerRole == MANUFACTURER_ROLE) {
            return amount * 10 / 100; 
        } else {
            return 0;
        }
    }

 

    function buyProduct(uint _productId, uint _quantity) public payable onlyConsumer {
        Product storage product = products[_productId];
        if (product.seller == address(0)) {
            revert ProductNotFound();
        }

        if (product.quantity < _quantity) {
            revert InvalidQuantity();
        }

        uint totalPrice = product.price * _quantity;

        uint intermediaryFee = 0;
        if (product.intermediary != address(0)) {
            intermediaryFee = calculateIntermediaryFee(totalPrice, CONSUMER_ROLE);
        }

        uint amountToBePaid = totalPrice + intermediaryFee;

        if (msg.value < amountToBePaid) {
            revert InsufficientFunds();
        }

        (bool success, ) = product.seller.call{value: totalPrice}("");
        require(success, "Transfer to seller failed");

        if (product.intermediary != address(0)) {
            (success, ) = product.intermediary.call{value: intermediaryFee}("");
            require(success, "Transfer to intermediary failed");
        }

        product.quantity -= _quantity;

        orderCount++;
        orders[orderCount] = Order({
            productId: _productId,
            quantity: _quantity,
            buyer: msg.sender,
            seller: product.seller,
            intermediary: product.intermediary,
            status: Status.Pending
        });

        emit OrderPlaced(orderCount, _productId, msg.sender);

        if (msg.value > amountToBePaid) {
            (success, ) = msg.sender.call{value: msg.value - amountToBePaid}("");
            require(success, "Refund failed");
        }
    }


}