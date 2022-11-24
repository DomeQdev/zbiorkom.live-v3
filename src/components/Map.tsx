import { GpsFixed, Traffic } from '@mui/icons-material';
import { useState } from 'react';
import mapStyles from "../util/styles.json";
import { Fab } from '@mui/material';
import { Style } from 'mapbox-gl';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default ({ location, buttons = true, style, children }: { location: [number, number], buttons?: boolean, style?: React.CSSProperties, children?: JSX.Element | JSX.Element[] }) => {
    const [trafficEnabled, setTrafficEnabled] = useState(false);
    const [map, setMap] = useState<mapboxgl.Map>();
    const mapStyle = localStorage.getItem("mapStyle") as keyof typeof mapStyles || "ms";

    return <Map
        mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JnZnp5MDExMzJ4bWlpMjcwaDR0dCJ9.v2ONdyf7WN70xFwUOyUuXQ"
        mapStyle={mapStyles[mapStyle]?.style as string | Style || mapStyles["ms"].style}
        initialViewState={{
            latitude: location[0],
            longitude: location[1],
            zoom: 16
        }}
        minZoom={2}
        maxPitch={0}
        attributionControl={false}
        touchZoomRotate={false}
        dragRotate={false}
        reuseMaps={true}
        style={style}
        onLoad={map => setMap(map.target)}
    >
        {children}
        {buttons && <Fab
            size="small"
            color="primary"
            sx={{ position: "absolute", marginTop: `${window.innerWidth > 600 ? 64 + 19 : 56 + 19}px`, right: 13 }}
        >
            <GpsFixed />
        </Fab>}
        {buttons && <Fab
            size="small"
            color="primary"
            sx={{ position: "absolute", marginTop: `${window.innerWidth > 600 ? 64 + 67 : 56 + 67}px`, right: 13 }}
            onClick={() => {
                if (!map) return;
                let style = map.getStyle();
                if (!style.sources["mapbox-traffic"]) map.setStyle({
                    ...style,
                    sources: {
                        ...style.sources,
                        "mapbox-traffic": {
                            "url": "mapbox://mapbox.mapbox-traffic-v1",
                            "type": "vector"
                        }
                    },
                    layers: [
                        ...style.layers,
                        {
                            "id": "traffic",
                            "source": "mapbox-traffic",
                            "source-layer": "traffic",
                            "type": "line",
                            "paint": {
                                "line-width": 2.5,
                                "line-color": [
                                    "case",
                                    [
                                        "==",
                                        "low",
                                        [
                                            "get",
                                            "congestion"
                                        ]
                                    ],
                                    "#63d668",
                                    [
                                        "==",
                                        "moderate",
                                        [
                                            "get",
                                            "congestion"
                                        ]
                                    ],
                                    "#ff974d",
                                    [
                                        "==",
                                        "heavy",
                                        [
                                            "get",
                                            "congestion"
                                        ]
                                    ],
                                    "#f23c32",
                                    [
                                        "==",
                                        "severe",
                                        [
                                            "get",
                                            "congestion"
                                        ]
                                    ],
                                    "#811f1f",
                                    "#000000"
                                ]
                            }
                        }
                    ]
                });
                else map.setLayoutProperty("traffic", "visibility", trafficEnabled ? "none" : "visible");
                setTrafficEnabled(!trafficEnabled);
            }}
        >
            <Traffic />
        </Fab>}
    </Map>
};