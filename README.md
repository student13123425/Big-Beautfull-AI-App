# Big Beautiful AI App: Local RAG Study Assistant

A Full-Stack, Local-First AI Platform for Academic Research and Study Optimization.

## Overview

Big Beautiful AI App is a specialized web interface designed to bridge the gap between Large Language Models (LLMs) and local data privacy. Unlike commercial platforms that run in the cloud, this application functions as a Local Host Web Tool, allowing users to leverage powerful AI models (via LM Studio) against their own private documents (PDFs, PPTs, etc.) without data ever leaving their machine.

This project was built to solve a specific student problem: Contextualizing AI. General LLMs do not know specific university curricula. This tool injects course materials directly into the AI context window, enabling highly specific summarization, quiz generation, and Q&A based strictly on the source text.

## Key Features

* **Context-Aware Chat (RAG):** Upload specific course files (Lectures, Seminars, Treatises) and chat with them. The AI answers are grounded strictly in the provided material to reduce hallucinations.
* **Automated Synthesis:** Generate comprehensive summaries of chapters or entire documents for efficient study sessions.
* **Intelligent Quiz Generation:** Automatically create multiple-choice quizzes based on uploaded course material to test knowledge retention and exam readiness.
* **Privacy-Centric Architecture:** Operates entirely on localhost. No data is sent to external APIs like OpenAI or Anthropic. The user owns both the data and the inference process.
* **Dynamic Context Management:** User-configurable context window sizes to balance between inference speed, depth of memory, and hardware constraints.

## Technical Complexity & Architecture

This application is not a simple wrapper; it is a complex orchestration of modern web technologies and local inference handling.

### 1. Full-Stack TypeScript Monorepo
The project maintains strict type safety across the entire stack, utilizing a modern architecture:
* **Frontend:** Built with React and Vite, utilizing SCSS for modular styling and Custom Hooks for managing complex UI states (keyboard navigation, resize handling, and connection status).
* **Backend:** A robust Node.js server acting as the middleware between the client interface, the local file system, and the AI inference engine.

### 2. Custom AI Orchestration (AOX Engine)
The backend implements a custom orchestration layer designed to interface with local inference servers. This handles:
* **Prompt Engineering Injection:** Dynamically wrapping user queries with system prompts that enforce academic rigor and format constraints (e.g., forcing JSON output for quizzes).
* **Stream Management:** Handling asynchronous data streams from the local LLM to provide a real-time token generation effect in the UI.
* **Error Recovery:** Graceful handling of connection drops common with local inference servers (e.g., handling LM Studio connection timeouts).

### 3. Document Processing Pipeline
The application features a sophisticated document ingestion system capable of:
* Parsing diverse file formats (PDF, PPT, PPTX).
* Sanitizing and converting binary content into text-based tokens usable by the LLM.
* Managing temporary storage and cleanup to ensure efficient resource usage on the host machine.

### 4. Reactive State Management
The frontend employs advanced React patterns to handle the volatility of AI responses:
* **Custom Hooks:** Specialized hooks manage window resizing, arrow key navigation, and document titles to ensure the web app feels like a native desktop tool.
* **Real-time Feedback:** Visual indicators for connection status, network errors, and inference loading states provide immediate feedback on the state of the local server.

## Tech Stack

* **Language:** TypeScript (Frontend & Backend)
* **Framework:** React (Vite)
* **Styling:** SCSS / CSS Modules
* **Runtime:** Node.js
* **AI Integration:** LM Studio (Local Inference Server)
* **Data Handling:** JSON-based persistent storage for study groups and settings.

## Getting Started

Since this is a self-hosted tool, you will need to run the backend and frontend locally, along with an inference server.

### Prerequisites
1.  Node.js (v18+)
2.  LM Studio (or any OAI-compatible local server) running on port 1234.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/big-beautfull-ai-app.git](https://github.com/yourusername/big-beautfull-ai-app.git)
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Connect AI**
    * Open LM Studio.
    * Load your preferred model (e.g., Llama 3, Mistral).
    * Start the Local Server.
    * The app will automatically detect the connection.

## Future Roadmap

* **Vector Database Integration:** Moving from direct context injection to a vector store (like Pinecone or ChromaDB) for handling massive datasets and entire textbooks.
* **Multi-Model Support:** Allowing the user to switch between different models for different tasks (e.g., a coding model for CS homework, a creative model for writing).
* **Export to PDF:** Save generated summaries and quizzes directly to downloadable PDF files.
