// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ChainClubNFT
 * @dev ERC-721 token representing ChainClub membership cards
 * @custom:security-contact security@chainclub.com
 */
contract ChainClubNFT is ERC721, ERC721URIStorage, Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    
    // Base URI for token metadata
    string private _baseTokenURI;
    
    // Maximum supply of NFTs
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Minting price (0 for free minting)
    uint256 public mintPrice = 0;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event BaseURIUpdated(string newBaseURI);
    event MintPriceUpdated(uint256 newPrice);
    
    // Mapping to track if an address has already minted
    mapping(address => bool) public hasMinted;
    
    // Mapping to track token metadata
    mapping(uint256 => string) private _tokenURIs;
    
    // Modifiers
    modifier onlyMinter() {
        require(msg.sender == owner() || msg.sender == address(this), "Not authorized to mint");
        _;
    }
    
    modifier notMintedBefore(address to) {
        require(!hasMinted[to], "Address has already minted an NFT");
        _;
    }
    
    modifier withinSupplyLimit() {
        require(_tokenIds.current() < MAX_SUPPLY, "Maximum supply reached");
        _;
    }
    
    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     * @param baseTokenURI Base URI for token metadata
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }
    
    /**
     * @dev Mint a new NFT to the specified address
     * @param to Address to mint the NFT to
     * @param tokenURI URI for the token metadata
     * @return tokenId The ID of the newly minted token
     */
    function mint(address to, string memory tokenURI) 
        public 
        onlyMinter 
        notMintedBefore(to) 
        withinSupplyLimit 
        whenNotPaused 
        nonReentrant 
        returns (uint256) 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        hasMinted[to] = true;
        
        emit NFTMinted(to, newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Batch mint NFTs to multiple addresses
     * @param recipients Array of recipient addresses
     * @param tokenURIs Array of token URIs
     */
    function batchMint(address[] memory recipients, string[] memory tokenURIs) 
        public 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        require(recipients.length == tokenURIs.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (!hasMinted[recipients[i]] && _tokenIds.current() < MAX_SUPPLY) {
                mint(recipients[i], tokenURIs[i]);
            }
        }
    }
    
    /**
     * @dev Get the total number of tokens minted
     * @return Total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Get the remaining supply
     * @return Remaining supply
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - _tokenIds.current();
    }
    
    /**
     * @dev Check if an address has minted an NFT
     * @param account Address to check
     * @return True if the address has minted
     */
    function hasAddressMinted(address account) public view returns (bool) {
        return hasMinted[account];
    }
    
    /**
     * @dev Get all tokens owned by an address
     * @param owner Address to get tokens for
     * @return Array of token IDs
     */
    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (ownerOf(i) == owner) {
                tokens[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokens;
    }
    
    /**
     * @dev Update the base URI for token metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    /**
     * @dev Update the minting price
     * @param newPrice New minting price
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Emergency function to transfer ownership
     * @param newOwner New owner address
     */
    function emergencyTransferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        _transferOwnership(newOwner);
    }
    
    // Override functions
    
    /**
     * @dev Override _baseURI function
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Override _burn function
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    /**
     * @dev Override tokenURI function
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override supportsInterface function
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Override _beforeTokenTransfer function
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Accept ETH payments
    }
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {
        // Fallback function
    }
}
