package http

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v3"
)

const readinessTimeout = 2 * time.Second

// Pinger reports whether the database is reachable. *pgxpool.Pool satisfies it.
type Pinger interface {
	Ping(ctx context.Context) error
}

func registerHealthRoutes(app *fiber.App, db Pinger) {
	// Liveness: the process is up and serving requests.
	app.Get("/healthz", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// Readiness: the process can reach the database.
	app.Get("/readyz", func(c fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(c.Context(), readinessTimeout)
		defer cancel()

		if err := db.Ping(ctx); err != nil {
			return c.Status(fiber.StatusServiceUnavailable).
				JSON(fiber.Map{"status": "unavailable", "database": "unreachable"})
		}
		return c.JSON(fiber.Map{"status": "ok", "database": "ok"})
	})
}
