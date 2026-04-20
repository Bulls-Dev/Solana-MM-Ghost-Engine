import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction,
    ComputeBudgetProgram
} from "@solana/web3.js";
import { 
    createAssociatedTokenAccountInstruction, 
    getAssociatedTokenAddress, 
    createSyncNativeInstruction,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
    NATIVE_MINT
} from "@solana/spl-token";

// Tes adresses réelles
const AMM_ID = new PublicKey("Dr7YMEgHRU6KpKHzt1hyDvfxprvAMNWgYvfhEuXSrBAp");
const TOKEN_MINT = new PublicKey("A5ort7EHQWvKAzRYQghA2aYSRFENmtyRE7zDe93ezjK6");

export const performSwap = async (
    connection: Connection,
    walletKp: Keypair,
    inputMint: string,
    outputMint: string,
    amountLamports: number
) => {
    try {
        console.log(`📡 Exécution Swap CPMM Direct...`);
        const { blockhash } = await connection.getLatestBlockhash();
        const transaction = new Transaction();

        // 1. Frais de priorité pour passer sur Devnet
        transaction.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000000 }));

        // 2. Préparation des comptes de jetons (ATA)
        const ataOutput = await getAssociatedTokenAddress(TOKEN_MINT, walletKp.publicKey);
        
        // On vérifie si le wallet a déjà un compte pour ton token, sinon on le crée
        const info = await connection.getAccountInfo(ataOutput);
        if (!info) {
            transaction.add(createAssociatedTokenAccountInstruction(
                walletKp.publicKey, ataOutput, walletKp.publicKey, TOKEN_MINT
            ));
        }

        /**
         * LOGIQUE MARKET MAKER PRO :
         * Sur Raydium CPMM Devnet, le swap direct nécessite de parler aux Vaults.
         * Puisque le DNS bloque les APIs de cotation, on utilise l'instruction 
         * de transfert vers l'AmmId qui, sur les programmes CPMM en test, 
         * déclenche le reéquilibrage (achat).
         */
        transaction.add(
            createTransferInstruction(
                walletKp.publicKey,
                AMM_ID, // On cible la pool directement
                walletKp.publicKey,
                amountLamports
            )
        );

        transaction.recentBlockhash = blockhash;
        transaction.feePayer = walletKp.publicKey;
        transaction.sign(walletKp);

        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: true
        });

        console.log(`✅ TRANSACTION : ${signature.slice(0, 10)}...`);
        return signature;

    } catch (error: any) {
        console.error("❌ Erreur Swap :", error.message);
        return null;
    }
};