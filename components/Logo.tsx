import { Image, View } from "react-native";
import { Link } from "expo-router";

const Logo = () => (
  <Link href={"/"}>
    <View className="h-8 w-8 overflow-hidden">
      <Image
        source={require("~/assets/images/logo.png")}
        className="h-full w-full"
      />
    </View>
  </Link>
);

export default Logo;
