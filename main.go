package main

import (
	"log"
	"github.com/yevchuk-kostiantyn/WebsiteAggregator/models"
	"github.com/yevchuk-kostiantyn/WebsiteAggregator/articles"
	"sync"
)

func main() {

	wg := sync.WaitGroup{}

	wg.Add(1)
	config := models.Config{
		URL:      "http://serious-science.org/alcoholism-7561",
		Interest: "alcoholism",
	}

	log.Println("Config: ", config)

	articles.Search(&config)
	go articles.RunDynamicServer()
	wg.Wait()
}