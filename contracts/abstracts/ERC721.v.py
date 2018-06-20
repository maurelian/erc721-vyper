## Vyper doesn't support interfaces
## But as a starting point, I converted the solidity interfact to vyper with the most basic 
## implementation required to compile.

# @dev ERC-721 non-fungible token standard. See https://goo.gl/pc9yo# 
# 
# @dev Emits when ownership of any NFT changes by any mechanism. This event emits when NFTs are
# created (`from` == 0) and destroyed (`to` == 0). Exception: during contract creation, any
# number of NFTs may be created and assigned without emitting Transfer. At the time of any
# transfer, the approved address for that NFT (if any) is reset to none.
Transfer: event({_from: indexed(address), _to: indexed(address), _tokenId:indexed(uint256)})

# @dev This emits when the approved address for an NFT is changed or reaffirmed. The zero
# address indicates there is no approved address. When a Transfer event emits, this also
# indicates that the approved address for that NFT (if any) is reset to none.
Approval: event({_owner: indexed(address), _approved: indexed(address), _tokenId:indexed(uint256)})

# @dev This emits when an operator is enabled or disabled for an owner. The operator can manage
# all NFTs of the owner.
ApprovalForAll: event({_owner: indexed(address), _operator: indexed(address), _approved: bool})

# @dev Returns the number of NFTs owned by `_owner`. NFTs assigned to the zero address are
# considered invalid, and this function throws for queries about the zero address.
# @param _owner Address for whom to query the balance.

# function balanceOf(address _owner) external view returns (uint256);
@public # external not available in vyper
@constant
def balanceOf(_owner: address) -> (uint256):
  return 1 ## placeholder 

# @dev Returns the address of the owner of the NFT. NFTs assigned to zero address are considered
# invalid, and queries about them do throw.
# @param _tokenId The identifier for an NFT.
# function ownerOf(uint256 _tokenId) external view returns(address);
@public
@constant
def ownerOf(_tokenId: uint256) -> address


# @dev Transfers the ownership of an NFT from one address to another address.
# @notice Throws unless `msg.sender` is the current owner, an authorized operator, or the
# approved address for this NFT. Throws if `_from` is not the current owner. Throws if `_to` is
# the zero address. Throws if `_tokenId` is not a valid NFT. When transfer is complete, this
# function checks if `_to` is a smart contract (code size > 0). If so, it calls `onERC721Received`
# on `_to` and throws if the return value is not `bytes4(keccak256("onERC721Received(address,uint256,bytes)"))`.
# @param _from The current owner of the NFT.
# @param _to The new owner.
# @param _tokenId The NFT to transfer.
# @param _data Additional data with no specified format, sent in call to `_to`. May be empty "". 
# function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
# function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data) external;
@public # used `_data: bytes[64]` to allow up to a certain length
def safeTransferFrom(_from: address, _to: address, _tokenId: uint256, _data: bytes[64]):
  log.Transfer(_from, _to, _tokenId)

# @dev Throws unless `msg.sender` is the current owner, an authorized operator, or the approved
# address for this NFT. Throws if `_from` is not the current owner. Throws if `_to` is the zero
# address. Throws if `_tokenId` is not a valid NFT.
# @notice The caller is responsible to confirm that `_to` is capable of receiving NFTs or else
# they mayb be permanently lost.
# @param _from The current owner of the NFT.
# @param _to The new owner.
# @param _tokenId The NFT to transfer.
# function transferFrom(address _from, address _to, uint256 _tokenId) external;
@public
def transferFrom(_from: address, _to: address, _tokenId: uint256):
  log.Transfer(_from, _to, _tokenId)

# @dev Set or reaffirm the approved address for an NFT.
# @notice The zero address indicates there is no approved address. Throws unless `msg.sender` is
# the current NFT owner, or an authorized operator of the current owner.
# @param _approved The new approved NFT controller.
# @param _tokenId The NFT to approve.
# function approve( address _approved, uint256 _tokenId) external;
@public
def approve(_approved: address, _tokenId: uint256):
  _owner: address = 0x1111111111111111111111111111111111111111
  log.Approval(_owner, _approved, _tokenId)

# @dev Enables or disables approval for a third party ("operator") to manage all of
# `msg.sender`'s assets. It also emits the ApprovalForAll event.
# @notice The contract MUST allow multiple operators per owner.
# @param _operator Address to add to the set of authorized operators.
# @param _approved True if the operators is approved, false to revoke approval.
# function setApprovalForAll(address _operator, bool _approved)  external;
@public
def setApprovalForAll(_operator: address, _approved: bool):
  _owner: address = 0x1111111111111111111111111111111111111111
  log.Approval(_owner, _operator, 20) # may need to emit for multiple tokenIds

# @dev Get the approved address for a single NFT.
# @notice Throws if `_tokenId` is not a valid NFT.
# @param _tokenId The NFT to find the approved address for. 
# function getApproved(uint256 _tokenId) external view returns(address);
@public
@constant
def getApproved(_tokenId: uint256) -> (address):
  return 0x1111111111111111111111111111111111111111 ## placeholder

# @dev Returns true if `_operator` is an approved operator for `_owner`, false otherwise.
# @param _owner The address that owns the NFTs.
# @param _operator The address that acts on behalf of the owner.
# function isApprovedForAll( address _owner, address _operator) external view returns(bool);
@public 
@constant
def isApprovedForAll( _owner: address, _operator: address) -> (bool):
  return True
