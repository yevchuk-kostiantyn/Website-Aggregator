package articles

import (
	"time"
	"net/http"
	"github.com/gorilla/handlers"
	"log"
	"encoding/json"
	"github.com/gorilla/mux"
)

func RunDynamicServer() {
	r := mux.NewRouter()

	//provide static html pages
	//r.PathPrefix("/").Handler(http.FileServer(http.Dir("./view/")))
	r.HandleFunc("/", getArticlesHandler).Methods("GET")
	//r.HandleFunc("/", getDevConfigHandler).Methods("GET")
	//r.HandleFunc("/", patchDevConfigHandler).Methods("PATCH")

	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0" + ":" + "8100",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	//CORS provides Cross-Origin Resource Sharing middleware
	http.ListenAndServe("0.0.0.0"+":"+"8100", handlers.CORS()(r))

	go log.Fatal(srv.ListenAndServe())
}

func getArticlesHandler(w http.ResponseWriter, r *http.Request) {
	client := RunDBConnection()
	articles := getAllArticles(client)
	log.Println(articles)
	err := json.NewEncoder(w).Encode(articles)

	if err != nil {
		log.Println("getArticlesHandler JSON enc", err)
	}
}
