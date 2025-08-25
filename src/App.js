// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { io } from "socket.io-client";

// // --- Loading Spinner Component ---
// const LoadingSpinner = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//         <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-rose-400 border-t-transparent"></div>
//     </div>
// );

// // --- SVG Icons ---
// const HeartIcon = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
//   </svg>
// );

// const MenuIcon = ({ className }) => (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//     </svg>
// );

// // --- Login Form Modal Component ---
// const LoginForm = ({ onLoginAttempt, onNavigateToSignUp, onClose }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             setError("Please enter both email and password.");
//             return;
//         }
//         setError('');
//         onLoginAttempt({ email, password });
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
//             <div className="relative w-full max-w-sm bg-white/90 p-8 rounded-2xl shadow-xl">
//                 <h2 className="text-2xl font-bold text-slate-700 text-center mb-2">Welcome Back!</h2>
//                 <p className="text-center text-slate-500 mb-6">Please login to continue.</p>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input type="email" placeholder="University Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6"> New to GChat?{' '} <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline"> Sign Up </button> </p>
//             </div>
//         </div>
//     );
// };

// // --- Landing Page Component ---
// const LandingPage = ({ onNavigateToSignUp, onLoginAttempt }) => {
//     const [showLogin, setShowLogin] = useState(false);

//     const handleSignUpClick = () => {
//         setShowLogin(false);
//         onNavigateToSignUp();
//     };

//     const handleLogin = (credentials) => {
//         setShowLogin(false);
//         onLoginAttempt(credentials);
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
//             {showLogin && <LoginForm onClose={() => setShowLogin(false)} onNavigateToSignUp={handleSignUpClick} onLoginAttempt={handleLogin} />}
//             <HeartIcon className="w-20 h-20 text-rose-400 mb-4" />
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> GChat </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all"> Login / Sign Up </button>
//             </div>
//         </div>
//     );
// };

// // --- Profile Form Page Component ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({ name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: '' });
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const isEditMode = !!existingProfile;

//     useEffect(() => {
//         if (isEditMode && existingProfile) {
//             setFormData({
//                 name: existingProfile.name || '',
//                 course: existingProfile.course || '',
//                 gender: existingProfile.gender || 'Female',
//                 year: existingProfile.year || '1st Year',
//                 bio: existingProfile.bio || '',
//                 email: existingProfile.email || '',
//                 password: '',
//             });
//         }
//     }, [isEditMode, existingProfile]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setProfilePicFile(e.target.files[0]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onProfileSubmit(formData, profilePicFile);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'} </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>Female</option> <option>Male</option> <option>Other</option> </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>1st Year</option> <option>2nd Year</option> <option>3rd Year</option> <option>4th Year</option> <option>Final Year</option> </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none" required></textarea>
//                     <div>
//                         <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
//                         <input type="file" name="profilePic" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
//                     </div>
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500"> {isEditMode ? 'Update Profile' : 'Create Profile'} </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Sidebar Component ---
// const Sidebar = ({ isOpen, onClose, onNavigate, onLogout }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 z-50">
//             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
//             <div className="relative w-72 h-full bg-rose-50 shadow-xl p-6 flex flex-col">
//                 <div className="flex items-center gap-3 mb-8">
//                     <HeartIcon className="w-10 h-10 text-rose-400" />
//                     <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>GChat</h1>
//                 </div>
//                 <nav className="flex flex-col gap-4">
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100"> Logout </button>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component (UPDATED) ---
// const StudentCard = ({ student, onViewProfile, onStartChat }) => (
//     <div onClick={() => onViewProfile(student)} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform flex flex-col cursor-pointer">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button 
//           onClick={(e) => {
//             e.stopPropagation(); // --- FIX ---: Prevents the card's onClick from firing
//             onStartChat(student);
//           }} 
//           className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 flex items-center justify-center gap-2"
//         >
//           <HeartIcon className="w-5 h-5" /> GChat
//         </button>
//       </div>
//     </div>
// );

// // --- Dashboard Page Component (UPDATED) ---
// const DashboardPage = ({ students, onViewProfile, onStartChat, onMenuClick, currentUser }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500"> <MenuIcon className="w-8 h-8"/> </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> Campus Profiles </h1>
//             </div>
//             <div className="flex items-center gap-3">
//                 <span className="hidden sm:block font-semibold text-slate-700"> Welcome, {currentUser?.name} </span>
//                 <img src={currentUser?.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Me'} alt="Your profile" className="w-12 h-12 rounded-full object-cover border-2 border-rose-200 shadow-sm" />
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => ( 
//             <StudentCard 
//               key={student._id} 
//               student={student} 
//               onViewProfile={onViewProfile} 
//               onStartChat={onStartChat} 
//             /> 
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page Component ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner.conversationId} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
//                         <img src={partner.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={partner.name} className="w-16 h-16 rounded-full object-cover" />
//                         <div className="ml-4">
//                             <h3 className="text-lg font-bold text-slate-800">{partner.name}</h3>
//                             <p className="text-slate-500 text-sm">Click to view conversation</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );

// // --- Chat Page Component ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [conversation, setConversation] = useState(null);
//   const [isChatLoading, setIsChatLoading] = useState(true); 
//   const socket = useRef();
//   const scrollRef = useRef();

//   useEffect(() => {
//     socket.current = io("ws://localhost:5000");
//     socket.current.on("getMessage", (data) => {
//       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
//     });
//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);
  
//   useEffect(() => {
//     if (currentUser?._id) {
//       socket.current.emit("addUser", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchChatData = async () => {
//         setIsChatLoading(true);
//         try {
//             const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//             const currentConversation = convRes.data;
//             setConversation(currentConversation);

//             if (currentConversation?._id) {
//                 const messagesRes = await axios.get('/messages/' + currentConversation._id);
//                 setMessages(messagesRes.data);
//             }
//         } catch (err) {
//             console.error("Failed to load chat data", err);
//         } finally {
//             setIsChatLoading(false);
//         }
//     };
//     if (currentUser?._id && student?._id) {
//         fetchChatData();
//     }
//   }, [currentUser, student]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === '' || !conversation?._id) return;

//     const message = {
//       senderId: currentUser._id,
//       text: newMessage,
//       conversationId: conversation._id,
//     };
    
//     socket.current.emit("sendMessage", {
//       senderId: currentUser._id,
//       receiverId: student._id,
//       text: newMessage,
//     });
    
//     try {
//         const res = await axios.post('/messages', message);
//         setMessages([...messages, res.data]);
//         setNewMessage('');
//     } catch (err) {
//         console.log(err);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend(e);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
//       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
//         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
//         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" />
//         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
//       </div>
//       <div className="flex-grow p-4 overflow-y-auto">
//         {messages.map((msg, index) => (
//           <div ref={scrollRef} key={index}>
//             <div className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} mb-3`}>
//               <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser._id ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
//                 <p>{msg.text}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input 
//             type="text" 
//             value={newMessage} 
//             onChange={(e) => setNewMessage(e.target.value)} 
//             onKeyPress={handleKeyPress} 
//             placeholder={isChatLoading ? "Loading chat..." : "Type a message..."} 
//             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
//             disabled={isChatLoading}
//             />
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={isChatLoading}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // --- Full Profile Page Component ---
// const FullProfilePage = ({ profileId, onBack, onStartChat }) => {
//     const [profileData, setProfileData] = useState(null);
//     const [connectionStatus, setConnectionStatus] = useState('none');
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             setIsLoading(true);
//             try {
//                 const res = await axios.get(`/connections/profile/${profileId}`);
//                 setProfileData(res.data.profile);
//                 setConnectionStatus(res.data.status);
//             } catch (err) {
//                 console.error("Failed to fetch profile", err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProfile();
//     }, [profileId]);

//     const handleSendRequest = async () => {
//         try {
//             await axios.post('/connections/request', { receiverId: profileId });
//             setConnectionStatus('pending');
//         } catch (err) {
//             console.error("Failed to send request", err);
//         }
//     };

//     if (isLoading) return <LoadingSpinner />;
//     if (!profileData) return <div className="text-center p-8">User not found.</div>;

//     return (
//         <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-rose-50 to-purple-50">
//             <div className="max-w-2xl mx-auto">
//                 <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                     Back to Dashboard
//                 </button>

//                 <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8">
//                     <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
//                         <img src={profileData.profilePic || 'https://placehold.co/200x200/cccccc/ffffff?text=Pic'} alt={profileData.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
//                         <div className="text-center sm:text-left">
//                             <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>{profileData.name}</h1>
//                             <p className="text-lg text-slate-500 mt-1">{profileData.course}, {profileData.year}</p>
//                         </div>
//                     </div>
//                     <p className="text-slate-700 my-6 text-center sm:text-left text-lg leading-relaxed">{profileData.bio}</p>
                    
//                     <div className="flex flex-col sm:flex-row gap-4 mt-6">
//                         {connectionStatus === 'connected' ? (
//                             <button onClick={() => onStartChat(profileData)} className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-all flex items-center justify-center gap-2">
//                                 <HeartIcon className="w-6 h-6" /> GChat
//                             </button>
//                         ) : connectionStatus === 'pending' ? (
//                             <button className="w-full bg-slate-300 text-slate-600 font-bold py-3 px-6 rounded-xl cursor-not-allowed" disabled>
//                                 Request Sent
//                             </button>
//                         ) : (
//                             <button onClick={handleSendRequest} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all">
//                                 Connect
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);

//   axios.defaults.baseURL = 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   useEffect(() => {
//     const verifyUser = async () => {
//         const token = localStorage.getItem("gchat_token");
//         if (token) {
//             try {
//                 axios.defaults.headers.common['token'] = `Bearer ${token}`;
//                 const res = await axios.get("/auth/verify");
//                 setCurrentUser(res.data);
//                 setCurrentPage('dashboard');
//             } catch (err) {
//                 console.log("Token verification failed:", err);
//                 localStorage.removeItem("gchat_token");
//             }
//         }
//         setIsAuthLoading(false);
//     };
//     verifyUser();
//   }, []);

//   const handleLoginAttempt = async (credentials) => {
//     setIsLoading(true);
//     try {
//         const res = await axios.post('/auth/login', credentials);
//         setCurrentUser(res.data);
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//         alert("Login failed. Please check your credentials.");
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       setConversations([]);
//       localStorage.removeItem("gchat_token");
//       delete axios.defaults.headers.common['token'];
//       setCurrentPage('landing');
//   };
  
//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
//         if (key === 'password' && !formData[key]) return;
//         submissionData.append(key, formData[key]);
//     });
//     if (profilePicFile) {
//         submissionData.append('profilePic', profilePicFile);
//     }
//     try {
//         if (currentUser) {
//             const res = await axios.put(`/users/${currentUser._id}`, submissionData);
//             setCurrentUser(res.data);
//             alert("Profile updated successfully!");
//             setCurrentPage('dashboard');
//         } else {
//             await axios.post('/auth/register', submissionData);
//             await handleLoginAttempt({ email: formData.email, password: formData.password });
//         }
//     } catch (err) {
//         console.error("Profile submission failed:", err);
//         alert("Operation failed. Please try again.");
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleStartChat = (student) => {
//     setSelectedStudent(student);
//     setCurrentPage('chat');
//   };
  
//   const handleViewProfile = (student) => {
//     setSelectedStudent(student);
//     setCurrentPage('fullProfile');
//   };

//   const handleBackToDashboard = () => {
//     setCurrentPage('dashboard');
//     setSelectedStudent(null);
//   };
  
//   const handleSidebarNavigate = (page) => {
//     if (page === 'editProfile') {
//         setCurrentPage('profileForm');
//     } else {
//         setCurrentPage(page);
//     }
//     setIsSidebarOpen(false);
//   };
  
//   useEffect(() => {
//     const fetchStudents = async () => {
//         if (currentUser) {
//             try {
//                 const token = localStorage.getItem("gchat_token");
//                 axios.defaults.headers.common['token'] = `Bearer ${token}`;
//                 const res = await axios.get('/users');
//                 setStudents(res.data);
//             } catch (err) {
//                 console.error("Failed to fetch students:", err);
//             }
//         }
//     };
//     fetchStudents();
//   }, [currentUser]);

//   useEffect(() => {
//     const getConversations = async () => {
//         if (currentUser && currentPage === 'allChats') {
//             try {
//                 const res = await axios.get("/conversations/" + currentUser._id);
//                 setConversations(res.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };
//     getConversations();
//   }, [currentUser, currentPage]);

//   useEffect(() => {
//     const wakeupServer = async () => {
//         try {
//             console.log("Pinging server to wake it up...");
//             await axios.get('/wakeup');
//             console.log("Server is awake!");
//         } catch (err) {
//             console.error("Server ping failed:", err);
//         }
//     };
//     wakeupServer();
//   }, []);

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

//   const renderPage = () => {
//     if (isAuthLoading) {
//         return <LoadingSpinner />;
//     }
    
//     if (!currentUser) {
//         switch (currentPage) {
//             case 'profileForm':
//                 return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={null} />;
//             default:
//                 return <LandingPage onNavigateToSignUp={navigateToSignUp} onLoginAttempt={handleLoginAttempt} />;
//         }
//     }

//     switch (currentPage) {
//       case 'profileForm':
//         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
//       case 'chat':
//         return <ChatPage key={selectedStudent._id} student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('dashboard')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={conversations} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'dashboard':
//         return <DashboardPage students={students} currentUser={currentUser} onViewProfile={handleViewProfile} onStartChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//       case 'fullProfile':
//         return <FullProfilePage profileId={selectedStudent._id} onBack={() => setCurrentPage('dashboard')} onStartChat={handleStartChat} />;
//       default:
//         return <DashboardPage students={students} currentUser={currentUser} onViewProfile={handleViewProfile} onStartChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
//       {isLoading && <LoadingSpinner />}
//       <Sidebar 
//         isOpen={isSidebarOpen && currentUser} 
//         onClose={() => setIsSidebarOpen(false)} 
//         onNavigate={handleSidebarNavigate}
//         onLogout={handleLogout}
//       />
//       {renderPage()}
//     </main>
//   );
// }
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { io } from "socket.io-client";

// // --- Loading Spinner Component ---
// const LoadingSpinner = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//         <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-rose-400 border-t-transparent"></div>
//     </div>
// );

// // --- SVG Icons ---
// const HeartIcon = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
//   </svg>
// );

// const MenuIcon = ({ className }) => (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//     </svg>
// );

// // --- Login Form Modal Component ---
// const LoginForm = ({ onLoginAttempt, onNavigateToSignUp, onClose }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             setError("Please enter both email and password.");
//             return;
//         }
//         setError('');
//         onLoginAttempt({ email, password });
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
//             <div className="relative w-full max-w-sm bg-white/90 p-8 rounded-2xl shadow-xl">
//                 <h2 className="text-2xl font-bold text-slate-700 text-center mb-2">Welcome Back!</h2>
//                 <p className="text-center text-slate-500 mb-6">Please login to continue.</p>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input type="email" placeholder="University Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6"> New to GChat?{' '} <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline"> Sign Up </button> </p>
//             </div>
//         </div>
//     );
// };

// // --- Landing Page Component ---
// const LandingPage = ({ onNavigateToSignUp, onLoginAttempt }) => {
//     const [showLogin, setShowLogin] = useState(false);

//     const handleSignUpClick = () => {
//         setShowLogin(false);
//         onNavigateToSignUp();
//     };

//     const handleLogin = (credentials) => {
//         setShowLogin(false);
//         onLoginAttempt(credentials);
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
//             {showLogin && <LoginForm onClose={() => setShowLogin(false)} onNavigateToSignUp={handleSignUpClick} onLoginAttempt={handleLogin} />}
//             <HeartIcon className="w-20 h-20 text-rose-400 mb-4" />
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> GChat </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all"> Login / Sign Up </button>
//             </div>
//         </div>
//     );
// };

// // --- Profile Form Page Component ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({ name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: '' });
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const isEditMode = !!existingProfile;

//     useEffect(() => {
//         if (isEditMode && existingProfile) {
//             setFormData({
//                 name: existingProfile.name || '',
//                 course: existingProfile.course || '',
//                 gender: existingProfile.gender || 'Female',
//                 year: existingProfile.year || '1st Year',
//                 bio: existingProfile.bio || '',
//                 email: existingProfile.email || '',
//                 password: '',
//             });
//         }
//     }, [isEditMode, existingProfile]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setProfilePicFile(e.target.files[0]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onProfileSubmit(formData, profilePicFile);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'} </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>Female</option> <option>Male</option> <option>Other</option> </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>1st Year</option> <option>2nd Year</option> <option>3rd Year</option> <option>4th Year</option> <option>Final Year</option> </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none" required></textarea>
//                     <div>
//                         <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
//                         <input type="file" name="profilePic" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
//                     </div>
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500"> {isEditMode ? 'Update Profile' : 'Create Profile'} </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Sidebar Component ---
// const Sidebar = ({ isOpen, onClose, onNavigate, onLogout }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 z-50">
//             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
//             <div className="relative w-72 h-full bg-rose-50 shadow-xl p-6 flex flex-col">
//                 <div className="flex items-center gap-3 mb-8">
//                     <HeartIcon className="w-10 h-10 text-rose-400" />
//                     <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>GChat</h1>
//                 </div>
//                 <nav className="flex flex-col gap-4">
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100"> Logout </button>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 flex items-center justify-center gap-2">
//           <HeartIcon className="w-5 h-5" /> GChat
//         </button>
//       </div>
//     </div>
// );

// // --- Dashboard Page Component ---
// const DashboardPage = ({ students, onChat, onMenuClick, currentUser }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500"> <MenuIcon className="w-8 h-8"/> </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> Campus Profiles </h1>
//             </div>
//             <div className="flex items-center gap-3">
//                 <span className="hidden sm:block font-semibold text-slate-700"> Welcome, {currentUser?.name} </span>
//                 <img src={currentUser?.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Me'} alt="Your profile" className="w-12 h-12 rounded-full object-cover border-2 border-rose-200 shadow-sm" />
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => ( <StudentCard key={student._id} student={student} onChat={onChat} /> ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page Component ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner.conversationId} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
//                         <img src={partner.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={partner.name} className="w-16 h-16 rounded-full object-cover" />
//                         <div className="ml-4">
//                             <h3 className="text-lg font-bold text-slate-800">{partner.name}</h3>
//                             <p className="text-slate-500 text-sm">Click to view conversation</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );

// // --- Chat Page Component ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [conversation, setConversation] = useState(null);
//   const [isChatLoading, setIsChatLoading] = useState(true); 
//   const socket = useRef();
//   const scrollRef = useRef();

//   useEffect(() => {
//     socket.current = io(process.env.REACT_APP_SOCKET_URL || "ws://localhost:5000");
//     socket.current.on("getMessage", (data) => {
//       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
//     });
//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);
  
//   useEffect(() => {
//     if (currentUser?._id) {
//       socket.current.emit("addUser", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchChatData = async () => {
//         setIsChatLoading(true);
//         try {
//             const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//             const currentConversation = convRes.data;
//             setConversation(currentConversation);

//             if (currentConversation?._id) {
//                 const messagesRes = await axios.get('/messages/' + currentConversation._id);
//                 setMessages(messagesRes.data);
//             }
//         } catch (err) {
//             console.error("Failed to load chat data", err);
//         } finally {
//             setIsChatLoading(false);
//         }
//     };
//     if (currentUser?._id && student?._id) {
//         fetchChatData();
//     }
//   }, [currentUser, student]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === '' || !conversation?._id) return;

//     const message = {
//       senderId: currentUser._id,
//       text: newMessage,
//       conversationId: conversation._id,
//     };
    
//     socket.current.emit("sendMessage", {
//       senderId: currentUser._id,
//       receiverId: student._id,
//       text: newMessage,
//     });
    
//     try {
//         const res = await axios.post('/messages', message);
//         setMessages([...messages, res.data]);
//         setNewMessage('');
//     } catch (err) {
//         console.log(err);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend(e);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
//       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
//         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
//         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" />
//         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
//       </div>
//       <div className="flex-grow p-4 overflow-y-auto">
//         {messages.map((msg, index) => (
//           <div ref={scrollRef} key={index}>
//             <div className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} mb-3`}>
//               <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser._id ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
//                 <p>{msg.text}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input 
//             type="text" 
//             value={newMessage} 
//             onChange={(e) => setNewMessage(e.target.value)} 
//             onKeyPress={handleKeyPress} 
//             placeholder={isChatLoading ? "Loading chat..." : "Type a message..."} 
//             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
//             disabled={isChatLoading}
//             />
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={isChatLoading}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // --- Full Profile Page Component ---
// const FullProfilePage = ({ profileId, currentUser, onBack, onStartChat }) => {
//     const [profileData, setProfileData] = useState(null);
//     const [connectionStatus, setConnectionStatus] = useState('none');
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             setIsLoading(true);
//             try {
//                 const res = await axios.get(`/connections/profile/${profileId}`);
//                 setProfileData(res.data.profile);
//                 setConnectionStatus(res.data.status);
//             } catch (err) {
//                 console.error("Failed to fetch profile", err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProfile();
//     }, [profileId]);

//     const handleSendRequest = async () => {
//         try {
//             await axios.post('/connections/request', { receiverId: profileId });
//             setConnectionStatus('pending');
//         } catch (err) {
//             console.error("Failed to send request", err);
//         }
//     };

//     if (isLoading) return <LoadingSpinner />;
//     if (!profileData) return <div className="text-center p-8">User not found.</div>;

//     return (
//         <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-rose-50 to-purple-50">
//             <div className="max-w-2xl mx-auto">
//                 <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                     Back to Dashboard
//                 </button>

//                 <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8">
//                     <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
//                         <img src={profileData.profilePic || 'https://placehold.co/200x200/cccccc/ffffff?text=Pic'} alt={profileData.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
//                         <div className="text-center sm:text-left">
//                             <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>{profileData.name}</h1>
//                             <p className="text-lg text-slate-500 mt-1">{profileData.course}, {profileData.year}</p>
//                         </div>
//                     </div>
//                     <p className="text-slate-700 my-6 text-center sm:text-left text-lg leading-relaxed">{profileData.bio}</p>
                    
//                     <div className="flex flex-col sm:flex-row gap-4 mt-6">
//                         {connectionStatus === 'connected' ? (
//                             <button onClick={() => onStartChat(profileData)} className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-all flex items-center justify-center gap-2">
//                                 <HeartIcon className="w-6 h-6" /> GChat
//                             </button>
//                         ) : connectionStatus === 'pending' ? (
//                             <button className="w-full bg-slate-300 text-slate-600 font-bold py-3 px-6 rounded-xl cursor-not-allowed" disabled>
//                                 Request Sent
//                             </button>
//                         ) : (
//                             <button onClick={handleSendRequest} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all">
//                                 Connect
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);

//   axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   useEffect(() => {
//     const verifyUser = async () => {
//         const token = localStorage.getItem("gchat_token");
//         if (token) {
//             try {
//                 axios.defaults.headers.common['token'] = `Bearer ${token}`;
//                 const res = await axios.get("/auth/verify");
//                 setCurrentUser(res.data);
//                 setCurrentPage('dashboard');
//             } catch (err) {
//                 console.log("Token verification failed:", err);
//                 localStorage.removeItem("gchat_token");
//             }
//         }
//         setIsAuthLoading(false);
//     };
//     verifyUser();
//   }, []);

//   const handleLoginAttempt = async (credentials) => {
//     setIsLoading(true);
//     try {
//         const res = await axios.post('/auth/login', credentials);
//         setCurrentUser(res.data);
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//         alert("Login failed. Please check your credentials.");
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       setConversations([]);
//       localStorage.removeItem("gchat_token");
//       delete axios.defaults.headers.common['token'];
//       setCurrentPage('landing');
//   };
  
//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
//         if (key === 'password' && !formData[key]) return;
//         submissionData.append(key, formData[key]);
//     });
//     if (profilePicFile) {
//         submissionData.append('profilePic', profilePicFile);
//     }
//     try {
//         if (currentUser) {
//             const res = await axios.put(`/users/${currentUser._id}`, submissionData);
//             setCurrentUser(res.data);
//             alert("Profile updated successfully!");
//             setCurrentPage('dashboard');
//         } else {
//             await axios.post('/auth/register', submissionData);
//             await handleLoginAttempt({ email: formData.email, password: formData.password });
//         }
//     } catch (err) {
//         console.error("Profile submission failed:", err);
//         alert("Operation failed. Please try again.");
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleStartChat = (student) => {
//     setSelectedStudent(student);
//     setCurrentPage('chat');
//   };
  
//   const handleViewProfile = (student) => {
//     setSelectedStudent(student);
//     setCurrentPage('fullProfile');
//   };

//   const handleBackToDashboard = () => {
//     setCurrentPage('dashboard');
//     setSelectedStudent(null);
//   };
  
//   const handleSidebarNavigate = (page) => {
//     if (page === 'editProfile') {
//         setCurrentPage('profileForm');
//     } else {
//         setCurrentPage(page);
//     }
//     setIsSidebarOpen(false);
//   };
  
//   useEffect(() => {
//     const fetchStudents = async () => {
//         if (currentUser) {
//             try {
//                 const token = localStorage.getItem("gchat_token");
//                 axios.defaults.headers.common['token'] = `Bearer ${token}`;
//                 const res = await axios.get('/users');
//                 setStudents(res.data);
//             } catch (err) {
//                 console.error("Failed to fetch students:", err);
//             }
//         }
//     };
//     fetchStudents();
//   }, [currentUser]);

//   useEffect(() => {
//     const getConversations = async () => {
//         if (currentUser && currentPage === 'allChats') {
//             try {
//                 const res = await axios.get("/conversations/" + currentUser._id);
//                 setConversations(res.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };
//     getConversations();
//   }, [currentUser, currentPage]);

//   useEffect(() => {
//     const wakeupServer = async () => {
//         try {
//             console.log("Pinging server to wake it up...");
//             await axios.get('/wakeup');
//             console.log("Server is awake!");
//         } catch (err) {
//             console.error("Server ping failed:", err);
//         }
//     };
//     wakeupServer();
//   }, []);

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

//   const renderPage = () => {
//     if (isAuthLoading) {
//         return <LoadingSpinner />;
//     }
    
//     if (!currentUser) {
//         switch (currentPage) {
//             case 'profileForm':
//                 return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={null} />;
//             default:
//                 return <LandingPage onNavigateToSignUp={navigateToSignUp} onLoginAttempt={handleLoginAttempt} />;
//         }
//     }

//     switch (currentPage) {
//       case 'profileForm':
//         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
//       case 'chat':
//         return <ChatPage key={selectedStudent._id} student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('dashboard')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={conversations} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'dashboard':
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleViewProfile} onMenuClick={() => setIsSidebarOpen(true)} />;
//       case 'fullProfile':
//         return <FullProfilePage profileId={selectedStudent._id} currentUser={currentUser} onBack={() => setCurrentPage('dashboard')} onStartChat={handleStartChat} />;
//       default:
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleViewProfile} onMenuClick={() => setIsSidebarOpen(true)} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
//       {isLoading && <LoadingSpinner />}
//       <Sidebar 
//         isOpen={isSidebarOpen && currentUser} 
//         onClose={() => setIsSidebarOpen(false)} 
//         onNavigate={handleSidebarNavigate}
//         onLogout={handleLogout}
//       />
//       {renderPage()}
//     </main>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-rose-400 border-t-transparent"></div>
    </div>
);

// --- SVG Icons ---
const HeartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const MenuIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

// --- Login Form Modal Component ---
const LoginForm = ({ onLoginAttempt, onNavigateToSignUp, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setError('');
        onLoginAttempt({ email, password });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-sm bg-white/90 p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-slate-700 text-center mb-2">Welcome Back!</h2>
                <p className="text-center text-slate-500 mb-6">Please login to continue.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="University Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600">Login</button>
                </form>
                <p className="text-center text-sm text-slate-600 mt-6"> New to GChat?{' '} <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline"> Sign Up </button> </p>
            </div>
        </div>
    );
};

// --- Landing Page Component ---
const LandingPage = ({ onNavigateToSignUp, onLoginAttempt }) => {
    const [showLogin, setShowLogin] = useState(false);

    const handleSignUpClick = () => {
        setShowLogin(false);
        onNavigateToSignUp();
    };

    const handleLogin = (credentials) => {
        setShowLogin(false);
        onLoginAttempt(credentials);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            {showLogin && <LoginForm onClose={() => setShowLogin(false)} onNavigateToSignUp={handleSignUpClick} onLoginAttempt={handleLogin} />}
            <HeartIcon className="w-20 h-20 text-rose-400 mb-4" />
            <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> GChat </h1>
            <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
            <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
                <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all"> Login / Sign Up </button>
            </div>
        </div>
    );
};

// --- Profile Form Page Component ---
const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
    const [formData, setFormData] = useState({ name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: '' });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const isEditMode = !!existingProfile;

    useEffect(() => {
        if (isEditMode && existingProfile) {
            setFormData({
                name: existingProfile.name || '',
                course: existingProfile.course || '',
                gender: existingProfile.gender || 'Female',
                year: existingProfile.year || '1st Year',
                bio: existingProfile.bio || '',
                email: existingProfile.email || '',
                password: '',
            });
        }
    }, [isEditMode, existingProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProfilePicFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onProfileSubmit(formData, profilePicFile);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-6">
                    <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
                    <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'} </h2>
                    <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isEditMode && (
                        <>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                            <hr className="border-slate-200" />
                        </>
                    )}
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                    <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                    <div className="flex gap-4">
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>Female</option> <option>Male</option> <option>Other</option> </select>
                        <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>1st Year</option> <option>2nd Year</option> <option>3rd Year</option> <option>4th Year</option> <option>Final Year</option> </select>
                    </div>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none" required></textarea>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
                        <input type="file" name="profilePic" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                    </div>
                    <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500"> {isEditMode ? 'Update Profile' : 'Create Profile'} </button>
                </form>
            </div>
        </div>
    );
};

// --- Sidebar Component ---
const Sidebar = ({ isOpen, onClose, onNavigate, onLogout }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-72 h-full bg-rose-50 shadow-xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <HeartIcon className="w-10 h-10 text-rose-400" />
                    <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>GChat</h1>
                </div>
                <nav className="flex flex-col gap-4">
                    <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Dashboard</button>
                    <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">My Chats</button>
                    <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Edit Profile</button>
                </nav>
                <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100"> Logout </button>
            </div>
        </div>
    );
};

// --- Student Card Component ---
const StudentCard = ({ student, onChat }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform flex flex-col">
      <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
        <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
        <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
        <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 flex items-center justify-center gap-2">
          <HeartIcon className="w-5 h-5" /> GChat
        </button>
      </div>
    </div>
);

// --- Dashboard Page Component ---
const DashboardPage = ({ students, onChat, onMenuClick, currentUser }) => (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500"> <MenuIcon className="w-8 h-8"/> </button>
                <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> Campus Profiles </h1>
            </div>
            <div className="flex items-center gap-3">
                <span className="hidden sm:block font-semibold text-slate-700"> Welcome, {currentUser?.name} </span>
                <img src={currentUser?.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Me'} alt="Your profile" className="w-12 h-12 rounded-full object-cover border-2 border-rose-200 shadow-sm" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.filter(s => s._id !== currentUser?._id).map(student => ( <StudentCard key={student._id} student={student} onChat={onChat} /> ))}
        </div>
      </div>
    </div>
);

// --- All Chats Page Component ---
const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> </button>
                <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
            </div>
            <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
                <p>For your privacy, all conversations are deleted after 24 hours.</p>
            </div>
            <div className="space-y-4">
                {chatPartners.map(partner => (
                    <div key={partner.conversationId} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <img src={partner.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={partner.name} className="w-16 h-16 rounded-full object-cover" />
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-slate-800">{partner.name}</h3>
                            <p className="text-slate-500 text-sm">Click to view conversation</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Chat Page Component ---
const ChatPage = ({ student, currentUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(true); 
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL || "ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (currentUser?._id) {
      socket.current.emit("addUser", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchChatData = async () => {
        setIsChatLoading(true);
        try {
            const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
            const currentConversation = convRes.data;
            setConversation(currentConversation);

            if (currentConversation?._id) {
                const messagesRes = await axios.get('/messages/' + currentConversation._id);
                setMessages(messagesRes.data);
            }
        } catch (err) {
            console.error("Failed to load chat data", err);
        } finally {
            setIsChatLoading(false);
        }
    };
    if (currentUser?._id && student?._id) {
        fetchChatData();
    }
  }, [currentUser, student]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !conversation?._id) return;

    const message = {
      senderId: currentUser._id,
      text: newMessage,
      conversationId: conversation._id,
    };
    
    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: student._id,
      text: newMessage,
    });
    
    try {
        const res = await axios.post('/messages', message);
        setMessages([...messages, res.data]);
        setNewMessage('');
    } catch (err) {
        console.log(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
      <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
        <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" />
        <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div ref={scrollRef} key={index}>
            <div className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser._id ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
        <div className="flex items-center">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            onKeyPress={handleKeyPress} 
            placeholder={isChatLoading ? "Loading chat..." : "Type a message..."} 
            className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
            disabled={isChatLoading}
            />
          <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={isChatLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const navigateToSignUp = () => setCurrentPage('profileForm');
  
  useEffect(() => {
    const verifyUser = async () => {
        const token = localStorage.getItem("gchat_token");
        if (token) {
            try {
                axios.defaults.headers.common['token'] = `Bearer ${token}`;
                const res = await axios.get("/auth/verify");
                setCurrentUser(res.data);
                setCurrentPage('dashboard');
            } catch (err) {
                console.log("Token verification failed:", err);
                localStorage.removeItem("gchat_token");
            }
        }
        setIsAuthLoading(false);
    };
    verifyUser();
  }, []);

  const handleLoginAttempt = async (credentials) => {
    setIsLoading(true);
    try {
        const res = await axios.post('/auth/login', credentials);
        setCurrentUser(res.data);
        localStorage.setItem("gchat_token", res.data.accessToken);
        setCurrentPage('dashboard');
    } catch (err) {
        console.error("Login failed:", err);
        alert("Login failed. Please check your credentials.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setStudents([]);
      setConversations([]);
      localStorage.removeItem("gchat_token");
      delete axios.defaults.headers.common['token'];
      setCurrentPage('landing');
  };
  
  const handleProfileSubmit = async (formData, profilePicFile) => {
    setIsLoading(true);
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        if (key === 'password' && !formData[key]) return;
        submissionData.append(key, formData[key]);
    });
    if (profilePicFile) {
        submissionData.append('profilePic', profilePicFile);
    }
    try {
        if (currentUser) {
            const res = await axios.put(`/users/${currentUser._id}`, submissionData);
            setCurrentUser(res.data);
            alert("Profile updated successfully!");
            setCurrentPage('dashboard');
        } else {
            await axios.post('/auth/register', submissionData);
            await handleLoginAttempt({ email: formData.email, password: formData.password });
        }
    } catch (err) {
        console.error("Profile submission failed:", err);
        alert("Operation failed. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartChat = (student) => {
    setSelectedStudent(student);
    setCurrentPage('chat');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedStudent(null);
  };
  
  const handleSidebarNavigate = (page) => {
    if (page === 'editProfile') {
        setCurrentPage('profileForm');
    } else {
        setCurrentPage(page);
    }
    setIsSidebarOpen(false);
  };
  
  useEffect(() => {
    const fetchStudents = async () => {
        if (currentUser) {
            try {
                const token = localStorage.getItem("gchat_token");
                axios.defaults.headers.common['token'] = `Bearer ${token}`;
                const res = await axios.get('/users');
                setStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch students:", err);
            }
        }
    };
    fetchStudents();
  }, [currentUser]);

  useEffect(() => {
    const getConversations = async () => {
        if (currentUser && currentPage === 'allChats') {
            try {
                const res = await axios.get("/conversations/" + currentUser._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };
    getConversations();
  }, [currentUser, currentPage]);

  useEffect(() => {
    const wakeupServer = async () => {
        try {
            console.log("Pinging server to wake it up...");
            await axios.get('/wakeup');
            console.log("Server is awake!");
        } catch (err) {
            console.error("Server ping failed:", err);
        }
    };
    wakeupServer();
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const subscribeToPushNotifications = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window && currentUser) {
        try {
          const registration = await navigator.serviceWorker.ready;
          let subscription = await registration.pushManager.getSubscription();

          if (subscription === null) {
            console.log("Requesting permission for notifications...");
            const permission = await window.Notification.requestPermission();
            if (permission !== 'granted') {
                console.log("Notification permission not granted.");
                return;
            }

            // In a real app, you would fetch this from your server
            const vapidPublicKey = "YOUR_VAPID_PUBLIC_KEY_HERE"; 
            if (!vapidPublicKey) {
                console.error("VAPID public key not found.");
                return;
            }

            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: vapidPublicKey,
            });
          }

          await axios.post('/subscriptions', { subscription, userId: currentUser._id });
          console.log("Subscription sent to server successfully.");

        } catch (error) {
          console.error('Failed to subscribe to push notifications:', error);
        }
      }
    };
    subscribeToPushNotifications();
  }, [currentUser]);

  const renderPage = () => {
    if (isAuthLoading) {
        return <LoadingSpinner />;
    }
    
    if (!currentUser) {
        switch (currentPage) {
            case 'profileForm':
                return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={null} />;
            default:
                return <LandingPage onNavigateToSignUp={navigateToSignUp} onLoginAttempt={handleLoginAttempt} />;
        }
    }

    switch (currentPage) {
      case 'profileForm':
        return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
      case 'chat':
        return <ChatPage key={selectedStudent._id} student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
      case 'allChats':
        return <AllChatsPage chatPartners={conversations} onChat={handleStartChat} onBack={handleBackToDashboard} />;
      case 'dashboard':
      default:
        return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
    }
  };

  return (
    <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
      {isLoading && <LoadingSpinner />}
      <Sidebar 
        isOpen={isSidebarOpen && currentUser} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={handleSidebarNavigate}
        onLogout={handleLogout}
      />
      {renderPage()}
    </main>
  );
}
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { io } from "socket.io-client";

// // --- Loading Spinner Component ---
// const LoadingSpinner = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//         <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-rose-400 border-t-transparent"></div>
//     </div>
// );

// // --- SVG Icons ---
// const HeartIcon = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
//   </svg>
// );

// const MenuIcon = ({ className }) => (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//     </svg>
// );

// // --- Login Form Modal Component ---
// const LoginForm = ({ onLoginAttempt, onNavigateToSignUp, onClose }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             setError("Please enter both email and password.");
//             return;
//         }
//         setError('');
//         onLoginAttempt({ email, password });
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
//             <div className="relative w-full max-w-sm bg-white/90 p-8 rounded-2xl shadow-xl">
//                 <h2 className="text-2xl font-bold text-slate-700 text-center mb-2">Welcome Back!</h2>
//                 <p className="text-center text-slate-500 mb-6">Please login to continue.</p>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input type="email" placeholder="University Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6"> New to GChat?{' '} <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline"> Sign Up </button> </p>
//             </div>
//         </div>
//     );
// };

// // --- Landing Page Component ---
// const LandingPage = ({ onNavigateToSignUp, onLoginAttempt }) => {
//     const [showLogin, setShowLogin] = useState(false);

//     const handleSignUpClick = () => {
//         setShowLogin(false);
//         onNavigateToSignUp();
//     };

//     const handleLogin = (credentials) => {
//         setShowLogin(false);
//         onLoginAttempt(credentials);
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
//             {showLogin && <LoginForm onClose={() => setShowLogin(false)} onNavigateToSignUp={handleSignUpClick} onLoginAttempt={handleLogin} />}
//             <HeartIcon className="w-20 h-20 text-rose-400 mb-4" />
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> GChat </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all"> Login / Sign Up </button>
//             </div>
//         </div>
//     );
// };

// // --- Profile Form Page Component (FIXED) ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({ name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: '' });
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const isEditMode = !!existingProfile;

//     // --- FIX ---: This useEffect correctly pre-fills the form when editing
//     useEffect(() => {
//         if (isEditMode && existingProfile) {
//             setFormData({
//                 name: existingProfile.name || '',
//                 course: existingProfile.course || '',
//                 gender: existingProfile.gender || 'Female',
//                 year: existingProfile.year || '1st Year',
//                 bio: existingProfile.bio || '',
//                 email: existingProfile.email || '', // Keep email in state, even though it's not shown
//                 password: '', // Always start with an empty password field
//             });
//         }
//     }, [isEditMode, existingProfile]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setProfilePicFile(e.target.files[0]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onProfileSubmit(formData, profilePicFile);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'} </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>Female</option> <option>Male</option> <option>Other</option> </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg"> <option>1st Year</option> <option>2nd Year</option> <option>3rd Year</option> <option>4th Year</option> <option>Final Year</option> </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none" required></textarea>
//                     <div>
//                         <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
//                         <input type="file" name="profilePic" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
//                     </div>
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500"> {isEditMode ? 'Update Profile' : 'Create Profile'} </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Sidebar Component ---
// const Sidebar = ({ isOpen, onClose, onNavigate, onLogout }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 z-50">
//             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
//             <div className="relative w-72 h-full bg-rose-50 shadow-xl p-6 flex flex-col">
//                 <div className="flex items-center gap-3 mb-8">
//                     <HeartIcon className="w-10 h-10 text-rose-400" />
//                     <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>GChat</h1>
//                 </div>
//                 <nav className="flex flex-col gap-4">
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100"> Logout </button>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 flex items-center justify-center gap-2">
//           <HeartIcon className="w-5 h-5" /> GChat
//         </button>
//       </div>
//     </div>
// );

// // --- Dashboard Page Component ---
// const DashboardPage = ({ students, onChat, onMenuClick, currentUser }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500"> <MenuIcon className="w-8 h-8"/> </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}> Campus Profiles </h1>
//             </div>
//             <div className="flex items-center gap-3">
//                 <span className="hidden sm:block font-semibold text-slate-700"> Welcome, {currentUser?.name} </span>
//                 <img src={currentUser?.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Me'} alt="Your profile" className="w-12 h-12 rounded-full object-cover border-2 border-rose-200 shadow-sm" />
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => ( <StudentCard key={student._id} student={student} onChat={onChat} /> ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page Component ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner.conversationId} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
//                         <img src={partner.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={partner.name} className="w-16 h-16 rounded-full object-cover" />
//                         <div className="ml-4">
//                             <h3 className="text-lg font-bold text-slate-800">{partner.name}</h3>
//                             <p className="text-slate-500 text-sm">Click to view conversation</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );

// // --- Chat Page Component ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [conversation, setConversation] = useState(null);
//   const [isChatLoading, setIsChatLoading] = useState(true); 
//   const socket = useRef();
//   const scrollRef = useRef();

//   useEffect(() => {
//     socket.current = io(process.env.REACT_APP_SOCKET_URL || "ws://localhost:5000");
//     socket.current.on("getMessage", (data) => {
//       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
//     });
//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);
  
//   useEffect(() => {
//     if (currentUser?._id) {
//       socket.current.emit("addUser", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchChatData = async () => {
//         setIsChatLoading(true);
//         try {
//             const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//             const currentConversation = convRes.data;
//             setConversation(currentConversation);

//             if (currentConversation?._id) {
//                 const messagesRes = await axios.get('/messages/' + currentConversation._id);
//                 setMessages(messagesRes.data);
//             }
//         } catch (err) {
//             console.error("Failed to load chat data", err);
//         } finally {
//             setIsChatLoading(false);
//         }
//     };
//     if (currentUser?._id && student?._id) {
//         fetchChatData();
//     }
//   }, [currentUser, student]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === '' || !conversation?._id) return;

//     const message = {
//       senderId: currentUser._id,
//       text: newMessage,
//       conversationId: conversation._id,
//     };
    
//     socket.current.emit("sendMessage", {
//       senderId: currentUser._id,
//       receiverId: student._id,
//       text: newMessage,
//     });
    
//     try {
//         const res = await axios.post('/messages', message);
//         setMessages([...messages, res.data]);
//         setNewMessage('');
//     } catch (err) {
//         console.log(err);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend(e);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
//       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
//         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
//         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" />
//         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
//       </div>
//       <div className="flex-grow p-4 overflow-y-auto">
//         {messages.map((msg, index) => (
//           <div ref={scrollRef} key={index}>
//             <div className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} mb-3`}>
//               <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser._id ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
//                 <p>{msg.text}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input 
//             type="text" 
//             value={newMessage} 
//             onChange={(e) => setNewMessage(e.target.value)} 
//             onKeyPress={handleKeyPress} 
//             placeholder={isChatLoading ? "Loading chat..." : "Type a message..."} 
//             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
//             disabled={isChatLoading}
//             />
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={isChatLoading}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };


// // --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversations, setConversations] = useState([]);

//   axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   const handleLoginAttempt = async (credentials) => {
//     setIsLoading(true);
//     try {
//         const res = await axios.post('/auth/login', credentials);
//         setCurrentUser(res.data);
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//         alert("Login failed. Please check your credentials.");
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       setConversations([]);
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
//         if (key === 'password' && !formData[key]) return;
//         submissionData.append(key, formData[key]);
//     });
//     if (profilePicFile) {
//         submissionData.append('profilePic', profilePicFile);
//     }
//     try {
//         if (currentUser) {
//             const res = await axios.put(`/users/${currentUser._id}`, submissionData);
//             setCurrentUser(res.data);
//             alert("Profile updated successfully!");
//             setCurrentPage('dashboard');
//         } else {
//             await axios.post('/auth/register', submissionData);
//             await handleLoginAttempt({ email: formData.email, password: formData.password });
//         }
//     } catch (err) {
//         console.error("Profile submission failed:", err);
//         alert("Operation failed. Please try again.");
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleStartChat = (student) => {
//     setSelectedStudent(student);
//     setCurrentPage('chat');
//   };

//   const handleBackToDashboard = () => {
//     setCurrentPage('dashboard');
//     setSelectedStudent(null);
//   };
  
//   const handleSidebarNavigate = (page) => {
//     if (page === 'editProfile') {
//         setCurrentPage('profileForm');
//     } else {
//         setCurrentPage(page);
//     }
//     setIsSidebarOpen(false);
//   };
  
//   useEffect(() => {
//     const fetchStudents = async () => {
//         if (currentUser) {
//             try {
//                 const token = localStorage.getItem("gchat_token");
//                 axios.defaults.headers.common['token'] = `Bearer ${token}`;
//                 const res = await axios.get('/users');
//                 setStudents(res.data);
//             } catch (err) {
//                 console.error("Failed to fetch students:", err);
//             }
//         }
//     };
//     fetchStudents();
//   }, [currentUser]);

//   useEffect(() => {
//     const getConversations = async () => {
//         if (currentUser && currentPage === 'allChats') {
//             try {
//                 const res = await axios.get("/conversations/" + currentUser._id);
//                 setConversations(res.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };
//     getConversations();
//   }, [currentUser, currentPage]);

//   useEffect(() => {
//     const wakeupServer = async () => {
//         try {
//             console.log("Pinging server to wake it up...");
//             await axios.get('/wakeup');
//             console.log("Server is awake!");
//         } catch (err) {
//             console.error("Server ping failed:", err);
//         }
//     };
//     wakeupServer();
//   }, []);

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);
//   // just added this remember
//   useEffect(() => {
//     const subscribeToPushNotifications = async () => {
//       if ('serviceWorker' in navigator && 'PushManager' in window && currentUser) {
//         try {
//           const registration = await navigator.serviceWorker.ready;
//           let subscription = await registration.pushManager.getSubscription();

//           if (subscription === null) {
//             console.log("Requesting permission for notifications...");
//             const permission = await window.Notification.requestPermission();
//             if (permission !== 'granted') {
//                 console.log("Notification permission not granted.");
//                 return;
//             }

//             const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
//             if (!vapidPublicKey) {
//                 console.error("VAPID public key not found.");
//                 return;
//             }

//             subscription = await registration.pushManager.subscribe({
//               userVisibleOnly: true,
//               applicationServerKey: vapidPublicKey,
//             });
//           }

//           await axios.post('/subscriptions', { subscription, userId: currentUser._id });
//           console.log("Subscription sent to server successfully.");

//         } catch (error) {
//           console.error('Failed to subscribe to push notifications:', error);
//         }
//       }
//     };
//     subscribeToPushNotifications();
//   }, [currentUser]);

//   const renderPage = () => {
//     if (!currentUser) {
//         switch (currentPage) {
//             case 'profileForm':
//                 return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={null} />;
//             default:
//                 return <LandingPage onNavigateToSignUp={navigateToSignUp} onLoginAttempt={handleLoginAttempt} />;
//         }
//     }

//     switch (currentPage) {
//       case 'profileForm':
//         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
//       case 'chat':
//         return <ChatPage key={selectedStudent._id} student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={conversations} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'dashboard':
//       default:
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
//       {isLoading && <LoadingSpinner />}
//       <Sidebar 
//         isOpen={isSidebarOpen && currentUser} 
//         onClose={() => setIsSidebarOpen(false)} 
//         onNavigate={handleSidebarNavigate}
//         onLogout={handleLogout}
//       />
//       {renderPage()}
//     </main>
//   );
// }
