# CryptoTracker Pro
A full-stack web application built to manage your cryptocurrency portfolio and securely log trades. It's extremely useful for tracking trades to ensure easier tax reporting.

Check out the live version [here](https://google.com)!

## Table of Contents
- [CryptoTracker Pro](#cryptotracker-pro)
  - [Table of Contents](#table-of-contents)
  - [Demo](#demo)
  - [Features](#features)
  - [Tools](#tools)
  - [Limitations](#limitations)
  - [Installation](#installation)
  - [Contributing](#contributing)
  - [License](#license)

## Demo
- Authentication and home page portfolio
![Authentication and home page flow](/readme_gifs/authenticate.gif)

- Editing a trade & viewing trade log
![Edit a trade and view trade log](/readme_gifs/edittrade.gif)

- Leaderboards to compete with other investors/traders
![Leaderboards](/readme_gifs/leaderboards.gif)

- Profile page to view investor profiles
![Profile page](/readme_gifs/profile.gif)

## Features
- **Secure Authentication:**
  - Sign in/out using Google, GitHub, or Microsoft.
  - Modify your user profile data (username, image, etc.).


- **User Interface:**
  - Smooth and elegant UI with light/dark mode.
  - Easy navigation and crypto tracking functionality.

- **Trades:**
  - Create, read, update, and delete trades.
  - Supports up to 1000+ cryptocurrencies.
  - Trade log lets you capture each and every trade, making it extremely useful for tax reporting.

- **Leaderboards:**
  - Compete with other investors/traders.
  - Option to switch between public or private profile.

- **Profiles:**
  - View your profile or others' public profiles.
  - Learn more about other users using the app.

## Tools
- **Next.js, Tailwind CSS, shadcn ui** (for beautiful UI components such as tables, buttons, etc.)
- **Clerk** for authentication.
- **CoinGecko API** for the current crypto data
- **MongoDB** for storing trades & users on the app.

## Limitations
- **CoinGecko API:**
  - Free-tier version allows a maximum of 5 requests per minute.
  - Exceeding this limit may make the application non-responsive as it wohn't be able to get real-time crypto data (such as prices, 1 hour change etc.)
  - If this happens, wait a few minutes and try again.

*The application works perfectly. I just didn't want to pay for a CoinGecko API key when the free-tier was sufficient.*

## Installation
1. Clone the repository and install the dependencies:
```bash
npm install
```

2. Setup environment variables by creating a `.env` file in the root directory and add the required variables.
3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
