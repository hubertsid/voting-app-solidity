// Replace this with your deployed contract address
const contractAddress = "0x63d1026C33af01e5f5204976619E9C4EC3a52DCB";

let provider, signer, contract;

async function init() {
    try {
        if (!window.ethereum) {
            alert("❌ MetaMask not detected. Please install it.");
            return;
        }

        console.log("🔄 Loading ABI...");
        const response = await fetch('contractABI.json');
        const contractABI = await response.json();
        console.log("✅ ABI loaded:", contractABI);

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();

        const network = await provider.getNetwork();
        console.log("🌐 Connected to network:", network.name);

        console.log("🔗 Creating contract instance...");
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("✅ Contract instance created:", contract);

        loadProposals();
    } catch (error) {
        console.error("❌ Initialization failed:", error);
    }
}

async function loadProposals() {
    const proposalsDiv = document.getElementById("proposals");
    proposalsDiv.innerHTML = "";

    if (!contract) {
        proposalsDiv.innerHTML = "<p>❌ Contract not initialized.</p>";
        return;
    }

    let i = 0;
    while (true) {
        try {
            console.log(`🔍 Fetching proposal at index ${i}`);
            const proposal = await contract.proposals(i);
            const name = ethers.utils.parseBytes32String(proposal.name);
            const count = proposal.voteCount.toString();
            console.log(`✅ Proposal ${i}: ${name} (${count} votes)`);
            proposalsDiv.innerHTML += `<p><b>${i}</b>: ${name} - ${count} votes</p>`;
            i++;
        } catch (error) {
            console.warn(`⚠️ No more proposals at index ${i}.`, error);
            break;
        }
    }
}

async function vote() {
    const index = document.getElementById("proposalIndex").value;
    if (!contract) {
        alert("❌ Contract not initialized.");
        return;
    }
    try {
        console.log(`🗳️ Sending vote for index ${index}...`);
        const tx = await contract.vote(index);
        await tx.wait();
        alert(`✅ Voted for candidate ${index}`);
        loadProposals(); // refresh
    } catch (error) {
        console.error("❌ Voting failed:", error);
        alert("Voting failed. See console.");
    }
}

async function getWinner() {
    if (!contract) {
        alert("❌ Contract not initialized.");
        return;
    }
    try {
        const winnerBytes32 = await contract.winnerName();
        const winner = ethers.utils.parseBytes32String(winnerBytes32);
        console.log("🏆 Current winner:", winner);
        document.getElementById("winner").innerText = `Current Winner: ${winner}`;
    } catch (error) {
        console.error("❌ Failed to fetch winner:", error);
        alert("Error fetching winner. See console.");
    }
}

window.addEventListener('load', init);