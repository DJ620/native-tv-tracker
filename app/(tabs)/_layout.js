import { Tabs } from "expo-router";
import { useRouter, usePathname } from "expo-router";
import { Feather, Fontisto } from '@expo/vector-icons';
import { ModalPortal } from "react-native-modals";

import store from "../redux/store";
import { Provider } from "react-redux";

export default function _layout() {
  const router = useRouter();
  const pathname = usePathname();


  return (
    <Provider store={store}>
    <Tabs>
      <Tabs.Screen
        onPress={() => router.push("/(tabs)/library")}
        name="library"
        options={{
            tabBarLabel: "Library",
            headerShown: false,
            tabBarLabelStyle: {fontSize:12, color: pathname === "/library" ? "#006FF9" : "gray", marginBottom:-15},
            tabBarStyle: {paddingBottom:10, backgroundColor:"white", height:50},
            tabBarIconStyle: {marginBottom:-15},
            tabBarIcon: ({focused}) => <Feather name="tv" size={24} color={focused && pathname === "/library" ? "#006FF9" : "black"} />
        }}
      />
      <Tabs.Screen
        onPress={() => router.push("/(tabs)/search")}
        name="search"
        options={{
            tabBarLabel: "Search",
            headerShown: false,
            tabBarLabelStyle: {fontSize:12, color: pathname === "/search" ? "#006FF9" : "gray", marginBottom:-15},
            tabBarStyle: {paddingBottom:10, backgroundColor:"white", height: 50},
            tabBarIconStyle: {marginBottom:-15},
            tabBarIcon: ({focused}) => <Fontisto name="search" size={24} color={focused && pathname === "/search" ? "#006FF9" : "black"} />
        }}
      />
       <Tabs.Screen
        name="show"
        options={{
            href: null,
            headerShown: false,
            tabBarLabelStyle: {fontSize:12, color: pathname === "/library" ? "#006FF9" : "gray", marginBottom:-15},
            tabBarIconStyle: {marginBottom:-15},
            tabBarStyle: {paddingBottom:10, backgroundColor:"white", height: 50}
        }}
      />
      <Tabs.Screen
        name="actor"
        options={{
            href: null,
            headerShown: false,
            tabBarLabelStyle: {fontSize:12, color: pathname === "/library" ? "#006FF9" : "gray", marginBottom:-15},
            tabBarIconStyle: {marginBottom:-15},
            tabBarStyle: {paddingBottom:10, backgroundColor:"white", height: 50}
        }}
      />
    </Tabs>
    <ModalPortal />
    </Provider>
  );
}
