// Command api runs the SC New Horizon HTTP API.
package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v3"

	"github.com/sctest3220-a11y/sc-new-horizon/server/internal/config"
	"github.com/sctest3220-a11y/sc-new-horizon/server/internal/db"
	apihttp "github.com/sctest3220-a11y/sc-new-horizon/server/internal/http"
)

const shutdownTimeout = 10 * time.Second

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	if err := run(logger); err != nil {
		logger.Error("api stopped", "error", err)
		os.Exit(1)
	}
}

func run(logger *slog.Logger) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		return err
	}
	defer pool.Close()

	if cfg.MigrateOnStart {
		if err := db.Migrate(ctx, pool, logger); err != nil {
			return err
		}
	}

	app := apihttp.NewApp(apihttp.Dependencies{DB: pool, CORSOrigins: cfg.CORSOrigins})

	serveErr := make(chan error, 1)
	go func() {
		logger.Info("api listening", "port", cfg.Port)
		serveErr <- app.Listen(fmt.Sprintf(":%d", cfg.Port), fiber.ListenConfig{DisableStartupMessage: true})
	}()

	select {
	case err := <-serveErr:
		return err
	case <-ctx.Done():
		logger.Info("shutting down")
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()
	return app.ShutdownWithContext(shutdownCtx)
}
