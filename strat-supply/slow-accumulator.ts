import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { RPC_URL } from "../config/constants.js";
import { performSwap } from "../utils/swap-helper.js";
import bs58 from "bs58";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const slowAccumulate = async (tokenMint: string) => {
    const connection = new Connection(RPC_URL, "confirmed");
    const wallets = JSON.parse(fs.readFileSync(path.join(__dirname, "../../storage/wallets.json"), "utf-8"));
    const SOL_MINT = "So11111111111111111111111111111111111111112";

    console.log("🕵️ Lancement de l'accumulation discrète...");

    for (const walletData of wallets) {
        const walletKp = Keypair.fromSecretKey(bs58.decode(walletData.secretKey));
        
        // Montant aléatoire pour ne pas avoir de patterns
        const amountSol = 0.5 + Math.random() * 1.5; 
        const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

        console.log(`🛒 Wallet ${walletData.id} achète pour ${amountSol.toFixed(3)} SOL...`);
        
        const txid = await performSwap(connection, walletKp, SOL_MINT, tokenMint, lamports);
        
        if (txid) {
            console.log(`✅ Achat réussi: https://solscan.io/tx/${txid}`);
        }

        // Temps d'attente aléatoire (ex: 1 à 5 minutes)
        const delay = Math.floor(Math.random() * 240000) + 60000;
        console.log(`⏱️ Prochain achat dans ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
    }
};