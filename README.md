# AI Interview Platform 🚀

An AI-powered mock interview platform built using the MERN Stack that helps users practice technical interviews with AI-generated questions, voice interaction, video interviews, analytics, and performance feedback.

---

## 📌 Features

- 🔐 User Authentication (JWT)
- 🤖 AI-generated interview questions
- 🎤 Speech-to-Text support
- 🔊 Text-to-Speech responses
- 🎥 Video interview support
- 📊 Advanced analytics dashboard
- 📄 PDF interview report export
- 💬 Real-time interview simulation
- 📱 Fully Responsive UI
- 📝 Interview history tracking
- ⚡ Fast and optimized frontend

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

### AI Integration
- OpenAI API / Gemini API

---

## 📂 Project Structure

```bash
Interview-AI/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sanjanayadav07/Interview-AI.git
```

### 2️⃣ Navigate to Project Folder

```bash
cd Interview-AI
```

---

## 🔧 Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## 🔧 Backend Setup

```bash
cd server
npm install
npm run server
```

Backend will run on:

```bash
http://localhost:5000
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_api_key
```

---

## 🌍 Deployment

### Frontend Deployment
- Vercel / Netlify

### Backend Deployment
- Render / Railway

---

## 👨‍💻 Author

### Sanjana Yadav

- GitHub: https://github.com/Sanjanayadav07
- LinkedIn: https://www.linkedin.com/in/sanjana-yadav007

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub and share it with others.

---

## 📜 License

This project is licensed under the MIT License.
