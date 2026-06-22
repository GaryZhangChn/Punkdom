package handlers

import punkdomApp "punkdom/internal/app"

// Handlers owns HTTP request handlers and adapts requests to application services.
type Handlers struct {
	app *punkdomApp.App
}

// New creates a handler set bound to one application runtime.
func New(application *punkdomApp.App) *Handlers {
	return &Handlers{app: application}
}
