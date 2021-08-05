/**
 *Submitted for verification at BscScan.com on 2021-02-09
*/

/**
 *Submitted for verification at BscScan.com on 2021-02-05
*/

// File: contracts/interfaces/IERC165.sol

pragma solidity ^0.7.0;

interface IERC165 {
    /**
     * @notice Query if a contract implements an interface
     * @dev Interface identification is specified in ERC-165. This function
     * uses less than 30,000 gas
     * @param _interfaceId The interface identifier, as specified in ERC-165
     */
    function supportsInterface(bytes4 _interfaceId)
        external
        view
        returns (bool);
}
