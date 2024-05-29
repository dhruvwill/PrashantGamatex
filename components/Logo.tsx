import { Image } from 'react-native';
import { Link } from 'expo-router';

const Logo = () => (
    <Link href={"/"} className="mr-8">
      <Image source={require('~/assets/images/logo.png')} className="w-[100px] h-5" resizeMode="content"/>
    </Link>
)

export default Logo;