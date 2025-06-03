// Replace this with your deployed contract address
const contractAddress = "0x63d1026C33af01e5f5204976619E9C4EC3a52DCB";
const ALCHEMY_API_KEY = "SEPOLIO_API_KEY"; // Optional: for fallback

let provider, signer, contract;

async function init() {
    try {
        console.log("🔄 Loading ABI...");
        const response = await fetch('contractABI.json');
        const contractABI = await response.json();
        console.log("✅ ABI loaded:", contractABI);

        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();

            const network = await provider.getNetwork();
            console.log("🌐 Connected to network:", network.name, `(chainId: ${network.chainId})`);

            if (network.chainId !== 11155111) {
                alert("❌ Wrong network. Please switch MetaMask to Sepolia testnet.");
                return;
            }

            console.log("🔗 Creating contract instance with signer...");
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("✅ Contract with signer ready.");

        } else {
            alert("❌ MetaMask not detected. Read-only mode enabled.");
            provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
            contract = new ethers.Contract(contractAddress, contractABI, provider);
            console.log("✅ Read-only contract instance ready.");
        }

        loadProposals();
    } catch (error) {
        console.error("❌ Initialization failed:", error);
    }
}

async function loadProposals() {
    const proposalsDiv = document.getElementById("proposals");
    proposalsDiv.innerHTML = "";

    if (!contract) {
        proposalsDiv.innerHTML = "<p>⚠️ Contract not loaded.</p>";
        return;
    }

    let i = 0;
    while (true) {
        try {
            console.log(`🔍 Fetching proposal at index ${i}`);
            const proposal = await contract.proposals(i);
            const name = ethers.utils.parseBytes32String(proposal.name);
            const count = proposal.voteCount.toString();
            proposalsDiv.innerHTML += `<p><b>${i}</b>: ${name} - ${count} votes</p>`;
            i++;
        } catch (error) {
            console.warn(`⚠️ No more proposals at index ${i}.`, error.message);
            break;
        }
    }
}

async function vote() {
    const index = document.getElementById("proposalIndex").value;
    if (!contract || !signer) {
        alert("Connect your wallet on Sepolia first!");
        return;
    }
    try {
        await contract.vote(index);
        alert(`✅ Vote for candidate ${index} submitted!`);
    } catch (error) {
        console.error("❌ Voting failed:", error);
        alert("⚠️ Voting failed. See console for details.");
    }
}

async function getWinner() {
    if (!contract) {
        alert("Contract not loaded.");
        return;
    }
    try {
        const winnerBytes32 = await contract.winnerName();
        const winner = ethers.utils.parseBytes32String(winnerBytes32);
        document.getElementById("winner").innerText = `🏆 Current Winner: ${winner}`;
    } catch (error) {
        console.error("❌ Failed to fetch winner:", error);
        alert("⚠️ Error fetching winner.");
    }
}

window.addEventListener('load', init);
