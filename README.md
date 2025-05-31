# Split Voting DApp

This project demonstrates a **decentralized voting application (DApp)** built using **blockchain technology**, designed as part of my university coursework on **Decentralized Systems**. It simulates a simple election system based on a **smart contract** deployed on the **Ethereum Sepolia Testnet**, using technologies that represent hybrid architectures (frontend + blockchain backend).

---

## Project Overview

The DApp allows users to:
- Connect their **MetaMask wallet** to a **public blockchain network (Sepolia)**.
- View a list of candidates.
- Cast votes for a candidate of choice.
- View the current leading candidate.

This project focuses on demonstrating knowledge of:
- **Blockchain concepts** (transactions, smart contracts, consensus).
- **Smart contract development** (using Solidity).
- **Frontend integration** with the blockchain (using ethers.js and MetaMask).
- **Decentralized architectures** in practice.

---

## Technologies & Frameworks

### **Smart Contract Layer**
- **Solidity**: Programming language for writing the **Ballot smart contract**.
- **Remix IDE**: Online environment for writing, compiling, and deploying smart contracts.
- **Ethereum Sepolia Testnet**: A public test network simulating the Ethereum Mainnet, allowing interaction with deployed contracts using free **Sepolia ETH**.

### **Frontend Layer**
- **HTML/CSS/JavaScript**: Basic web technologies to build the user interface.
- **ethers.js**: A JavaScript library that interacts with the Ethereum blockchain and smart contracts.
- **MetaMask**: A browser extension wallet that connects to the Ethereum blockchain and manages user accounts.

### **Hosting & Deployment**
- **Netlify**: Used for deploying the static frontend, making the app accessible via a public URL.

---

## Key Solidity Functions and Logic

The **Ballot smart contract** is written in Solidity and contains the logic for a simple voting system:

### `struct Voter`
- Represents a voter with:
  - `weight`: Voting power.
  - `voted`: Whether the voter has already voted.
  - `delegate`: To whom the vote was delegated.
  - `vote`: Index of the chosen proposal.

### `struct Proposal`
- Represents a candidate with:
  - `name`: Proposal name (bytes32).
  - `voteCount`: Number of accumulated votes.

### `constructor(bytes32[] memory proposalNames)`
- Initializes the contract with a list of candidates.
- Sets the deployer as `chairperson` with a voting weight of 1.

### `giveRightToVote(address voter)`
- Grants voting rights to a specified address.
- Can only be called by the `chairperson`.
- Ensures the voter hasn’t already voted and has no prior voting rights.

### `delegate(address to)`
- Allows a voter to delegate their vote to another voter.
- Checks for delegation loops (to prevent circular delegations).
- Adds delegated weight to the delegatee’s total.

### `vote(uint proposal)`
- Records a vote for a specific proposal.
- Adds the voter’s weight to the chosen proposal’s `voteCount`.

### `winningProposal()`
- Calculates and returns the index of the proposal with the highest vote count.

### `winnerName()`
- Returns the name (bytes32) of the winning proposal.

---

## Key Frontend Logic

### `connectWallet()`
- Connects to MetaMask and initializes the contract using `ethers.js`.
- Loads the list of proposals from the contract.

### `loadProposals()`
- Loops through the proposals stored on-chain and displays them on the webpage.

### `vote()`
- Calls the smart contract’s `vote` function with the selected proposal index.

### `getWinner()`
- Calls `winnerName()` from the contract to display the current winner.

---

## How the Network Works
- **MetaMask connects to Sepolia**, a public Ethereum test network.
- **Transactions** (like voting) are signed in MetaMask and sent to the Sepolia network.
- **Gas fees** are simulated using test ETH, ensuring no real cost.
- Contract state (e.g., votes) is stored on the blockchain, ensuring transparency and tamper-resistance.

---

## Hosting & Running Locally

### Live Demo
[Visit the Voting DApp on Netlify](https://hubertsid.github.io/voting-app-solidity/)  

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/split-voting-dapp.git
   cd split-voting-dapp
