package articles

import (
	"github.com/PuerkitoBio/goquery"
	"log"
	"strings"
	"github.com/yevchuk-kostiantyn/WebsiteAggregator/models"
)

func Search(config *models.Config) {
	response, err := goquery.NewDocument(config.URL)

	if err != nil {
		panic("Bad URL!")
	}

	article := ""
	response.Find("p").Each(func(index int, item *goquery.Selection) {
		line := item.Text()
		article += line
	})

	if IsInteresting(article, config.Interest) {
		key := config.Interest + "|" + config.URL

		SaveToDB(key, article)
	} else {
		log.Println("Not interesting")
	}

}

func IsInteresting(article string, interest string) bool {
	if strings.Contains(article, interest) {
		return true
	} else {
		return false
	}
}