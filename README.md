App Link: skillswap-gamma.vercel.app



Here's a step-by-step guide on how to run the SkillSwap application on your system, including all necessary commands:

Step 1: Prerequisites - Install Node.js and npm

What: Node.js is a JavaScript runtime, and npm is its package manager. You need these to install project dependencies and run the application.
How:
    Go to the official Node.js website: https://nodejs.org/
    Download the LTS (Long Term Support) version.
    Install it by following the installer instructions.
    Verify installation: Open your terminal (Command Prompt on Windows, Terminal on macOS/Linux) and run:
       node -v
       npm -v
    You should see version numbers for both.
Step 2: Get the Project Code

Ensure you have the SkillSwap project files on your computer (e.g., downloaded as a ZIP or cloned from a repository).
Step 3: Install Project Dependencies

Where to run: In your terminal.
How:
    Navigate to the root directory of your SkillSwap project (the folder containing the package.json file).
    cd path/to/your/skillswap-project
    (Replace path/to/your/skillswap-project with the actual path on your system).
    Install all the project's libraries by running:
    npm install
    This might take a few minutes.
Step 4: Set Up Environment Variables (.env file)

What: This file stores sensitive information like API keys.
Where to create/edit: In the root directory of your project.
How:
    Create a file named exactly .env in the project's root directory.

  Add the following content to it. You MUST replace the placeholder values (like YOUR_..._HERE) with your actual credentials.

# For Genkit and Google AI Features
GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY_HERE

# For Firebase Integration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN_HERE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID_HERE
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET_HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID_HERE
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID_HERE
Get your GOOGLE_API_KEY from Google AI Studio or Google Cloud.
Get your NEXT_PUBLIC_FIREBASE_... values from your Firebase project settings (Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration).
Important for NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: It should typically be in the format your-project-id.appspot.com.

Step 5: Configure Firebase Project in the Firebase Console

What: You need to enable the Firebase services your app will use.
Where: In your Firebase Console.
How:
Select your SkillSwap project.
Authentication: Go to Build > Authentication > Sign-in method. Enable the providers you want (e.g., Email/Password, Google). For Google Sign-In, ensure you also set a project support email.
Firestore Database: Go to Build > Firestore Database > Create database. Start in test mode for development (you can secure it later). Choose a server location.
Storage: Go to Build > Storage > Get started. Follow the prompts, using the default security rules (test mode) for now.
Step 6: Run the Development Servers

What: The SkillSwap application requires two servers to run simultaneously: the Next.js frontend and the Genkit AI backend.

Where to run: In your terminal, from the project's root directory. You'll need two separate terminal windows/tabs.

Terminal 1: Start the Next.js Application (Frontend)

Make sure you're in the project's root directory.
Run:
npm run dev
This typically starts the app on http://localhost:9002. Watch the terminal for the exact address.
Terminal 2: Start the Genkit Development Server (AI Backend)

Open a new terminal window or tab.
Navigate to the project's root directory again.
Run:
npm run genkit:dev
(Alternatively, npm run genkit:watch will auto-reload if you change AI flow files).
This server handles AI requests and usually runs on a different port (e.g., http://localhost:3400 or http://localhost:4000 – check the terminal output).
Step 7: Access the Application

How:
Once both servers are running without errors, open your web browser (e.g., Chrome, Firefox).
Go to the address of the Next.js application, which is usually: http://localhost:9002
