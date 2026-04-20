import { 
    Connection, 
    Keypair, 
    SystemProgram, 
    Transaction, 
    sendAndConfirmTransaction 
} from "@solana/web3.js";
import { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo 
} from "@solana/spl-token";
import { MAIN_KP, RPC_URL } from "../config/constants.js";

export const createTokenFullSupply = async () => {
    const connection = new Connection(RPC_URL, "confirmed");

    console.log("🛠️ Création du Token SPL (Standard) sur Devnet...");

    try {
        // 1. Création du Mint
        const mint = await createMint(
            connection,
            MAIN_KP,            // Payeur des frais
            MAIN_KP.publicKey,  // Autorité qui peut créer les jetons
            MAIN_KP.publicKey,  // Autorité de gel (optionnelle)
            9                   // 9 décimales (standard Solana)
        );

        console.log(`✅ Token créé avec succès !`);
        console.log(`📍 ADRESSE DU TOKEN (MINT) : ${mint.toBase58()}`);

        // 2. Création du compte de réception pour ton Main Wallet
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            MAIN_KP,
            mint,
            MAIN_KP.publicKey
        );

        // 3. Mint de 1 Milliard de tokens
        const amount = 1_000_000_000 * Math.pow(10, 9);
        await mintTo(
            connection,
            MAIN_KP,
            mint,
            ata.address,
            MAIN_KP,
            amount
        );

        console.log(`🪙 1,000,000,000 tokens ont été déposés sur ton wallet principal.`);
        console.log(`🔗 Vérifie ici : https://solscan.io/token/${mint.toBase58()}?cluster=devnet`);
        
        return mint.toBase58();
    } catch (error) {
        console.error("❌ Erreur lors de la création :", error);
        return null;
    }
};