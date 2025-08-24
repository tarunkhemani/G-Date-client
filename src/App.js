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

// --- Profile Form Page Component (FIXED) ---
const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
    const [formData, setFormData] = useState({ name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: '' });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const isEditMode = !!existingProfile;

    // --- FIX ---: This useEffect correctly pre-fills the form when editing
    useEffect(() => {
        if (isEditMode && existingProfile) {
            setFormData({
                name: existingProfile.name || '',
                course: existingProfile.course || '',
                gender: existingProfile.gender || 'Female',
                year: existingProfile.year || '1st Year',
                bio: existingProfile.bio || '',
                email: existingProfile.email || '', // Keep email in state, even though it's not shown
                password: '', // Always start with an empty password field
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

  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const navigateToSignUp = () => setCurrentPage('profileForm');
  
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

  const renderPage = () => {
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

// // --- Profile Form Page Component ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({ name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: '' });
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const isEditMode = !!existingProfile;

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
// // --- Chat Page Component (DEFINITIVE FIX) ---
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
//       // Only add the incoming message if it's for the current conversation
//       if (data.conversationId === conversation?._id) {
//           setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
//       }
//     });
//     return () => {
//       socket.current.disconnect();
//     };
//   }, [conversation]); // Re-bind the listener if the conversation changes
  
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
//       conversationId: conversation._id, // Send conversationId with the socket message
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

// // // --- Chat Page Component ---
// // const ChatPage = ({ student, currentUser, onBack }) => {
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [conversation, setConversation] = useState(null);
// //   const [isChatLoading, setIsChatLoading] = useState(true); 
// //   const socket = useRef();
// //   const scrollRef = useRef();

// //   useEffect(() => {
// //     socket.current = io("ws://localhost:5000");
// //     socket.current.on("getMessage", (data) => {
// //       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
// //     });
// //     return () => {
// //       socket.current.disconnect();
// //     };
// //   }, []);
  
// //   useEffect(() => {
// //     if (currentUser?._id) {
// //       socket.current.emit("addUser", currentUser._id);
// //     }
// //   }, [currentUser]);

// //   useEffect(() => {
// //     const fetchChatData = async () => {
// //         setIsChatLoading(true);
// //         try {
// //             const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
// //             const currentConversation = convRes.data;
// //             setConversation(currentConversation);

// //             if (currentConversation?._id) {
// //                 const messagesRes = await axios.get('/messages/' + currentConversation._id);
// //                 setMessages(messagesRes.data);
// //             }
// //         } catch (err) {
// //             console.error("Failed to load chat data", err);
// //         } finally {
// //             setIsChatLoading(false);
// //         }
// //     };
// //     if (currentUser?._id && student?._id) {
// //         fetchChatData();
// //     }
// //   }, [currentUser, student]);

// //   useEffect(() => {
// //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const handleSend = async (e) => {
// //     e.preventDefault();
// //     if (newMessage.trim() === '' || !conversation?._id) return;

// //     const message = {
// //       senderId: currentUser._id,
// //       text: newMessage,
// //       conversationId: conversation._id,
// //     };
    
// //     socket.current.emit("sendMessage", {
// //       senderId: currentUser._id,
// //       receiverId: student._id,
// //       text: newMessage,
// //     });
    
// //     try {
// //         const res = await axios.post('/messages', message);
// //         setMessages([...messages, res.data]);
// //         setNewMessage('');
// //     } catch (err) {
// //         console.log(err);
// //     }
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSend(e);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
// //       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
// //         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
// //         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" />
// //         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
// //       </div>
// //       <div className="flex-grow p-4 overflow-y-auto">
// //         {messages.map((msg, index) => (
// //           <div ref={scrollRef} key={index}>
// //             <div className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} mb-3`}>
// //               <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser._id ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
// //                 <p>{msg.text}</p>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //       <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
// //         <div className="flex items-center">
// //           <input 
// //             type="text" 
// //             value={newMessage} 
// //             onChange={(e) => setNewMessage(e.target.value)} 
// //             onKeyPress={handleKeyPress} 
// //             placeholder={isChatLoading ? "Loading chat..." : "Type a message..."} 
// //             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
// //             disabled={isChatLoading}
// //             />
// //           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={isChatLoading}>
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };


// // --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversations, setConversations] = useState([]);

//   axios.defaults.baseURL = 'http://localhost:5000/api';

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
//         // --- DEFINITIVE FIX ---: Add a unique key to the ChatPage component
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
// // --- Chat Page Component (DEFINITIVE FIX v2) ---
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
//         // --- FIX ---: Reset the state for the new chat partner
//         setConversation(null);
//         setMessages([]);

//         try {
//             const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//             const currentConversation = convRes.data;
//             setConversation(currentConversation); // Set the new conversation

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
//   }, [currentUser, student]); // This effect correctly re-runs when the 'student' prop changes

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

// // --- Chat Page Component (DEFINITIVE FIX) ---
// // const ChatPage = ({ student, currentUser, onBack }) => {
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [conversation, setConversation] = useState(null);
// //   const [isChatLoading, setIsChatLoading] = useState(true); 
// //   const socket = useRef();
// //   const scrollRef = useRef();

// //   useEffect(() => {
// //     socket.current = io("ws://localhost:5000");
// //     socket.current.on("getMessage", (data) => {
// //       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
// //     });
// //     return () => {
// //       socket.current.disconnect();
// //     };
// //   }, []);
  
// //   useEffect(() => {
// //     if (currentUser?._id) {
// //       socket.current.emit("addUser", currentUser._id);
// //     }
// //   }, [currentUser]);

// //   useEffect(() => {
// //     const fetchChatData = async () => {
// //         setIsChatLoading(true);
// //         try {
// //             const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
// //             const currentConversation = convRes.data;
// //             setConversation(currentConversation);

// //             if (currentConversation?._id) {
// //                 const messagesRes = await axios.get('/messages/' + currentConversation._id);
// //                 setMessages(messagesRes.data);
// //             }
// //         } catch (err) {
// //             console.error("Failed to load chat data", err);
// //         } finally {
// //             setIsChatLoading(false);
// //         }
// //     };
// //     if (currentUser?._id && student?._id) {
// //         fetchChatData();
// //     }
// //   }, [currentUser, student]);

// //   useEffect(() => {
// //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const handleSend = async (e) => {
// //     e.preventDefault();
// //     if (newMessage.trim() === '' || !conversation?._id) return;

// //     const message = {
// //       senderId: currentUser._id,
// //       text: newMessage,
// //       conversationId: conversation._id,
// //     };
    
// //     socket.current.emit("sendMessage", {
// //       senderId: currentUser._id,
// //       receiverId: student._id,
// //       text: newMessage,
// //     });
    
// //     try {
// //         const res = await axios.post('/messages', message);
// //         setMessages([...messages, res.data]);
// //         setNewMessage('');
// //     } catch (err) {
// //         console.log(err);
// //     }
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSend(e);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
// //       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
// //         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
// //         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" />
// //         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
// //       </div>
// //       <div className="flex-grow p-4 overflow-y-auto">
// //         {messages.map((msg, index) => (
// //           <div ref={scrollRef} key={index}>
// //             <div className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} mb-3`}>
// //               <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser._id ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
// //                 <p>{msg.text}</p>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //       <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
// //         <div className="flex items-center">
// //           <input 
// //             type="text" 
// //             value={newMessage} 
// //             onChange={(e) => setNewMessage(e.target.value)} 
// //             onKeyPress={handleKeyPress} 
// //             placeholder={isChatLoading ? "Loading chat..." : "Type a message..."} 
// //             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
// //             disabled={isChatLoading}
// //             />
// //           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={isChatLoading}>
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };


// // --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversations, setConversations] = useState([]);

//   axios.defaults.baseURL = 'http://localhost:5000/api';

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
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
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
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
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
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
//     if (newMessage.trim() === '') return;
    
//     const conversationRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//     const conversationId = conversationRes.data._id;
    
//     if(!conversationId) return;

//     const message = {
//       senderId: currentUser._id,
//       text: newMessage,
//       conversationId: conversationId,
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

//   axios.defaults.baseURL = 'http://localhost:5000/api';

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
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
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
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
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
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
// // --- Chat Page Component (FINAL FIX) ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   // --- NEW ---: A dedicated loading state for the chat
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

//   // --- UPDATED ---: Combined fetching logic into a single, robust useEffect
//   useEffect(() => {
//     const fetchChatData = async () => {
//         setIsChatLoading(true);
//         try {
//             // Step 1: Get or create the conversation
//             const convRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//             const currentConversation = convRes.data;

//             // Step 2: Immediately use the conversation ID to get messages
//             if (currentConversation?._id) {
//                 const messagesRes = await axios.get('/messages/' + currentConversation._id);
//                 setMessages(messagesRes.data);
//             }
//         } catch (err) {
//             console.error("Failed to load chat data", err);
//         } finally {
//             setIsChatLoading(false); // Mark loading as complete
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
//     if (newMessage.trim() === '') return;
    
//     // Find the current conversation from the component's state
//     // This requires us to fetch the conversation first
//     const conversationRes = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//     const conversationId = conversationRes.data._id;
    
//     if(!conversationId) return; // Do not send if no conversation ID

//     const message = {
//       senderId: currentUser._id,
//       text: newMessage,
//       conversationId: conversationId,
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

// // --- Chat Page Component (UPDATED WITH FIX) ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [conversation, setConversation] = useState(null);
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
//     const getConversation = async () => {
//       try {
//         const res = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//         setConversation(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     if (currentUser._id && student._id) {
//         getConversation();
//     }
//   }, [currentUser._id, student._id]);

//   useEffect(() => {
//     const getMessages = async () => {
//       if (conversation?._id) {
//         try {
//           // --- FIX --- Corrected the string concatenation here
//           const res = await axios.get('/messages/' + conversation._id);
//           setMessages(res.data);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
//     getMessages();
//   }, [conversation]);

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
//             placeholder={!conversation ? "Loading chat..." : "Type a message..."} 
//             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
//             disabled={!conversation}
//             />
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={!conversation}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };


// --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversations, setConversations] = useState([]);

//   axios.defaults.baseURL = 'http://localhost:5000/api';

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
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
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
//         if (currentUser) {
//             try {
//                 const res = await axios.get("/conversations/" + currentUser._id);
//                 setConversations(res.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };
//     getConversations();
//   }, [currentUser]);

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
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
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
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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

// // --- Chat Page Component (UPDATED WITH FIX) ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [conversation, setConversation] = useState(null);
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
//     const getConversation = async () => {
//       try {
//         const res = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//         setConversation(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     if (currentUser._id && student._id) {
//         getConversation();
//     }
//   }, [currentUser._id, student._id]);

//   useEffect(() => {
//     const getMessages = async () => {
//       if (conversation?._id) {
//         try {
//           const res = await axios.get('/messages/' + conversation._id);
//           setMessages(res.data);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
//     getMessages();
//   }, [conversation]);

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
//             placeholder={!conversation ? "Loading chat..." : "Type a message..."} 
//             className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
//             disabled={!conversation}
//             />
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors disabled:opacity-50" disabled={!conversation}>
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

//   axios.defaults.baseURL = 'http://localhost:5000/api';

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
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
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
//         if (currentUser) {
//             try {
//                 const res = await axios.get("/conversations/" + currentUser._id);
//                 setConversations(res.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };
//     getConversations();
//   }, [currentUser]);

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
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
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


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { io } from "socket.io-client";

// // --- NEW ---: A simple, reusable loading spinner component
// const LoadingSpinner = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//         <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-rose-400 border-t-transparent"></div>
//     </div>
// );

// // --- All other components (HeartIcon, MenuIcon, LoginForm, etc.) remain the same ---
// // ... (The full code for all components is included below for completeness)

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
//                     <input
//                         type="email"
//                         placeholder="University Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-colors">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6">
//                     New to GChat?{' '}
//                     <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
//                         Sign Up
//                     </button>
//                 </p>
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
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                 GChat
//             </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75">
//                     Login / Sign Up
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Sign Up / Edit Profile Page Component ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({
//         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: ''
//     });
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const isEditMode = !!existingProfile;

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
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
//                     </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option><option>Male</option><option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Final Year</option>
//                         </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
//                     <div>
//                         <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
//                         <input type="file" name="profilePic" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
//                     </div>
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all">
//                         {isEditMode ? 'Update Profile' : 'Create Profile'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Sidebar, StudentCard, DashboardPage, AllChatsPage, ChatPage components are unchanged ---
// // ... (Full code included below)

// // --- Main App Component (UPDATED) ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // --- NEW ---: Loading state
//   const [conversations, setConversations] = useState([]); // --- NEW ---: State for chat list

//   axios.defaults.baseURL = 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   // --- UPDATED ---: Added loading state management
//   const handleLoginAttempt = async (credentials) => {
//     setIsLoading(true); // Start loading
//     try {
//         const res = await axios.post('/auth/login', credentials);
//         setCurrentUser(res.data);
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//         alert("Login failed. Please check your credentials.");
//     } finally {
//         setIsLoading(false); // Stop loading, regardless of outcome
//     }
//   };

//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   // --- UPDATED ---: Added loading state management
//     // --- UPDATED ---: This function now handles both creating and editing profiles
//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     setIsLoading(true);
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
//         // Don't append empty password field during updates
//         if (key === 'password' && !formData[key]) return;
//         submissionData.append(key, formData[key]);
//     });
//     if (profilePicFile) {
//         submissionData.append('profilePic', profilePicFile);
//     }

//     try {
//         // Check if we are in "Edit Mode" (currentUser exists)
//         if (currentUser) {
//             // --- EDIT LOGIC ---
//             const res = await axios.put(`/users/${currentUser._id}`, submissionData);
//             setCurrentUser(res.data); // Update the local user state with new details
//             alert("Profile updated successfully!");
//             setCurrentPage('dashboard');
//         } else {
//             // --- CREATE LOGIC ---
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
//   // const handleProfileSubmit = async (formData, profilePicFile) => {
//   //   setIsLoading(true); // Start loading
//   //   const submissionData = new FormData();
//   //   Object.keys(formData).forEach(key => {
//   //       submissionData.append(key, formData[key]);
//   //   });
//   //   if (profilePicFile) {
//   //       submissionData.append('profilePic', profilePicFile);
//   //   }

//   //   try {
//   //       await axios.post('/auth/register', submissionData);
//   //       await handleLoginAttempt({ email: formData.email, password: formData.password });
//   //   } catch (err) {
//   //       console.error("Registration failed:", err);
//   //       alert("Registration failed. Please try again.");
//   //   } finally {
//   //       setIsLoading(false); // Stop loading, regardless of outcome
//   //   }
//   // };

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
//     // --- NEW ---: useEffect to fetch actual conversations for the "My Chats" page
//   useEffect(() => {
//     const getConversations = async () => {
//         if (currentUser) {
//             try {
//                 const res = await axios.get("/conversations/" + currentUser._id);
//                 setConversations(res.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };
//     getConversations();
//   }, [currentUser, currentPage]); // Re-fetch when user logs in or navigates to a new page

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);
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
//   }, []); // The empty array [] ensures this runs only once when the app first loads

//   const renderPage = () => {
//     if (!currentUser) {
//         switch (currentPage) {
//             case 'profileForm':
//                 return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={null} />;
//             default:
//                 return <LandingPage onNavigateToSignUp={navigateToSignUp} onLoginAttempt={handleLoginAttempt} />;
//         }
//     }

//       switch (currentPage) {
//       case 'profileForm':
//         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
//       case 'chat':
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
//       case 'allChats':
//         // --- UPDATED ---: Pass the new 'conversations' state to the AllChatsPage
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


// //     switch (currentPage) {
// //       case 'profileForm':
// //         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
// //       case 'chat':
// //         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
// //       case 'allChats':
// //         return <AllChatsPage chatPartners={students.filter(s => s._id !== currentUser?._id)} onChat={handleStartChat} onBack={handleBackToDashboard} />;
// //       case 'dashboard':
// //       default:
// //         return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
// //     }
// //   };

// //   return (
// //     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
// //       {/* --- NEW ---: Conditionally render the spinner */}
// //       {isLoading && <LoadingSpinner />}
// //       <Sidebar 
// //         isOpen={isSidebarOpen && currentUser} 
// //         onClose={() => setIsSidebarOpen(false)} 
// //         onNavigate={handleSidebarNavigate}
// //         onLogout={handleLogout}
// //       />
// //       {renderPage()}
// //     </main>
// //   );
// // }

// // --- FULL COMPONENT CODE FOR COMPLETENESS ---

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
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error'; }} />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
//           <HeartIcon className="w-5 h-5" /> GChat
//         </button>
//       </div>
//     </div>
// );
// // --- Dashboard Page Component (UPDATED) ---
// const DashboardPage = ({ students, onChat, onMenuClick, currentUser }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
//                     <MenuIcon className="w-8 h-8"/>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Campus Profiles
//                 </h1>
//             </div>

//             {/* --- NEW: Current User Profile Display --- 👋 */}
//             <div className="flex items-center gap-3">
//                 <span className="hidden sm:block font-semibold text-slate-700">
//                     Welcome, {currentUser?.name}
//                 </span>
//                 <img
//                     src={currentUser?.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Me'}
//                     alt="Your profile"
//                     className="w-12 h-12 rounded-full object-cover border-2 border-rose-200 shadow-sm"
//                     onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/ffffff?text=Error'; }}
//                 />
//             </div>
//             {/* --- End of New Section --- */}
            
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => (
//             <StudentCard key={student._id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // const DashboardPage = ({ students, onChat, onMenuClick, currentUser }) => (
// //     <div className="min-h-screen p-4 sm:p-6 md:p-8">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="flex items-center justify-between mb-8">
// //             <div className="flex items-center gap-3">
// //                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
// //                     <MenuIcon className="w-8 h-8"/>
// //                 </button>
// //                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
// //                     Campus Profiles
// //                 </h1>
// //             </div>
// //         </div>
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //           {students.filter(s => s._id !== currentUser?._id).map(student => (
// //             <StudentCard key={student._id} student={student} onChat={onChat} />
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// // );

// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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

// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [conversation, setConversation] = useState(null);
//   const socket = useRef();
//   const scrollRef = useRef();

//   useEffect(() => {
//     socket.current = io("ws://localhost:5000");
//     socket.current.on("getMessage", (data) => {
//       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
//     });
//     return () => socket.current.disconnect();
//   }, []);

//   useEffect(() => {
//     if (currentUser?._id) {
//       socket.current.emit("addUser", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const getConversation = async () => {
//       try {
//         const res = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//         setConversation(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getConversation();
//   }, [currentUser._id, student._id]);

//   useEffect(() => {
//     const getMessages = async () => {
//       if (conversation?._id) {
//         try {
//           const res = await axios.get('/messages/' + conversation._id);
//           setMessages(res.data);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
//     getMessages();
//   }, [conversation]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === '') return;

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
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"/>
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
//         </div>
//       </form>
//     </div>
//   );
// };

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { io } from "socket.io-client";

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
//                     <input
//                         type="email"
//                         placeholder="University Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-colors">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6">
//                     New to GChat?{' '}
//                     <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
//                         Sign Up
//                     </button>
//                 </p>
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
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                 GChat
//             </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75">
//                     Login / Sign Up
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Sign Up / Edit Profile Page Component (UPDATED) ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({
//         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: ''
//     });
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const isEditMode = !!existingProfile;

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setProfilePicFile(e.target.files[0]);
//     };

//     // --- UPDATED ---: This function now passes the raw data and file separately
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // The main App component will now be responsible for creating the FormData
//         onProfileSubmit(formData, profilePicFile);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
//                     </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option><option>Male</option><option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Final Year</option>
//                         </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
//                     <div>
//                         <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
//                         <input type="file" name="profilePic" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
//                     </div>
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all">
//                         {isEditMode ? 'Update Profile' : 'Create Profile'}
//                     </button>
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
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error'; }} />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
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
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
//                     <MenuIcon className="w-8 h-8"/>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Campus Profiles
//                 </h1>
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => (
//             <StudentCard key={student._id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
//   const socket = useRef();
//   const scrollRef = useRef();

//   useEffect(() => {
//     socket.current = io("ws://localhost:5000");
//     socket.current.on("getMessage", (data) => {
//       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
//     });
//     return () => socket.current.disconnect();
//   }, []);

//   useEffect(() => {
//     if (currentUser?._id) {
//       socket.current.emit("addUser", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const getConversation = async () => {
//       try {
//         const res = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//         setConversation(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getConversation();
//   }, [currentUser._id, student._id]);

//   useEffect(() => {
//     const getMessages = async () => {
//       if (conversation?._id) {
//         try {
//           const res = await axios.get('/messages/' + conversation._id);
//           setMessages(res.data);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
//     getMessages();
//   }, [conversation]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === '') return;

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
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"/>
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
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

//   axios.defaults.baseURL = 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   const handleLoginAttempt = async (credentials) => {
//     try {
//         const res = await axios.post('/auth/login', credentials);
//         setCurrentUser(res.data);
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//         alert("Login failed. Please check your credentials.");
//     }
//   };

//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   // --- UPDATED ---: This function now handles auto-login after registration
//   const handleProfileSubmit = async (formData, profilePicFile) => {
//     // Create the FormData object here
//     const submissionData = new FormData();
//     Object.keys(formData).forEach(key => {
//         submissionData.append(key, formData[key]);
//     });
//     if (profilePicFile) {
//         submissionData.append('profilePic', profilePicFile);
//     }

//     try {
//         // Register the new user
//         await axios.post('/auth/register', submissionData);
        
//         // --- NEW ---: Automatically log the user in
//         // We have the email and password right here in formData
//         await handleLoginAttempt({ email: formData.email, password: formData.password });
        
//     } catch (err) {
//         console.error("Registration failed:", err);
//         alert("Registration failed. Please try again.");
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
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

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
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={students.filter(s => s._id !== currentUser?._id)} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'dashboard':
//       default:
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
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
//                     <input
//                         type="email"
//                         placeholder="University Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-colors">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6">
//                     New to GChat?{' '}
//                     <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
//                         Sign Up
//                     </button>
//                 </p>
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
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                 GChat
//             </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75">
//                     Login / Sign Up
//                 </button>
//             </div>
//         </div>
//     );
// };
// // --- Sign Up / Edit Profile Page Component (FIXED) ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({
//         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: ''
//     });
//     const [profilePicFile, setProfilePicFile] = useState(null);

//     const isEditMode = !!existingProfile;

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setProfilePicFile(e.target.files[0]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
        
//         const submissionData = new FormData();
//         // Append all text data from the form
//         Object.keys(formData).forEach(key => {
//             submissionData.append(key, formData[key]);
//         });
//         // Append the file if one was selected
//         if (profilePicFile) {
//             submissionData.append('profilePic', profilePicFile);
//         }

//         onProfileSubmit(submissionData);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
//                     </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
                    
//                     {/* --- FIX ---: Restored the Gender and Year dropdowns */}
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option>
//                             <option>Male</option>
//                             <option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option>
//                             <option>2nd Year</option>
//                             <option>3rd Year</option>
//                             <option>4th Year</option>
//                             <option>Final Year</option>
//                         </select>
//                     </div>

//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
                    
//                     <div>
//                         <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
//                         <input 
//                             type="file" 
//                             name="profilePic" 
//                             onChange={handleFileChange} 
//                             className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
//                         />
//                     </div>

//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all">
//                         {isEditMode ? 'Update Profile' : 'Create Profile'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
// // --- Sign Up / Edit Profile Page Component (UPDATED FOR FILE UPLOAD) ---
// // const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
// //     // State for text fields
// //     const [formData, setFormData] = useState({
// //         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', email: '', password: ''
// //     });
// //     // --- NEW ---: State specifically for the image file
// //     const [profilePicFile, setProfilePicFile] = useState(null);

// //     const isEditMode = !!existingProfile; // (Edit mode logic remains for future use)

// //     // ... (useEffect for edit mode remains the same)

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData(prev => ({ ...prev, [name]: value }));
// //     };

// //     // --- NEW ---: Handler for file input change
// //     const handleFileChange = (e) => {
// //         setProfilePicFile(e.target.files[0]);
// //     };

// //     // --- UPDATED ---: handleSubmit now uses FormData
// //     const handleSubmit = (e) => {
// //         e.preventDefault();
        
// //         // Use FormData to send both text and file data
// //         const submissionData = new FormData();
// //         for (const key in formData) {
// //             submissionData.append(key, formData[key]);
// //         }
// //         if (profilePicFile) {
// //             submissionData.append('profilePic', profilePicFile);
// //         }

// //         onProfileSubmit(submissionData);
// //     };

// //     return (
// //         <div className="flex flex-col items-center justify-center min-h-screen p-4">
// //             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
// //                 <div className="text-center mb-6">
// //                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
// //                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
// //                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
// //                     </h2>
// //                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
// //                 </div>
// //                 {/* Use onSubmit on the form tag */}
// //                 <form onSubmit={handleSubmit} className="space-y-4">
// //                     {/* All other input fields (name, email, etc.) remain the same */}
// //                     {!isEditMode && (
// //                         <>
// //                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
// //                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
// //                             <hr className="border-slate-200" />
// //                         </>
// //                     )}
// //                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
// //                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
// //                     {/* ... (gender and year selects) ... */}
// //                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none" required></textarea>
                    
// //                     {/* --- UPDATED ---: Changed from URL input to file input */}
// //                     <div>
// //                         <label className="block text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
// //                         <input 
// //                             type="file" 
// //                             name="profilePic" 
// //                             onChange={handleFileChange} 
// //                             className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
// //                         />
// //                     </div>

// //                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all">
// //                         {isEditMode ? 'Update Profile' : 'Create Profile'}
// //                     </button>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };

// // // --- Sign Up / Edit Profile Page Component ---
// // const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
// //     const [formData, setFormData] = useState({
// //         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', profilePic: '', email: '', password: ''
// //     });

// //     const isEditMode = !!existingProfile;

// //     useEffect(() => {
// //         if (isEditMode && existingProfile) {
// //             setFormData({
// //                 name: existingProfile.name || '',
// //                 course: existingProfile.course || '',
// //                 gender: existingProfile.gender || 'Female',
// //                 year: existingProfile.year || '1st Year',
// //                 bio: existingProfile.bio || '',
// //                 profilePic: existingProfile.profilePic || '',
// //                 email: existingProfile.email || '',
// //                 password: '' // Don't pre-fill password
// //             });
// //         }
// //     }, [existingProfile, isEditMode]);

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData(prev => ({ ...prev, [name]: value }));
// //     };

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         onProfileSubmit(formData);
// //     };

// //     return (
// //         <div className="flex flex-col items-center justify-center min-h-screen p-4">
// //             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
// //                 <div className="text-center mb-6">
// //                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
// //                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
// //                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
// //                     </h2>
// //                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
// //                 </div>
// //                 <form onSubmit={handleSubmit} className="space-y-4">
// //                     {!isEditMode && (
// //                         <>
// //                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
// //                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
// //                             <hr className="border-slate-200" />
// //                         </>
// //                     )}
// //                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
// //                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
// //                     <div className="flex gap-4">
// //                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
// //                             <option>Female</option><option>Male</option><option>Other</option>
// //                         </select>
// //                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
// //                             <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Final Year</option>
// //                         </select>
// //                     </div>
// //                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
// //                     <input type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
// //                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105">
// //                         {isEditMode ? 'Update Profile' : 'Create Profile'}
// //                     </button>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };

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
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error'; }} />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
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
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
//                     <MenuIcon className="w-8 h-8"/>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Campus Profiles
//                 </h1>
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => (
//             <StudentCard key={student._id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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


// // --- Chat Page Component (UPDATED FOR CHAT HISTORY) ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [conversation, setConversation] = useState(null);
//   const socket = useRef();
//   const scrollRef = useRef();

//   // Effect for socket connection and events
//   useEffect(() => {
//     socket.current = io("ws://localhost:5000");
//     socket.current.on("getMessage", (data) => {
//       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text, createdAt: Date.now() }]);
//     });
//     return () => socket.current.disconnect();
//   }, []);

//   // Effect to add user to socket server
//   useEffect(() => {
//     if (currentUser?._id) {
//       socket.current.emit("addUser", currentUser._id);
//     }
//   }, [currentUser]);

//   // --- NEW ---: Effect to get/create conversation and fetch message history
//   useEffect(() => {
//     const getConversation = async () => {
//       try {
//         const res = await axios.post('/conversations/', { senderId: currentUser._id, receiverId: student._id });
//         setConversation(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getConversation();
//   }, [currentUser._id, student._id]);

//   useEffect(() => {
//     const getMessages = async () => {
//       if (conversation?._id) {
//         try {
//           const res = await axios.get('/messages/' + conversation._id);
//           setMessages(res.data);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
//     getMessages();
//   }, [conversation]);

//   // Effect for auto-scrolling
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- UPDATED ---: handleSend now also saves the message to the database
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === '') return;

//     const message = {
//       senderId: currentUser._id,
//       text: newMessage,
//       conversationId: conversation._id,
//     };
    
//     // Send message to Socket.IO server
//     socket.current.emit("sendMessage", {
//       senderId: currentUser._id,
//       receiverId: student._id,
//       text: newMessage,
//     });
    
//     // Save message to database
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
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"/>
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
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

//   // --- UPDATED ---: Set a base URL for all axios requests
//   axios.defaults.baseURL = 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   const handleLoginAttempt = async (credentials) => {
//     try {
//         const res = await axios.post('/auth/login', credentials);
//         setCurrentUser(res.data);
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//     }
//   };

//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };
//   const handleProfileSubmit = async (profileData) => { // profileData is now FormData
//     try {
//         // --- UPDATED ---: Axios will automatically set the correct headers for FormData
//         const res = await axios.post('/auth/register', profileData);
        
//         // Login requires email and password, which are in the FormData.
//         // We can't easily get them back, so we'll just navigate to the landing page
//         // to let the user log in manually after signing up.
//         alert("Registration successful! Please log in.");
//         setCurrentPage('landing');

//     } catch (err) {
//         console.error("Registration failed:", err);
//     }
//   };

//   // const handleProfileSubmit = async (profileData) => {
//   //   try {
//   //       await axios.post('/auth/register', profileData);
//   //       handleLoginAttempt({ email: profileData.email, password: profileData.password });
//   //   } catch (err) {
//   //       console.error("Registration failed:", err);
//   //   }
//   // };

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
//                 // Set token for all future requests
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
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

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
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={students.filter(s => s._id !== currentUser?._id)} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'dashboard':
//       default:
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
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
//                     <input
//                         type="email"
//                         placeholder="University Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-colors">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6">
//                     New to GChat?{' '}
//                     <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
//                         Sign Up
//                     </button>
//                 </p>
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
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                 GChat
//             </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75">
//                     Login / Sign Up
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Sign Up / Edit Profile Page Component ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({
//         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', profilePic: '', email: '', password: ''
//     });

//     const isEditMode = !!existingProfile;

//     useEffect(() => {
//         if (isEditMode && existingProfile) {
//             setFormData({
//                 name: existingProfile.name || '',
//                 course: existingProfile.course || '',
//                 gender: existingProfile.gender || 'Female',
//                 year: existingProfile.year || '1st Year',
//                 bio: existingProfile.bio || '',
//                 profilePic: existingProfile.profilePic || '',
//                 email: existingProfile.email || '',
//                 password: '' // Don't pre-fill password
//             });
//         }
//     }, [existingProfile, isEditMode]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onProfileSubmit(formData);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
//                     </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option><option>Male</option><option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Final Year</option>
//                         </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
//                     <input type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105">
//                         {isEditMode ? 'Update Profile' : 'Create Profile'}
//                     </button>
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
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error'; }} />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
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
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
//                     <MenuIcon className="w-8 h-8"/>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Campus Profiles
//                 </h1>
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => (
//             <StudentCard key={student._id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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

// // --- Chat Page Component (UPDATED FOR SOCKET.IO) ---
// const ChatPage = ({ student, currentUser, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
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
//         socket.current.emit("addUser", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === '') return;

//     const message = {
//       senderId: currentUser._id,
//       text: newMessage,
//       receiverId: student._id,
//     };

//     socket.current.emit("sendMessage", message);

//     setMessages([...messages, { ...message, createdAt: Date.now() }]);
//     setNewMessage('');
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         handleSend(e);
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
//                 <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser._id ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
//                     <p>{msg.text}</p>
//                 </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"/>
//           <button type="submit" className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
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

//   const API_URL = 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   const handleLoginAttempt = async (credentials) => {
//     try {
//         const res = await axios.post(`${API_URL}/auth/login`, credentials);
//         setCurrentUser(res.data);
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//     }
//   };

//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   const handleProfileSubmit = async (profileData) => {
//     try {
//         await axios.post(`${API_URL}/auth/register`, profileData);
//         handleLoginAttempt({ email: profileData.email, password: profileData.password });
//     } catch (err) {
//         console.error("Registration failed:", err);
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
//                 const res = await axios.get(`${API_URL}/users`, {
//                     headers: { token: `Bearer ${token}` }
//                 });
//                 setStudents(res.data);
//             } catch (err) {
//                 console.error("Failed to fetch students:", err);
//             }
//         }
//     };
//     fetchStudents();
//   }, [currentUser]);

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

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
//         return <ChatPage student={selectedStudent} currentUser={currentUser} onBack={() => setCurrentPage('allChats')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={students.filter(s => s._id !== currentUser?._id)} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'dashboard':
//       default:
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
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
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // --- CHANGE ---

// // --- CHANGE ---: Mock data is now removed.

// // --- SVG Icons (No Change) ---
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
// // --- CHANGE ---: Now handles its own state for email and password.
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
//                     <input
//                         type="email"
//                         placeholder="University Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
//                         required
//                     />
//                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//                     <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-colors">Login</button>
//                 </form>
//                 <p className="text-center text-sm text-slate-600 mt-6">
//                     New to GChat?{' '}
//                     <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
//                         Sign Up
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };


// // --- Landing Page Component ---
// // --- CHANGE ---: Passes login credentials up to the App component.
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
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                 GChat
//             </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75">
//                     Login / Sign Up
//                 </button>
//             </div>
//         </div>
//     );
// };


// // --- Sign Up / Edit Profile Page Component (No major changes) ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({
//         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', profilePic: '', email: '', password: ''
//     });

//     const isEditMode = !!existingProfile;

//     useEffect(() => {
//         if (isEditMode && existingProfile) {
//             setFormData({
//                 name: existingProfile.name || '',
//                 course: existingProfile.course || '',
//                 gender: existingProfile.gender || 'Female',
//                 year: existingProfile.year || '1st Year',
//                 bio: existingProfile.bio || '',
//                 profilePic: existingProfile.profilePic || '',
//                 email: existingProfile.email || '',
//                 password: '' // Don't pre-fill password
//             });
//         }
//     }, [existingProfile, isEditMode]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onProfileSubmit(formData);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
//                     </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option><option>Male</option><option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Final Year</option>
//                         </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
//                     <input type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105">
//                         {isEditMode ? 'Update Profile' : 'Create Profile'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Sidebar Component (No Change) ---
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
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Dashboard</button>
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Edit Profile</button>
//                 </nav>
//                 <button onClick={onLogout} className="mt-auto text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component (No Change) ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error'; }} />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
//           <HeartIcon className="w-5 h-5" /> GChat
//         </button>
//       </div>
//     </div>
// );

// // --- Dashboard Page Component ---
// // --- CHANGE ---: Uses MongoDB `_id` for keys.
// const DashboardPage = ({ students, onChat, onMenuClick, currentUser }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
//                     <MenuIcon className="w-8 h-8"/>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Campus Profiles
//                 </h1>
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.filter(s => s._id !== currentUser?._id).map(student => (
//             <StudentCard key={student._id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page (No Change) ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner._id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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

// // --- Chat Page Component (No Change for now) ---
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
//     if (e.key === 'Enter') handleSend();
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
//       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
//         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
//         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'; }}/>
//         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
//       </div>
//       <div className="flex-grow p-4 overflow-y-auto">
//         <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//             <p>These chats will be deleted in 24 hours.</p>
//         </div>
//         {messages.map(msg => (
//           <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-3`}>
//             <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}><p>{msg.text}</p></div>
//           </div>
//         ))}
//       </div>
//       <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"/>
//           <button onClick={handleSend} className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
//         </div>
//       </div>
//     </div>
//   );
// };


// // --- Main App Component ---
// // --- CHANGE ---: This is now the main engine, handling all API calls and state.
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // --- CHANGE ---: Define the base URL for our API
//   const API_URL = 'http://localhost:5000/api';

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   // --- CHANGE ---: Login handler now calls the backend
//   const handleLoginAttempt = async (credentials) => {
//     try {
//         const res = await axios.post(`${API_URL}/auth/login`, credentials);
//         setCurrentUser(res.data);
//         // Store token for future sessions (optional but recommended)
//         localStorage.setItem("gchat_token", res.data.accessToken);
//         setCurrentPage('dashboard');
//     } catch (err) {
//         console.error("Login failed:", err);
//         // You can add state to show an error message to the user
//     }
//   };

//   // --- CHANGE ---: Logout handler
//   const handleLogout = () => {
//       setCurrentUser(null);
//       setStudents([]);
//       localStorage.removeItem("gchat_token");
//       setCurrentPage('landing');
//   };

//   // --- CHANGE ---: Profile submit now calls the register endpoint
//   const handleProfileSubmit = async (profileData) => {
//     // For now, we only handle new user creation. Edit can be added later.
//     try {
//         const res = await axios.post(`${API_URL}/auth/register`, profileData);
//         // After successful registration, log them in automatically
//         handleLoginAttempt({ email: profileData.email, password: profileData.password });
//     } catch (err) {
//         console.error("Registration failed:", err);
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
  
//   // --- CHANGE ---: This effect runs when the user logs in (currentUser is set)
//   useEffect(() => {
//     const fetchStudents = async () => {
//         if (currentUser) {
//             try {
//                 const token = localStorage.getItem("gchat_token");
//                 const res = await axios.get(`${API_URL}/users`, {
//                     headers: { token: `Bearer ${token}` }
//                 });
//                 setStudents(res.data);
//             } catch (err) {
//                 console.error("Failed to fetch students:", err);
//             }
//         }
//     };
//     fetchStudents();
//   }, [currentUser]); // This effect depends on currentUser

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

//   const renderPage = () => {
//     // --- CHANGE ---: If no user is logged in, always show the landing page.
//     if (!currentUser) {
//         switch (currentPage) {
//             case 'profileForm':
//                 return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={null} />;
//             default:
//                 return <LandingPage onNavigateToSignUp={navigateToSignUp} onLoginAttempt={handleLoginAttempt} />;
//         }
//     }

//     // --- CHANGE ---: These pages are only available after login.
//     switch (currentPage) {
//       case 'profileForm':
//         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
//       case 'chat':
//         return <ChatPage student={selectedStudent} onBack={() => setCurrentPage('allChats')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={students.filter(s => s._id !== currentUser?._id)} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'dashboard':
//       default:
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
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

// import React, { useState, useEffect } from 'react';
// import "./index.css"

// // --- Mock Data for Student Profiles ---
// const initialStudents = [
//   {
//     id: 1,
//     name: 'Ananya Sharma',
//     course: 'B.A. Psychology',
//     year: '2nd Year',
//     gender: 'Female',
//     bio: 'Lover of poetry, rainy days, and deep conversations. Looking for someone to explore campus coffee shops with.',
//     profilePic: 'https://placehold.co/400x400/f87171/ffffff?text=AS',
//     email: 'ananya.s@university.edu',
//   },
//   {
//     id: 2,
//     name: 'Rohan Verma',
//     course: 'B.Tech CSE',
//     year: '3rd Year',
//     gender: 'Male',
//     bio: 'Code by day, guitar by night. I can probably fix your laptop. Seeking a partner-in-crime for late-night coding sessions.',
//     profilePic: 'https://placehold.co/400x400/c084fc/ffffff?text=RV',
//     email: 'rohan.v@university.edu',
//   },
//   {
//     id: 3,
//     name: 'Priya Patel',
//     course: 'M.Sc. Biology',
//     year: '1st Year',
//     gender: 'Female',
//     bio: 'Fascinated by the little things in life, from cells to stars. Let\'s go stargazing or visit the botanical gardens.',
//     profilePic: 'https://placehold.co/400x400/fbbf24/ffffff?text=PP',
//     email: 'priya.p@university.edu',
//   },
//   {
//     id: 4,
//     name: 'Sameer Khan',
//     course: 'B.Com Honours',
//     year: 'Final Year',
//     gender: 'Male',
//     bio: 'Future entrepreneur with a passion for street food and old Bollywood movies. My financial advice is usually sound.',
//     profilePic: 'https://placehold.co/400x400/60a5fa/ffffff?text=SK',
//     email: 'sameer.k@university.edu',
//   },
//   {
//     id: 5,
//     name: 'Isha Singh',
//     course: 'B.Des Fashion',
//     year: '2nd Year',
//     gender: 'Female',
//     bio: 'I see the world in colors and patterns. My ideal date involves thrifting and turning old clothes into something new.',
//     profilePic: 'https://placehold.co/400x400/f472b6/ffffff?text=IS',
//     email: 'isha.s@university.edu',
//   },
//   {
//     id: 6,
//     name: 'Arjun Reddy',
//     course: 'MBBS',
//     year: '4th Year',
//     gender: 'Male',
//     bio: 'Surviving on caffeine and ambition. I have a weird sense of humor, probably from sleep deprivation. Make me laugh!',
//     profilePic: 'https://placehold.co/400x400/818cf8/ffffff?text=AR',
//     email: 'arjun.r@university.edu',
//   },
// ];

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
// const LoginForm = ({ onLoginAttempt, onNavigateToSignUp, onClose }) => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
//         <div className="relative w-full max-w-sm bg-white/90 p-8 rounded-2xl shadow-xl">
//             <h2 className="text-2xl font-bold text-slate-700 text-center mb-2">Welcome Back!</h2>
//             <p className="text-center text-slate-500 mb-6">Please login to continue.</p>
//             <form onSubmit={(e) => { e.preventDefault(); onLoginAttempt(); }} className="space-y-4">
//                 <input type="email" placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                 <input type="password" placeholder="Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                 <button type="submit" className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition-colors">Login</button>
//             </form>
//             <p className="text-center text-sm text-slate-600 mt-6">
//                 New to GChat?{' '}
//                 <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
//                     Sign Up
//                 </button>
//             </p>
//         </div>
//     </div>
// );

// // --- Landing Page Component ---
// const LandingPage = ({ onLoginClick, onNavigateToSignUp, onLoginAttempt }) => {
//     const [showLogin, setShowLogin] = useState(false);

//     const handleSignUpClick = () => {
//         setShowLogin(false);
//         onNavigateToSignUp();
//     };

//     const handleLoginAttemptClick = () => {
//         setShowLogin(false);
//         onLoginAttempt();
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
//             {showLogin && <LoginForm onClose={() => setShowLogin(false)} onNavigateToSignUp={handleSignUpClick} onLoginAttempt={handleLoginAttemptClick} />}
//             <HeartIcon className="w-20 h-20 text-rose-400 mb-4" />
//             <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                 GChat
//             </h1>
//             <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//             <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//                 <button onClick={() => setShowLogin(true)} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75">
//                     Login / Sign Up
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Sign Up / Edit Profile Page Component ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({
//         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', profilePic: '', email: '', password: ''
//     });

//     const isEditMode = !!existingProfile;

//     useEffect(() => {
//         if (isEditMode) {
//             setFormData(existingProfile);
//         }
//     }, [existingProfile, isEditMode]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.name || !formData.course || !formData.bio || (!isEditMode && (!formData.email || !formData.password))) {
//             console.error("Please fill out all required fields.");
//             return;
//         }
//         onProfileSubmit(formData);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
//                     </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {!isEditMode && (
//                         <>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                             <hr className="border-slate-200" />
//                         </>
//                     )}
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option><option>Male</option><option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Final Year</option>
//                         </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
//                     <input type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105">
//                         {isEditMode ? 'Update Profile' : 'Create Profile'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Sidebar Component ---
// const Sidebar = ({ isOpen, onClose, onNavigate }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 z-50">
//             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
//             <div className="relative w-72 h-full bg-rose-50 shadow-xl p-6">
//                 <div className="flex items-center gap-3 mb-8">
//                     <HeartIcon className="w-10 h-10 text-rose-400" />
//                     <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>GChat</h1>
//                 </div>
//                 <nav className="flex flex-col gap-4">
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Edit Profile</button>
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Dashboard</button>
//                 </nav>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component for Dashboard ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error'; }} />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
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
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
//                     <MenuIcon className="w-8 h-8"/>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Campus Profiles
//                 </h1>
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {/* Filter re-added to hide the current user's profile from the dashboard */}
//           {students.filter(s => s.id !== currentUser?.id).map(student => (
//             <StudentCard key={student.id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//                 <p>For your privacy, all conversations are deleted after 24 hours.</p>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner.id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
//     if (e.key === 'Enter') handleSend();
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
//       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
//         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
//         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'; }}/>
//         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
//       </div>
//       <div className="flex-grow p-4 overflow-y-auto">
//         <div className="text-center text-xs text-slate-500 p-3 mb-4 bg-rose-50/80 rounded-lg border border-rose-200">
//             <p>These chats will be deleted in 24 hours.</p>
//         </div>
//         {messages.map(msg => (
//           <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-3`}>
//             <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}><p>{msg.text}</p></div>
//           </div>
//         ))}
//       </div>
//       <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"/>
//           <button onClick={handleSend} className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState(initialStudents);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const navigateToSignUp = () => setCurrentPage('profileForm');
  
//   const handleLoginAttempt = () => {
//     // In a real app, you'd verify credentials. Here, we'll just go to the dashboard.
//     // We'll also set a mock logged-in user for demonstration.
//     if (!currentUser) {
//         setCurrentUser(students[1]); // Let's log in as Rohan Verma for demo
//     }
//     setCurrentPage('dashboard');
//   };

//   const handleProfileSubmit = (profileData) => {
//     if (currentUser && currentPage === 'profileForm') { // Editing existing user
//         const updatedStudents = students.map(s => s.id === currentUser.id ? { ...s, ...profileData } : s);
//         setStudents(updatedStudents);
//         setCurrentUser({ ...currentUser, ...profileData });
//     } else { // Creating new user
//         const newUser = { id: students.length + 1, ...profileData };
//         setStudents(prevStudents => [newUser, ...prevStudents]);
//         setCurrentUser(newUser);
//     }
//     setCurrentPage('dashboard');
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
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'profileForm':
//         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
//       case 'dashboard':
//         return <DashboardPage students={students} currentUser={currentUser} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//       case 'chat':
//         return <ChatPage student={selectedStudent} onBack={() => setCurrentPage( 'allChats')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={students.filter(s => s.id !== currentUser?.id)} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'landing':
//       default:
//         return <LandingPage onNavigateToSignUp={navigateToSignUp} onLoginAttempt={handleLoginAttempt} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={handleSidebarNavigate}/>
//       {renderPage()}
//     </main>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import "./index.css"

// // --- Mock Data for Student Profiles ---
// const initialStudents = [
//   {
//     id: 1,
//     name: 'Ananya Sharma',
//     course: 'B.A. Psychology',
//     year: '2nd Year',
//     gender: 'Female',
//     bio: 'Lover of poetry, rainy days, and deep conversations. Looking for someone to explore campus coffee shops with.',
//     profilePic: 'https://placehold.co/400x400/f87171/ffffff?text=AS',
//   },
//   {
//     id: 2,
//     name: 'Rohan Verma',
//     course: 'B.Tech CSE',
//     year: '3rd Year',
//     gender: 'Male',
//     bio: 'Code by day, guitar by night. I can probably fix your laptop. Seeking a partner-in-crime for late-night coding sessions.',
//     profilePic: 'https://placehold.co/400x400/c084fc/ffffff?text=RV',
//   },
//   {
//     id: 3,
//     name: 'Priya Patel',
//     course: 'M.Sc. Biology',
//     year: '1st Year',
//     gender: 'Female',
//     bio: 'Fascinated by the little things in life, from cells to stars. Let\'s go stargazing or visit the botanical gardens.',
//     profilePic: 'https://placehold.co/400x400/fbbf24/ffffff?text=PP',
//   },
//   {
//     id: 4,
//     name: 'Sameer Khan',
//     course: 'B.Com Honours',
//     year: 'Final Year',
//     gender: 'Male',
//     bio: 'Future entrepreneur with a passion for street food and old Bollywood movies. My financial advice is usually sound.',
//     profilePic: 'https://placehold.co/400x400/60a5fa/ffffff?text=SK',
//   },
//   {
//     id: 5,
//     name: 'Isha Singh',
//     course: 'B.Des Fashion',
//     year: '2nd Year',
//     gender: 'Female',
//     bio: 'I see the world in colors and patterns. My ideal date involves thrifting and turning old clothes into something new.',
//     profilePic: 'https://placehold.co/400x400/f472b6/ffffff?text=IS',
//   },
//   {
//     id: 6,
//     name: 'Arjun Reddy',
//     course: 'MBBS',
//     year: '4th Year',
//     gender: 'Male',
//     bio: 'Surviving on caffeine and ambition. I have a weird sense of humor, probably from sleep deprivation. Make me laugh!',
//     profilePic: 'https://placehold.co/400x400/818cf8/ffffff?text=AR',
//   },
// ];

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

// // --- Landing Page Component ---
// const LandingPage = ({ onLogin }) => (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
//       <HeartIcon className="w-20 h-20 text-rose-400 mb-4" />
//       <h1 className="text-6xl md:text-7xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//         GChat
//       </h1>
//       <p className="mt-4 text-xl text-slate-600">Find your campus connection.</p>
//       <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-semibold text-slate-700 mb-6">Welcome!</h2>
//         <button onClick={onLogin} className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-75">
//           Login / Sign Up
//         </button>
//       </div>
//     </div>
// );

// // --- Sign Up / Edit Profile Page Component ---
// const ProfileFormPage = ({ onProfileSubmit, existingProfile }) => {
//     const [formData, setFormData] = useState({
//         name: '', course: '', gender: 'Female', year: '1st Year', bio: '', profilePic: ''
//     });

//     const isEditMode = !!existingProfile;

//     useEffect(() => {
//         if (isEditMode) {
//             setFormData(existingProfile);
//         }
//     }, [existingProfile, isEditMode]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.name || !formData.course || !formData.bio) {
//             // A non-blocking alert is better for user experience
//             console.error("Please fill out all required fields.");
//             return;
//         }
//         onProfileSubmit(formData);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                         {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
//                     </h2>
//                     <p className="text-slate-500">{isEditMode ? 'Keep your details fresh!' : "Let's find your connection!"}</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option><option>Male</option><option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Final Year</option>
//                         </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
//                     <input type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105">
//                         {isEditMode ? 'Update Profile' : 'Create Profile'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Sidebar Component ---
// const Sidebar = ({ isOpen, onClose, onNavigate }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 z-50">
//             {/* Backdrop */}
//             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
//             {/* Sidebar Panel */}
//             <div className="relative w-72 h-full bg-rose-50 shadow-xl p-6">
//                 <div className="flex items-center gap-3 mb-8">
//                     <HeartIcon className="w-10 h-10 text-rose-400" />
//                     <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>GChat</h1>
//                 </div>
//                 <nav className="flex flex-col gap-4">
//                     <button onClick={() => onNavigate('allChats')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">My Chats</button>
//                     <button onClick={() => onNavigate('editProfile')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Edit Profile</button>
//                     <button onClick={() => onNavigate('dashboard')} className="text-left text-lg text-slate-700 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors">Dashboard</button>
//                 </nav>
//             </div>
//         </div>
//     );
// };

// // --- Student Card Component for Dashboard ---
// const StudentCard = ({ student, onChat }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} alt={student.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error'; }} />
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
//         <p className="text-sm text-slate-500 mt-1">{student.course}, {student.year}</p>
//         <p className="text-slate-600 my-4 text-sm flex-grow">{student.bio}</p>
//         <button onClick={() => onChat(student)} className="w-full mt-auto bg-violet-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
//           <HeartIcon className="w-5 h-5" /> GChat
//         </button>
//       </div>
//     </div>
// );

// // --- Dashboard Page Component ---
// const DashboardPage = ({ students, onChat, onMenuClick }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//                 <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-rose-100 text-slate-600 hover:text-rose-500">
//                     <MenuIcon className="w-8 h-8"/>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Campus Profiles
//                 </h1>
//             </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {students.map(student => (
//             <StudentCard key={student.id} student={student} onChat={onChat} />
//           ))}
//         </div>
//       </div>
//     </div>
// );

// // --- All Chats Page ---
// const AllChatsPage = ({ chatPartners, onChat, onBack }) => (
//     <div className="min-h-screen p-4 sm:p-6 md:p-8">
//         <div className="max-w-2xl mx-auto">
//             <div className="flex items-center gap-3 mb-8">
//                 <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//                 <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Chats</h1>
//             </div>
//             <div className="space-y-4">
//                 {chatPartners.map(partner => (
//                     <div key={partner.id} onClick={() => onChat(partner)} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
//     if (e.key === 'Enter') handleSend();
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/80 shadow-2xl rounded-t-2xl md:rounded-2xl md:my-8">
//       <div className="flex items-center p-4 border-b border-slate-200 bg-white rounded-t-2xl">
//         <button onClick={onBack} className="text-violet-500 hover:text-violet-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
//         <img src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} alt={student.name} className="w-10 h-10 rounded-full object-cover ml-2" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'; }}/>
//         <div className="ml-3"><h2 className="font-bold text-slate-800 text-lg">{student.name}</h2><p className="text-sm text-slate-500">Online</p></div>
//       </div>
//       <div className="flex-grow p-4 overflow-y-auto">
//         {messages.map(msg => (
//           <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-3`}>
//             <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-rose-400 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}><p>{msg.text}</p></div>
//           </div>
//         ))}
//       </div>
//       <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
//         <div className="flex items-center">
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300"/>
//           <button onClick={handleSend} className="ml-3 bg-violet-500 text-white p-3 rounded-full hover:bg-violet-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main App Component ---
// export default function App() {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState(initialStudents);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogin = () => setCurrentPage('signup');
  
//   const handleProfileSubmit = (profileData) => {
//     if (currentUser) { // Editing existing user
//         const updatedStudents = students.map(s => s.id === currentUser.id ? { ...s, ...profileData } : s);
//         setStudents(updatedStudents);
//         setCurrentUser({ ...currentUser, ...profileData });
//     } else { // Creating new user
//         const newUser = { id: students.length + 1, ...profileData };
//         setStudents(prevStudents => [newUser, ...prevStudents]);
//         setCurrentUser(newUser);
//     }
//     setCurrentPage('dashboard');
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
//         setCurrentPage('signup');
//     } else {
//         setCurrentPage(page);
//     }
//     setIsSidebarOpen(false);
//   };
  
//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'signup':
//         return <ProfileFormPage onProfileSubmit={handleProfileSubmit} existingProfile={currentUser} />;
//       case 'dashboard':
//         return <DashboardPage students={students} onChat={handleStartChat} onMenuClick={() => setIsSidebarOpen(true)} />;
//       case 'chat':
//         return <ChatPage student={selectedStudent} onBack={() => setCurrentPage( 'allChats')} />;
//       case 'allChats':
//         return <AllChatsPage chatPartners={students.filter(s => s.id !== currentUser?.id)} onChat={handleStartChat} onBack={handleBackToDashboard} />;
//       case 'landing':
//       default:
//         return <LandingPage onLogin={handleLogin} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={handleSidebarNavigate}/>
//       {renderPage()}
//     </main>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import "./index.css"

// // --- Mock Data for Student Profiles ---
// const initialStudents = [
//   {
//     id: 1,
//     name: 'Ananya Sharma',
//     course: 'B.A. Psychology',
//     year: '2nd Year',
//     gender: 'Female',
//     bio: 'Lover of poetry, rainy days, and deep conversations. Looking for someone to explore campus coffee shops with.',
//     profilePic: 'https://placehold.co/400x400/f87171/ffffff?text=AS',
//   },
//   {
//     id: 2,
//     name: 'Rohan Verma',
//     course: 'B.Tech CSE',
//     year: '3rd Year',
//     gender: 'Male',
//     bio: 'Code by day, guitar by night. I can probably fix your laptop. Seeking a partner-in-crime for late-night coding sessions.',
//     profilePic: 'https://placehold.co/400x400/c084fc/ffffff?text=RV',
//   },
//   {
//     id: 3,
//     name: 'Priya Patel',
//     course: 'M.Sc. Biology',
//     year: '1st Year',
//     gender: 'Female',
//     bio: 'Fascinated by the little things in life, from cells to stars. Let\'s go stargazing or visit the botanical gardens.',
//     profilePic: 'https://placehold.co/400x400/fbbf24/ffffff?text=PP',
//   },
//   {
//     id: 4,
//     name: 'Sameer Khan',
//     course: 'B.Com Honours',
//     year: 'Final Year',
//     gender: 'Male',
//     bio: 'Future entrepreneur with a passion for street food and old Bollywood movies. My financial advice is usually sound.',
//     profilePic: 'https://placehold.co/400x400/60a5fa/ffffff?text=SK',
//   },
//   {
//     id: 5,
//     name: 'Isha Singh',
//     course: 'B.Des Fashion',
//     year: '2nd Year',
//     gender: 'Female',
//     bio: 'I see the world in colors and patterns. My ideal date involves thrifting and turning old clothes into something new.',
//     profilePic: 'https://placehold.co/400x400/f472b6/ffffff?text=IS',
//   },
//   {
//     id: 6,
//     name: 'Arjun Reddy',
//     course: 'MBBS',
//     year: '4th Year',
//     gender: 'Male',
//     bio: 'Surviving on caffeine and ambition. I have a weird sense of humor, probably from sleep deprivation. Make me laugh!',
//     profilePic: 'https://placehold.co/400x400/818cf8/ffffff?text=AR',
//   },
//   {
//     id: 7,
//     name: 'Meera Desai',
//     course: 'B.A. English Lit.',
//     year: '3rd Year',
//     gender: 'Female',
//     bio: 'Lost in the world of classic novels and period dramas. Let\'s discuss Austen and Brontë over a cup of chai.',
//     profilePic: 'https://placehold.co/400x400/a78bfa/ffffff?text=MD',
//   },
//   {
//     id: 8,
//     name: 'Vikram Rathore',
//     course: 'LLB',
//     year: '2nd Year',
//     gender: 'Male',
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
//           Login / Sign Up
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- Sign Up Page Component ---
// const SignUpPage = ({ onProfileCreate }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         course: '',
//         gender: 'Female',
//         year: '1st Year',
//         bio: '',
//         profilePic: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Basic validation
//         if (!formData.name || !formData.course || !formData.bio) {
//             alert("Please fill out all required fields.");
//             return;
//         }
//         onProfileCreate(formData);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
//                 <div className="text-center mb-6">
//                     <HeartIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
//                     <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Create Your Profile</h2>
//                     <p className="text-slate-500">Let's find your connection!</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Your Course (e.g., B.Tech CSE)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" required />
//                     <div className="flex gap-4">
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>Female</option>
//                             <option>Male</option>
//                             <option>Other</option>
//                         </select>
//                         <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300">
//                             <option>1st Year</option>
//                             <option>2nd Year</option>
//                             <option>3rd Year</option>
//                             <option>4th Year</option>
//                             <option>Final Year</option>
//                         </select>
//                     </div>
//                     <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio (max 150 chars)" maxLength="150" className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" required></textarea>
//                     <input type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
//                     <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transition-all duration-300 transform hover:scale-105">
//                         Create Profile
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };


// // --- Student Card Component for Dashboard ---
// const StudentCard = ({ student, onChat }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
//       <img 
//         src={student.profilePic || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Pic'} 
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
//           src={student.profilePic || 'https://placehold.co/100x100/cccccc/ffffff?text=Pic'} 
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
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [students, setStudents] = useState(initialStudents);

//   const handleLogin = () => {
//     setCurrentPage('signup');
//   };
  
//   const handleProfileCreate = (newProfileData) => {
//     const newUser = {
//         id: students.length + 1,
//         ...newProfileData
//     };
//     setStudents(prevStudents => [newUser, ...prevStudents]);
//     setCurrentPage('dashboard');
//   };

//   const handleStartChat = (student) => {
//     setSelectedStudent(student);
//     setCurrentPage('chat');
//   };

//   const handleBackToDashboard = () => {
//     setCurrentPage('dashboard');
//     setSelectedStudent(null);
//   };
  
//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap";
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   }, []);

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'signup':
//         return <SignUpPage onProfileCreate={handleProfileCreate} />;
//       case 'dashboard':
//         return <DashboardPage students={students} onChat={handleStartChat} />;
//       case 'chat':
//         return <ChatPage student={selectedStudent} onBack={handleBackToDashboard} />;
//       case 'landing':
//       default:
//         return <LandingPage onLogin={handleLogin} />;
//     }
//   };

//   return (
//     <main className="bg-gradient-to-br from-rose-100 via-purple-50 to-cream-100 font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
//       {renderPage()}
//     </main>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import "./index.css"

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
