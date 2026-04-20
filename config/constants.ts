// src/config/constants.ts
import dotenv from "dotenv";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

dotenv.config();

// Pour le test, assure-toi que ton .env contient l'URL Devnet
export const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

// Jito a des adresses différentes selon le réseau
export const JITO_BLOCK_ENGINE = process.env.NETWORK === 'mainnet' 
    ? "mainnet.block-engine.jito.wtf" 
    : "ny.be.jito.wtf"; // Adresse type pour Devnet/Testnet

const privateKeyString = process.env.PRIVATE_KEY_MAIN || "";
export const MAIN_KP = Keypair.fromSecretKey(bs58.decode(privateKeyString));

export const TOKEN_TOTAL_SUPPLY = 1_000_000_000;
export const BUY_PERCENTAGE = 0.70;