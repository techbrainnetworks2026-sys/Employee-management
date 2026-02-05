import React, { useState, useRef, useEffect } from "react";
import "./EmployeeDashboard.css";
import { mockUser, mockAttendance, mockLeaves, mockTasks, mockAnnouncements } from "../../data/mockData";
import AttendanceView from "./components/AttendanceView";
import LeaveHistory from "./components/LeaveHistory";
import ApplyLeave from "./components/ApplyLeave";
import TaskManager from "./components/TaskManager";
import AnnouncementsView from "./components/AnnouncementsView";
import { useNavigate } from "react-router-dom";
import ProfileView from "./components/ProfileView";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(mockAnnouncements.length); // Dynamic count
  const profileRef = useRef(null);

  // Data State
  const [user, setUser] = useState(mockUser);
  const [leaves, setLeaves] = useState(mockLeaves);
  const [tasks, setTasks] = useState(mockTasks);
  const [editProfile, setEditProfile] = useState(false);

  // Stats for Widgets
  const presentDays = mockAttendance.filter(a => a.status === 'Present').length;
  const totalLeavesTaken = leaves.filter(l => l.status === 'Approved').length; // Simple logic
  const tasksInProgress = tasks.filter(t => t.status === 'In Progress').length;
  const tasksCompleted = tasks.filter(t => t.status === 'Completed').length;

  // Check-in State
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  // Initialize Check-in state based on mock data (today)
  useState(() => {
    // Simulating finding today's record
    // In a real app, this would fetch from backend
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfile]);

  const handleCheckIn = (e) => {
    e.stopPropagation(); // Prevent card click
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(true);
    setCheckInTime(time);
    // Add to attendance list locally
    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord = { date: todayStr, status: 'Present', checkIn: time, checkOut: 'Pending' };

    // Remove if exists to avoid dupes in this mock
    // const filtered = mockAttendance.filter(a => a.date !== todayStr); // Unused
    mockAttendance.push(newRecord); // Mutating mock for simplicity or use setAttendance state if we managed it fully
  };

  const handleCheckOut = (e) => {
    e.stopPropagation();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(false);
    setCheckOutTime(time);
    // Update mock record
    const todayStr = new Date().toISOString().split('T')[0];
    const recordIndex = mockAttendance.findIndex(a => a.date === todayStr);
    if (recordIndex >= 0) {
      mockAttendance[recordIndex].checkOut = time;
    }
  };




  const handleApplyLeave = (newLeave) => {
    const leaveEntry = {
      id: leaves.length + 1,
      ...newLeave,
      status: 'Pending'
    };
    setLeaves([...leaves, leaveEntry]);
    setActive('leaves'); // Redirect to history
  };

  const handleTaskStatusUpdate = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    setActive("announcements");
  };

  const handleLogout = () => {
    // Clear data if needed
    navigate('/Signin');
  };

  return (
    <div className="layout">


      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="logo">Techbrain Networks</div>
        </div>
        <div className="header-right">
          <div className={`notification ${notificationCount > 0 ? 'has-notifications' : ''}`} onClick={handleNotificationClick}>
            <svg className="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
          </div>
          <div className="profile-area" ref={profileRef}>
            <button
              className="profile-toggle"
              onClick={() => setShowProfile(!showProfile)}
              aria-label="Profile menu"
              title="Click to open profile menu"
            >
              <div className="header-avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" />
                ) : (
                  <span className="avatar-placeholder">👤</span>
                )}
              </div>
              <span className="profile-name">{user.name}</span>
            </button>
            {showProfile && (
              <div className="profile-dropdown">
                <button onClick={() => {
                  setActive("profile");
                  setShowProfile(false);
                }}>Profile</button>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>
        <button className={active === 'dashboard' ? 'active' : ''} onClick={() => { setActive("dashboard"); setSidebarOpen(false); }}>Dashboard</button>
        <button className={active === 'attendance' ? 'active' : ''} onClick={() => { setActive("attendance"); setSidebarOpen(false); }}>Attendance</button>
        <button className={active === 'leaves' ? 'active' : ''} onClick={() => { setActive("leaves"); setSidebarOpen(false); }}>Leaves</button>
        <button className={active === 'tasks' ? 'active' : ''} onClick={() => { setActive("tasks"); setSidebarOpen(false); }}>Tasks</button>
        <button className={active === 'applyLeave' ? 'active' : ''} onClick={() => { setActive("applyLeave"); setSidebarOpen(false); }}>Apply Leave</button>
        <button className={active === 'announcements' ? 'active' : ''} onClick={() => { setActive("announcements"); setSidebarOpen(false); }}>Announcements</button>
      </aside>

      {/* Main Content */}
      <main className="content">

        {/* DASHBOARD HOME */}
        {active === "dashboard" && (
          <div className="dashboard-home">
            <h2 className="welcome-user">Welcome, {user.name}</h2>
            <div className="cards">
              {/* Widget 1: Total Days Present */}


              {/* Widget 2: Today's Status (Interactive) */}
              <div className="card checkin-card">
                <h2>Today's Status</h2>
                <div className="date-text">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {!isCheckedIn && !checkOutTime ? (
                  <div className="status-content">
                    <div className="status-text">Not Checked In</div>
                    <button className="checkin-btn" onClick={handleCheckIn}>Check In</button>
                  </div>
                ) : isCheckedIn ? (
                  <div className="status-content">
                    <div className="check-time">In: {checkInTime}</div>
                    <div className="working-badges">🕒 Working</div>
                    <button className="checkout-btn" onClick={handleCheckOut}>Check Out</button>
                  </div>
                ) : (
                  <div className="status-content">
                    <div className="check-time">In: {checkInTime}</div>
                    <div className="check-time">Out: {checkOutTime}</div>
                    <div className="completed-badge">✅ Day Completed</div>
                  </div>
                )}
              </div>
              <div className="card" onClick={() => setActive('attendance')}>
                <h3>Total Days Present</h3>
                <div className="card-value">{presentDays} / 22</div>
                <p>January 2026</p>
              </div>

              {/* Widget 2 */}
              <div className="card" onClick={() => setActive('leaves')}>
                <h3>Yearly Leave Taken</h3>
                <div className="card-value">{totalLeavesTaken} Days</div>
                <p>View History</p>
              </div>

              {/* Widget 3 */}
              <div className="card" onClick={() => setActive('tasks')}>
                <h3>Task Completion</h3>
                <div className="card-stat">In Progress: <b>{tasksInProgress}</b></div>
                <div className="card-stat">Completed: <b>{tasksCompleted}</b></div>
              </div>

              {/* Widget 4 */}
              <div className="card highlight-card" onClick={() => setActive('applyLeave')}>
                <p className="apply-Leave">Apply Leave</p>
              </div>
            </div>
          </div>
        )}

        {/* SUB VIEWS */}
        {active === "dashboard" && (
          // ... (Dashboard widgets are above, this section conditionally renders if I extracted them, 
          // but based on current file structure, 'dashboard' view renders the cards.
          // Wait, looking at lines 122-187, the cards are rendered when active==='dashboard'.
          // Lines 195+ are for OTHER views.
          // I need to check where active === "attendance" is handled.
          // Ah, I need to see the line where AttendanceView is rendered.
          null
        )}

        {/* Render Views based on active state */}
        {active === "attendance" && <AttendanceView attendance={mockAttendance} leaves={leaves} />}
        {active === "leaves" && <LeaveHistory leaves={leaves} />}
        {active === "applyLeave" && <ApplyLeave onApply={handleApplyLeave} />}
        {active === "tasks" && <TaskManager tasks={tasks} onUpdateStatus={handleTaskStatusUpdate} onAddTask={handleAddTask} />}
        {active === "announcements" && <AnnouncementsView announcements={mockAnnouncements} />}

        {active === "profile" && (
          <ProfileView
            user={user}
            setUser={setUser}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
          />
        )}

      </main>
    </div>
  );
}
