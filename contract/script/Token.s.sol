// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyToken} from "../src/Token.sol";

contract TokenScript is Script {
    MyToken public myToken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        myToken = new MyToken();

        myToken.mint(0x2830C21ecA4d3F7b5D4e7b7AB4ca0D8C04025bf8, 1000000 * 10 ** 18);

        vm.stopBroadcast();
    }
}
