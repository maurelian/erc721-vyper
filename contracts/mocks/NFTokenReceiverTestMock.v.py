# @notice Handle the receipt of an NFT
# @dev The ERC721 smart contract calls this function on the recipient
#  after a `transfer`. This function MAY throw to revert and reject the
#  transfer. Return of other than the magic value MUST result in the
#  transaction being reverted.
#  Note: the contract address is always the message sender.
# @param _operator The address which called `safeTransferFrom` function
# @param _from The address which previously owned the token
# @param _tokenId The NFT identifier which is being transferred
# @param _data Additional data with no specified format
# @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
#  unless throwing

InputData: event({_data: bytes[1024]})

@public 
def onERC721Received(_operator: address, _from: address ,_tokenId: uint256, _data: bytes[1028]) -> bytes32:
  return 0xf0b9e5ba00000000000000000000000000000000000000000000000000000000