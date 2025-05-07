// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AgroChain} from "../src/AgroChain.sol";

contract CounterScript is Script {
    AgroChain public agroChain;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        agroChain = new AgroChain();

        vm.stopBroadcast();
    }
}
