package migrations

import (
	"strings"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("styles")
		if err != nil {
			return err
		}	
		return app.RunInTransaction(func(tx core.App) error {
			styles := []string{"Liberty", "Bright", "Positron", "Dark", "Fiord"}
			for _, styleName := range styles {
				record := core.NewRecord(collection)
				record.Set("name", styleName)
				record.Set("styleUrl", "https://tiles.openfreemap.org/styles/" + strings.ToLower(styleName))
				
				f, err := filesystem.NewFileFromPath("./frontend/public/images/" + strings.ToLower(styleName) + ".png")
				record.Set("image", f)

				if err != nil {
					return err
				}

				if err := app.Save(record); err != nil {
					return err
				}
			}
			return nil
		})		
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
