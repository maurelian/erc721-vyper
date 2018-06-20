# @dev Implementation of standard for detect smart contract interfaces.

# @dev Mapping of supported intefraces.
# @notice You must not set element 0xffffffff to true.
# mapping(bytes4 => bool) internal supportedInterfaces;
supportedInterfaces: bool[bytes[4]]

# @dev Contract constructor.
@public
def __init__():
  # The interface ID of supportsInterface
  self.supportedInterfaces['\x01\xff\xc9\xa7'] = True

# @dev Function to check which interfaces are suported by this contract.
# @param _interfaceID Id of the interface.
@public
@constant
def supportsInterface(_interfaceID: bytes[4]) -> (bool):
  return self.supportedInterfaces[_interfaceID]
