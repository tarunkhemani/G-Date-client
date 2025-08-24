import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import "./index.css"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// import React, { useState, useEffect } from 'react';

// // --- Mock Data for Student Profiles ---
// const mockStudents = [
//   {
//     id: 1,
//     name: 'Ananya Sharma',
//     course: 'B.A. Psychology',
//     year: '2nd Year',
//     bio: 'Lover of poetry, rainy days, and deep conversations. Looking for someone to explore campus coffee shops with.',
//     profilePic: 'https://placehold.co/400x400/f87171/ffffff?text=AS',
//   },
//   {
//     id: 2,
//     name: 'Rohan Verma',
//     course: 'B.Tech CSE',
//     year: '3rd Year',
//     bio: 'Code by day, guitar by night. I can probably fix your laptop. Seeking a partner-in-crime for late-night coding sessions.',
//     profilePic: 'https://placehold.co/400x400/c084fc/ffffff?text=RV',
//   },
//   {
//     id: 3,
//     name: 'Priya Patel',
//     course: 'M.Sc. Biology',
//     year: '1st Year',
//     bio: 'Fascinated by the little things in life, from cells to stars. Let\'s go stargazing or visit the botanical gardens.',
//     profilePic: 'https://placehold.co/400x400/fbbf24/ffffff?text=PP',
//   },
//   {
//     id: 4,
//     name: 'Sameer Khan',
//     course: 'B.Com Honours',
//     year: 'Final Year',
//     bio: 'Future entrepreneur with a passion for street food and old Bollywood movies. My financial advice is usually sound.',
//     profilePic: 'https://placehold.co/400x400/60a5fa/ffffff?text=SK',
//   },
//   {
//     id: 5,
//     name: 'Isha Singh',
//     course: 'B.Des Fashion',
//     year: '2nd Year',
//     bio: 'I see the world in colors and patterns. My ideal date involves thrifting and turning old clothes into something new.',
//     profilePic: 'https://placehold.co/400x400/f472b6/ffffff?text=IS',
//   },
//   {
//     id: 6,
//     name: 'Arjun Reddy',
//     course: 'MBBS',
//     year: '4th Year',
//     bio: 'Surviving on caffeine and ambition. I have a weird sense of humor, probably from sleep deprivation. Make me laugh!',
//     profilePic: 'https://placehold.co/400x400/818cf8/ffffff?text=AR',
//   },
//     {
//     id: 7,
//     name: 'Meera Desai',
//     course: 'B.A. English Lit.',
//     year: '3rd Year',
//     bio: 'Lost in the world of classic novels and period dramas. Let\'s discuss Austen and Brontë over a cup of chai.',
//     profilePic: 'https://placehold.co/400x400/a78bfa/ffffff?text=MD',
//   },
//   {
//     id: 8,
//     name: 'Vikram Rathore',
//     course: 'LLB',
//     year: '2nd Year',
//     bio: 'I argue for a living, but I promise I\'m a good listener. Passionate about justice, debates, and spicy food.',
//     profilePic: 'https://placehold.co/400x400/fca5a5/ffffff?text=VR',
//   },
// ];

// // --- SVG Heart Icon Component ---
// const HeartIcon = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
//   </svg>
// );


// // --- Landing Page Component ---
// const LandingPage = ({ onLogin }) => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
//       <HeartIcon className="w-20 h-20 text-rose-400 mb-4" />
//       <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//         GChat
//       </h1>
//       <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//       <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//         <button
//           onClick={onLogin}
//           className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75"
//         >
//           Login with University ID
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- Student Card Component for Dashboard ---
// const StudentCard = ({ student, onChat }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img 
//         src={student.profilePic} 
//         alt={student.name} 
//         className="w-full h-48 object-cover"
//         onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Image+Error'; }}
//       />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button
//           onClick={() => onChat(student)}
//           className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2"
//         >
//           <HeartIcon className="w-5 h-5" />
//           GChat
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- Dashboard Page Component ---
// const DashboardPage = ({ students, onChat }) => {
//   return (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center gap-3 mb-8">
//            <HeartIcon className="w-10 h-10 text-rose-400" />
//            <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//              Campus Profiles
//            </h1>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.map(student => (
//             <StudentCard key={student.id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


// // --- Chat Page Component ---
// const ChatPage = ({ student, onBack }) => {
//   const [messages, setMessages] = useState([
//     { id: 1, text: `Hey! I saw your profile, you seem really interesting.`, sender: 'other' },
//     { id: 2, text: `I love your taste in movies! We should totally watch one sometime.`, sender: 'other' },
//     { id: 3, text: `That's so sweet! I'd love that. 😊`, sender: 'me' },
//   ]);
//   const [newMessage, setNewMessage] = useState('');

//   const handleSend = () => {
//     if (newMessage.trim()) {
//       setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'me' }]);
//       setNewMessage('');
//     }
//   };
  
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
//       {/* Chat Header */}
//       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
//         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <img 
//           src={student.profilePic} 
//           alt={student.name} 
//           className="w-10 h-10 rounded-full object-cover ml-2"
//           onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'; }}
//         />
//         <div className="ml-3">
//           <h2 className="font-bold text-slate-800 text-lg">{student.name}</h2>
//           <p className="text-sm text-slate-500">Online</p>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-grow p-4 overflow-y-auto">
//         {messages.map(msg => (
//           <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-3`}>
//             <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
//               <p>{msg.text}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input Area */}
//       <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type a message..."
//             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"
//           />
//           <button
//             onClick={handleSend}
//             className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// // --- Main App Component ---
// export default function App() {
//   // State to manage which page is currently visible
//   // 'landing', 'dashboard', or 'chat'
//   const [currentPage, setCurrentPage] = useState('landing');
  
//   // State to store the student profile selected for chatting
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   // Function to handle login and navigate to the dashboard
//   const handleLogin = () => {
//     setCurrentPage('dashboard');
//   };

//   // Function to handle selecting a student and navigating to the chat page
//   const handleStartChat = (student) => {
//     setSelectedStudent(student);
//     setCurrentPage('chat');
//   };

//   // Function to navigate back to the dashboard from the chat page
//   const handleBackToDashboard = () => {
//     setCurrentPage('dashboard');
//     setSelectedStudent(null);
//   };
  
//   // Add Google Fonts for a more romantic feel
//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

//   // Render the correct page based on the currentPage state
//   const renderPage = () => {
//     switch (currentPage) {
//       case 'dashboard':
//         return <DashboardPage students={mockStudents} onChat={handleStartChat} />;
//       case 'chat':
//         return <ChatPage student={selectedStudent} onBack={handleBackToDashboard} />;
//       case 'landing':
//       default:
//         return <LandingPage onLogin={handleLogin} />;
//     }
//   };

//   return (
//     // Main container with a romantic, gradient background
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
//       {renderPage()}
//     </main>
//   );
// }
