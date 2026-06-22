package app

import (
	"context"
	"log"

	punkdomskills "punkdom/internal/skills"
)

// SkillsAppService exposes user and workspace skill management.
type SkillsAppService struct {
	app *App
}

func (a *App) SkillSnapshot(ctx context.Context) (punkdomskills.Snapshot, error) {
	return a.skills().Snapshot(ctx)
}

func (a *App) SkillDocument(ctx context.Context, scope punkdomskills.Scope, name string) (punkdomskills.Document, error) {
	return a.skills().Document(ctx, scope, name)
}

func (a *App) CreateSkillDocument(ctx context.Context, scope punkdomskills.Scope, name, description string, agents []string) (punkdomskills.Document, error) {
	return a.skills().Create(ctx, scope, name, description, agents)
}

func (a *App) SaveSkillDocument(ctx context.Context, scope punkdomskills.Scope, name, content string) (punkdomskills.Document, error) {
	return a.skills().Save(ctx, scope, name, content)
}

func (a *App) DeleteSkillDocument(ctx context.Context, scope punkdomskills.Scope, name string) error {
	return a.skills().Delete(ctx, scope, name)
}

func (s *SkillsAppService) Snapshot(ctx context.Context) (punkdomskills.Snapshot, error) {
	return punkdomskills.SnapshotFor(ctx, s.directories())
}

func (s *SkillsAppService) Document(ctx context.Context, scope punkdomskills.Scope, name string) (punkdomskills.Document, error) {
	return punkdomskills.ReadDocument(ctx, s.directories(), scope, name)
}

func (s *SkillsAppService) Create(ctx context.Context, scope punkdomskills.Scope, name, description string, agents []string) (punkdomskills.Document, error) {
	doc, err := punkdomskills.CreateDocument(ctx, s.directories(), scope, name, description, agents...)
	if err != nil {
		return punkdomskills.Document{}, err
	}
	log.Printf("[skills] Skill created scope=%s name=%s path=%s", scope, name, doc.Path)
	return doc, nil
}

func (s *SkillsAppService) Save(ctx context.Context, scope punkdomskills.Scope, name, content string) (punkdomskills.Document, error) {
	doc, err := punkdomskills.SaveDocument(ctx, s.directories(), scope, name, content)
	if err != nil {
		return punkdomskills.Document{}, err
	}
	log.Printf("[skills] Skill saved scope=%s name=%s path=%s", scope, name, doc.Path)
	return doc, nil
}

func (s *SkillsAppService) Delete(ctx context.Context, scope punkdomskills.Scope, name string) error {
	if err := punkdomskills.DeleteDocument(ctx, s.directories(), scope, name); err != nil {
		return err
	}
	log.Printf("[skills] Skill deleted scope=%s name=%s", scope, name)
	return nil
}

func (s *SkillsAppService) directories() []punkdomskills.Directory {
	a := s.app
	a.mu.RLock()
	defer a.mu.RUnlock()
	if a.cfg == nil {
		return nil
	}
	return punkdomskills.NewDirectories(a.cfg.SkillsDir, a.cfg.PunkdomDir, a.workspace)
}
