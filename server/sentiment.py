from transformers import pipeline

'''
"sentiment-analysis": {
    "impl": TextClassificationPipeline,
    "tf": TFAutoModelForSequenceClassification if is_tf_available() else None,
    "pt": AutoModelForSequenceClassification if is_torch_available() else None,
    "default": {
        "model": {
            "pt": "distilbert-base-uncased-finetuned-sst-2-english",
            "tf": "distilbert-base-uncased-finetuned-sst-2-english",
        },
        "config": "distilbert-base-uncased-finetuned-sst-2-english",
        "tokenizer": "distilbert-base-uncased",
    },
},


RETURNTYPE:

[{'label': 'NEGATIVE', 'score': 0.9951657}]
as it can take lists as input

'''

class Sentiment:
    def __init__(self):
        print('Initialize huggingface pipeline for SA')
        self.pipe = pipeline('sentiment-analysis')
        self.threshold = 0.6  # neutral if below

    def neutralize(self, sent):
        label = sent['label']
        score = sent['score']
        if score < self.threshold:
            label = "NEUTRAL"
        return {
            "label": label,
            "score": str(score)
        }

    def compute(self, texts):
        sentiments = self.pipe(texts)
        return [self.neutralize(s) for s in sentiments]


