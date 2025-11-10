import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { StyleSwitcherControl, type StyleItem } from "map-gl-style-switcher";
import "map-gl-style-switcher/dist/map-gl-style-switcher.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { Protocol } from "pmtiles";
import "./style.css";

let protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);
const mapStyles: StyleItem[] = await fetch("/styles.json").then((res) =>
  res.json()
);

let index = mapStyles?.findIndex(
  (i) => i.id === localStorage.getItem("mapStyle")
);

if (index === undefined || index < 0) {
  index = 0;
}

console.log("Initial map style index:", index);
const currentStyle = mapStyles?.[index];
const map = new maplibregl.Map({
  container: "map", // container id
  hash: true,
  style: currentStyle?.styleUrl,
  attributionControl: false,
  renderWorldCopies: false,
});

const styleSwitcher = new StyleSwitcherControl({
  styles: mapStyles ?? [],
  theme: "auto",
  showLabels: true,
  showImages: true,
  activeStyleId: currentStyle?.id,
  onBeforeStyleChange: (from, to) => {
    console.log("Changing style from", from.name, "to", to.name);
  },
  onAfterStyleChange: (_from, to) => {
    map.setStyle(to.styleUrl);
    localStorage.setItem("mapStyle", to.id);
    console.log("Style changed to", to.name);
  },
});

const geocoderApi = {
  forwardGeocode: async (config) => {
    const features = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request);
      const geojson = await response.json();
      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
        ];
        const point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ["place"],
          center,
        };
        features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return {
      features,
    };
  },
};

map.on("load", () => {
  // Add controls to the map
  map.addControl(new maplibregl.NavigationControl(), "top-right");
  map.addControl(new maplibregl.FullscreenControl(), "top-right");
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }),
    "top-right"
  );
  map.addControl(new maplibregl.GlobeControl(), "top-right");
  map.addControl(
    new maplibregl.ScaleControl({ unit: "imperial" }),
    "bottom-right"
  );
  map.addControl(styleSwitcher, "bottom-left");
  map.addControl(new MaplibreGeocoder(geocoderApi, { maplibregl }), "top-left");
  // Uncomment the following lines to add terrain control and 3D terrain effect
  //map.addControl(new maplibregl.TerrainControl({ source: "terrain" }));
});
