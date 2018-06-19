# Solidity to Vyper Notes

Due to differences between Solidity and Vyper, decisions needed to be made in the translation process. The following notes attempt to record some of the approach taken to satisfy the requirements for the contract using Vyper:

* Vyper lacks support for inheritance, or any form of import, thus: 
  * All functionality needed to be included in a single file.
  * Although there is no ability to inherit from an unimplemented `interface`, I created 'minimal' implementations which do the last amount of work required by the compiler to accept and return the correct types. 
* ERC721's `safeTransferFrom()` function takes additional data with no specified format, which sent in a call to the token receiver. Since vyper does not have a dynamically sized bytes arrays like Solidity's `bytes`, I've used `bytes[164]` (4-byte identifier, plus 5 * 32).

## Other Vyper feedback:

* Nested mappings not documented
* If visibility decorators are required, then it should be on storage vars too. 

* If I have a function 
  `def onERC721Received(_from: address ,_tokenId: uint256, _data: bytes[164])`, 
  the bytes length is ignored, and the function ID is generated from 
  `onERC721Received(address, uint256, bytes)`
  