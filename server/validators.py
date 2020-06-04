from flask import abort
def validate_index(args, max_index):
    if 'index' in args:
        idx = int(args['index'])
        if idx > max_index or idx < 0:
            abort(404, description='Invalid index: {}'.format(idx))
        return idx

def validate_sentiment(args):
    if 'sent' in args:
        sent = int(args['sent'])
        if sent not in [-1, 0, 1]:
            abort(404, description='Invalid sentiment classification: {}'.format(sent))
        return sent
