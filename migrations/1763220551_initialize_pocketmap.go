package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		// add up queries...
		collection := core.NewCollection(core.CollectionTypeBase, "styles")
		
		// auth not required for reading styles
		collection.ViewRule = types.Pointer("")
		collection.ListRule = types.Pointer("")

		collection.Fields.Add(
			&core.TextField{
				Name:     "name",
				Required: true,
			},
			&core.JSONField{
				Name: "style",
			},
			&core.URLField{
				Name: "styleUrl",
			},
			&core.FileField{
				Name: "image",
				MaxSelect: 1,
				MaxSize: 5 * 1024 * 1024, // 5MB
				MimeTypes: []string{"image/jpeg", "image/png", "image/gif", "image/webp"},
			},
			&core.AutodateField{
				Name: "created",
				OnCreate: true,
				OnUpdate: false,
			},
			&core.AutodateField{
				Name: "updated",
				OnCreate: true,
				OnUpdate: true,
			},
		)

		return app.Save(collection)
	}, func(app core.App) error {
		// add down queries...
		collection, err := app.FindCollectionByNameOrId("styles")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
