// Replace this with your deployed contract address
const contractAddress = "0xA009502A2D9f5854de4d38b4769A8B1120b46414";

let provider, signer, contract;

// Function to initialize provider, signer, contract
async function init() {
    try {
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();

            const response = await fetch('contractABI.json');
            const contractABI = await response.json();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            console.log("Wallet connected and contract initialized.");
            loadProposals();
        } else {
            alert("MetaMask not detected. Please install MetaMask.");
        }
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

async function loadProposals() {
    const proposalsDiv = document.getElementById("proposals");
    proposalsDiv.innerHTML = "";

    if (!contract) {
        proposalsDiv.innerHTML = "<p>Please connect your wallet first.</p>";
        return;
    }

    let i = 0;
    while (true) {
        try {
            const proposal = await contract.proposals(i);
            const name = ethers.utils.parseBytes32String(proposal.name);
            const count = proposal.voteCount.toString();
            proposalsDiv.innerHTML += `<p><b>${i}</b>: ${name} - ${count} votes</p>`;
            i++;
        } catch (error) {
            console.log(`No more proposals at index ${i}.`, error);
            break;
        }
    }
}

// Automatically run init() on page load
window.addEventListener('load', init);

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
