# PocketMap

## Introduction

The goal of this project is to create a cross-platform, single file, offline map executable that can run on a single board computer (e.g. Raspberry Pi).

## Technologies used:

- [PocketBase](https://pocketbase.io) for a simple database backend (extended with Go)
- [MapLibre](https://maplibre.org) for rendering of the map files in a browser
- [OpenStreetMaps](https://openstreetmaps.org) for the original source for free map files
- [OpenFreeMaps](https://openfreemap.org) for default _ONLINE_ maps and styles
- [Protomaps](https://protomaps.com) for HTTP and offline-friendly `pmtiles` format
- [Protomaps Builds](https://maps.protomaps.com/builds/) for the latest `pmtiles` offline map builds
- [Mapterhorn](https://mapterhorn) for the latest planet terrain (optional)

A special thank you goes out to all of the folks from these projects that put in the work!

## Getting Started

Download the appropriate executable for your operating system from the releases. Extract the file and enable the executable run (e.g. `chmod +x pocketmap` on Linux)

_NOTE for Mac_, you have to remove the quarantine bit since this file was downloaded from the internet: `xattr -r quarantine pocketmap`

Start pocketmap:

```bash
./pocketmap serve
```

The browser will automatically open and prompt you to enter your superadmin credentials. Once created, you can log in and view the default (online) map styles.

To view the maps, you can go to http://127.0.0.1:8090 and select from the various styles. If running in production, I recommend using a local reverse proxy like Caddy.

As mentioned above, the primary goal is for offline maps, but I have preseeded the database with these online maps because offline map tiles are huge, so I don't package them with the app, and I didn't want the app to open up with a blank screen. You can leave these if you just want a simple map viewer, or remove them and replace them with offline map styles (see below).

## Offline Mode

To get started in offline mode, you will first need map tiles for the area that you're interested in. In my case, and because of my OCD, I wanted the entire planet offline. You can download the map in `pmtiles` format from here: [Protomaps Builds](https://maps.protomaps.com/builds/):

The latest version is available here: https://demo-bucket.protomaps.com/v4.pmtiles

**WARNING** This file is very large - around 122 GB for the latest! Make sure you have space on your device.

```bash
# Download ~122 GB map tiles
wget https://demo-bucket.protomaps.com/v4.pmtiles
```

This file must be placed in the `tiles` folder for the default offline styles to read.

If you still have space on your device, and you want hillshading and terrain, you can get that from [Mapterhorn](https://mapterhorn):

**WARNING** This file is very large - around 540 GB for the latest! Make sure you have space on your device.

```bash
# Download ~540 GB terrain file
wget https://download.mapterhorn.com/planet.pmtiles
```

## Roadmap:

- [ ] Offline glyphs and fonts
- [ ] Add OpenFreeMap styles with pmtiles
- [ ] Add satellite view in pmtile format
- [ ] Add automatic downloader for pmtiles
