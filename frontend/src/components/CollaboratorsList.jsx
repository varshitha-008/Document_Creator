const CollaboratorsList = ({ collaborators, colors }) => {
  return (
    <div>
      <h4>Collaborators:</h4>
      <ul>
        {collaborators.map((collab) => (
          <li key={collab.userId} style={{ color: colors[collab.userId] || 'black' }}>
            {collab.userId} {/* You can replace with the user's name */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorsList;
