import { BigNumber, ethers } from "ethers";
import React, { createContext, useState, useEffect } from "react";
import {
  AmmAddress,
  TokenXAddress,
  TokenYAddress,
  TokenXAbi,
  TokenYAbi,
  AmmAbi,
} from "../Constants/constants"; 
import { groupBy } from "lodash";
import { values } from "lodash";


export const AmmsContext = createContext();
const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const TokenXContract = new ethers.Contract(TokenXAddress, TokenXAbi, signer);
  const TokenYContract = new ethers.Contract(TokenYAddress, TokenYAbi, signer);
  const AmmContract = new ethers.Contract(AmmAddress, AmmAbi, signer);

  return { TokenXContract, TokenYContract, AmmContract, provider };
};

const AMMProvider = (children) => {
  let currentadd = "";
  const [CurrentAccount, setCurrentAccount] = useState("");
  const [TokenXPrice, setTokenXPrice] = useState(1);
  const [TokenYPrice, setTokenYPrice] = useState(1);
  const [PercentX, setPercentX] = useState({ text: "", arrow: "", percent: 1,timestamp: ''});
  const [PercentY, setPercentY] = useState({ text: "", arrow: "", percent: 1,timestamp:'' });
  const [Graphlabel, setGraphlabel] = useState({PriceX:0,PriceY:0,timestampxy:0})
  const [names, setnames] = useState([]);
  const [countss, setcountss] = useState([])
  const [Tokensaftercalac, setTokensaftercalac] = useState({
    tokens1: 0,
    tokens2: 0,
    tokens3: 0,
    tokens4: 0,
    tokens5: 0,
    tokens6: 0,
  });
  const [input, setinput] = useState({
    tokens1: 0,
    tokens2: 0,
    tokens3: 0,
    tokens4: 0,
    tokens5: 0,
    tokens6: 0,
  });

  // let x =  Web3.utils.toBN(18);
  // console.log(x);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
      if (accounts.length) {
        console.log(accounts[0]);
        setCurrentAccount(accounts[0]);
        currentadd = accounts[0];
        console.log(currentadd);
        getEthereumContract();
      GetPriceofAllToken();
      BarGraph();
      } else {
        console.log("no ethreum accounts");
        // change here

  
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      setCurrentAccount(accounts[0]);
      
      currentadd = accounts[0];
      console.log(currentadd);
      getEthereumContract();
      GetPriceofAllToken();
      BarGraph();
      GetGraphlabel();
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object.");
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
    GetGraphlabel();
  },[]);

  const GetPriceofAllToken = async () => {
    let preXprice = TokenXPrice;
    let preYprice = TokenYPrice;

    const { AmmContract } = getEthereumContract();
    const currentXprice = await AmmContract.priceofTokenX();
    console.log(currentXprice);
    let x = await ethers.BigNumber.from(10 ** 9);
    x = x.mul(x);
    x = x.mul(x);
    console.log(x);
    let PriceX = currentXprice.toString();
    x = x.toString();
    PriceX = PriceX / x;
    setTokenXPrice(PriceX);
    // PriceY

    const currentYprice = await AmmContract.priceofTokenY();
    console.log(currentYprice);
    let y = await ethers.BigNumber.from(10 ** 9);
    y = y.mul(y);
    y = y.mul(y);
    // console.log(y);
    let PriceY = currentYprice.toString();
    y = y.toString();
    PriceY = PriceY / y;
    setTokenYPrice(PriceY);
    // date and time from timestamp
    let datex = await AmmContract.Xtimestamp();
    console.log(datex.toNumber()*1000);
        datex = new Date(datex.toNumber()*1000);
        var min = String(datex.getMinutes()).padStart(2,'0');
       var hours = String(datex.getHours()).padStart(2,'0');
       var secnd = String(datex.getSeconds()).padStart(2,'0');
        // console.log(datex);
    let givedatex = `${hours}:${min}:${secnd}\u00A0\u00A0\u00A0   ${datex.getDate()}/${datex.getMonth()+1}/${datex.getFullYear()}`

        // console.log(datex);
    let datey = await AmmContract.Ytimestamp();
        datey = new Date(datey.toNumber()*1000);
        var minss = String(datey.getMinutes()).padStart(2,'0');
        var hoursss = String(datey.getHours()).padStart(2,'0');
        var secndss = String(datey.getSeconds()).padStart(2,'0');
        // console.log(datey);
    let givedatey = `${hoursss}:${minss}:${secndss} \u00A0\u00A0\u00A0  ${datey.getDate()}/${datey.getMonth()+1}/${datey.getFullYear()}`
    // Calculating Percentage for it and up and down arrow
    let percentX = (PriceX - preXprice) / preXprice;

    if (percentX >= 0) {
      setPercentX({ text: "success", arrow: "up", percent: percentX ,timestamp:givedatex});
    } else {
      setPercentX({ text: "warning", arrow: "down", percent: -percentX ,timestamp:givedatex});
    }

    let percentY = (PriceY - preYprice) / preYprice;

    if (percentY >= 0) {
      setPercentY({ text: "success", arrow: "up", percent: percentY,timestamp:givedatey });
    } else {
      setPercentY({ text: "warning", arrow: "down", percent: -percentY, timestamp:givedatey });
    }
    // GetGraphlabel();
  };
  const tellhowmuchtoken = (i, noft) => {
    console.log(i, noft.target.value);
    noft = noft.target.value;
    if (i === 1) {
      let res = noft * 0.999;
      let tokens = res / TokenXPrice;
      console.log(tokens);
      setTokensaftercalac({
        tokens1: tokens,
        tokens2: Tokensaftercalac.tokens2,
        tokens3: Tokensaftercalac.tokens3,
        tokens4: Tokensaftercalac.tokens4,
        tokens5: Tokensaftercalac.tokens5,
        tokens6: Tokensaftercalac.tokens6,
      });
      setinput({
        tokens1: noft,
        tokens2: input.tokens2,
        tokens3: input.tokens3,
        tokens4: input.tokens4,
        tokens5: input.tokens5,
        tokens6: input.tokens6,
      });
      return tokens;
    }
    if (i === 2) {
      let tokens = noft * TokenXPrice;
      tokens = tokens * 0.999;
      setTokensaftercalac({
        tokens2: tokens,
        tokens1: Tokensaftercalac.tokens1,
        tokens3: Tokensaftercalac.tokens3,
        tokens4: Tokensaftercalac.tokens4,
        tokens5: Tokensaftercalac.tokens5,
        tokens6: Tokensaftercalac.tokens6,
      });
      setinput({
        tokens2: noft,
        tokens1: input.tokens1,
        tokens3: input.tokens3,
        tokens4: input.tokens4,
        tokens5: input.tokens5,
        tokens6: input.tokens6,
      });
      return tokens;
    }
    if (i === 3) {
      let res = noft * 0.999;
      let tokens = res / TokenYPrice;
      setTokensaftercalac({
        tokens3: tokens,
        tokens2: Tokensaftercalac.tokens2,
        tokens1: Tokensaftercalac.tokens1,
        tokens4: Tokensaftercalac.tokens4,
        tokens5: Tokensaftercalac.tokens5,
        tokens6: Tokensaftercalac.tokens6,
      });
      setinput({
        tokens3: noft,
        tokens2: input.tokens2,
        tokens1: input.tokens1,
        tokens4: input.tokens4,
        tokens5: input.tokens5,
        tokens6: input.tokens6,
      });
    }
    if (i === 4) {
      let tokens = noft * TokenYPrice;
      tokens = tokens * 0.999;
      setTokensaftercalac({
        tokens4: tokens,
        tokens2: Tokensaftercalac.tokens2,
        tokens3: Tokensaftercalac.tokens3,
        tokens1: Tokensaftercalac.tokens1,
        tokens5: Tokensaftercalac.tokens5,
        tokens6: Tokensaftercalac.tokens6,
      });
      setinput({
        tokens4: noft,
        tokens2: input.tokens2,
        tokens3: input.tokens3,
        tokens1: input.tokens1,
        tokens5: input.tokens5,
        tokens6: input.tokens6,
      });
    }
    if (i === 5) {
      let res = noft * TokenXPrice;
      res = res * 0.999;
      let tokens = res / TokenYPrice;
      setTokensaftercalac({
        tokens5: tokens,
        tokens2: Tokensaftercalac.tokens2,
        tokens3: Tokensaftercalac.tokens3,
        tokens4: Tokensaftercalac.tokens4,
        tokens1: Tokensaftercalac.tokens1,
        tokens6: Tokensaftercalac.tokens6,
      });
      setinput({
        tokens5: noft,
        tokens2: input.tokens2,
        tokens3: input.tokens3,
        tokens4: input.tokens4,
        tokens1: input.tokens1,
        tokens6: input.tokens6,
      });
    }
    if (i === 6) {
      let res = noft * TokenYPrice;
      res = res * 0.999;
      let tokens = res / TokenXPrice;
      setTokensaftercalac({
        tokens6: tokens,
        tokens2: Tokensaftercalac.tokens2,
        tokens3: Tokensaftercalac.tokens3,
        tokens4: Tokensaftercalac.tokens4,
        tokens5: Tokensaftercalac.tokens5,
        tokens1: Tokensaftercalac.tokens1,
      });
      setinput({
        tokens6: noft,
        tokens2: input.tokens2,
        tokens3: input.tokens3,
        tokens4: input.tokens4,
        tokens5: input.tokens5,
        tokens1: input.tokens1,
      });
    }
  };
  const HandleTransactions = async (i, e) => {
    const { AmmContract ,TokenXContract,TokenYContract} = getEthereumContract();
    // console.log(e);
    if (i === 1) {
      let result = await AmmContract.BuyTokenX(TokenXAddress, e,{value:e});
      let man = await result.wait()
      // console.log(await result.wait());
      if (man.confirmations === 1) {
        GetPriceofAllToken();
        BarGraph();
        GetGraphlabel();
      }
    }
    if (i === 2) {
      let x = await TokenXContract.approve(AmmAddress,e)
      let result = await AmmContract.SellTokenX(TokenXAddress, e);
      let man = await result.wait()
      // console.log(await result.wait());
      if (man.confirmations === 1) {
        GetPriceofAllToken();
        BarGraph();
        GetGraphlabel();
      }
     
    }
    if (i === 3) {
      let result = await AmmContract.BuyTokenY(TokenYAddress, e,{value:e});
      let man = await result.wait()
      // console.log(await result.wait());
      if (man.confirmations === 1) {
        GetPriceofAllToken();
        BarGraph();
        GetGraphlabel();
      }
    }
    if (i === 4) {
      let x = await TokenYContract.approve(AmmAddress,e)
      let result = await AmmContract.SellTokenY(TokenYAddress, e);
      let man = await result.wait()
      // console.log(result);
      if (man.confirmations === 1) {
        GetPriceofAllToken();
        BarGraph();
        GetGraphlabel();
      }
    }
    if (i === 5) {
      let x = await TokenXContract.approve(AmmAddress,e)
      let result = await AmmContract.ExchangeTokenX(TokenXAddress,TokenYAddress, e);
      let man = await result.wait()
      // console.log(result);
      if (man.confirmations === 1) {
        GetPriceofAllToken();
        BarGraph();
        GetGraphlabel();
      }
    }
    if (i === 6) {
      let x = await TokenYContract.approve(AmmAddress,e)
      let result = await AmmContract.ExchangeTokenY(TokenXAddress,TokenYAddress ,e);
      let man = await result.wait()
      // console.log(result);
      if (man.confirmations === 1) {
        GetPriceofAllToken();
        BarGraph();
        GetGraphlabel();
      }
    }
    GetPriceofAllToken();
    GetPriceofAllToken();
    BarGraph();
    GetGraphlabel();
  };

  const GetGraphlabel = async() =>{
    const {AmmContract} = getEthereumContract();
    // let r = await AmmContract.Graphs(0);
     let i = 1;
    let priceX = [];
    let priceY = [];
    let timestampXY = [];
    // }
    // console.log("i am in");
    while (true) {
      // console.log("in loop");
      let r = await AmmContract.Graphs(i);
      // console.log(r.timestamp);
      if (r.timestamp.toNumber() === 0) {
        // console.log("breakloop");
        break;
      }
      else{
        // console.log("nonbeakloop");
        let y = await ethers.BigNumber.from(10 ** 9);
        y = y.mul(y);
        y = y.mul(y);
        let priceofx = r.PriceOfX;
        let bign = BigNumber.from(priceofx.toString())
        bign = bign.toString();
        y = y.toString()
         priceofx = bign/(y) 
        priceX.push(priceofx);
        // 
        let priceofy = r.PriceOfY;
        let bsnd = BigNumber.from(priceofy.toString())
        bsnd = bsnd.toString();
        priceofy = bsnd/(y)
        priceY.push(priceofy);
        let damte = r.timestamp.toNumber();
        let times = new Date(damte*1000);
        console.log(times);
        let timehrs = times.getHours();
        let timemin = times.getMinutes();
        let dateday = times.getDate();
        let datemon = times.getMonth();
      
          timestampXY.push( dateday+'/'+(datemon+1) + '  ' + timehrs+ ':' + timemin);
        
        i++;
      }

    }
    // settimeStamp(timestamp)
    setGraphlabel({PriceX:priceX,PriceY:priceY,timestampxy:timestampXY})
    console.log(priceX,priceY,timestampXY);
  }
  // BarGraph
  const BarGraph = async()=>{
    const {AmmContract} = getEthereumContract();
    // let r = await AmmContract.Graphs(0);
     let i = 1;
    let timestamp = [];
    // }
    // console.log("i am in");
    while (true) {
      // console.log("in loop");
      let r = await AmmContract.Graphs(i);
      console.log(r.timestamp);
      if (r.timestamp.toNumber() === 0) {
        // console.log("breakloop");
        break;
      }
      else{
        // console.log("x");
        let damte = r.timestamp.toNumber();
        let times = new Date(damte*1000);
        let time = times.getHours();
        var currenttime = new Date();
        //  console.log(currenttime.getDay());
        //  console.log(times.getDay());
        if (times.getDay() === currenttime.getDay()) {
          // console.log("in ifse");
          timestamp.push(time);
        }
        i++;
      }

    }
    // settimeStamp(timestamp)
    // console.log(timestamp);
    // const data = ["apple", "banana", "apple", "orange", "grapes", "mango", "banana"];
      //  console.log(values(groupBy(timestamp)));

     const result = values(groupBy(timestamp)).map( d=>
          ({name: d[0], count: d.length})
     )
       let name = [result.length];
       let counts = [result.length];
      for (let i = 0; i < result.length; i++) {
        // console.log("00000000000000000000000000000000000000000000000000000000000000");
            name[i] = result[i].name;
            counts[i] = result[i].count;
      };

      for (let i = 0; i < name.length; i++) {
        var ampm = name[i] >= 12 ? 'PM' : 'AM';
        console.log(name[i]);
        // console.log("herer in the loooooop");
        name[i] = name[i] % 12;
        name[i] = name[i] ? name[i] : 12; 
         name[i] = name[i] + ampm;
      }
      setnames(name);
      setcountss(counts);
      // console.log(names,counts);
  } 
  

  return (
    <AmmsContext.Provider
      value={{
        CurrentAccount,
        TokenXPrice,
        TokenYPrice,
        PercentX,
        PercentY,
        tellhowmuchtoken,
        Tokensaftercalac,
        HandleTransactions,
        input,
        connectWallet,
        names,
        countss,
        Graphlabel
      }}
      {...children}
    />
  );
};

export { AMMProvider };
