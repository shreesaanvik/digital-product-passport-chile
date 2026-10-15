"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import { CLUSTERS, type ClusterId } from "@/lib/data";

import "leaflet/dist/leaflet.css";

const FM_BLUE = "#1799b5";
const FM_BTN_BG = "#0081A1";
const FM_BTN_TEXT = "#006E8A";

type Props = {
  selectedId: ClusterId | null;
  onSelect: (id: ClusterId) => void;
  matchedIds?: string[] | null;
};

function FitChile() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(CLUSTERS.map((c) => L.latLng(c.lat, c.lng)));
    const fit = () => {
      map.invalidateSize();
      map.fitBounds(bounds, {
        paddingTopLeft: [32, 36],
        paddingBottomRight: [32, 64],
        maxZoom: 5,
      });
    };
    fit();
    const timer = window.setTimeout(fit, 50);
    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function FitSelection({ selectedId }: { selectedId: ClusterId | null }) {
  const map = useMap();
  const skipFirst = useRef(true);

  useEffect(() => {
    const c = CLUSTERS.find((x) => x.id === selectedId);
    if (!c) return;

    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }

    map.flyTo([c.lat, c.lng], 6, { duration: 0.45 });
  }, [map, selectedId]);

  return null;
}

function pinClasses(
  selectedId: ClusterId | null,
  clusterId: ClusterId,
  matchedIds: string[] | null | undefined,
) {
  const filtering = matchedIds != null;
  const isSelected = selectedId === clusterId;
  const isMatched = !filtering || matchedIds.includes(clusterId);

  if (isSelected) {
    return {
      pin: "fm-map-pin fm-map-pin--active",
      halo: "fm-map-pin-halo fm-map-pin-halo--active",
    };
  }
  if (filtering && isMatched) {
    return {
      pin: "fm-map-pin fm-map-pin--matched",
      halo: "fm-map-pin-halo fm-map-pin-halo--matched",
    };
  }
  if (filtering && !isMatched) {
    return {
      pin: "fm-map-pin fm-map-pin--dimmed",
      halo: "fm-map-pin-halo fm-map-pin-halo--dimmed",
    };
  }
  return {
    pin: "fm-map-pin fm-map-pin--idle",
    halo: "fm-map-pin-halo fm-map-pin-halo--idle",
  };
}

export function ChileMap({ selectedId, onSelect, matchedIds = null }: Props) {
  const t = useT();
  const bounds = useMemo(() => {
    const pts = CLUSTERS.map((c) => L.latLng(c.lat, c.lng));
    return L.latLngBounds(pts);
  }, []);

  return (
    <div
      className="relative h-[420px] w-full rounded-2xl bg-slate-100 shadow-neu overflow-hidden border border-slate-200/80 z-0"
      role="application"
      aria-label={t.home.mapLabel}
    >
      <MapContainer
        bounds={bounds}
        boundsOptions={{
          paddingTopLeft: [32, 36],
          paddingBottomRight: [32, 64],
          maxZoom: 5,
        }}
        center={[-33.5, -71.2]}
        zoom={4}
        className="h-[420px] w-full z-0 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:bg-white/90"
        scrollWheelZoom={false}
        zoomSnap={0.25}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitChile />
        <FitSelection selectedId={selectedId} />
        {CLUSTERS.map((c) => {
          const active = selectedId === c.id;
          const filtering = matchedIds != null;
          const isMatched = !filtering || matchedIds.includes(c.id);
          const isDimmed = filtering && !isMatched;
          const classes = pinClasses(selectedId, c.id, matchedIds);

          return (
            <Fragment key={c.id}>
              <CircleMarker
                center={[c.lat, c.lng]}
                radius={active ? 24 : isMatched && filtering ? 20 : 16}
                interactive={false}
                pathOptions={{
                  className: classes.halo,
                  color: active || (filtering && isMatched) ? FM_BLUE : FM_BTN_TEXT,
                  weight: active ? 1.5 : filtering && isMatched ? 1 : 0,
                  fillColor: active || (filtering && isMatched) ? FM_BLUE : FM_BTN_TEXT,
                  fillOpacity: isDimmed
                    ? 0.08
                    : active
                      ? 0.28
                      : filtering && isMatched
                        ? 0.22
                        : 0.18,
                }}
              />
              <CircleMarker
                center={[c.lat, c.lng]}
                radius={active ? 11 : filtering && isMatched ? 10 : 8}
                pathOptions={{
                  className: classes.pin,
                  color: active || (filtering && isMatched) ? FM_BLUE : FM_BTN_TEXT,
                  weight: active ? 2.5 : filtering && isMatched ? 2.25 : 2,
                  fillColor: active
                    ? FM_BTN_BG
                    : filtering && isMatched
                      ? FM_BLUE
                      : FM_BTN_TEXT,
                  fillOpacity: isDimmed
                    ? 0.25
                    : active
                      ? 0.95
                      : filtering && isMatched
                        ? 0.9
                        : 0.88,
                }}
                eventHandlers={{
                  click: () => onSelect(c.id),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                  className="fm-cluster-tooltip"
                >
                  <span className="block w-40">
                    <Image
                      src={c.image}
                      alt={phrase(c.imageAlt, t)}
                      width={160}
                      height={80}
                      className="h-20 w-40 rounded object-cover"
                    />
                    <span className="mt-1 block text-center text-xs leading-snug">
                      {c.name}, {phrase(c.craft, t)}
                    </span>
                  </span>
                </Tooltip>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>
      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs text-fm-muted px-2 bg-white/85 backdrop-blur-sm py-1.5 border-t border-slate-100">
        {t.home.mapHint}
      </p>
    </div>
  );
}
