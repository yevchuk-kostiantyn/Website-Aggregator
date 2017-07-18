package models

type Config struct {
	Interest string
	URL string
}

type Article struct {
	URL string `json:"url"`
	Interest string `json:"interest"`
	Text string `json:"text"`
}