import { ethers } from 'ethers';

// ⚠️ REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const CONTRACT_ABI = [
    // Manufacturer
    "function createMedicine(string,string,string,uint256,uint256) external",
    
    // Distributor
    "function receiveAtDistributor(string,string) external",
    "function dispatchFromDistributor(string,address,string) external",
    
    // Warehouse
    "function receiveAtWarehouse(string,string) external",
    
    // Pharmacy
    "function receiveAtPharmacy(string,string) external",
    "function sellToPatient(string,string) external",
    
    // Verification
    "function verifyMedicine(string) external view returns (bool,string,string,string,string,uint256)",
    "function getHistory(string) external view returns (tuple(string action, address from, address to, uint256 timestamp, string location, string notes)[])",
    "function getCurrentOwner(string) external view returns (address)",
    
    // Reporting
    "function reportCounterfeit(string,string) external"
];

// ============================================
// WALLET CONNECTION
// ============================================

export const connectWallet = async () => {
    if (!window.ethereum) {
        alert('Please install MetaMask!');
        return null;
    }
    try {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        return accounts[0];
    } catch (error) {
        console.error('Error connecting wallet:', error);
        return null;
    }
};

// ============================================
// CONTRACT INSTANCE
// ============================================

export const getContract = async () => {
    if (!window.ethereum) throw new Error('Please install MetaMask!');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getProvider = () => {
    if (!window.ethereum) throw new Error('Please install MetaMask!');
    return new ethers.providers.Web3Provider(window.ethereum);
};

// ============================================
// MANUFACTURER FUNCTIONS
// ============================================

export const createMedicine = async (batchId, name, manufacturer, expiryDate, quantity) => {
    const contract = await getContract();
    const tx = await contract.createMedicine(
        batchId,
        name,
        manufacturer,
        Math.floor(expiryDate.getTime() / 1000),
        quantity
    );
    await tx.wait();
    return tx;
};

// ============================================
// DISTRIBUTOR FUNCTIONS
// ============================================

export const receiveAtDistributor = async (batchId, location) => {
    const contract = await getContract();
    const tx = await contract.receiveAtDistributor(batchId, location);
    await tx.wait();
    return tx;
};

export const dispatchFromDistributor = async (batchId, warehouseAddress, location) => {
    const contract = await getContract();
    const tx = await contract.dispatchFromDistributor(batchId, warehouseAddress, location);
    await tx.wait();
    return tx;
};

// ============================================
// WAREHOUSE FUNCTIONS
// ============================================

export const receiveAtWarehouse = async (batchId, location) => {
    const contract = await getContract();
    const tx = await contract.receiveAtWarehouse(batchId, location);
    await tx.wait();
    return tx;
};

// ============================================
// PHARMACY FUNCTIONS
// ============================================

export const receiveAtPharmacy = async (batchId, location) => {
    const contract = await getContract();
    const tx = await contract.receiveAtPharmacy(batchId, location);
    await tx.wait();
    return tx;
};

export const sellToPatient = async (batchId, patientName) => {
    const contract = await getContract();
    const tx = await contract.sellToPatient(batchId, patientName);
    await tx.wait();
    return tx;
};

// ============================================
// VERIFICATION FUNCTIONS
// ============================================

export const verifyMedicine = async (batchId) => {
    const provider = getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    return await contract.verifyMedicine(batchId);
};

export const getHistory = async (batchId) => {
    const provider = getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    return await contract.getHistory(batchId);
};

export const getCurrentOwner = async (batchId) => {
    const provider = getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    return await contract.getCurrentOwner(batchId);
};

// ============================================
// REPORTING FUNCTIONS
// ============================================

export const reportCounterfeit = async (batchId, reason) => {
    const contract = await getContract();
    const tx = await contract.reportCounterfeit(batchId, reason);
    await tx.wait();
    return tx;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const generateQRData = (batchId) => {
    const baseURL = window.location.origin;
    return `${baseURL}/verify?batch=${batchId}`;
};

export default {
    connectWallet,
    getContract,
    getProvider,
    createMedicine,
    receiveAtDistributor,
    dispatchFromDistributor,
    receiveAtWarehouse,
    receiveAtPharmacy,
    sellToPatient,
    verifyMedicine,
    getHistory,
    getCurrentOwner,
    reportCounterfeit,
    generateQRData
};