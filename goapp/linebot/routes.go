package main

import "github.com/go-chi/chi/v5"

func (s *server) routes(){
	s.router = chi.NewRouter()
	s.router.Post("/webhook", s.handleHook())
}