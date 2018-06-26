# ERC721 Vyper implementation

This is an implementation of the [ERC721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) specification in Vyper. It was done as a learning excercise, and **has not been audited.** Moreover, due to certain limitations of Vyper (see TODOs below), the implementation doesn't yet comply with the specification. 

## Setup

`npm i`

## Testing

`npm run test`

If you make any modifications to the contracts, you will need re-compile: 

`npm run build`

A truffle compatible build process is handled by [`truper`](https://www.npmjs.com/package/truper), which does not include vyper compiler. You will need to have the `vyper` compiler installed and available in your terminal's environment. If you can't run `$ vyper -h`, the build process will fail. 

See the [Vyper installation instructions](https://vyper.readthedocs.io/en/latest/installing-vyper.html).

## TODOs

- [ ] Implement the `safeTransfer()` function with data. (Dependent on adding [default parameter values in vyper](https://github.com/ethereum/vyper/issues/903)). Currently it is implemented but named `safeTransferWithData()`. 
- [ ] Add a test for the ability to send from `safeTransferWithData()`
- [ ] Add the erc721 MetaData interface
- [ ] Add the erc721 Enumberable interface


## Acknowledgements

The test suite used here is taken from [0xCert's ethereum-erc721](https://github.com/0xcert/ethereum-erc721), with only minor modifications. Thank you to them for their work. 