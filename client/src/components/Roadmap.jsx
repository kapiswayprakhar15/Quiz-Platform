import React, { useEffect, useState } from 'react';

const Roadmap = () => {
  const [roadmapData, setRoadmapData] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    fetch('http://localhost:3001/get-data')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Check the fetched data in the console
        setRoadmapData(data); // Set the fetched data to the state
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Your Roadmap</h1>
      <ul>
      {roadmapData.map(({ Skill, Roadmap, Link }, index) => (
  <li key={`${Skill}-${index}`}>
    <strong>{Skill}</strong>: {Roadmap} - <a href={Link} target="_blank" rel="noopener noreferrer">Link</a>
  </li>
))}

      </ul>
    </div>
  );
};

export default Roadmap;





