import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, Dimensions, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Polygon } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { XStack, Paragraph, Card, Button, H2, ScrollView } from 'tamagui';
import { useTheme } from '@/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

interface MarkerData {
  id: number;
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
  value: number;
}

interface Network {
  [key: number]: number[];
}

interface MapData {
  markers: MarkerData[];
  network: Network;
}

const Home = () => {
    const { layout, gutters, backgrounds, colors } = useTheme();

    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    const [selectedMarker, setSelectedMarker] = useState(null);

    const mapData: MapData = {
        markers: [
            { id: 1, coordinate: { latitude: 37.78825, longitude: -122.4324 }, title: "Marker 1", description: "This is marker 1", value: -100 },
            { id: 2, coordinate: { latitude: 37.78925, longitude: -122.4344 }, title: "Marker 2", description: "This is marker 2", value: 0 },
            { id: 3, coordinate: { latitude: 37.78725, longitude: -122.4304 }, title: "Marker 3", description: "This is marker 3", value: 100 },
        ],
        network: {
            1: [2, 3],
            2: [],
            3: []
        }
    };

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

    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
    };

    const hexToRgb = (hex: string): number[] => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    };

    const interpolateColor = (color1: string, color2: string, factor: number) => {
        const c1 = hexToRgb(color1);
        const c2 = hexToRgb(color2);
        const result = c1.map((c, i) => Math.round(c + factor * (c2[i] - c)));
        return `rgb(${result[0]},${result[1]},${result[2]})`;
    };

    const getColorForValues = (value1: number, value2: number) => {
        const avgValue = (value1 + value2) / 2;
        const minValue = -100;
        const maxValue = 100;
        const factor = Math.max(0, Math.min(1, (avgValue - minValue) / (maxValue - minValue)));
        const lowColor = colors.heartbeatLowStart || '#9EB5DE';
        const highColor = colors.heartbeatHighEnd || '#F67236';
        const color = interpolateColor(lowColor, highColor, factor);
        console.log(`Values: ${value1}, ${value2}, Avg: ${avgValue}, Factor: ${factor}, Color: ${color}`);
        return color;
    };

    const getColorForValue = (value: number) => {
        return getColorForValues(value, value);
    };

    // 计算两点之间的叉积
    const cross = (o: any, a: any, b: any) => {
        return (a.longitude - o.longitude) * (b.latitude - o.latitude) - (a.latitude - o.latitude) * (b.longitude - o.longitude);
    };

    // 计算凸包
    const computeConvexHull = (points: any[]) => {
        points.sort((a, b) => a.longitude - b.longitude || a.latitude - b.latitude);
        
        const lower = [];
        for (let i = 0; i < points.length; i++) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                lower.pop();
            }
            lower.push(points[i]);
        }
        
        const upper = [];
        for (let i = points.length - 1; i >= 0; i--) {
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                upper.pop();
            }
            upper.push(points[i]);
        }
        
        upper.pop();
        lower.pop();
        return lower.concat(upper);
    };

    // 获取所有点的坐标
    const getAllPoints = () => {
        return mapData.markers.map(marker => marker.coordinate);
    };

    // 计算多边形的坐标
    const polygonCoordinates = computeConvexHull(getAllPoints());
    console.log("Polygon Coordinates:", polygonCoordinates); // 添加这行来检查坐标

    // 计算多边形的颜色（这里我们使用所有点的平均值）
    const getPolygonColor = () => {
        const avgValue = mapData.markers.reduce((sum, marker) => sum + marker.value, 0) / mapData.markers.length;
        return getColorForValue(avgValue);
    };

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
                            <Polygon
                                coordinates={polygonCoordinates}
                                fillColor={`${getPolygonColor()}40`}  // 40 is for 25% opacity
                                strokeColor={getPolygonColor()}
                                strokeWidth={2}
                            />
                            {mapData.markers.map((marker) => (
                                <Marker
                                    key={marker.id}
                                    coordinate={marker.coordinate}
                                    title={marker.title}
                                    description={marker.description}
                                    onPress={() => handleMarkerPress(marker)}
                                >
                                    <View style={[styles.customMarker, { borderColor: getColorForValue(marker.value) }]}>
                                        <Text style={[styles.markerText, { color: getColorForValue(marker.value) }]}>{marker.id}</Text>
                                    </View>
                                </Marker>
                            ))}
                            {Object.entries(mapData.network).flatMap(([startId, endIds]) => 
                                endIds.map(endId => {
                                    const startMarker = mapData.markers.find(m => m.id === parseInt(startId));
                                    const endMarker = mapData.markers.find(m => m.id === endId);
                                    if (startMarker && endMarker) {
                                        const color = getColorForValues(startMarker.value, endMarker.value);
                                        console.log(`Line: Start: ${startMarker.coordinate.latitude},${startMarker.coordinate.longitude}, End: ${endMarker.coordinate.latitude},${endMarker.coordinate.longitude}, Color: ${color}`);
                                        return (
                                            <Polyline
                                                key={`${startMarker.id}-${endMarker.id}`}
                                                coordinates={[startMarker.coordinate, endMarker.coordinate]}
                                                strokeColor={color}
                                                strokeWidth={6}
                                                strokeOpacity={1}
                                            />
                                        );
                                    }
                                    return null;
                                })
                            )}
                        </MapView>
                    </View>
                    {selectedMarker && (
                        <Card style={styles.markerInfo}>
                            <Card.Header padded>
                                <H2>{selectedMarker.title}</H2>
                            </Card.Header>
                            <Card.Footer padded>
                                <Paragraph>{selectedMarker.description}</Paragraph>
                                <Paragraph>Value: {selectedMarker.value}</Paragraph>
                                <Button onPress={() => setSelectedMarker(null)}>Close</Button>
                            </Card.Footer>
                        </Card>
                    )}
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
    markerInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    customMarker: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        borderColor: '#ff5a5f',
        borderWidth: 2,
    },
    markerText: {
        color: '#ff5a5f',
        fontWeight: 'bold',
    },
});

export default Home;