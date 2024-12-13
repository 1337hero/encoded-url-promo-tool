# Promotional URL Tool

Working for a client with a "Return to Cart" promotional offer that is encoded using AES-CBC encryption. These are generated in Hubspot. While working on the project, I needed a quick and effective way to decode and validate test URL's and even create my own. Thus this tool now exists.

This tool allows users to generate encoded URLs with customer information and decode existing promotional URLs securely.

It's setup for my needs in terms of how we read the URL's and Generate them based on our params, but anyone could modify this code. Pretty standard stuff.

## Features

- **URL Generation**: Create encoded promotional URLs with customer information
- **URL Decoding**: Decrypt and display parameters from encoded promotional URLs
- **Profile Templates**: Pre-configured customer profiles for quick data entry
- **Address Templates**: Common address templates for promotional locations
- **Secure Encryption**: AES-CBC encryption for URL parameters

## Technology Stack

- React 18.3
- Vite 6.0
- Tailwind CSS
- shadcn/ui Components
- Web Crypto API

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd encoded-promo-tool
```

2. Install dependencies:
This project was primarily setup to use the Bun runtime which is an alternative to Node but fully compatible with it. 

Learn more here: https://bun.sh/

```bash
bun install
```
**OR**
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Set up your encryption key:
Edit `.env` and add your encryption key:
```
VITE_ENCRYPTION_KEY=your-encryption-key-here
```

## Development

To start the development server:

```bash
bun run dev
# or
npm run dev
```

The application will be available at `http://localhost:3001`

## Building for Production

To create a production build:

```bash
bun run build
# or
npm build
```

The built files will be in the `dist` directory.

## Usage

### Generating URLs

1. Select the "Generate URL" tab
2. Fill in customer information:
   - Return End Date
   - Return Promo Code
   - Address Details
   - Customer Information
3. Click "Generate URL" to create an encoded promotional URL

### Decoding URLs

1. Select the "Decode URL" tab
2. Paste an encoded promotional URL
3. Click "Decode URL" to view the decoded parameters

### Using Templates

The tool includes pre-configured templates for:
- Customer Profiles (Basic Residential, Moving Customer)
- Addresses (Available Properties, Promotional Locations)

## Project Structure

```
src/
├── components/
│   ├── PromoUrlTool/        # Main application components
│   └── ui/                  # Reusable UI components
├── config/
│   └── testData.js         # Template data configurations
├── hooks/
│   └── usePromoUrl.js      # URL encryption/decryption logic
├── lib/
│   ├── crypto.js           # Cryptography utilities
│   └── utils.js            # General utilities
└── App.jsx                 # Root component
```

## Security

- Uses AES-CBC encryption for parameter encoding
- Implements Web Crypto API for secure cryptographic operations
- Encryption key stored in environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.