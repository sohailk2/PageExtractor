from pymongo import MongoClient
mongo_client = MongoClient("mongodb://127.0.0.1:27017/")
mongo_db = mongo_client.ForwardData_PageExtractor

# print(mongo_db.entities.find_one())
# mongo_db.entities.replace_one({'text': "test"}, {'text': "test", 'label': "new val"}, upsert=True)

# TODO: fix the duplicate insert update issue if user overwrites stuff

#can be useful for testing with input
def getLabel(clf, nlp, sentence):
    labels = {0: "Other", 1 : "Education", 2 : "Biography", 3 : "Research Interest", 4 : "Award"}
    vect = nlp(sentence).vector
    y = int(clf.predict([vect])[0])
    return labels[y]

def updateLabel_mongo(text, label):
    mongo_db.entities.update({'text': text}, {'text': text, 'label': label}, upsert=True)

'''
    Database Structure:
    db.entities.insert({text: "test", label: "test"})
        Mongo DB
        {
            text : "..."
            label : "..."
        }
'''