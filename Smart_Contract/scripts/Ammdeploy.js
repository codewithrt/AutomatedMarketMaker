
// const { ethers } = require("ethers");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const web3 = require("web3")
async function main() {
    [deployer,user1,user2] = await ethers.getSigners();
//   console.log(deployer);

    const Xtoken = await hre.ethers.getContractFactory("TokenX",deployer);
    const TokenX = await Xtoken.deploy(50050);
    await TokenX.deployed();
    console.log("TokenX deployed!!!!",TokenX.address);

    const Ytoken = await hre.ethers.getContractFactory("TokenY",deployer);
    const TokenY = await Ytoken.deploy(50050);
    await TokenY.deployed();
    console.log("TokenY deployed!!!!",TokenY.address);
   
    const Amms = await hre.ethers.getContractFactory("Amm",deployer);
    const Amm = await Amms.deploy(50000,50000,1);
    await Amm.deployed();
    console.log("Amm deployed!!!!",Amm.address);
    // const AMMCONTRACT = Amm.address.toString();
    
    const alsoint = BigInt(5000000000000);
    const onemore = BigInt(10000000000)
    let me = ethers.BigNumber.from(onemore);
    let x = ethers.BigNumber.from(alsoint)
      x = x.mul(me)
      //  tokensX trasnfeerred
   await TokenX.connect(deployer).transfer(Amm.address,x);
  //  console.log(await TokenX.balanceOf(Amm.address));
  //  console.log(await TokenX.totalSupply());
  //  tokensY transffered
   await TokenY.connect(deployer).transfer(Amm.address,x);
  //  console.log(await TokenY.balanceOf(Amm.address));
  //  Need to transfer the remaining tokens to users 
  const totrasn = BigInt(2500);
  const rest = BigInt(10**16);
  let re = ethers.BigNumber.from(totrasn);
  let res = ethers.BigNumber.from(rest);
  re = re.mul(res);
  // givng each user 1 and 2 25 ether coins for the transactions
  await TokenX.connect(deployer).transfer(user1.address,re);
  await TokenY.connect(deployer).transfer(user1.address,re);
  await TokenX.connect(deployer).transfer(user2.address,re);
  await TokenY.connect(deployer).transfer(user2.address,re);
  
  // giving smartcontract atleast 75ether for worst case;
  console.log(await TokenX.balanceOf(Amm.address));
  console.log(await TokenY.balanceOf(Amm.address));
  console.log(await Amm.TokenXBalance());
  console.log(await Amm.TokenYBalance());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
