-- Baseline migration: creates no tables. It marks schema version 1 so later
-- migrations (00002_..., 00003_...) have a starting point.

-- +goose Up
SELECT 1;

-- +goose Down
SELECT 1;
