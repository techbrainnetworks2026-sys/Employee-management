import React from 'react';

const AnnouncementsView = ({ announcements = [] }) => {
    return (
        <div className="dashboard-view announcements-view">
            <h2>Announcements</h2>
            <div className="announcement-list">
                {announcements.map(ann => (
                    <div key={ann.id} className="announcement-item">
                        <div className="ann-header">
                            <h3>📢 {ann.title}</h3>
                            <span className="ann-date">{ann.date}</span>
                        </div>
                        <p className="ann-message">{ann.message}</p>
                        <div className="ann-footer">
                            <small>Posted by: {ann.createdBy}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsView;
