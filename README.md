# 👻 Solana MM-Ghost Engine

![TypeScript](https://img.shields.io/badge/language-TypeScript-%233178C6?style=flat-square&logo=typescript&logoColor=white)
![Solana](https://img.shields.io/badge/network-Solana-black?style=flat-square&logo=solana)
![Jito](https://img.shields.io/badge/MEV-Jito-blue?style=flat-square)

**Solana MM-Ghost Engine** is an advanced Market Making suite and automated token management system. Designed for developers and project leads who need to simulate organic growth, maintain high-frequency trading volume, and execute complex launches with surgical precision.

By leveraging **Jito Block Engine**, this suite bypasses public mempools to ensure 100% landing rates for your bundles and swaps.

---

## ⚡️ Key Features

### 💎 Token Launcher (Bundle Mode)
* **Full Supply Minting:** Deploy a standard SPL Token with custom decimals and supply (e.g., 1 Billion) in a single transaction.
* **Jito Bundles:** Stealth-launch your project and secure the first buy orders before snipers can react.

### 🕵️ Slow Accumulator (Organic Stealth)
* **Wallet Fragmentation:** Accumulate tokens across dozens of secondary wallets to avoid "Developer Wallet" flags.
* **Anti-Pattern Logic:** Randomized SOL amounts and variable delays between buys to mimic real human behavior and deceive "Bubble Maps" or "Alpha" trackers.

### 🔥 Smart Volume Engine (24/7 Activity)
* **Bullish Pressure:** Configurable Buy/Sell ratios (e.g., 60/40) to maintain a steady uptrend on the charts.
* **Capital Recycling:** Automatically sells small percentages (5-15%) from random wallets to sustain SOL liquidity while generating constant trading volume.

---

## 📂 Project Structure

```text
src/
├── config/       # RPC, Jito settings, and Private Key management
├── strat-launch/ # Deployment logic and Jito Bundles
├── strat-supply/ # "Slow Accumulator" stealth strategy
├── strat-volume/ # High-frequency Volume & Market Making engine
└── utils/        # Wallet generator, Jito helpers, and Swap aggregators
```

---

🚀 Installation & Quick Start

1. Prerequisites

* Node.js (v18 or higher)
* TypeScript environment
* A Jito Block Engine compatible RPC

2. Setup

```bash
# Clone the repository
git clone https://github.com/Bulls-Dev/Solana-MM-Ghost-Engine.git

# Enter the directory
cd Solana-MM-Ghost-Engine

# Install dependencies
npm install
```

3. Environment Variables

Create a `.env` file in the root directory and configure your keys:

```env
RPC_URL=https://api.mainnet-beta.solana.com
PRIVATE_KEY_MAIN=your_main_wallet_private_key_base58
NETWORK=mainnet # or devnet
```

🛠 Operation Manual

📝 Step 1: Wallet Generation

Before starting any strategy, you need to generate your fleet of "Ghost" wallets:

```bash
npm run generate
```

This will create `storage/wallets.json`.
Make sure to fund these wallets with a small amount of SOL.

📝 Step 2: Running the Engine

You can launch the main entry point:

```bash
npm start
```

📝 Step 3: Independent Modules

To run a specific engine directly without using the main menu:

**Volume Engine:**

```bash
node --loader ts-node/esm src/strat-volume/volume-bot.ts
```

**Slow Accumulation:**

```bash
node --loader ts-node/esm src/strat-supply/slow-accumulator.ts
```

🌟 Support the Project

If this engine helps you dominate the Solana market, please consider giving it a Star! ⭐️

🔗 Connect with Us

Looking for custom token development, dApp builds, or professional Web3 consulting?

* 🛒 Official Store: Visit Shop-Block-S-Dev
* 📢 Telegram Channel: Join @dev_web3_blocks

⚠️ Disclaimer

Trading on Solana involves high risk.

This software is provided "as is" for educational and development purposes.
The developers are not responsible for any financial losses incurred through the use of this tool.

Always test on Devnet first.
