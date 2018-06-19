# Notes: `bytes` is not a valid type in vyper. This makes it impossible to get the proper 
# function ID, and call this function
@public 
def onERC721Received(_from: address ,_tokenId: uint256, _data: bytes[164]) -> (bytes[4]):
    return '\xf0\xb9\xe5\xba'