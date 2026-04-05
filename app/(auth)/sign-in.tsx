import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useType } from "@/store/zustand";
import AuthForm from "@/components/AuthForm";

const SignIn = () => {
  const { type } = useType();
  return <AuthForm type={type} />;
};

export default SignIn;
