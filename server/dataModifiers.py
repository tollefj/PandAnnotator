from flask import jsonify
from sentence_splitter import SentenceSplitter
from tokenizer import Tokenizer

splitter = SentenceSplitter(language="en")

tokenizer = Tokenizer()

def set_sentiment(csv, idx, sentiment):
    csv.loc[idx, ['sentiment']] = sentiment

def discard(csv, idx):
    csv.drop(csv.index[[idx]])

def get_text(csv, id):
    id_row = csv.loc[csv['id'] == id, 'text']
    return id_row.values[0]  # the text value of the array "text"

def get_row(entities, texts, idx):
    row = entities.loc[idx]
    
    fulltext = get_text(texts, row['id'])

    # sentences = splitter.split(fulltext)
    sentences = tokenizer.sentences(fulltext)
    valid_sentences = []
    aliases = eval(row['aliases'])
    for sentence in sentences:
        words = tokenizer.words(sentence)
        lowercase = [w.lower() for w in words]
        if any(alias in words for alias in aliases):
            valid_sentences.append(sentence)

    return jsonify(
        name=row['name'],
        aliases=eval(row['aliases']),
        offset=eval(row['offset']),
        phrase=eval(row['phrase']),
        summary=row['summary'],
        relevant_texts=valid_sentences,
        text=fulltext,
        sentiment=int(row['sentiment']),
        to_discard=str(row['to_discard']),
    )
