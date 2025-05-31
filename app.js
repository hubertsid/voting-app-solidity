// Replace this with your deployed contract address
const contractAddress = "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3";

let provider, signer, contract;

async function connectWallet() {
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const response = await fetch('contractABI.json');
        const contractABI = await response.json();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        alert("Wallet connected!");
        loadProposals();
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Failed to connect wallet. Check console for details.");
    }
}

async function loadProposals() {
    const proposalsDiv = document.getElementById("proposals");
    proposalsDiv.innerHTML = "";
    if (!contract) {
        proposalsDiv.innerHTML = "<p>Please connect your wallet first.</p>";
        return;
    }
    for (let i = 0; ; i++) {
        try {
            const proposal = await contract.proposals(i);
            const name = ethers.utils.parseBytes32String(proposal.name);
            const count = proposal.voteCount.toString();
            proposalsDiv.innerHTML += `<p><b>${i}:</b> ${name} - ${count} votes</p>`;
        } catch {
            break;
        }
    }
}

async function vote() {
    const index = document.getElementById("proposalIndex").value;
    if (!contract) {
        alert("Connect your wallet first!");
        return;
    }
    try {
        await contract.vote(index);
        alert(`Vote for candidate ${index} submitted!`);
    } catch (error) {
        console.error("Voting failed:", error);
        alert("Voting failed. Check console for details.");
    }
}

async function getWinner() {
    if (!contract) {
        alert("Connect your wallet first!");
        return;
    }
    try {
        const winnerBytes32 = await contract.winnerName();
        const winner = ethers.utils.parseBytes32String(winnerBytes32);
        document.getElementById("winner").innerText = `Current Winner: ${winner}`;
    } catch (error) {
        console.error("Failed to fetch winner:", error);
        alert("Error fetching winner. Check console for details.");
    }
}
