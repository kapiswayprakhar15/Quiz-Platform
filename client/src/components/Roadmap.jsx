import React, { useEffect } from 'react';
import flowchart from 'flowchart.js';

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

    const diagram = flowchart.parse(roadmapCode);
    const diagramContainer = document.getElementById('roadmap-container');
    diagramContainer.innerHTML = '';
    diagram.drawSVG('roadmap-container');
  }, [roadmapData]);

  return (
    <div>
      <h1>Your Roadmap</h1>
      <div id="roadmap-container"></div>
    </div>
  );
};

export default Roadmap;
