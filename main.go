package main

import (
	"github.com/PuerkitoBio/goquery"
	"log"
	"strings"
	"github.com/go-redis/redis"
)

func main() {

	type Config struct {
		Interest string
		URL string
	}

	config := Config{
		URL: "http://serious-science.org/alcoholism-7561",
		Interest: "alcoholism",
	}

	log.Println("Config: ", config)

	response, err := goquery.NewDocument(config.URL)

	if err != nil {
		panic("Bad URL!")
	}

	article := ""

	response.Find("p").Each(func(index int, item *goquery.Selection) {
		line := item.Text()
		article += line
	})

	log.Println(strings.Contains(article, config.Interest))

	log.Println("Redis:", Redis())
}

func Redis() string {
	client := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		Password: "",
		DB: 0,
	})

	pong, _ := client.Ping().Result()

	return pong
}