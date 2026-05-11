# LexGuard.ai

An AI-powered legal contract analysis tool that helps users understand contracts in plain English by identifying dangerous clauses and providing clear explanations.

## Features

- **Contract Upload**: Upload contract images or documents for analysis
- **AI Analysis**: Powered by Google Gemini AI to analyze legal language
- **Plain English Explanations**: Convert complex legal jargon into understandable terms
- **Risk Identification**: Highlight dangerous clauses and potential issues
- **Email Generation**: Automatically generate professional emails related to contracts
- **Live Translation**: Translate contract summaries to Hindi and Bengali in real time
- **Expert Search**: Find relevant legal experts based on contract type
- **User Dashboard**: Track analysis history and manage projects
- **Authentication**: Secure user authentication via Clerk

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Clerk** for authentication
- **Axios** for API communication
- **React Query** for state management
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript**
- **Prisma** ORM with PostgreSQL
- **Clerk** for server-side authentication
- **Cloudinary** for image storage
- **Tesseract.js** for OCR processing
- **OpenAI** integration
- **Multer** for file uploads

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Clerk account and API keys
- Groq AI API key
- Cloudinary account for image storage

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lexguard.ai
   ```

2. **Install dependencies**

   **Client:**
   ```bash
   cd Client
   npm install
   ```

   **Server:**
   ```bash
   cd ../Server
   npm install
   ```

3. **Environment Configuration**

   Create `.env` files in both Client and Server directories.

   **Server/.env:**
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/lexguard"
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   GROQ_API_KEY=your_GROQ_ai_api_key
   SERPAPI_KEY=your_serpapi_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret_key
   ```

   **Client/.env:**
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BASEURL=http://localhost:3000
   ```

4. ** Start the translation service**

   Run a LibreTranslate Docker image so the backend can call the translation API at `http://localhost:5000/translate`.

   ```bash
   docker pull libretranslate/libretranslate:latest
   docker run -d --name libretranslate -p 5000:5000 libretranslate/libretranslate:latest
   ```

5. **Database Setup**
   ```bash
   cd Server
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start the application**

   **Terminal 1 - Server:**
   ```bash
   cd Server
   npm run dev
   ```

   **Terminal 2 - Client:**
   ```bash
   cd Client
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Usage

1. **Sign Up/Login**: Create an account using Clerk authentication
2. **Upload Contract**: Upload a contract image or document through the dashboard
3. **AI Analysis**: The system will analyze the contract using AI
4. **Review Results**: View the analysis results, identified risks, and plain English explanations
5. **Generate Communications**: Use the email generation feature for contract-related communications
6. **Find Experts**: Search for legal experts relevant to your contract type
7. **Manage History**: Access your analysis history in the dashboard

## API Endpoints

### Projects
- `POST /addApi/add-project` - Upload and analyze a new contract
- `GET /getApi/get-project` - Retrieve project details and analysis results

### Utilities
- `POST /api/translate` - Translate legal text to plain English
- `GET /api/search-experts` - Search for legal experts

## Project Structure

```
lexguard.ai/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── Server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── lib/            # Business logic
│   │   └── configs/        # Configuration files
│   ├── prisma/             # Database schema and migrations
│   └── package.json
└── README.md
```

## Development

### Available Scripts

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

**Server:**
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server

### Database Management
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio for database management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Disclaimer**: This tool is for informational purposes only and does not constitute legal advice. Always consult with qualified legal professionals for contract review and legal matters.</content>
<parameter name="filePath">c:\Users\aviru\.vscode\Every Project is Here\LexGurd.ai\README.md
