import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams, useLocation, Redirect } from 'react-router';

import API from './API'
import useKey from './hooks/useKey'
import { SentimentButton, DiscardButton } from './components/Buttons'
import {
  NavigateBack, NavigateForward
} from './components/Navigation'
import Labeled from './components/Labeled'
import getIndices from './helpers/getIndices'

const baseUrl = "http://localhost:5000"
const entityUrl = (index) => `${baseUrl}/entity?index=${index}`

const NEG = -1
const NEU = 0
const POS = 1

let markedColor = null

const parseSentiment = (sent) => {
  if (sent === NEU) return "NEUTRAL"
  else if (sent === POS) return "POSITIVE"
  return "NEGATIVE"
}

// convert numbers to color
const getSentimentColor = (sent) => {
  if (sent === NEU) return "moccasin"
  else if (sent === POS) return "palegreen"
  else return "lightcoral"
}

/*
{
  "aliases": [
    "placeholder", 
    "placeholder"
  ], 
  "name": "placeholder", 
  "offset": 0, 
  "phrase": "placeholder", 
  "sentiment": 0, 
  "summary": "placeholder", 
  "relevant": "placeholder",
  "text": "placeholder", 
  "to_discard": "False"
}
*/

async function annotate(index, sentiment) {
  if (index) {
    await API.post(`/entity?index=${index}&sent=${sentiment}`)
    .then((res) => {
      console.log(res)
    })
  }
}

async function discard(index) {
  await API.post(`/discard?index=${index}`)
  .then((res) => {
    console.log('discarded', index)
  })
}

async function getSentiment(index) {
  let sent
  if (index) {
    await API.post(`/sentiment?index=${index}`)
    .then((res) => {
      sent = res.data
      console.log(sent)
    })
  }
  return sent
}

// const annotate = async({index, sentiment}) => {
//   await API.post("entity", null, {
//     params: {
//       index: index,
//       sentiment: sentiment
//     }
//   }).then((res) => {
//     console.log('POSTED')
//     console.log(res)
//   })
// }

const annotateText = (text, entity, aliases) => {
  // iterate through a text an label matching words
  const indices = getIndices(entity, text)
  aliases.map((alias) => {
    const aliasIndices = getIndices(alias, text)
  })
}

const Entity = ({index, sentiment}) => {
  const [loaded, setLoaded] = useState(false)
  const [color, setColor] = useState(null)
  const entityData = useRef(null)
  const _index = useRef(null)

  useKey("q", () => setSentiment(-1))
  useKey("w", () => setSentiment(0))
  useKey("e", () => setSentiment(1))

  const fetchEntity = async () => {
    await API.get("entity", {
      params: { index }
    }).then((res) => {
      entityData.current = res.data
      _index.current = index
      setLoaded(index)  // utilize index to ensure it propagates properly throughout the component
      setColor(getSentimentColor(entityData.current.sentiment))
    })
  }

  const setSentiment = (sent) => {
    setColor(getSentimentColor(sent))
    annotate(_index.current, sent)
  }

  useEffect(() => {
    fetchEntity()
  }, [index])

  const displayEntity = () => {
    const json = entityData.current
    const name = json.name
    const aliases = json.aliases
    const offsets = json.offset
    const phrases = json.phrase
    const summary = json.summary
    const text = json.text
    const aliasSentences = json.relevant_texts
    // modifiers
    const sentiment = json.sentiment
    const toDiscard = json.to_discard

    return (
      <div className="entity">
        <div className="backdrop" style={
          {
            backgroundColor: color
          }}>
        </div>
        <div className="header center">
          <h1>Annotator 3000</h1>
          <h2>Annotating <Labeled text={name} color={color}/></h2>
          <div className="button-rack">
            <SentimentButton text="Negative" keybind="q"/>
            <SentimentButton text="Neutral" keybind="w"/>
            <SentimentButton text="Positive" keybind="e"/>
          </div>
        </div>
        <div className="content">
          <h3>Summary</h3><p>{summary}</p>
          <h3>Sentences mentioning {name}</h3>
            <ul>
              {aliasSentences.map((sent) => <li>{sent}</li>)}
            </ul>
          <h3>Full text</h3><p>{text}</p>
          <div className="footer">
            <div className="footer-left">
              <h3>Aliases</h3>
              {aliases.map((a) => 
                <p key={a}>{a}</p>
              )}
              <h3>Phrases</h3>
              {phrases.map((p) => 
                <p key={p}>{p}</p>
              )}
            </div>
            <div className="footer-left">
            </div>
            <div className="footer-right">
              <h3>Offsets</h3>
              {offsets.map((off) => 
                <p key={off}>{off}</p>
              )}
            </div>
          </div>
          <div className="button-rack bottom">
            <DiscardButton />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="entity-container">
      { (loaded !== false) ?  // as index 0 counts as zero otherwise
        displayEntity()
        :
        <h2>loading...</h2>
      }
    </div>
  )
}

const App = () => {
  let history = useHistory()
  let { index } = useParams()
  index = parseInt(index)

  useEffect(() => {
    console.log('App loaded with index:', index)
  }, [index])

  const redirect = (i) => history.push(`/entity/${i}`)

  const next = () => {
    console.log('next')
    index = index + 1
    console.log('idx is now:',index)
    redirect(index)
  }
  const prev = () => {
    index = index - 1
    redirect(index)
  }
  useKey('arrowright', next)
  useKey('arrowleft', prev)

  const discard = () => discard(index)
  useKey("d", discard)


  return (
    <div className="App">
      <Entity index={index}/>
    </div>
  )
}

export default App;
