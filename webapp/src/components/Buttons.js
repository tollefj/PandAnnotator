import React from 'react';

const KeybindButton = ({content, keybind, color="white"}) => (
  <button style={{
      backgroundColor: color
    }}
    className="btn">
    {content} ({keybind})
  </button>
)

export const DiscardButton = ({keybind}) => (
  <KeybindButton content="DISCARD ENTITY"
    keybind="d"
    color="white"
  />
)

export const SaveButton = ({keybind}) => (
  <KeybindButton content="SAVE CHANGES"
    keybind="s"
    color="white"
  />
)

export const SentimentButton = ({text, keybind}) => {
  let color = "moccasin" // neutral
  if (text === 'Positive') {
    color = "palegreen"
  } else if (text === "Negative") {
    color = "lightcoral"
  }

  return <KeybindButton content={text} keybind={keybind} color={color} />
}
