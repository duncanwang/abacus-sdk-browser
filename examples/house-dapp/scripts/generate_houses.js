const flags = require('node-flag');
const HouseToken = artifacts.require('HouseToken');

const addresses = [
  '0x26919E2B62b5f2d21F3D412ac2FA68D61F3f766D',
  '0x22fDE5983913d51D6df0E833597eD3b21720D70f',
  '0xef1b140BFc9A805b160A3a7C4Bb457abBfC9c9bd'
];

const randomAddress = () => addresses[Math.floor(Math.random() * Math.floor(addresses.length))]

const genMetadataURI = (applicationId, contractAddress) =>
  tokenId => `https://api.abacusprotocol.com/api/v1/applications/${applicationId}/tokens/${contractAddress}/${tokenId}/metadata`

const main = async () => {
  const ht = await HouseToken.deployed();

  const applicationId = flags.get('app_id');
  if (applicationId == null)
    throw 'Must pass in application ID via "--app_id" flag'

  const metadataURI = genMetadataURI(applicationId, ht.address);

  const houses = await Promise.all(
    [...Array(100).keys()].map(async _ => {
      const res = await ht.mintTo(randomAddress());
      const tokenId = res.logs[0].args._tokenId;
      const uri = metadataURI(tokenId);
      await ht.setTokenURI(tokenId, uri);
      console.log(`Created token: ${tokenId} with metadataURI: ${uri}`);
      return tokenId;
    })
  );

  console.log(`Generated ${houses.length} houses.`);
}

module.exports = (cb) => main().catch(cb);