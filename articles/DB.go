package articles

import (
	"github.com/yevchuk-kostiantyn/WebsiteAggregator/models"
	"log"
	"menteslibres.net/gosexy/redis"
	"strings"
)

func RunDBConnection() *redis.Client {
	var client *redis.Client
	client = redis.New()

	err := client.Connect("127.0.0.1", 6379)
	if err != nil {
		log.Println("Error Connect(): ", err)
	}
	return client
}

func SaveToDB(key string, article string) {
	client := RunDBConnection()
	_, err := client.HMSet(key, "article", article)
	if err != nil {
		log.Println("Error HMSet(): ", err)
	}
	client.SAdd("interestsArticles", key)

}

func getAllArticles(client *redis.Client) []models.Article {
	var article models.Article
	var articles []models.Article

	interestsArticles, err := client.SMembers("interestsArticles")
	if err != nil {
		log.Println("Error SMembers(): ", err)
	}

	var interestsArticlesTokens = make([][]string, len(interestsArticles))

	for i, k := range interestsArticles {
		interestsArticlesTokens[i] = strings.Split(k, "|")
	}

	for _, key := range interestsArticlesTokens {
		log.Println("Key: ", key)
		article.Interest = key[0]
		article.URL = key[1]
		article.Text, err = client.HGet(article.Interest+"|"+article.URL, "article")
		if err != nil {
			log.Println("Error HGet(): ", err)
		}

		articles = append(articles, article)
	}
	return articles
}
