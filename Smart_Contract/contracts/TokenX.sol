// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

// import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
contract TokenX{
    using SafeMath for uint256;

    string public name = "TokenX";
    string public symbol = "X";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from , address indexed to , uint256 value);
    event  Approval(address indexed owner,address indexed spender,uint256 value);
  
    // we can set the totatal supply tokens for our exchange app
    constructor(uint256 _totalsupply) {
        totalSupply = _totalsupply*(10**decimals);
        // totalSupply = _totalsupply;
        balanceOf[msg.sender] = totalSupply;
    }

    
    function transfer(address _to,uint256 _value) public returns(bool){
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    // genrealised to use it again and again to do token transfer
    function _transfer(address _from ,address _to , uint256 _value) internal{
        require(_to != address(0));
         balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value); 
    }
   
     function approve(address _spender,uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
     }
   
    function transferFrom(address _from , address _to ,uint256 _value) public returns(bool success){
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
       _transfer(_from, _to, _value);
       return true;
    }


}