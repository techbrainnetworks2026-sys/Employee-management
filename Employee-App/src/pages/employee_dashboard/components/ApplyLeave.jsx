import React, { useState } from 'react';
import './ApplyLeave.css';

const ApplyLeave = ({ onApply }) => {
    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        type: 'Casual',
        reason: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onApply) {
            onApply(formData);
            // Reset form
            setFormData({
                fromDate: '',
                toDate: '',
                type: 'Casual',
                reason: ''
            });
            alert('Leave application submitted successfully!');
        }
    };

    return (
        <div className="dashboard-view apply-leave-view">
            <h2>Apply Leave</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Leave From Date</label>
                    <input
                        type="date"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Leave To Date</label>
                    <input
                        type="date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Leave Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="Casual">Casual Leave</option>
                        <option value="Sick">Sick Leave</option>

                    </select>
                </div>

                <div className="form-group">
                    <label>Reason</label>
                    <textarea
                        name="reason"
                        rows="4"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        placeholder="Reason for leave..."
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="primary-btn">Submit Application</button>
                    <button type="button" className="secondary-btn" onClick={() => setFormData({ fromDate: '', toDate: '', type: 'Casual', reason: '' })}>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default ApplyLeave;
