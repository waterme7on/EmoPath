import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Paragraph, Card, Button, H2, XStack, ScrollView } from 'tamagui';
import { View } from 'react-native';
import { useTheme } from '@/theme';
import BottomTabBar from '../../components/navigation/BottomTabBar';
const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
import {
    SafeAreaView,
} from 'react-native';

const Home = () => {
    const {
        layout,
        gutters,
        backgrounds,
    } = useTheme();

    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                setRegion({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                });
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }, []);

    return (
        <SafeAreaView style={[styles.container, backgrounds.graySoft]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[
                    layout.justifyCenter,
                    layout.itemsCenter,
                    layout.padding,
                    gutters.marginTop_80,
                    backgrounds.graySoft,
                ]}>
                    <Card style={styles.card}>
                        <Card.Header padded>
                            <H2>Sony A7IV</H2>
                            <Paragraph theme="alt2">Now available</Paragraph>
                        </Card.Header>
                        <Card.Footer padded>
                            <XStack flex={1} />
                            <Button borderRadius="$10">Purchase</Button>
                        </Card.Footer>
                    </Card>
                    <View style={styles.mapContainer}>
                        <MapView
                            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                            style={styles.map}
                            region={region}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                        >
                            <Marker
                                coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                                title="You are here"
                                description="Your current location"
                            />
                        </MapView>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    card: {
        padding: 0,
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    mapContainer: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginTop: 16,
    },
    map: {
        flex: 1,
        borderRadius: 6,
    },
});

export default Home;