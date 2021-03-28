package main
import (
	"context"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/line/line-bot-sdk-go/linebot"
	"github.com/go-chi/chi/v5"
	"net/http"
)

type server struct {
	line *linebot.Client
	router *chi.Mux
}

func (s *server) handleHook() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
	}
}

func (s *server) lambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body: "hello world",
	} ,nil
}


func newServer() *server {
	return &server{}
}

func main(){
	s := newServer()
	lambda.Start(s.lambdaHandler)
}
