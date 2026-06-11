import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { useNavigate } from "react-router";
import {
  activeRides,
  heatZones,
  mapMarkers,
  rideLine,
  secondRideLine,
} from "../data/mockDashboardData";
import type { HeatZone } from "../types";
import { getMapTileLayer } from "../utils/mapConfig";
import { driverIcon, passengerIcon } from "../utils/mapIcons";
import { useActivePaletteMode } from "../utils/useActivePaletteMode";
import { MapLegend } from "./MapLegend";

export function DashboardLiveMap() {
  const theme = useTheme();
  const navigate = useNavigate();
  const activeMode = useActivePaletteMode();
  const tileLayer = getMapTileLayer(activeMode);
  const alertRide =
    activeRides.find((r) => r.id === activeRides[2]?.id) ?? null;

  function openAlertRide() {
    if (!alertRide) return;
    navigate("/rides", {
      state: {
        selectedTab: "active",
        selectedRideId: alertRide.id,
        highlightAlert: true,
      },
    });
  }

  return (
    <Card variant="outlined" sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4">Mapa ao vivo</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Motoristas, passageiros e linhas de corrida em andamento.
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            <MapLegend color="#EF4444" label="Alerta" />
            <MapLegend color="#F97316" label="Chamadas" />
            <MapLegend color="#2563EB" label="Motorista" />
            <MapLegend color="#22D3EE" label="Passageiro" />
          </Stack>
        </Stack>

        <Box
          sx={{
            height: { xs: 340, md: 460 },
            overflow: "hidden",
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <MapContainer
            center={[-22.4256, -45.4528]}
            zoom={10}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              key={activeMode}
              attribution={tileLayer.attribution}
              url={tileLayer.url}
            />
            {heatZones.map((zone) => (
              <Circle
                key={zone.id}
                center={zone.position}
                radius={getHeatZoneRadius(zone)}
                pathOptions={getHeatZoneStyle(zone, activeMode)}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                  {zone.label}: {zone.calls} chamadas
                </Tooltip>
              </Circle>
            ))}
            <Polyline
              positions={rideLine}
              pathOptions={{ color: "#0ABEE9", weight: 5, opacity: 0.88 }}
            />
            <Polyline
              positions={secondRideLine}
              pathOptions={{
                color: "#2DD4A0",
                weight: 4,
                opacity: 0.76,
                dashArray: "8 10",
              }}
            />
            {alertRide ? (
              <CircleMarker
                center={alertRide.passengerPosition}
                radius={13}
                pathOptions={{
                  color: "#FFFFFF",
                  weight: 3,
                  fillColor: "#EF4444",
                  fillOpacity: 0.95,
                }}
                eventHandlers={{ click: openAlertRide }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={0.98}>
                  Alerta ativo - {alertRide.id}
                </Tooltip>
              </CircleMarker>
            ) : null}
            {mapMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={marker.type === "driver" ? driverIcon : passengerIcon}
                title={marker.label}
              />
            ))}
          </MapContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

function getHeatZoneRadius(zone: HeatZone) {
  return 420 + zone.intensity * 760;
}

function getHeatZoneStyle(zone: HeatZone, mode: "light" | "dark") {
  const fillOpacity =
    mode === "dark"
      ? 0.18 + zone.intensity * 0.22
      : 0.14 + zone.intensity * 0.2;

  return {
    color: "#F97316",
    weight: 0,
    fillColor:
      zone.intensity > 0.82
        ? "#EF4444"
        : zone.intensity > 0.66
          ? "#F97316"
          : "#F59E0B",
    fillOpacity,
  };
}
