// Package config reads the API server's settings from environment variables.
package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Config holds the runtime settings for the API server.
type Config struct {
	// Port is the TCP port the HTTP server listens on.
	Port int
	// DatabaseURL is the Postgres connection string (required).
	DatabaseURL string
	// CORSOrigins lists the browser origins allowed to call the API.
	CORSOrigins []string
	// MigrateOnStart applies pending database migrations before serving.
	MigrateOnStart bool
}

const (
	defaultPort        = 8080
	defaultCORSOrigins = "http://localhost:3000"
)

// Load reads the configuration from the environment and validates it.
func Load() (Config, error) {
	return load(os.Getenv)
}

// load takes a getenv function so tests can supply their own environment.
func load(getenv func(string) string) (Config, error) {
	cfg := Config{
		Port:           defaultPort,
		DatabaseURL:    strings.TrimSpace(getenv("DATABASE_URL")),
		CORSOrigins:    splitList(valueOr(getenv("CORS_ORIGINS"), defaultCORSOrigins)),
		MigrateOnStart: true,
	}

	if cfg.DatabaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required")
	}

	if raw := getenv("PORT"); raw != "" {
		port, err := strconv.Atoi(raw)
		if err != nil || port < 1 || port > 65535 {
			return Config{}, fmt.Errorf("PORT must be a number between 1 and 65535, got %q", raw)
		}
		cfg.Port = port
	}

	if raw := getenv("MIGRATE_ON_START"); raw != "" {
		migrate, err := strconv.ParseBool(raw)
		if err != nil {
			return Config{}, fmt.Errorf("MIGRATE_ON_START must be true or false, got %q", raw)
		}
		cfg.MigrateOnStart = migrate
	}

	for _, origin := range cfg.CORSOrigins {
		if origin == "*" {
			return Config{}, errors.New("CORS_ORIGINS must list explicit origins, not *")
		}
	}

	return cfg, nil
}

func valueOr(value, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
}

// splitList turns "a, b,,c" into ["a" "b" "c"].
func splitList(raw string) []string {
	var items []string
	for _, item := range strings.Split(raw, ",") {
		if item = strings.TrimSpace(item); item != "" {
			items = append(items, item)
		}
	}
	return items
}
