import { Keypair } from "@solana/web3.js";
import * as fs from "fs";
import bs58 from "bs58";
import path from "path";
import { fileURLToPath } from "url"; // Ajout requis pour ESM

// --- RECRÉATION DE __dirname POUR LE MODE MODULE ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateWallets = (count: number) => {
    const wallets = [];
    const storageDir = path.join(__dirname, "../../storage");

    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }

    for (let i = 0; i < count; i++) {
        const kp = Keypair.generate();
        wallets.push({
            id: i + 1,
            publicKey: kp.publicKey.toBase58(),
            secretKey: bs58.encode(kp.secretKey)
        });
    }

    fs.writeFileSync(path.join(storageDir, "wallets.json"), JSON.stringify(wallets, null, 2));
    console.log(`✅ ${count} wallets générés avec succès dans /storage/wallets.json`);
};

generateWallets(10);