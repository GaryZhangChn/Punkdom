package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadDefaultsPunkdomDirToHomePunkdom(t *testing.T) {
	t.Chdir(t.TempDir())
	t.Setenv("PUNKDOM_DIR", "")

	cfg := Load()
	want := normalizePath("./.punkdom")
	if cfg.PunkdomDir != want {
		t.Fatalf("默认 PunkdomDir 不符合预期: want=%s got=%s", want, cfg.PunkdomDir)
	}
}

func TestLoadDoesNotDefaultWorkspaceToCurrentDir(t *testing.T) {
	t.Chdir(t.TempDir())
	t.Setenv("PUNKDOM_DIR", "")
	t.Setenv("PUNKDOM_WORKSPACE", "")

	cfg := Load()
	if cfg.Workspace != "" {
		t.Fatalf("未显式指定 workspace 时不应默认打开当前目录: got=%s", cfg.Workspace)
	}
	if !cfg.ResumeLastWorkspace {
		t.Fatalf("未显式指定 workspace 时应允许恢复上次打开的书籍")
	}
}

func TestLoadPunkdomDirFromEnv(t *testing.T) {
	t.Chdir(t.TempDir())
	dir := filepath.Join(t.TempDir(), "punkdom-data")
	t.Setenv("PUNKDOM_DIR", dir)

	cfg := Load()
	if cfg.PunkdomDir != dir {
		t.Fatalf("环境变量 PunkdomDir 不符合预期: want=%s got=%s", dir, cfg.PunkdomDir)
	}
}

func TestNormalizePathExpandsRelativeAndHome(t *testing.T) {
	relative := "data/punkdom"
	abs, err := filepath.Abs(relative)
	if err != nil {
		t.Fatal(err)
	}
	if got := normalizePath(relative); got != abs {
		t.Fatalf("相对路径未转绝对路径: want=%s got=%s", abs, got)
	}

	home, err := os.UserHomeDir()
	if err != nil || home == "" {
		t.Skip("当前环境无 home 目录")
	}
	want := filepath.Join(home, ".punkdom")
	if got := normalizePath("~/.punkdom"); got != want {
		t.Fatalf("~ 路径未正确展开: want=%s got=%s", want, got)
	}
}

func TestLoadWithWorkspaceMergesLayers(t *testing.T) {
	punkdomDir := t.TempDir()
	ws := t.TempDir()
	t.Setenv("PUNKDOM_DIR", punkdomDir)
	t.Setenv("OPENAI_API_KEY", "")
	t.Setenv("OPENAI_MODEL", "")

	if err := WriteSettingsFile(filepath.Join(punkdomDir, "config.toml"),
		Settings{OpenAIModel: "user-model"}); err != nil {
		t.Fatal(err)
	}
	if err := WriteSettingsFile(filepath.Join(ws, ".punkdom", "config.toml"),
		Settings{OpenAIModel: "ws-model"}); err != nil {
		t.Fatal(err)
	}

	cfg, layered, err := LoadWithWorkspace(ws)
	if err != nil {
		t.Fatal(err)
	}
	if cfg.OpenAIModel != "ws-model" {
		t.Fatalf("Workspace override expected, got %s", cfg.OpenAIModel)
	}
	if layered.User.OpenAIModel != "user-model" {
		t.Fatalf("user layer raw value lost")
	}
}

func TestLoadWithWorkspaceUsesGlobalConfigPunkdomDir(t *testing.T) {
	root := t.TempDir()
	t.Chdir(root)
	punkdomDir := filepath.Join(root, "global-punkdom")
	ws := t.TempDir()
	t.Setenv("PUNKDOM_DIR", "")
	t.Setenv("OPENAI_API_KEY", "")
	t.Setenv("OPENAI_MODEL", "")

	if err := os.WriteFile(filepath.Join(root, "config.toml"), []byte("punkdom_dir = \"./global-punkdom\"\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := WriteSettingsFile(filepath.Join(punkdomDir, "config.toml"), Settings{OpenAIModel: "user-model"}); err != nil {
		t.Fatal(err)
	}

	cfg, layered, err := LoadWithWorkspace(ws)
	if err != nil {
		t.Fatal(err)
	}
	wantPunkdomDir := normalizePath("./global-punkdom")
	if cfg.PunkdomDir != wantPunkdomDir {
		t.Fatalf("global punkdom_dir should locate user config: want=%s got=%s", wantPunkdomDir, cfg.PunkdomDir)
	}
	if layered.User.OpenAIModel != "user-model" {
		t.Fatalf("user config should be loaded from global punkdom_dir")
	}
}

func TestLoadWithWorkspaceUsesGlobalConfigAsBaseLayer(t *testing.T) {
	root := t.TempDir()
	t.Chdir(root)
	ws := t.TempDir()
	t.Setenv("PUNKDOM_DIR", "")
	t.Setenv("OPENAI_API_KEY", "")
	t.Setenv("OPENAI_MODEL", "")

	if err := os.WriteFile(filepath.Join(root, "config.toml"), []byte("openai_model = \"global-model\"\nskills_dir = \"./global-skills\"\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	cfg, layered, err := LoadWithWorkspace(ws)
	if err != nil {
		t.Fatal(err)
	}
	if cfg.OpenAIModel != "global-model" {
		t.Fatalf("global config should be effective when user/workspace unset: %s", cfg.OpenAIModel)
	}
	if layered.Global.OpenAIModel != "global-model" {
		t.Fatalf("global layer should be exposed: %s", layered.Global.OpenAIModel)
	}
}

func TestLoadWithWorkspaceUsesConfiguredStartupPorts(t *testing.T) {
	root := t.TempDir()
	t.Chdir(root)
	ws := t.TempDir()
	t.Setenv("PUNKDOM_DIR", "")
	t.Setenv("PUNKDOM_BACKEND_PORT", "")

	if err := os.WriteFile(filepath.Join(root, "config.toml"), []byte("backend_port = 18080\nfrontend_port = 15173\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	cfg, layered, err := LoadWithWorkspace(ws)
	if err != nil {
		t.Fatal(err)
	}
	if cfg.BackendPort != 18080 {
		t.Fatalf("global backend_port should be effective: %d", cfg.BackendPort)
	}
	if layered.Effective.BackendPort == nil || *layered.Effective.BackendPort != 18080 {
		t.Fatalf("effective backend_port should be exposed")
	}
	if cfg.FrontendPort != 15173 {
		t.Fatalf("global frontend_port should be effective: %d", cfg.FrontendPort)
	}
	if layered.Effective.FrontendPort == nil || *layered.Effective.FrontendPort != 15173 {
		t.Fatalf("effective frontend_port should be exposed")
	}
}

func TestLoadStartupPortEnvOverridesConfig(t *testing.T) {
	root := t.TempDir()
	t.Chdir(root)
	t.Setenv("PUNKDOM_DIR", "")
	t.Setenv("PUNKDOM_BACKEND_PORT", "19090")
	t.Setenv("PUNKDOM_FRONTEND_PORT", "16173")

	if err := os.WriteFile(filepath.Join(root, "config.toml"), []byte("backend_port = 18080\nfrontend_port = 15173\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	cfg := Load()
	if cfg.BackendPort != 19090 {
		t.Fatalf("PUNKDOM_BACKEND_PORT should override config: %d", cfg.BackendPort)
	}
	if cfg.FrontendPort != 16173 {
		t.Fatalf("PUNKDOM_FRONTEND_PORT should override config: %d", cfg.FrontendPort)
	}
}
