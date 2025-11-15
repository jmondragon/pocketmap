package migrations

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

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

		ctx, cancel:= context.WithTimeout(context.Background(), time.Second*30)
		defer cancel()
		file, err := http.Get("https://s3.pocketmap.io/styles/dark/style.json")
		if err != nil {
			return err
		}
		var data map[string]interface{}
		err = json.NewDecoder(file.Body).Decode(&data)
		if err != nil {
			return err
		};

		image, err := filesystem.NewFileFromURL(ctx, "https://s3.pocketmap.io/images/dark-offline.png")
		if err != nil {
			return err
		}

		record := core.NewRecord(collection)
		record.Set("name", "Dark (Offline)")
		record.Set("style",	data);
		record.Set("image", image)
		_ = app.Save(record)

		file, err = http.Get("https://s3.pocketmap.io/styles/light/style.json")
		if err != nil {
			return err
		}
		err = json.NewDecoder(file.Body).Decode(&data)
		if err != nil {
			return err
		}

		image, err = filesystem.NewFileFromURL(ctx, "https://s3.pocketmap.io/images/light-offline.png")
		if err != nil {
			return err
		}

		record = core.NewRecord(collection)
		record.Set("name", "Light (Offline)")
		record.Set("style",	data);
		record.Set("image", image)		
		_ = app.Save(record)

		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
