import React from 'react';

export default ({text, color='lightblue'}) => (
  <span
    style={{ backgroundColor: color, padding: "0 0.2em" }}
    className='annotated-text'>
    {text}
  </span>
)