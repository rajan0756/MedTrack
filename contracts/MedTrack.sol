// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedTrack {
    
    struct Medicine {
        string batchId;
        string name;
        string manufacturer;
        uint256 manufacturingDate;
        uint256 expiryDate;
        uint256 quantity;
        bool isActive;
        address currentOwner;
    }
    
    struct HistoryEntry {
        string action;
        address from;
        address to;
        uint256 timestamp;
        string location;
        string notes;
    }
    
    mapping(string => Medicine) public medicines;
    mapping(string => HistoryEntry[]) public medicineHistory;
    mapping(string => bool) public isVerified;
    
    event MedicineCreated(string indexed batchId, string name, address indexed manufacturer);
    event MedicineTransferred(string indexed batchId, address indexed from, address indexed to, string action);
    
    // ============================================
    // MANUFACTURER FUNCTIONS
    // ============================================
    
    function createMedicine(
        string memory _batchId,
        string memory _name,
        string memory _manufacturer,
        uint256 _expiryDate,
        uint256 _quantity
    ) external {
        require(!medicines[_batchId].isActive, "Batch already exists");
        
        medicines[_batchId] = Medicine({
            batchId: _batchId,
            name: _name,
            manufacturer: _manufacturer,
            manufacturingDate: block.timestamp,
            expiryDate: _expiryDate,
            quantity: _quantity,
            isActive: true,
            currentOwner: msg.sender
        });
        
        medicineHistory[_batchId].push(HistoryEntry({
            action: "Manufactured",
            from: address(0),
            to: msg.sender,
            timestamp: block.timestamp,
            location: "Factory",
            notes: "Medicine batch created"
        }));
        
        isVerified[_batchId] = true;
        emit MedicineCreated(_batchId, _name, msg.sender);
    }
    
    // ============================================
    // DISTRIBUTOR FUNCTIONS
    // ============================================
    
    function receiveAtDistributor(string memory _batchId, string memory _location) external {
        require(medicines[_batchId].isActive, "Medicine does not exist");
        
        address previousOwner = medicines[_batchId].currentOwner;
        
        medicineHistory[_batchId].push(HistoryEntry({
            action: "Received at Distributor",
            from: previousOwner,
            to: msg.sender,
            timestamp: block.timestamp,
            location: _location,
            notes: "Distributor received stock"
        }));
        
        medicines[_batchId].currentOwner = msg.sender;
        emit MedicineTransferred(_batchId, previousOwner, msg.sender, "Distributor Received");
    }
    
    function dispatchFromDistributor(
        string memory _batchId,
        address _warehouse,
        string memory _location
    ) external {
        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(msg.sender == medicines[_batchId].currentOwner, "Not owner");
        require(_warehouse != address(0), "Invalid warehouse");
        
        medicines[_batchId].currentOwner = _warehouse;
        
        medicineHistory[_batchId].push(HistoryEntry({
            action: "Dispatched to Warehouse",
            from: msg.sender,
            to: _warehouse,
            timestamp: block.timestamp,
            location: _location,
            notes: "Distributor dispatched to warehouse"
        }));
        
        emit MedicineTransferred(_batchId, msg.sender, _warehouse, "Dispatched to Warehouse");
    }
    
    // ============================================
    // WAREHOUSE FUNCTIONS
    // ============================================
    
    function receiveAtWarehouse(string memory _batchId, string memory _location) external {
        require(medicines[_batchId].isActive, "Medicine does not exist");
        
        address previousOwner = medicines[_batchId].currentOwner;
        
        medicineHistory[_batchId].push(HistoryEntry({
            action: "Received at Warehouse",
            from: previousOwner,
            to: msg.sender,
            timestamp: block.timestamp,
            location: _location,
            notes: "Warehouse received stock"
        }));
        
        medicines[_batchId].currentOwner = msg.sender;
        emit MedicineTransferred(_batchId, previousOwner, msg.sender, "Warehouse Received");
    }
    
    // ============================================
    // PHARMACY FUNCTIONS
    // ============================================
    
    function receiveAtPharmacy(string memory _batchId, string memory _location) external {
        require(medicines[_batchId].isActive, "Medicine does not exist");
        
        address previousOwner = medicines[_batchId].currentOwner;
        
        medicineHistory[_batchId].push(HistoryEntry({
            action: "Received at Pharmacy",
            from: previousOwner,
            to: msg.sender,
            timestamp: block.timestamp,
            location: _location,
            notes: "Pharmacy received stock"
        }));
        
        medicines[_batchId].currentOwner = msg.sender;
        emit MedicineTransferred(_batchId, previousOwner, msg.sender, "Pharmacy Received");
    }
    
    function sellToPatient(string memory _batchId, string memory _patientName) external {
        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(medicines[_batchId].quantity > 0, "No stock");
        
        medicines[_batchId].quantity -= 1;
        
        medicineHistory[_batchId].push(HistoryEntry({
            action: "Sold to Patient",
            from: msg.sender,
            to: address(0),
            timestamp: block.timestamp,
            location: "Pharmacy",
            notes: string(abi.encodePacked("Patient: ", _patientName))
        }));
        
        emit MedicineTransferred(_batchId, msg.sender, address(0), "Sold");
    }
    
    // ============================================
    // VERIFICATION FUNCTIONS
    // ============================================
    
    function verifyMedicine(string memory _batchId) external view returns (
        bool isValid,
        string memory batchId,
        string memory name,
        string memory manufacturer,
        string memory status,
        uint256 expiryDate
    ) {
        require(medicines[_batchId].isActive, "Medicine does not exist");
        
        Medicine memory med = medicines[_batchId];
        bool valid = isVerified[_batchId] && block.timestamp < med.expiryDate;
        
        string memory stat;
        if (!isVerified[_batchId]) stat = "Counterfeit";
        else if (block.timestamp >= med.expiryDate) stat = "Expired";
        else stat = "Authentic";
        
        return (valid, med.batchId, med.name, med.manufacturer, stat, med.expiryDate);
    }
    
    function getHistory(string memory _batchId) external view returns (HistoryEntry[] memory) {
        return medicineHistory[_batchId];
    }
    
    function getCurrentOwner(string memory _batchId) external view returns (address) {
        return medicines[_batchId].currentOwner;
    }
    
    // ============================================
    // COUNTERFEIT REPORTING
    // ============================================
    
    function reportCounterfeit(string memory _batchId, string memory _reason) external {
        isVerified[_batchId] = false;
        medicineHistory[_batchId].push(HistoryEntry({
            action: "Reported Counterfeit",
            from: msg.sender,
            to: address(0),
            timestamp: block.timestamp,
            location: "System",
            notes: _reason
        }));
    }
}