import nltk
import newspaper
import string
import json
import pymongo
from newspaper import Article
from nltk.tokenize import RegexpTokenizer
from nltk.sentiment.vader import SentimentIntensityAnalyzer


"""
:raise 
"""
def mongoUploader(jsonName):
    sia = SentimentIntensityAnalyzer()
    newsOutlet = newspaper.build('https://www.yahoo.com/entertainment/')
    for article in newsOutlet.articles:
        article.download()
        article.parse()
        toke = RegexpTokenizer(r'\w+')
        lowerAndTokenizedArticle = toke.tokenize(article.text.lower())
        stopwords = nltk.corpus.stopwords.words("english")
        cleanArticle = " ".join([word for word in lowerAndTokenizedArticle if word not in stopwords])
        finalOutput = {
            "title" : article.title,
            "url" : article.url,
            "score" : sia.polarity_scores(cleanArticle)["compound"],
            "source" : "Yahoo",
            "topic" : "Entertainment"
        }
        print(finalOutput)
        break


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    mongoUploader("newsOutlets.json")
    # cnn_paper = newspaper.build('https://www.foxnews.com')
    # for article in cnn_paper.category_urls():
    #     print(article)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
