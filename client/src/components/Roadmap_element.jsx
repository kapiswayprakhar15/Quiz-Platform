import React from 'react';

const Element = ({ iconClass, title, description, position }) => {
  return (
    <div className={`container ${position}`}>
      {/* <div className="date">{date}</div> */}
      <i className={`icon fa ${iconClass}`}></i>
      <div className="content">
        <h2>{title}</h2>
        <p>Link: {description}</p>
      </div>
    </div>
  );
};

const Roadmap = ({ roadmapData }) => {
  return (
    <div>
      <div id="roadmap-container"></div>
      <div className="roadmap">
        {roadmapData.map((item, index) => (
          <Element key={index} {...item} position={index % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
