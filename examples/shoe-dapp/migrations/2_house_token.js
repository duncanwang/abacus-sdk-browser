const HouseToken = artifacts.require("HouseToken");

module.exports = async deployer => {
  await deployer.deploy(HouseToken);
}