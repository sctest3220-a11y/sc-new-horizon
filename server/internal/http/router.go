// Package http builds the Fiber application and its routes.
package http

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"github.com/gofiber/fiber/v3/middleware/requestid"
)

// Dependencies are the services the routes need.
type Dependencies struct {
	DB          Pinger
	CORSOrigins []string
}

// NewApp returns a Fiber app with middleware and all routes registered.
func NewApp(deps Dependencies) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName: "sc-new-horizon-api",
		// Limit request bodies to 1 MB until an endpoint needs more.
		BodyLimit: 1 << 20,
	})

	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{AllowOrigins: deps.CORSOrigins}))

	registerHealthRoutes(app, deps.DB)

	return app
}
