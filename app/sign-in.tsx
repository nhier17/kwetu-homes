import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { login } from "@/lib/appwrite";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { router } from "expo-router";

const Auth = () => {
  const handleLogin = async () => {
    const success = await login();
    if (success) {
      router.push("/");
    } else {
      Alert.alert("Login failed");
    }
  };
  
  return (
    <SafeAreaView className="bg-white h-full">
        <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
        >
          <Image 
            source={images.onboarding}
            className="w-full h-4/6"
            resizeMode="contain"
          />
          <View className="px-10">
            <Text className="text-base text-center uppercase font-rubik text-black-200">
              Welcome to KwetuHomes
            </Text>

            <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
            </Text>

            <Text className="text-lg font-rubik text-black-200 text-center mt-12">
              Login to KwetuHomes with Google
            </Text>

            <TouchableOpacity
              onPress={handleLogin}
              className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
            >
              <View className="flex flex-row items-center justify-center">
                <Image 
                  source={icons.google}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-rubik-medium text-blue-300 ml-2">
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Auth

