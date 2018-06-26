module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },

    rinkeby: {
      host: "10.0.128.6",
      port: 8545,
      gasPrice: 5000000000,
      network_id: 4
    }
  },

  optimizer: {
    enabled: true,
    runs: 500
  }
};