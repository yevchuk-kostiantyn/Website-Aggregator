package main

import (
	"github.com/yevchuk-kostiantyn/WebsiteAggregator/articles"
	"sync"
)

func main() {
	wg := sync.WaitGroup{}

	wg.Add(1)

	go articles.RunDynamicServer()
	wg.Wait()
}