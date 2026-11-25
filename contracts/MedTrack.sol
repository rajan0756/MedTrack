// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedTrack {

    // ============================================
    // ROLES AND ACCESS CONTROL
    // ============================================

    enum Role {
        None,
        Admin,
        Manufacturer,
        Distributor,
        Warehouse,
        Pharmacy
    }

    address public admin;
    mapping(address => Role) public participantRoles;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRole(Role _role) {
        require(participantRoles[msg.sender] == _role, "Unauthorized role");
        _;
    }

    constructor() {
        admin = msg.sender;
        participantRoles[msg.sender] = Role.Admin;
    }

    event RoleAssigned(address indexed participant, Role role);
    event RoleRevoked(address indexed participant);

    function registerParticipant(
        address _participant,
        Role _role
    ) external onlyAdmin {
        require(_participant != address(0), "Invalid address");
        require(_participant != admin, "Cannot change admin role");
        require(_role != Role.None && _role != Role.Admin, "Invalid role");

        participantRoles[_participant] = _role;

        emit RoleAssigned(_participant, _role);
    }

    function revokeParticipant(address _participant) external onlyAdmin {
        require(_participant != admin, "Cannot revoke admin");

        participantRoles[_participant] = Role.None;

        emit RoleRevoked(_participant);
    }

    function getParticipantRole(address _participant)
        external
        view
        returns (Role)
    {
        return participantRoles[_participant];
    }

    // ============================================
    // MEDICINE STRUCTURES
    // ============================================

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

    event MedicineCreated(
        string indexed batchId,
        string name,
        address indexed manufacturer
    );

    event MedicineTransferred(
        string indexed batchId,
        address indexed from,
        address indexed to,
        string action
    );

    // ============================================
    // MANUFACTURER FUNCTIONS
    // ============================================

    function createMedicine(
        string memory _batchId,
        string memory _name,
        string memory _manufacturer,
        uint256 _expiryDate,
        uint256 _quantity
    ) external onlyRole(Role.Manufacturer) {

        require(!medicines[_batchId].isActive, "Batch already exists");
        require(bytes(_batchId).length > 0, "Batch ID required");
        require(_expiryDate > block.timestamp, "Invalid expiry date");
        require(_quantity > 0, "Quantity must be greater than zero");

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

    function dispatchFromManufacturer(
        string memory _batchId,
        address _distributor,
        string memory _location
    ) external onlyRole(Role.Manufacturer) {

        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(
            medicines[_batchId].currentOwner == msg.sender,
            "Not current owner"
        );
        require(
            participantRoles[_distributor] == Role.Distributor,
            "Recipient is not a distributor"
        );

        medicines[_batchId].currentOwner = _distributor;

        medicineHistory[_batchId].push(HistoryEntry({
            action: "Dispatched to Distributor",
            from: msg.sender,
            to: _distributor,
            timestamp: block.timestamp,
            location: _location,
            notes: "Manufacturer dispatched medicine"
        }));

        emit MedicineTransferred(
            _batchId,
            msg.sender,
            _distributor,
            "Dispatched to Distributor"
        );
    }

    // ============================================
    // DISTRIBUTOR FUNCTIONS
    // ============================================

    function receiveAtDistributor(
        string memory _batchId,
        string memory _location
    ) external onlyRole(Role.Distributor) {

        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(
            medicines[_batchId].currentOwner == msg.sender,
            "Medicine not dispatched to this distributor"
        );

        medicineHistory[_batchId].push(HistoryEntry({
            action: "Received at Distributor",
            from: msg.sender,
            to: msg.sender,
            timestamp: block.timestamp,
            location: _location,
            notes: "Distributor confirmed receipt"
        }));
    }

    function dispatchFromDistributor(
        string memory _batchId,
        address _warehouse,
        string memory _location
    ) external onlyRole(Role.Distributor) {

        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(
            medicines[_batchId].currentOwner == msg.sender,
            "Not current owner"
        );
        require(
            participantRoles[_warehouse] == Role.Warehouse,
            "Recipient is not a warehouse"
        );

        medicines[_batchId].currentOwner = _warehouse;

        medicineHistory[_batchId].push(HistoryEntry({
            action: "Dispatched to Warehouse",
            from: msg.sender,
            to: _warehouse,
            timestamp: block.timestamp,
            location: _location,
            notes: "Distributor dispatched to warehouse"
        }));

        emit MedicineTransferred(
            _batchId,
            msg.sender,
            _warehouse,
            "Dispatched to Warehouse"
        );
    }

    // ============================================
    // WAREHOUSE FUNCTIONS
    // ============================================

    function receiveAtWarehouse(
        string memory _batchId,
        string memory _location
    ) external onlyRole(Role.Warehouse) {

        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(
            medicines[_batchId].currentOwner == msg.sender,
            "Medicine not dispatched to this warehouse"
        );

        medicineHistory[_batchId].push(HistoryEntry({
            action: "Received at Warehouse",
            from: msg.sender,
            to: msg.sender,
            timestamp: block.timestamp,
            location: _location,
            notes: "Warehouse confirmed receipt"
        }));
    }

    function dispatchFromWarehouse(
        string memory _batchId,
        address _pharmacy,
        string memory _location
    ) external onlyRole(Role.Warehouse) {

        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(
            medicines[_batchId].currentOwner == msg.sender,
            "Not current owner"
        );
        require(
            participantRoles[_pharmacy] == Role.Pharmacy,
            "Recipient is not a pharmacy"
        );

        medicines[_batchId].currentOwner = _pharmacy;

        medicineHistory[_batchId].push(HistoryEntry({
            action: "Dispatched to Pharmacy",
            from: msg.sender,
            to: _pharmacy,
            timestamp: block.timestamp,
            location: _location,
            notes: "Warehouse dispatched to pharmacy"
        }));

        emit MedicineTransferred(
            _batchId,
            msg.sender,
            _pharmacy,
            "Dispatched to Pharmacy"
        );
    }

    // ============================================
    // PHARMACY FUNCTIONS
    // ============================================

    function receiveAtPharmacy(
        string memory _batchId,
        string memory _location
    ) external onlyRole(Role.Pharmacy) {

        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(
            medicines[_batchId].currentOwner == msg.sender,
            "Medicine not dispatched to this pharmacy"
        );

        medicineHistory[_batchId].push(HistoryEntry({
            action: "Received at Pharmacy",
            from: msg.sender,
            to: msg.sender,
            timestamp: block.timestamp,
            location: _location,
            notes: "Pharmacy confirmed receipt"
        }));
    }

    function sellToPatient(
        string memory _batchId,
        string memory _patientName
    ) external onlyRole(Role.Pharmacy) {

        require(medicines[_batchId].isActive, "Medicine does not exist");
        require(
            medicines[_batchId].currentOwner == msg.sender,
            "Not current owner"
        );
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

        emit MedicineTransferred(
            _batchId,
            msg.sender,
            address(0),
            "Sold"
        );
    }

    // ============================================
    // VERIFICATION FUNCTIONS
    // ============================================

    function verifyMedicine(string memory _batchId)
        external
        view
        returns (
            bool isValid,
            string memory batchId,
            string memory name,
            string memory manufacturer,
            string memory status,
            uint256 expiryDate
        )
    {
        require(medicines[_batchId].isActive, "Medicine does not exist");

        Medicine memory med = medicines[_batchId];

        bool valid = isVerified[_batchId] &&
            block.timestamp < med.expiryDate;

        string memory stat;

        if (!isVerified[_batchId]) {
            stat = "Counterfeit";
        } else if (block.timestamp >= med.expiryDate) {
            stat = "Expired";
        } else {
            stat = "Authentic";
        }

        return (
            valid,
            med.batchId,
            med.name,
            med.manufacturer,
            stat,
            med.expiryDate
        );
    }

    function getHistory(string memory _batchId)
        external
        view
        returns (HistoryEntry[] memory)
    {
        return medicineHistory[_batchId];
    }

    function getCurrentOwner(string memory _batchId)
        external
        view
        returns (address)
    {
        return medicines[_batchId].currentOwner;
    }

    // ============================================
    // COUNTERFEIT REPORTING
    // ============================================

    function reportCounterfeit(
        string memory _batchId,
        string memory _reason
    ) external {

        require(
            participantRoles[msg.sender] != Role.None &&
            participantRoles[msg.sender] != Role.Admin,
            "Only registered participants can report"
        );

        require(medicines[_batchId].isActive, "Medicine does not exist");

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