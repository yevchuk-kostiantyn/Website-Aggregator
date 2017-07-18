package articles

import (
	"menteslibres.net/gosexy/redis"
	"github.com/yevchuk-kostiantyn/WebsiteAggregator/models"
	"log"
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
	var article1 models.Article
	var articles []models.Article

	interestsArticles, err := client.SMembers("interestsArticles")
	if err != nil {
		log.Println("Error SMembers(): ", err)
	}

	var interestsArticlesTokens = make([][]string, len(interestsArticles))

	for i, k := range interestsArticles {
		interestsArticlesTokens[i] = strings.Split(k, "|")
	}

	log.Println(interestsArticlesTokens)
	for _, key := range interestsArticlesTokens {

		article1.Interest = key[0]
		article1.URL = key[1]
		article1.Text, err = client.HGet(article1.Interest+"|"+article1.URL, "article")
		if err != nil {
			log.Println("Error HGet(): ", err)
		}
	}

	articles = append(articles, article1)
	return articles
}

