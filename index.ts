import { fundWallets } from "./utils/funder.js";
import { slowAccumulate } from "./strat-supply/slow-accumulator.js";
import { runVolumeLoop } from "./strat-volume/volume-bot.js";
import { getMarketMakerStats } from "./utils/stats.js";
import { createTokenFullSupply } from "./strat-launch/bundle-launcher.js"; 
import { withdrawAll } from "./utils/withdraw.js";
import { checkGlobalSol } from "./utils/check-wallets.js"; 
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const tokenAddress = args[1];

    console.log("\n======= 🛠️ MARKET MAKER TOOLS =======");

    switch (command) {
        case "launch-token":
            await createTokenFullSupply();
            break;

        case "fund":
            await fundWallets();
            break;

        case "withdraw":
            await withdrawAll();
            break;

        case "check-wallets": // Nouvelle commande
            await checkGlobalSol();
            break;

        case "accumulate":
            if (!tokenAddress) return console.error("❌ Erreur: Adresse du Token (Mint) requise");
            await slowAccumulate(tokenAddress);
            break;

        case "volume":
            if (!tokenAddress) return console.error("❌ Erreur: Adresse du Token (Mint) requise");
            const walletsPath = path.join(__dirname, "../storage/wallets.json");
            const wallets = JSON.parse(fs.readFileSync(walletsPath, "utf-8"));
            await runVolumeLoop(tokenAddress, wallets);
            break;

        case "stats":
            if (!tokenAddress) return console.error("❌ Erreur: Adresse du Token (Mint) requise");
            await getMarketMakerStats(tokenAddress);
            break;

        default:
            console.log("Usage:");
            console.log("  npm run start check-wallets      -> Voir les soldes SOL");
            console.log("  npm run start fund               -> Financer les wallets");
            console.log("  npm run start accumulate <MINT>  -> Achat progressif");
            console.log("  npm run start volume <MINT>      -> Lancer le flux d'activité");
            console.log("  npm run start stats <MINT>       -> Voir l'état de la flotte");
    }
}

main().catch(console.error);