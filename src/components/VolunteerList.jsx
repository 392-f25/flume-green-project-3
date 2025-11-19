import './VolunteerList.css';

const VolunteerList = ({ volunteers, eventName }) => {
  return (
    <div className="volunteer-list-container">
      <h2>Registered Volunteers</h2>
      {eventName && <p className="event-name">Event: {eventName}</p>}
      
      {volunteers && volunteers.length > 0 ? (
        <>
          <p className="volunteer-count">
            Total Volunteers: <strong>{volunteers.length}</strong>
          </p>
          <div className="volunteer-table-wrapper">
            <table className="volunteer-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td>{volunteer.firstName}</td>
                    <td>{volunteer.lastName}</td>
                    <td>{volunteer.email}</td>
                    <td>
                      {volunteer.registeredAt 
                        ? new Date(volunteer.registeredAt).toLocaleDateString() + ' ' + 
                          new Date(volunteer.registeredAt).toLocaleTimeString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="no-volunteers">
          <p>No volunteers have registered for this event yet.</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerList;
