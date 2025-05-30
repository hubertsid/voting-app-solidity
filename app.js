// Replace this with your deployed contract address
const contractAddress = "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3";

let provider;
let signer;
let contract;

async function connectWallet() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    // Load ABI from external JSON file
    const response = await fetch('contractABI.json');
    const contractABI = await response.json();

    contract = new ethers.Contract(contractAddress, contractABI, signer);
    alert("Wallet connected");
    loadProposals();
}

async function loadProposals() {
    const proposalsDiv = document.getElementById("proposals");
    proposalsDiv.innerHTML = "";
    for (let i = 0; ; i++) {
        try {
            const proposal = await contract.proposals(i);
            const name = ethers.utils.parseBytes32String(proposal.name);
            const count = proposal.voteCount.toString();
            proposalsDiv.innerHTML += `<p>${i}: ${name} - ${count} votes</p>`;
        } catch {
            break; // End of proposals
        }
    }
}

async function vote() {
    const index = document.getElementById("proposalIndex").value;
    await contract.vote(index);
    alert(`Voted for proposal ${index}`);
}

async function getWinner() {
    const winner = await contract.winnerName();
    document.getElementById("winner").innerText = "Winner: " + ethers.utils.parseBytes32String(winner);
}
