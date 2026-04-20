import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"; // Ajoute PublicKey ici
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { RPC_URL } from "../config/constants.js";
import { performSwap } from "../utils/swap-helper.js";
import bs58 from "bs58";

export const runVolumeLoop = async (tokenMint: string, wallets: any[]) => {
    const connection = new Connection(RPC_URL, "confirmed");
    const SOL_MINT = "So11111111111111111111111111111111111111112";
    const mintPubkey = new PublicKey(tokenMint);

    console.log("🚀 Moteur de Volume Intelligent activé...");

    while (true) {
        try {
            const walletData = wallets[Math.floor(Math.random() * wallets.length)];
            const walletKp = Keypair.fromSecretKey(bs58.decode(walletData.secretKey));
            
            // 1. Analyse rapide (Optionnel: on pourrait fetch le prix ici)
            // Pour l'instant on reste sur un ratio 60% BUY / 40% SELL pour maintenir une pression verte
            const action = Math.random() > 0.4 ? 'BUY' : 'SELL';

            if (action === 'BUY') {
                const amount = Math.floor((0.05 + Math.random() * 0.15) * LAMPORTS_PER_SOL);
                const txid = await performSwap(connection, walletKp, SOL_MINT, tokenMint, amount);
                if (txid) console.log(`🔥 [VOLUME] Buy: ${walletData.id} -> https://solscan.io/tx/${txid}?cluster=devnet`);
            } 
            else {
                // 2. Logique de Vente réelle
                const ata = await getAssociatedTokenAddress(mintPubkey, walletKp.publicKey);
                try {
                    const account = await getAccount(connection, ata);
                    if (account.amount > 0n) {
                        // On vend entre 5% et 15% de ce que le wallet possède pour ne pas "dump" notre propre token
                        const sellAmount = Number(account.amount) * (0.05 + Math.random() * 0.1);
                        const txid = await performSwap(connection, walletKp, tokenMint, SOL_MINT, Math.floor(sellAmount));
                        if (txid) console.log(`💧 [VOLUME] Sell: ${walletData.id} -> https://solscan.io/tx/${txid}?cluster=devnet`);
                    }
                } catch (e) {
                    console.log(`ℹ️ Wallet ${walletData.id} n'a pas de tokens à vendre, on skip.`);
                }
            }
        } catch (err) {
            console.error("⚠️ Erreur dans la boucle de volume:", err);
        }

        // Délai court pour le volume (10 à 30 secondes)
        const delay = Math.floor(Math.random() * 20000) + 10000;
        await new Promise(res => setTimeout(res, delay));
    }
};