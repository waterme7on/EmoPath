import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Paragraph } from 'tamagui';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  // Add other screen names here
};

type BottomTabNavigationProps = BottomTabNavigationProp<RootStackParamList>;

const BottomTabBar = () => {
    const navigation = useNavigation<BottomTabNavigationProps>();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.tabItem}
                onPress={() => navigation.navigate('Home')}
            >
                <Paragraph>Home</Paragraph>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.tabItem}
                onPress={() => navigation.navigate('Profile')}
            >
                <Paragraph>Profile</Paragraph>
            </TouchableOpacity>
            {/* Add more tab items as needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    tabItem: {
        alignItems: 'center',
    },
});

export default BottomTabBar;