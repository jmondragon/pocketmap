package migrations

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

func init() {
	m.Register(func(app core.App) error {
		// add up queries...
		collection, err := app.FindCollectionByNameOrId("styles")
		if err != nil {
			return err
		}
		file, err := os.ReadFile("./frontend/public/styles/dark/style.json")
		if err != nil {
			return err
		}
		image, err := filesystem.NewFileFromPath("./frontend/public/images/dark-offline.png")
		if err != nil {
			return err
		}

		record := core.NewRecord(collection)
		record.Set("name", "Dark (Offline)")
		record.Set("style",	file);
		record.Set("image", image)
		_ = app.Save(record)

		file, err = os.ReadFile("./frontend/public/styles/light/style.json")
		if err != nil {
			return err
		}
		image, err = filesystem.NewFileFromPath("./frontend/public/images/light-offline.png")
		if err != nil {
			return err
		}

		record = core.NewRecord(collection)
		record.Set("name", "Light (Offline)")
		record.Set("style",	file);
		record.Set("image", image)		
		_ = app.Save(record)

		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
