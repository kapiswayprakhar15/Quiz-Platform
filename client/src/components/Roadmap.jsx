// Place this in your src directory (e.g., src/Roadmap.jsx)
import React, { useEffect } from 'react';

const Roadmap = ({ roadmapData }) => {
  useEffect(() => {
    const generateRoadmapCode = (data) => {
      let code = 'st=>start: Start\n';

      data.forEach(({ Skill, Roadmap, Link }) => {
        code += `${Skill}=>operation: ${Roadmap}\n`;
        code += `${Skill}(link)->${Link}\n`;
      });

      code += 'e=>end: End\n';

      return code;
    };

    const roadmapCode = generateRoadmapCode(roadmapData);

    const roadmapContainer = document.getElementById('roadmap-container');
    roadmapContainer.innerHTML = '';
    roadmap.parse(roadmapCode).drawSVG('roadmap-container');
  }, [roadmapData]);

  return (
    <div>
      <h1>Your Roadmap</h1>
      <div id="roadmap-container"></div>
    </div>
  );
};

export default Roadmap;
