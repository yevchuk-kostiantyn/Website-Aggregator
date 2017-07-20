package articles

import (
	"time"
	"net/http"
	"github.com/gorilla/handlers"
	"log"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/yevchuk-kostiantyn/WebsiteAggregator/models"
)

func RunDynamicServer() {
	r := mux.NewRouter()

	r.HandleFunc("/articles", getArticlesHandler).Methods("GET")
	r.HandleFunc("/patch", patchArticlesHandler).Methods("PATCH")

	//provide static html pages
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./view/")))

	srv := &http.Server{
		Handler:      r,
		Addr:         "localhost" + ":" + "8100",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	// CORS provides Cross-Origin Resource Sharing middleware
	http.ListenAndServe("localhost"+":"+"8100", handlers.CORS()(r))

	go log.Fatal(srv.ListenAndServe())
}

func getArticlesHandler(w http.ResponseWriter, r *http.Request) {
	client := RunDBConnection()
	articles := getAllArticles(client)

	err := json.NewEncoder(w).Encode(articles)

	if err != nil {
		log.Println("getArticlesHandler JSON enc", err)
	}
}

func patchArticlesHandler(w http.ResponseWriter, r *http.Request) {
	var article models.RequestArticle

	err := json.NewDecoder(r.Body).Decode(&article)
	if err != nil{
		log.Println("Error Decode(): ", err)
	}

	defer func() {
		if r := recover(); r != nil {
			log.Println(r)
		}
	}()
	Search(&article)
}