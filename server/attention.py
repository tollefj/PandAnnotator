import torch
from transformers import DistilBertTokenizer, DistilBertModel

class Attention:
    def __init__(self):
        gpu = torch.cuda.is_available()
        self.device = torch.device("cuda" if gpu else "cpu")
        self.device = "cpu"
        print("using device: {}".format(self.device))

        model_name = "distilbert-base-uncased"
        self.model = DistilBertModel.from_pretrained(
            model_name, output_attentions=True).to(self.device)

        self.tokenizer = DistilBertTokenizer.from_pretrained(model_name)

    def get(self, context):
        # get attention for a given model
        # runs a forward pass => extracts + formats attention
        output = self.model(context)

        # format attention as LAYER; HEAD; FROM; TO
        att = torch.cat([i for i in output[-1]], dim=0)
        att_format = [
            [
                [
                    [str(round(att * 100)) for att in head]
                    for head in layer
                ]
                for layer in token
            ]
            for token in att.cpu().tolist()
        ]
        return att_format

    def analyze(self, text):
        tokens = self.tokenizer.encode(text)
        print("tokens: {}".format(tokens))
        context = torch.tensor(tokens).unsqueeze(0).long()
        att = self.get(context)
        tok = self.tokenizer.convert_ids_to_tokens(tokens)
        return { "tokens": tok, "attention": att }
