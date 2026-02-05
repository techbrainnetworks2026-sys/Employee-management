import React, { useState } from 'react';
import './AttendanceView.css';

const AttendanceView = ({ attendance = [], leaves = [] }) => {
    // State for selected month/year (default to Jan 2026 for mock data alignment)
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Navigation handlers removed in favor of dropdowns

    const handleMonthChange = (e) => {
        setCurrentDate(new Date(year, parseInt(e.target.value), 1));
    };

    const handleYearChange = (e) => {
        setCurrentDate(new Date(parseInt(e.target.value), month, 1));
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => 2026 + i); // 2026 to 2030

    // Tamil Nadu Government Holidays 2026 (Mock/Approximate)
    const holidays = [
        { date: '2026-01-01', name: 'New Year' },
        { date: '2026-01-14', name: 'Bhogi' },
        { date: '2026-01-15', name: 'Pongal' },
        { date: '2026-01-16', name: 'Thiruvalluvar Day' },
        { date: '2026-01-17', name: 'Uzhavar Thirunal' },
        { date: '2026-01-26', name: 'Republic Day' },
        { date: '2026-03-30', name: 'Ramzan' },
        { date: '2026-04-14', name: 'Tamil New Year' },
        { date: '2026-05-01', name: 'May Day' },
        { date: '2026-08-15', name: 'Independence Day' },
        { date: '2026-08-26', name: 'Milad-un-Nabi' },
        { date: '2026-10-02', name: 'Gandhi Jayanti' },
        { date: '2026-10-20', name: 'Ayutha Pooja' },
        { date: '2026-10-21', name: 'Vijaya Dasami' },
        { date: '2026-11-08', name: 'Diwali' },
        { date: '2026-12-25', name: 'Christmas' }
    ];

    const getStatus = (day) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Check for Holiday
        const holiday = holidays.find(h => h.date === dateStr);
        if (holiday) return 'Holiday';
        const record = attendance.find(a => a.date === dateStr);
        if (record) return record.status;

        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0; // Only Sunday (0) is weekend
        if (isWeekend) return 'Weekend';

        // Check if future date
        if (date > new Date()) return '-';

        return 'Absent';
    };

    // const getStatusColor = ... (Removed as we use CSS classes now)

    // Totals now calculated dynamically below

    const totalPresent = attendance.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === month && d.getFullYear() === year && a.status === 'Present';
    }).length;

    const totalLeave = attendance.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === month && d.getFullYear() === year && a.status === 'Leave';
    }).length;

    // Calculate working days (excluding Sundays and Holidays)
    let workingDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const dayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        const isHoliday = holidays.some(h => h.date === dayStr);

        // Count if NOT Sunday AND NOT Holiday
        if (d.getDay() !== 0 && !isHoliday) {
            workingDays++;
        }
    }

    // State for selected day details modal
    const [selectedDayDetails, setSelectedDayDetails] = useState(null);

    const handleDayClick = (day) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const status = getStatus(day);

        let details = {
            date: new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            status: status,
            info: null
        };

        if (status === 'Leave') {
            const leaveRecord = leaves.find(l => l.date === dateStr);
            details.info = leaveRecord ? { label: 'Reason', value: leaveRecord.reason } : { label: 'Reason', value: 'Not Specified' };
        } else if (status === 'Holiday') {
            const holiday = holidays.find(h => h.date === dateStr);
            details.info = { label: 'Holiday', value: holiday?.name };
        } else if (status === 'Absent') {
            details.info = { label: 'Note', value: 'Unplanned Absence' };
        } else if (status === 'Present') {
            const record = attendance.find(a => a.date === dateStr);
            details.times = {
                checkIn: record?.checkIn || '-',
                checkOut: record?.checkOut || '-'
            };
        }

        if (status !== '-' && status !== 'Weekend') {
            setSelectedDayDetails(details);
        }
    };

    const isClickable = (status) => ['Present', 'Absent', 'Leave', 'Holiday'].includes(status);

    const downloadCSV = () => {
        const headers = ["Date", "Day", "Status", "Check-In", "Check-Out", "Details"];
        const rows = daysArray.map(day => {
            const dateObj = new Date(year, month, day);
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const status = getStatus(day);
            const record = attendance.find(a => a.date === dateStr);

            let details = '';
            if (status === 'Leave') {
                const leave = leaves.find(l => l.date === dateStr);
                details = leave ? leave.reason : '';
            } else if (status === 'Holiday') {
                const holiday = holidays.find(h => h.date === dateStr);
                details = holiday ? holiday.name : '';
            }

            return [
                dateStr,
                dayName,
                status,
                record?.checkIn || '-',
                record?.checkOut || '-',
                details
            ].join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_${months[month]}_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-view attendance-view">
            {/* Modal */}
            {selectedDayDetails && (
                <div className="modal-overlay" onClick={() => setSelectedDayDetails(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Attendance Details</h3>
                            <button className="close-btn" onClick={() => setSelectedDayDetails(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">{selectedDayDetails.date}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status</span>
                                <span className={`detail-value ${selectedDayDetails.status ? ('status-' + selectedDayDetails.status.toLowerCase().replace(/\s+/g, '-').replace('/', '-')) : ''}`}>
                                    {selectedDayDetails.status}
                                </span>
                            </div>
                            {selectedDayDetails.info && (
                                <div className="detail-row">
                                    <span className="detail-label">{selectedDayDetails.info.label}</span>
                                    <span className="detail-value">{selectedDayDetails.info.value}</span>
                                </div>
                            )}
                            {selectedDayDetails.times && (
                                <>
                                    <div className="detail-row">
                                        <span className="detail-label">Check-In</span>
                                        <span className="detail-value">{selectedDayDetails.times.checkIn}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Check-Out</span>
                                        <span className="detail-value">{selectedDayDetails.times.checkOut}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <button className="primary-btn fullwidth" onClick={() => setSelectedDayDetails(null)}>Close</button>
                    </div>
                </div>
            )}

            <div className="view-header">
                <div className="left">
                    <h2 className='Monthly-Attendance'>Monthly Attendance</h2>
                    <button onClick={downloadCSV} className="secondary-btn small">
                        📥 Export CSV
                    </button>
                </div>

                <div className="month-controls">
                    <select
                        value={month}
                        onChange={handleMonthChange}
                    >
                        {months.map((m, index) => (
                            <option key={index} value={index}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={handleYearChange}
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="attendance-summary">
                <div className="Total-Present">Total Present: <b>{totalPresent}</b></div>
                <div className="Total-Leave">Total Leave: <b>{totalLeave}</b></div>
                <div className="Working-Days">Working Days: <b>{workingDays}</b></div>
            </div>

            <div className="calendar-grid">
                {daysArray.map(day => {
                    const status = getStatus(day);
                    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const dayName = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short' });
                    const record = attendance.find(a => a.date === dateStr);
                    const clickable = isClickable(status);

                    return (
                        <div
                            key={day}
                            className={`calendar-day status-${status.toLowerCase().replace('/', '-')} ${clickable ? 'clickable' : ''}`}
                            onClick={() => handleDayClick(day)}
                        >
                            <div className="day-header">
                                <span className="day-number">{day}</span>
                                <span className="day-name">{dayName}</span>
                            </div>

                            <div className="day-body">
                                <span className="day-status-label">{status}</span>
                                {status === 'Holiday' && (
                                    <div className="holiday-note">
                                        {holidays.find(h => h.date === dateStr)?.name}
                                    </div>
                                )}
                                {status === 'Present' && (
                                    <div className="day-times">
                                        <span>In: {record?.checkIn || '-'}</span>
                                        <span>Out: {record?.checkOut || '-'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendanceView;
