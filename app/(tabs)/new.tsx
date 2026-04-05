import ListingFormPage from "@/components/ListingFormPage";
import { TabScreenWrapper } from "@/components/TabScreenWrapper";
import { useLocalSearchParams } from "expo-router";

import { KeyboardAvoidingView, Platform } from "react-native";

const NewPage = () => {
  const params = useLocalSearchParams<{ type: "edit" | "new" }>();
  console.log(params.type);
  return (
    <TabScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ListingFormPage type={params.type === "edit" ? "edit" : "new"} />
      </KeyboardAvoidingView>
    </TabScreenWrapper>
  );
};

export default NewPage;
