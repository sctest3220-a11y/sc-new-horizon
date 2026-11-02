package config

import "testing"

func envFrom(values map[string]string) func(string) string {
	return func(key string) string { return values[key] }
}

func TestLoadDefaults(t *testing.T) {
	cfg, err := load(envFrom(map[string]string{"DATABASE_URL": "postgres://db"}))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cfg.Port != 8080 || !cfg.MigrateOnStart {
		t.Errorf("unexpected defaults: %+v", cfg)
	}
	if len(cfg.CORSOrigins) != 1 || cfg.CORSOrigins[0] != "http://localhost:3000" {
		t.Errorf("unexpected CORS origins: %v", cfg.CORSOrigins)
	}
}

func TestLoadOverrides(t *testing.T) {
	cfg, err := load(envFrom(map[string]string{
		"DATABASE_URL":     "postgres://db",
		"PORT":             "9090",
		"CORS_ORIGINS":     "https://a.example, https://b.example,",
		"MIGRATE_ON_START": "false",
	}))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cfg.Port != 9090 || cfg.MigrateOnStart || len(cfg.CORSOrigins) != 2 {
		t.Errorf("overrides not applied: %+v", cfg)
	}
}

func TestLoadReadsProcessEnvironment(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://from-env")
	t.Setenv("PORT", "9191")
	t.Setenv("CORS_ORIGINS", "")
	t.Setenv("MIGRATE_ON_START", "")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cfg.DatabaseURL != "postgres://from-env" || cfg.Port != 9191 {
		t.Errorf("environment not read: %+v", cfg)
	}
}

func TestLoadRejectsInvalid(t *testing.T) {
	cases := map[string]map[string]string{
		"missing database": {},
		"bad port":         {"DATABASE_URL": "postgres://db", "PORT": "99999"},
		"zero port":        {"DATABASE_URL": "postgres://db", "PORT": "0"},
		"non-numeric port": {"DATABASE_URL": "postgres://db", "PORT": "http"},
		"blank database":   {"DATABASE_URL": "   "},
		"bad migrate flag": {"DATABASE_URL": "postgres://db", "MIGRATE_ON_START": "maybe"},
		"wildcard origin":  {"DATABASE_URL": "postgres://db", "CORS_ORIGINS": "*"},
	}
	for name, env := range cases {
		t.Run(name, func(t *testing.T) {
			if _, err := load(envFrom(env)); err == nil {
				t.Error("expected an error")
			}
		})
	}
}
