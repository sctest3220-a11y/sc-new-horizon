package main

import (
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"os"
	"strings"
	"syscall"
	"testing"
	"time"
)

func quietLogger() *slog.Logger {
	return slog.New(slog.NewTextHandler(io.Discard, nil))
}

// testDatabaseURL skips the test unless TEST_DATABASE_URL points at Postgres.
func testDatabaseURL(t *testing.T) string {
	t.Helper()
	url := os.Getenv("TEST_DATABASE_URL")
	if url == "" {
		t.Skip("TEST_DATABASE_URL is not set; skipping database integration test")
	}
	return url
}

// freePort asks the OS for an unused TCP port.
func freePort(t *testing.T) int {
	t.Helper()
	l, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("find free port: %v", err)
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port
}

func TestRunFailsOnInvalidConfig(t *testing.T) {
	t.Setenv("DATABASE_URL", "")
	if err := run(quietLogger()); err == nil || !strings.Contains(err.Error(), "DATABASE_URL") {
		t.Fatalf("run returned %v, want the DATABASE_URL configuration error", err)
	}
}

func TestRunFailsWhenDatabaseIsUnreachable(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://user:pass@127.0.0.1:1/db?connect_timeout=2")
	t.Setenv("PORT", "")
	if err := run(quietLogger()); err == nil || !strings.Contains(err.Error(), "ping database") {
		t.Fatalf("run returned %v, want a ping database error", err)
	}
}

func TestRunServesUntilInterruptedThenShutsDown(t *testing.T) {
	port := freePort(t)
	t.Setenv("DATABASE_URL", testDatabaseURL(t))
	t.Setenv("PORT", fmt.Sprint(port))
	t.Setenv("MIGRATE_ON_START", "true")

	done := make(chan error, 1)
	go func() { done <- run(quietLogger()) }()

	waitForStatus(t, fmt.Sprintf("http://127.0.0.1:%d/readyz", port), http.StatusOK, done)

	// run has registered its signal handler by now, so SIGINT stops it
	// instead of the test process.
	if err := syscall.Kill(os.Getpid(), syscall.SIGINT); err != nil {
		t.Fatalf("send interrupt: %v", err)
	}
	select {
	case err := <-done:
		if err != nil {
			t.Fatalf("run returned %v after interrupt, want nil", err)
		}
	case <-time.After(15 * time.Second):
		t.Fatal("run did not shut down after interrupt")
	}
}

func TestRunReturnsListenErrorWhenPortIsTaken(t *testing.T) {
	taken, err := net.Listen("tcp", ":0")
	if err != nil {
		t.Fatalf("occupy port: %v", err)
	}
	defer taken.Close()

	t.Setenv("DATABASE_URL", testDatabaseURL(t))
	t.Setenv("PORT", fmt.Sprint(taken.Addr().(*net.TCPAddr).Port))
	t.Setenv("MIGRATE_ON_START", "false")

	// Assert the cause: a database failure would also return an error.
	err = run(quietLogger())
	if err == nil || !strings.Contains(err.Error(), "address already in use") {
		t.Fatalf("run returned %v, want an address-in-use listen error", err)
	}
}

// waitForStatus polls url until it answers want, failing early if run exits.
func waitForStatus(t *testing.T, url string, want int, done <-chan error) {
	t.Helper()
	deadline := time.Now().Add(15 * time.Second)
	for time.Now().Before(deadline) {
		select {
		case err := <-done:
			t.Fatalf("run exited before serving: %v", err)
		default:
		}
		if resp, err := http.Get(url); err == nil {
			resp.Body.Close()
			if resp.StatusCode == want {
				return
			}
		}
		time.Sleep(100 * time.Millisecond)
	}
	t.Fatalf("%s did not return %d in time", url, want)
}
