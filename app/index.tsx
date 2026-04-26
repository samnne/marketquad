
import React from "react";

import { db } from "@/db/db";
import { Redirect } from "expo-router";
import { ONBOARDING_KEY, ONBOARDING_VALUE } from "../constants/constants";


const Index = () => {
  const val = db.getItem(ONBOARDING_KEY);
  if (val === ONBOARDING_VALUE) {
    return <Redirect href={"/home"} />;
  } else {
    return <Redirect href={"/sign-in"} />;
  }
};

export default Index;
