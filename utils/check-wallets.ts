import { Connection, PublicKey } from "@solana/web3.js";
import fs from "fs";
import { RPC_URL } from "../config/constants.js";

const connection = new Connection(RPC_URL, "confirmed");

export async function checkGlobalSol() {
    try {
        const wallets = JSON.parse(fs.readFileSync("./storage/wallets.json", "utf-8"));
        
        console.log(`\n=== 💰 ÉTAT DES SOLDES ===\n`);
        console.log("NOM         | ADRESSE                                      | SOL BALANCE");
        console.log("-----------------------------------------------------------------------");

        let totalSol = 0;

        for (const [name, keypairData] of Object.entries(wallets)) {
            const pubkey = new PublicKey((keypairData as any).publicKey);
            
            try {
                const balance = await connection.getBalance(pubkey);
                const sol = balance / 1e9;
                totalSol += sol;

                console.log(`${name.padEnd(11)} | ${pubkey.toBase58().padEnd(44)} | ${sol.toFixed(4)} SOL`);
            } catch (e) {
                console.log(`${name.padEnd(11)} | Erreur sur ce wallet (Rate Limit)`);
            }
        }

        console.log("-----------------------------------------------------------------------");
        console.log(`TOTAL FLOTTE : ${totalSol.toFixed(4)} SOL`);
        console.log("-----------------------------------------------------------------------\n");

    } catch (error) {
        console.error("❌ Erreur lors de la lecture des wallets :", error);
    }
}

checkGlobalSol();