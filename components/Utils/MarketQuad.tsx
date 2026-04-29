import { View, Text } from "react-native";
import React from "react";
import { MotiText } from "moti";

const MarketQuad = ({ className }: { className: string }) => {
  return (
    <MotiText
   
      className={className}
    >
      Market<Text className="text-secondary">Quad</Text>
    </MotiText>
  );
};

export default MarketQuad;
