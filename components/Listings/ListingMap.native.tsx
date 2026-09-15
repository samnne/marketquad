import MapView, { Marker, Circle } from "react-native-maps";
import { Linking, Platform, View } from "react-native";
import { colors } from "@/constants/theme";

type Props = {
  lat: number;
  lon: number;
  title?: string;
};

export default function LocationPreview({ lat, lon, title }: Props) {
  function openInMaps(lat: number, lon: number, label?: string) {
    const encodedLabel = encodeURIComponent(label ?? "Location");

    const url = Platform.select({
      ios: `maps:0,0?q=${encodedLabel}@${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}(${encodedLabel})`,
    });

    if (!url) return;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web, works everywhere
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
        );
      }
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: 330, height: 150, borderRadius: 12 }}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={() => openInMaps(lat, lon, title)}
      >
        <Circle
          center={{ latitude: lat, longitude: lon }}
          radius={1000}
          strokeWidth={1}
          strokeColor={colors.secondary}
          fillColor={`${colors.primary}50`}
        />
      </MapView>
    </View>
  );
}
