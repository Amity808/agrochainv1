// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AgroChain is AccessControl {
    IERC20 public paymentToken;

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

    // TODO: should have admin addresss update the esxxcrow to be token
    // 0x83D6d013f11D3Ce9E2d36f20813864E861151A54
    struct Product {
        string url;
        uint price;
        uint quantity;
        address seller;
        address intermediary;
        address token;
    }

    struct Order {
        uint productId;
        uint quantity;
        address buyer;
        address seller;
        address intermediary;
        Status status;
    }

    enum Status {
        Pending,
        Shipped,
        Delivered,
        Completed,
        Disputed
    }

    uint public productCount;
    uint public orderCount;
    mapping(address => bool) public supportedTokens;
    mapping (address => bool) public accountRoles;
    mapping(uint => Product) public products;
    mapping(uint => uint) public escrowBalances;
    mapping(uint => Order) public orders;

    event ProductAdded(uint productId, string name, address seller);
    event OrderPlaced(uint orderId, uint productId, address buyer);
    event OrderStatusUpdated(uint orderId, Status status);
    event TokenSupported(address token, bool isSupported);


    struct Review {
        uint orderId;
        uint rating;
        string comment;
    }

    mapping(uint => Review) public reviews;

    event ReviewAdded(uint orderId, uint rating, string comment);

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


    function grantRoleFarmer(bytes32 role, address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(accountRoles[user] == false, "Already has role");
        grantRole(role, user);
        accountRoles[user] = true;
    }

    function addProduct(
        string memory _URL,
        uint _price,
        uint _quantity,
        address seller,
        address _token
    ) public onlyFarmer {
        if (_quantity == 0) {
            revert InvalidQuantity();
        }

        supportedTokens[_token] = true;
        productCount++;
        products[productCount] = Product({
            url: _URL,
            price: _price,
            quantity: _quantity,
            seller: seller,
            intermediary: address(0),
            token: _token
        });

        emit ProductAdded(productCount, _URL, msg.sender);
    }

    function grantRoleToUser(
        bytes32 role,
        address user
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(role, user);
    }

    function revokeRoleFromUser(
        bytes32 role,
        address user
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(role, user);
    }

    function calculateIntermediaryFee(
        uint amount,
        bytes32 buyerRole
    ) internal pure returns (uint) {
        if (buyerRole == CONSUMER_ROLE) {
            return (amount * 5) / 100;
        } else if (buyerRole == MANUFACTURER_ROLE) {
            return (amount * 10) / 100;
        } else {
            return 0;
        }
    }

    function buyProduct(
        uint _productId,
        uint _quantity,
        address _tokenAddress
    ) public  {
        require(supportedTokens[_tokenAddress], "Token not supported");

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

        IERC20 token = IERC20(_tokenAddress);
        require(
            token.transferFrom(msg.sender, address(this), amountToBePaid),
            "Token transfer failed"
        );

        if (product.intermediary != address(0)) {
            require(
                token.transfer(product.intermediary, intermediaryFee),
                "Intermediary transfer failed"
            );
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
    }

    function releaseEscrow(
    uint _orderId,
    address _tokenAddress
) public {
    Order storage order = orders[_orderId];
    if (order.status != Status.Delivered) {
        revert("Order not delivered");
    }

    // Ensure only the farmer (seller) can release escrow
    if (order.seller != msg.sender) {
        revert Unauthorized(FARMER_ROLE);
    }

    uint totalPrice = products[order.productId].price * order.quantity;

    IERC20 token = IERC20(_tokenAddress);
    require(
        token.transfer(order.seller, totalPrice),
        "Token transfer to seller failed"
    );

    escrowBalances[order.productId] -= totalPrice;
}

    function updateProductQuantity(uint _productId, uint _quantity) public {
        Product storage product = products[_productId];
        if (product.seller == address(0)) {
            revert ProductNotFound();
        }

        // Ensure only the seller or an admin can update the quantity
        if (
            product.seller != msg.sender &&
            !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)
        ) {
            revert Unauthorized(DEFAULT_ADMIN_ROLE);
        }

        if (_quantity == 0) {
            revert InvalidQuantity();
        }

        product.quantity = _quantity;
    }

    function makeProductOutOfStock(uint _productId) public onlyFarmer {
        Product storage product = products[_productId];
        if (product.seller == address(0)) {
            revert ProductNotFound();
        }

        if (product.seller != msg.sender) {
            revert Unauthorized(FARMER_ROLE);
        }

        product.quantity = 0;
    }

    function markOrderAsDelivered(uint _orderId) public {
        Order storage order = orders[_orderId];
        if (order.buyer == address(0)) {
            revert OrderNotFound();
        }

        if (
            order.seller != msg.sender &&
            !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)
        ) {
            revert Unauthorized(DEFAULT_ADMIN_ROLE);
        }

        order.status = Status.Delivered;
        emit OrderStatusUpdated(_orderId, Status.Delivered);
    }

    function addReview(
        uint _orderId,
        uint _rating,
        string memory _comment
    ) public {
        Order storage order = orders[_orderId];
        if (order.buyer != msg.sender) {
            revert Unauthorized(CONSUMER_ROLE);
        }
        if (order.status != Status.Completed) {
            revert("Order not completed");
        }
        reviews[_orderId] = Review({
            orderId: _orderId,
            rating: _rating,
            comment: _comment
        });
        emit ReviewAdded(_orderId, _rating, _comment);
    }

    function setSupportedToken(address _token, bool _isSupported) public onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[_token] = _isSupported;
        emit TokenSupported(_token, _isSupported);
    }
    
}
