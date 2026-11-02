package db

import (
	"context"
	"io"
	"log/slog"
	"os"
	"testing"
)

// testDatabaseURL returns the Postgres URL for integration tests, or skips the
// test when TEST_DATABASE_URL is unset. CI sets it; locally, point it at the
// docker compose database.
func testDatabaseURL(t *testing.T) string {
	t.Helper()
	url := os.Getenv("TEST_DATABASE_URL")
	if url == "" {
		t.Skip("TEST_DATABASE_URL is not set; skipping database integration test")
	}
	return url
}

func quietLogger() *slog.Logger {
	return slog.New(slog.NewTextHandler(io.Discard, nil))
}

func TestConnectRejectsMalformedURL(t *testing.T) {
	if _, err := Connect(context.Background(), "postgres://%zz"); err == nil {
		t.Fatal("expected a parse error")
	}
}

func TestConnectFailsWhenDatabaseIsUnreachable(t *testing.T) {
	// Port 1 on localhost refuses connections immediately.
	if _, err := Connect(context.Background(), "postgres://user:pass@127.0.0.1:1/db?connect_timeout=2"); err == nil {
		t.Fatal("expected a ping error")
	}
}

func TestConnectAndMigrate(t *testing.T) {
	ctx := context.Background()
	pool, err := Connect(ctx, testDatabaseURL(t))
	if err != nil {
		t.Fatalf("connect: %v", err)
	}
	defer pool.Close()

	// Running twice proves migrations are idempotent: the second run applies nothing.
	for run := 1; run <= 2; run++ {
		if err := Migrate(ctx, pool, quietLogger()); err != nil {
			t.Fatalf("migrate run %d: %v", run, err)
		}
	}

	var version int64
	if err := pool.QueryRow(ctx, "SELECT max(version_id) FROM goose_db_version").Scan(&version); err != nil {
		t.Fatalf("read version: %v", err)
	}
	if version < 1 {
		t.Errorf("schema version = %d, want at least 1", version)
	}
}

func TestMigrateFailsOnClosedPool(t *testing.T) {
	ctx := context.Background()
	pool, err := Connect(ctx, testDatabaseURL(t))
	if err != nil {
		t.Fatalf("connect: %v", err)
	}
	pool.Close()

	if err := Migrate(ctx, pool, quietLogger()); err == nil {
		t.Fatal("expected migrations to fail on a closed pool")
	}
}
