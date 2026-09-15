import { View, Text } from "react-native";

type Props = {
  lat: number;
  lon: number;
  title?: string;
};

export default function LocationPreview({ lat, lon, title }: Props) {
  // Small bounding box around the point — tweak this to zoom in/out
  const delta = 0.005;
  const bbox = [
    lon - delta,
    lat - delta,
    lon + delta,
    lat + delta,
  ].join("%2C");

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <View
      style={{
        width: 330,
        height: 150,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <iframe
        src={src}
        title={title ?? "Map preview"}
        // @ts-ignore — RN's View doesn't know about iframe-only DOM attrs, but this
        // renders straight to a real <iframe> on web via react-native-web
        style={{ width: "100%", height: "100%", border: 0 }}
        loading="lazy"
      />
    </View>
  );
}