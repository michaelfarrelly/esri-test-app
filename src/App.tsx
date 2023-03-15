import React from "react";
import "./App.css";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Print from "@arcgis/core/widgets/Print.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import KMLLayer from "@arcgis/core/layers/KMLLayer.js";
import esriConfig from "@arcgis/core/config";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Legend from "@arcgis/core/widgets/Legend.js";

function createGeoJsonBlobUrl(geojson: any): string {
    // create a new blob from geojson feature collection
    const blob = new Blob([JSON.stringify(geojson)], {
        type: "application/json",
    });

    // URL reference to the blob
    const url = URL.createObjectURL(blob);

    return url;
}

function App() {
    React.useEffect(() => {
        // private info
        esriConfig.apiKey = "";

        const webmap = new WebMap({
            basemap: "arcgis-topographic",
        });

        const view = new MapView({
            map: webmap,
            container: "viewDiv",
            zoom: 6,
            center: [-104.991531, 39.742043], // long/lat of Denver
        });

        // GeoJSON from URL
        const geojsonLayer = new GeoJSONLayer({
            url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
            copyright: "USGS Earthquakes",
            title: "USGS Earthquakes", // LayerList title
        });
        webmap.add(geojsonLayer);

        // if the geojson isn't from a URL, but in memory:

        // create a geojson layer from geojson feature collection
        const geojson = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    id: 1,
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [-100.0, 40.0],
                                [-110.0, 40.0],
                                [-110.0, 45.0],
                                [-100.0, 45.0],
                                [-100.0, 40.0],
                            ],
                        ],
                    },
                    properties: {
                        prop0: "value0",
                    },
                },
            ],
        };
        // URL reference to the blob
        const url = createGeoJsonBlobUrl(geojson);
        // create new geojson layer using the blob url
        const layer = new GeoJSONLayer({
            url,
            title: "Embed GeoJson",
        });
        webmap.add(layer);

        // KML from URL (possibly must be from a public url as the localhost KML_1.kml doesn't work.)
        const kmlLayer = new KMLLayer({
            url: "https://raw.githubusercontent.com/mapbox/Simple-KML/master/sample/example.kml", // url to the service
            title: "KML Samples",
        });
        webmap.add(kmlLayer); // adds the layer to the map

        // List of layers
        const layerList = new LayerList({
            view: view,
        });
        view.ui.add(layerList, { position: "top-right" });
        const legend = new Legend({
            view: view,
        });
        view.ui.add(legend, { position: "top-right" });

        // Print service
        const print = new Print({
            view: view,
            // specify your own print service
            printServiceUrl:
                "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
        });
        view.ui.add(print, { position: "top-right" });

        // trigger when the view is loaded.
        view.when(() => console.log("view ready"));
    }, []);

    return (
        <div className="App">
            <h1>Vite + React + Esri @arcgis/core</h1>
            <div className="card">
                <div id="viewDiv" />
            </div>
        </div>
    );
}

export default App;
