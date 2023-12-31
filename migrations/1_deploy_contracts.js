const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("identitySystem");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
};
