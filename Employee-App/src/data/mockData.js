export const mockUser = {
    name: "Pavin",
    email: "pavin@techbrain.com",
    role: "Employee",
    mobile: "9876543210",
    designation: "MERN Stack Developer",
    department: "BSC Computer Science",
    address: "Chennai, India",
    managerId: "M001",
    dob: "2001-10-22",
    bloodGroup: "O+",
    profilePicture: null // Base64 or URL will go here
};

export const mockAttendance = [
    { date: "2026-01-01", status: "Present", checkIn: "09:00 AM", checkOut: "06:00 PM" },
    { date: "2026-01-02", status: "Present", checkIn: "09:15 AM", checkOut: "06:10 PM" },
    { date: "2026-01-03", status: "Absent", checkIn: "-", checkOut: "-" },
    { date: "2026-01-05", status: "Present", checkIn: "08:55 AM", checkOut: "06:05 PM" },
    { date: "2026-01-06", status: "Present", checkIn: "09:05 AM", checkOut: "06:00 PM" },
    { date: "2026-01-07", status: "Present", checkIn: "09:00 AM", checkOut: "Pending" },
    // ... more entries would be dynamic in real app
];

export const mockLeaves = [

];

export const mockTasks = [

];

export const mockAnnouncements = [
    {
        title: "notice",
        message: "hii everyone",
        date: "2026-01-01",
        createdBy: "Pavin"
    },
    {
        title: "notice",
        message: "hii everyone",
        date: "2026-01-02",
        createdBy: "kabilan"
    }
];
