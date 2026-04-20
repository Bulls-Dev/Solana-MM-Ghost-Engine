import { 
    Connection, 
    Transaction, 
    SystemProgram, 
    LAMPORTS_PER_SOL, 
    Keypair, 
    sendAndConfirmTransaction 
} from "@solana/web3.js";
import { MAIN_KP, RPC_URL } from "../config/constants.js";
import bs58 from "bs58";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const withdrawAll = async () => {
    const connection = new Connection(RPC_URL, "confirmed");
    const wallets = JSON.parse(fs.readFileSync(path.join(__dirname, "../../storage/wallets.json"), "utf-8"));

    console.log(`🧹 Récupération des SOL vers le Main Wallet (${MAIN_KP.publicKey.toBase58()})...`);

    for (const walletData of wallets) {
        const walletKp = Keypair.fromSecretKey(bs58.decode(walletData.secretKey));
        const balance = await connection.getBalance(walletKp.publicKey);

        // On laisse 0.005 SOL pour les frais de transaction de l'envoi
        const amountToSend = balance - (0.005 * LAMPORTS_PER_SOL);

        if (amountToSend > 0) {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: walletKp.publicKey,
                    toPubkey: MAIN_KP.publicKey,
                    lamports: amountToSend,
                })
            );

            try {
                const sig = await sendAndConfirmTransaction(connection, transaction, [walletKp]);
                console.log(`✅ Wallet ${walletData.id} vidé : ${(amountToSend / LAMPORTS_PER_SOL).toFixed(4)} SOL récupérés.`);
            } catch (e) {
                console.error(`❌ Erreur sur le wallet ${walletData.id} :`, e);
            }
        }
    }
    console.log("✨ Opération videuse terminée.");
};