import json

import pandas as pd
from flask import Flask, abort, current_app, jsonify, make_response, request
from flask_cors import CORS

from dataLoader import DataLoader
from dataModifiers import discard, get_row, get_text, set_sentiment
from sentiment import Sentiment
from validators import validate_index, validate_sentiment

from attention import Attention

# load dataframes
loader = DataLoader()
entities = loader.get_entities()
texts = loader.get_texts()

SA = Sentiment()
ATTENTION = Attention()

# constants
ENTITY_COUNT = len(entities)
# index as query param
def get_index(args):
    return validate_index(args, ENTITY_COUNT)

# sentiment as query param
def get_sent(args):
    return validate_sentiment(args)


app = Flask(__name__)
# enable webapp interaction (cross-origin)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return 'Main app'

@app.errorhandler(404)
def not_found(err):
    return 'Woops! Error: {}'.format(err)
app.register_error_handler(404, not_found)

@app.route('/entity', methods=['GET', 'POST'])
def entity():
    idx = get_index(request.args)
    if request.method == 'POST':
        print('POST entity, request: {}'.format(request.args))
        sent = get_sent(request.args)
        print('Set entity sentiment: {}'.format(sent))
        set_sentiment(entities, idx, sent)
        return 'setting sentiment'
    else:
        print('GET entity, request: {}'.format(request.args))
        return get_row(entities, texts, idx) 

@app.route('/discard', methods=['POST'])
def discard_entity():
    idx = get_index(request.args)
    discard(entities, idx)

@app.route('/sentiment', methods=['POST'])
def get_sentiment():
    idx = get_index(request.args)
    entity_summary = entities.iloc[idx]['summary']
    entity_sentiment = SA.compute(entity_summary)
    return jsonify(sentiment=entity_sentiment)

@app.route('/attention', methods=['POST'])
def attention():
    idx = get_index(request.args)
    entity_summary = entities.iloc[idx]['summary']
    attention_result = ATTENTION.analyze(entity_summary)
    return jsonify(
        sentence=entity_summary,
        results=attention_result
    )


if __name__ == '__main__':
    app.run(debug=True)
