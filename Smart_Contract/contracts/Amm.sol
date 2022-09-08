// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "./TokenX.sol";
import "./TokenY.sol";
// import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract Amm {
 
    using SafeMath for uint256;
    uint256 public priceofTokenX = (1 ether)*(1 ether);
    uint256 public priceofTokenY = (1 ether)*(1 ether);
    uint256 public fees;
    uint256 public TotalAssets ;
    uint256 public TotalXasset ;
    uint256 public TotalYAssets;
    uint256 public TokenXBalance ;
    uint256 public TokenYBalance;
    uint256 public Xtimestamp;
    uint256 public Ytimestamp;
    struct ForGraph{
        uint256 timestamp;
        uint256 PriceOfX;
        uint256 PriceOfY;
    }
    mapping(uint256 => ForGraph) public Graphs;
    uint256 OrderCount = 0 ;
    
    constructor(uint256 Tokenx,uint256 Tokeny,uint256 _fees){
        // TokenBalance[_tokenX] = _TokenX;
        // TokenBalance[_tokenY] = _TokenY;
        fees = _fees*(1 ether)/1000;
        
        TokenXBalance = Tokenx*(1 ether) ;
        TokenYBalance = Tokeny*(1 ether);
         TotalXasset = TokenXBalance.mul(priceofTokenX);
        TotalYAssets = TokenYBalance.mul(priceofTokenY);
        TotalAssets =TotalXasset + TotalYAssets;
       
    }
 

    function BuyTokenX(address _token , uint256 _amountofether) public payable {
        
        uint256 _amountofetherfortransaction = _amountofether - (fees*_amountofether)/(1 ether);
        uint256 tokentosend = (_amountofetherfortransaction * (1 ether)*(1 ether))/(priceofTokenX );
        require(TokenX(_token).balanceOf(address(this)) >= tokentosend,"Did not have enough tokens");
        require(msg.value == _amountofether);
        TokenXBalance = TokenXBalance.sub(tokentosend);
        updatePrice();
        TokenX(_token).transfer(msg.sender , tokentosend);
        Xtimestamp = block.timestamp;
        // Holdings[msg.sender][_token] = Holdings[msg.sender][_token].add(tokentosend);
    }

    function SellTokenX(address _token , uint256 _amountofTokenX) public {
        
        uint256 Tokenshouldget = TokenXBalance + _amountofTokenX;
        uint256 amounttosend = (_amountofTokenX.mul(priceofTokenX))/((1 ether) * (1 ether));
        uint256 sendamount =  amounttosend - (fees*amounttosend)/(1 ether); 
        require(address(this).balance >= sendamount,"Did not have enough Ethereum");  
        require(TokenX(_token).transferFrom(msg.sender, address(this), _amountofTokenX));
        require(TokenX(_token).balanceOf(address(this)) >= Tokenshouldget,"Did not get enough tokens");
        TokenXBalance = TokenXBalance.add(_amountofTokenX);
        updatePrice();
        Xtimestamp = block.timestamp;
         payable(msg.sender).transfer(sendamount);
    }
    // for token 
    function BuyTokenY(address _token , uint256 _amountofether) public payable {
        uint256 _amountofetherfortransaction = _amountofether - (fees*_amountofether)/(1 ether);
        uint256 tokentosend = (_amountofetherfortransaction * (1 ether)*(1 ether))/(priceofTokenY );
        require(TokenY(_token).balanceOf(address(this)) >= tokentosend,"Did not have enough tokens");
        require(msg.value >= _amountofether);
        TokenYBalance = TokenYBalance.sub(tokentosend);
        updatePrice();
        TokenY(_token).transfer(msg.sender , tokentosend);
        Ytimestamp = block.timestamp;
        // Holdings[msg.sender][_token] = Holdings[msg.sender][_token].add(tokentosend);
    }

    function SellTokenY(address _token , uint256 _amountofTokenY) public {
        
        uint256 Tokenshouldget = TokenYBalance + _amountofTokenY;
       uint256 amounttosend = (_amountofTokenY.mul(priceofTokenX))/((1 ether) * (1 ether));
        uint256 sendamount =  amounttosend - (fees*amounttosend)/(1 ether); 
        require(address(this).balance >= sendamount,"Did not have enough Ethereum"); 
        require(TokenY(_token).transferFrom(msg.sender, address(this), _amountofTokenY));   
        require(TokenY(_token).balanceOf(address(this)) >= Tokenshouldget,"Did not get enough tokens");
         TokenYBalance = TokenYBalance.add(_amountofTokenY);
         updatePrice();
         Ytimestamp = block.timestamp;
         payable(msg.sender).transfer(sendamount);
    } 

    function ExchangeTokenX( address _tokenX,address _tokenY , uint256 amountofTokens) public {
        uint256 amountofTokensgiven = TokenXBalance + amountofTokens;
        TokenX(_tokenX).transferFrom(msg.sender,address(this),amountofTokens);
        uint256 assetsgiven = amountofTokens*priceofTokenX;
        assetsgiven = assetsgiven.sub((assetsgiven.mul(fees))/(1 ether));
        uint256 Tokenstogive =  assetsgiven/priceofTokenY;
       require(TokenX(_tokenX).balanceOf(address(this)) >= amountofTokensgiven,"Did not get enough tokens");
       TokenXBalance = TokenXBalance.add(amountofTokens);
       TokenYBalance = TokenYBalance.sub(Tokenstogive);
       require(TokenY(_tokenY).balanceOf(address(this)) >= Tokenstogive,"Did not have enough tokens");
       TokenY(_tokenY).transfer(msg.sender, Tokenstogive);
       updatePrice();
       Xtimestamp = block.timestamp;
       Ytimestamp = block.timestamp;
    }

    function ExchangeTokenY( address _tokenX,address _tokenY , uint256 amountofTokens) public {
         uint256 amountofTokensgiven = TokenYBalance + amountofTokens;
        TokenY(_tokenY).transferFrom(msg.sender,address(this),amountofTokens);
        uint256 assetsgiven = amountofTokens*priceofTokenY;
        assetsgiven = assetsgiven.sub((assetsgiven.mul(fees))/(1 ether));
        uint256 Tokenstogive =  assetsgiven/priceofTokenX;
       require(TokenY(_tokenY).balanceOf(address(this)) >= amountofTokensgiven,"Did not get enough tokens");
       TokenYBalance = TokenYBalance.add(amountofTokens);
       TokenXBalance = TokenXBalance.sub(Tokenstogive);
       require(TokenX(_tokenX).balanceOf(address(this)) >= Tokenstogive,"Did not have enough tokens");
       TokenX(_tokenX).transfer(msg.sender, Tokenstogive);
       updatePrice();
       Xtimestamp = block.timestamp;
       Ytimestamp = block.timestamp;
    }

    function updatePrice() internal {
         priceofTokenX = (TotalXasset/TokenXBalance);
         priceofTokenY = (TotalYAssets/TokenYBalance);
         OrderCount = OrderCount.add(1);
         Graphs[OrderCount] = ForGraph(block.timestamp,priceofTokenX,priceofTokenY);
    }

   
}