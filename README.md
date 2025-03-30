# ⚡ Lightning Web Application

A modern web application that integrates WebLN for Lightning Network payments, built with Next.js, React, and TypeScript.

## Features

- 💸 Send Lightning payments using WebLN
- 🔄 Keysend payments to recipients
- 📜 Auto-payment on scroll (1 sat per scroll)
- 🔍 Fetch and display Lightning wallet information
- 📝 Generate and display Lightning invoices
- 💱 Fiat to sats conversion
- 📱 Responsive design
- 🌓 Dark mode support
- 📷 QR code scanner for Lightning invoices

## Technologies Used

- Next.js 14
- React with TypeScript
- WebLN
- Alby SDK
- Tailwind CSS
- HeadlessUI
- Next Themes

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/lightning-web.git
cd lightning-web
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prerequisites

- A WebLN-compatible wallet (e.g., [Alby](https://getalby.com/))
- Node.js 18.0.0 or later

## Usage

1. Connect your Lightning wallet when prompted
2. Enter a recipient's Lightning address in the settings
3. Use the payment form to send Lightning payments
4. Enable scroll payments to automatically send 1 sat per scroll
5. Toggle between light and dark mode using the theme switcher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
