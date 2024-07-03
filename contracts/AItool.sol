// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

contract AItool {
    struct ToolDetail {
        string name;
        string symbol;
        string api;
        address developer;
        uint256 hourlyRent;
        uint256 dailyRent;
        uint256 weeklyRent;
        uint256 monthlyRent;
        mapping(address => bool) rentedUsers;
        mapping(address => uint256) rentStartTimes;
        mapping(address => uint256) rentalDuration; // Store the duration for which the tool is rented
    }

    mapping(uint256 => ToolDetail) public aiTools;
    uint256 public nextID = 1;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Events
    event AIToolRented(string name, address user, uint256 rentalDuration);
    event RentalFeeDeducted(string name, address user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Function to register a new AI tool
    function registerAITool(
        string memory _name,
        string memory _symbol,
        string memory _api,
        uint256 _hourlyRent,
        uint256 _dailyRent,
        uint256 _weeklyRent,
        uint256 _monthlyRent
    ) external {
        require(checkingName(_name) == 0, "AI tool name already registered");
        require(checkingSymbol(_symbol) == 0, "AI tool symbol already registered");
        require(checkingAPI(_api) == 0, "AI tool API already registered");
        uint256 newID = nextID;

        aiTools[newID].name = _name;
        aiTools[newID].symbol = _symbol;
        aiTools[newID].api = _api;
        aiTools[newID].developer = msg.sender;
        aiTools[newID].hourlyRent = _hourlyRent;
        aiTools[newID].dailyRent = _dailyRent;
        aiTools[newID].weeklyRent = _weeklyRent;
        aiTools[newID].monthlyRent = _monthlyRent;

        nextID++;
    }

    // Function to rent an AI tool with a specified duration
    function rentAITool(uint256 _id, uint256 _duration) external payable {
        require(_id < nextID, "AI tool not registered");
        require(aiTools[_id].developer != address(0), "AI tool not registered");
        require(!aiTools[_id].rentedUsers[msg.sender], "User already rented this AI tool");

        uint256 rentFee;
        if (_duration == 1 hours) {
            rentFee = aiTools[_id].hourlyRent;
        } else if (_duration == 1 days) {
            rentFee = aiTools[_id].dailyRent;
        } else if (_duration == 1 weeks) {
            rentFee = aiTools[_id].weeklyRent;
        } else if (_duration == 30 days) {
            rentFee = aiTools[_id].monthlyRent;
        } else {
            revert("Invalid rental duration");
        }

        require(msg.value >= rentFee, "Insufficient payment");

        // Mark user as rented
        aiTools[_id].rentedUsers[msg.sender] = true;
        // Record rental start time and duration
        aiTools[_id].rentStartTimes[msg.sender] = block.timestamp;
        aiTools[_id].rentalDuration[msg.sender] = _duration;

        payable(address(this)).transfer(rentFee);

        // Emit event
        emit AIToolRented(aiTools[_id].name, msg.sender, _duration);
    }

    // Internal function to check rental expiration and renew if necessary
    function checkRentalExpiration(uint256 _id) internal {
        require(aiTools[_id].rentedUsers[msg.sender], "User has not rented this AI tool");

        uint256 rentalStart = aiTools[_id].rentStartTimes[msg.sender];
        uint256 rentalEnd = rentalStart + aiTools[_id].rentalDuration[msg.sender];

        if (block.timestamp > rentalEnd) {
            // Rental period has expired, mark user as not rented
            aiTools[_id].rentedUsers[msg.sender] = false;
        } else if (block.timestamp == rentalEnd) {
            // Check if user has enough balance for renewal
            uint256 rentFee = aiTools[_id].monthlyRent; // Default to monthly rent for renewal
            if (address(this).balance >= rentFee) {
                // Automatically renew rental
                aiTools[_id].rentStartTimes[msg.sender] = block.timestamp;

                payable(address(this)).transfer(rentFee);
                // Emit event
                emit AIToolRented(aiTools[_id].name, msg.sender, 30 days);
            } else {
                revert("Insufficient balance for renewal");
            }
        }
    }

    // Internal function to check if a tool name is already registered
    function checkingName(string memory _name) private view returns (uint256) {
        for (uint256 i = 1; i < nextID; i++) {
            if (keccak256(abi.encodePacked(aiTools[i].name)) == keccak256(abi.encodePacked(_name))) {
                return i;
            }
        }
        return 0;
    }

    // Internal function to check if a tool symbol is already registered
    function checkingSymbol(string memory _symbol) private view returns (uint256) {
        for (uint256 i = 1; i < nextID; i++) {
            if (keccak256(abi.encodePacked(aiTools[i].symbol)) == keccak256(abi.encodePacked(_symbol))) {
                return i;
            }
        }
        return 0;
    }

    // Internal function to check if a tool API is already registered
    function checkingAPI(string memory _api) private view returns (uint256) {
        for (uint256 i = 1; i < nextID; i++) {
            if (keccak256(abi.encodePacked(aiTools[i].api)) == keccak256(abi.encodePacked(_api))) {
                return i;
            }
        }
        return 0;
    }
}
