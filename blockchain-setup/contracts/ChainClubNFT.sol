// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainClubNFT
 * @dev ChainClub Membership NFT Contract
 * @author ChainClub Team
 */
contract ChainClubNFT is ERC721, ERC721URIStorage, Ownable {
    // Simple counter instead of Counters library
    uint256 private _tokenIds;
    
    // Base URI for token metadata
    string private _baseTokenURI;
    
    // Minting fee (in wei)
    uint256 public mintingFee = 0.01 ether;
    
    // Maximum supply
    uint256 public maxSupply = 10000;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintingFeeUpdated(uint256 newFee);
    event BaseURIUpdated(string newBaseURI);
    
    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     * @param baseURI Base URI for token metadata
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Mint a new NFT (only owner can mint)
     * @param to Address to mint to
     * @param metadataURI Token metadata URI
     * @return tokenId The ID of the newly minted token
     */
    function mintNFT(address to, string memory metadataURI) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        require(_tokenIds < maxSupply, "Max supply reached");
        require(to != address(0), "Cannot mint to zero address");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        emit NFTMinted(to, newTokenId, metadataURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Public mint function (requires fee)
     * @param metadataURI Token metadata URI
     * @return tokenId The ID of the newly minted token
     */
    function publicMint(string memory metadataURI) 
        public 
        payable 
        returns (uint256) 
    {
        require(msg.value >= mintingFee, "Insufficient minting fee");
        require(_tokenIds < maxSupply, "Max supply reached");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        emit NFTMinted(msg.sender, newTokenId, metadataURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Get total supply
     * @return Total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Get token URI
     * @param tokenId Token ID
     * @return Token URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Set base URI (only owner)
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }
    
    /**
     * @dev Set minting fee (only owner)
     * @param newFee New minting fee in wei
     */
    function setMintingFee(uint256 newFee) public onlyOwner {
        mintingFee = newFee;
        emit MintingFeeUpdated(newFee);
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Override supportsInterface function
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
