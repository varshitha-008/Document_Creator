import React from 'react';

function VersionHistory({ versions, onRevert }) {
  return (
    <div>
      <h3>Version History</h3>
      <ul>
        {versions.map(version => (
          <li key={version.version}>
            <span>Version {version.version} - {new Date(version.timestamp).toLocaleString()}</span>
            <button onClick={() => onRevert(version.version)}>Revert</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VersionHistory;
