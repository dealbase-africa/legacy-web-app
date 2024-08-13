import africaGeoJson from "@dealbase/fixtures/json/africa.geo.json";
import bbox from "@turf/bbox";
import getCenter from "@turf/center";
import { FeatureCollection, Position } from "@turf/helpers";
import "mapbox-gl/dist/mapbox-gl.css";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { MapRef } from "react-map-gl";
import { useFilterStore } from "src/stores/filter";

interface Props {
  resetSelectedFeatures: () => void;
  setCenter: Dispatch<SetStateAction<Position>>;
  mapRef: RefObject<MapRef>;
  resetPopup: () => void;
}

export const useResetMapOnSearch = ({
  resetSelectedFeatures,
  setCenter,
  mapRef,
  resetPopup,
}: Props) => {
  const searchTerm = useFilterStore((state) => state.filter.searchTerm);
  const setFilter = useFilterStore((state) => state.setFilter);

  useEffect(() => {
    if (searchTerm !== "") {
      setFilter({ country: ["All"] });
      resetSelectedFeatures();
      if (mapRef?.current) {
        const centerCoords = getCenter(africaGeoJson as FeatureCollection);
        setCenter(centerCoords.geometry.coordinates);
        resetPopup();
        const [minLng, minLat, maxLng, maxLat] = bbox(
          africaGeoJson as FeatureCollection,
        );

        mapRef.current.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
            duration: 1000,
          },
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
};
