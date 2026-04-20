import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { RPC_URL } from "../config/constants.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMarketMakerStats = async (tokenMintAddress: string) => {
    const connection = new Connection(RPC_URL, "confirmed");
    const tokenMint = new PublicKey(tokenMintAddress);
    
    // 1. Charger les wallets
    const walletsPath = path.join(__dirname, "../../storage/wallets.json");
    if (!fs.existsSync(walletsPath)) {
        console.error("❌ Aucun wallet généré.");
        return;
    }
    const wallets = JSON.parse(fs.readFileSync(walletsPath, "utf-8"));

    console.log(`\n📊 ANALYSE DE LA FLOTTE (Token: ${tokenMintAddress.slice(0, 8)}...)`);
    console.log("--------------------------------------------------");

    let totalSol = 0;
    let totalTokens = 0;

    for (const wallet of wallets) {
        const pubKey = new PublicKey(wallet.publicKey);
        
        // Solde SOL
        const solBalance = await connection.getBalance(pubKey);
        const solConverted = solBalance / LAMPORTS_PER_SOL;
        totalSol += solConverted;

        // Solde Token
        try {
            const tokenAccounts = await connection.getTokenAccountsByOwner(pubKey, { mint: tokenMint });
            if (tokenAccounts.value.length > 0) {
                const balance = await connection.getTokenAccountBalance(tokenAccounts.value[0]!.pubkey);
                totalTokens += Number(balance.value.uiAmount);
            }
        } catch (e) {
            // Le wallet n'a peut-être pas encore de compte pour ce token
        }
    }

    // 2. Récupérer la Supply Totale (pour calculer le %)
    const supplyInfo = await connection.getTokenSupply(tokenMint);
    const totalSupply = Number(supplyInfo.value.uiAmount);
    const percentOwned = ((totalTokens / totalSupply) * 100).toFixed(2);

    // 3. Affichage Propre
    console.log(`💰 SOL Total dispo (Gaz/Achats) : ${totalSol.toFixed(4)} SOL`);
    console.log(`💎 Tokens accumulés par la flotte : ${totalTokens.toLocaleString()} tokens`);
    console.log(`📈 Contrôle de la Supply : ${percentOwned}% / 70%`);
    
    if (Number(percentOwned) < 70) {
        console.log(`⚠️  Statut : Accumulation en cours... (Manque ${(70 - Number(percentOwned)).toFixed(2)}%)`);
    } else {
        console.log(`✅ Statut : Objectif de supply atteint !`);
    }
    console.log("--------------------------------------------------\n");
};