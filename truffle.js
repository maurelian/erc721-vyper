module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache: {
      gasLimit: 999999999999999,
      hostname: "127.0.0.1",
      network_id: 5777,
      port: 8545,
      total_accounts: 10,
      unlocked_accounts: [],
      vmErrorsOnRPCResponse: true
    },
    default: {
      network_id: 1 // Ethereum public network
      // optional config values
      // host - defaults to "localhost"
      // port - defaults to 8545
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
    }
  }
};
