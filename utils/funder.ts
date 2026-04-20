import { 
    Connection, 
    SystemProgram, 
    Transaction, 
    sendAndConfirmTransaction, 
    LAMPORTS_PER_SOL,
    PublicKey
} from "@solana/web3.js";
import { MAIN_KP, RPC_URL } from "../config/constants.js";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = new Connection(RPC_URL, "confirmed");

export const fundWallets = async () => {
    const walletsPath = path.join(__dirname, "../../storage/wallets.json");
    if (!fs.existsSync(walletsPath)) {
        console.error("❌ wallets.json introuvable. Génère-les d'abord.");
        return;
    }

    const wallets = JSON.parse(fs.readFileSync(walletsPath, "utf-8"));
    console.log(`💰 Début du financement pour ${wallets.length} wallets...`);
    console.log(`🏦 Solde restant à distribuer : ~33 SOL`);

    for (const wallet of wallets) {
        // --- MODIFICATION ICI ---
        // On envoie 2.5 SOL par wallet pour avoir de la force de frappe
        const amount = 2.5 + (Math.random() * 0.3); // Entre 2.5 et 2.8 SOL
        const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: MAIN_KP.publicKey,
                toPubkey: new PublicKey(wallet.publicKey), // Correction : s'assurer que c'est une PublicKey
                lamports: lamports,
            })
        );

        try {
            const signature = await sendAndConfirmTransaction(connection, transaction, [MAIN_KP]);
            console.log(`✅ ${amount.toFixed(4)} SOL envoyés à ${wallet.publicKey.slice(0, 8)}...`);
            console.log(`🔗 Sig: https://solscan.io/tx/${signature}?cluster=devnet`);
            
            // Délai court (1-3s) pour ne pas y passer la nuit sur Devnet
            const delay = Math.floor(Math.random() * 2000) + 1000;
            await new Promise(res => setTimeout(res, delay));
        } catch (error) {
            console.error(`❌ Échec de l'envoi vers ${wallet.publicKey}:`, error);
        }
    }
    console.log("✨ Financement terminé. Tes wallets sont armés !");
};