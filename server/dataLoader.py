import pandas as pd
import os

class DataLoader:
    def __init__(self):
        self.path = os.path.join('..', 'dataset', 'Strise', 'CSV')

    def get_entities(self):
        entity_path = os.path.join(self.path, 'entities.csv')
        entity_csv = pd.read_csv(entity_path, index_col=False)

        return entity_csv

    def get_texts(self):
        text_path = os.path.join(self.path, 'texts.csv')
        text_csv = pd.read_csv(text_path, index_col=False)
        return text_csv
