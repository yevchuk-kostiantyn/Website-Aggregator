package main

import (
	"log"
	"github.com/mmcdole/gofeed"
	"net/http"
	"io"
)

func main() {
	http.HandleFunc("/", display)

	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Println("Error in ListenAndServe: ", err)
	}
}

func display(w http.ResponseWriter, r*http.Request) {
	parse := gofeed.NewParser()

	var url string = "https://pub.scotch.io/feed"
	feed, err := parse.ParseURL(url)
	if err != nil {
		log.Println("Error in ParseURL: ", err)
	}

	io.WriteString(w, feed.Title + " - " + feed.Description)

	for i:=0; i<=len(feed.Items) - 1;i++{
		io.WriteString(w, feed.Items[i].Title)
	}
}

