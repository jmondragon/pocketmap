import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { StyleSwitcherControl, type StyleItem } from "map-gl-style-switcher";
import "map-gl-style-switcher/dist/map-gl-style-switcher.css";
//import MaplibreGeocoder, { type MaplibreGeocoderApi } from "@maplibre/maplibre-gl-geocoder";
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
  map.addControl(
    new maplibregl.TerrainControl({ source: "terrainSource", exaggeration: 1 })
  );
});
