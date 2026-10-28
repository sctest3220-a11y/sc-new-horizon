package http

import (
	"context"
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v3"
)

type fakePinger struct{ err error }

func (f fakePinger) Ping(context.Context) error { return f.err }

func TestHealthRoutes(t *testing.T) {
	cases := []struct {
		name   string
		path   string
		dbErr  error
		status int
	}{
		{"liveness ignores database", "/healthz", errors.New("down"), fiber.StatusOK},
		{"ready when database answers", "/readyz", nil, fiber.StatusOK},
		{"not ready when database is down", "/readyz", errors.New("down"), fiber.StatusServiceUnavailable},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			app := NewApp(Dependencies{DB: fakePinger{err: tc.dbErr}, CORSOrigins: []string{"http://localhost:3000"}})

			resp, err := app.Test(httptest.NewRequest(fiber.MethodGet, tc.path, nil))
			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != tc.status {
				t.Errorf("status = %d, want %d", resp.StatusCode, tc.status)
			}
		})
	}
}

func TestCORSAllowsConfiguredOriginOnly(t *testing.T) {
	app := NewApp(Dependencies{DB: fakePinger{}, CORSOrigins: []string{"http://localhost:3000"}})

	for origin, wantAllowed := range map[string]bool{
		"http://localhost:3000": true,
		"https://evil.example":  false,
	} {
		req := httptest.NewRequest(fiber.MethodGet, "/healthz", nil)
		req.Header.Set("Origin", origin)

		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		resp.Body.Close()

		got := resp.Header.Get("Access-Control-Allow-Origin") == origin
		if got != wantAllowed {
			t.Errorf("origin %s allowed = %v, want %v", origin, got, wantAllowed)
		}
	}
}
