import React from 'react';

const BACK = "<"
const FORWARD = ">"
const COLOR = "white"
export const NavigateBack = () => (
    <button style={{ backgroundColor: COLOR }}
      className="btn">
      {BACK}
    </button>
)
export const NavigateForward = () => (
  <button style={{ backgroundColor: COLOR }}
    className="btn">
    {FORWARD}
  </button>
)
