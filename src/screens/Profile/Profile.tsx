import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2, Paragraph, YStack, XStack, Button } from 'tamagui';
import { useTheme } from '@/theme';
import BottomTabBar from '@/components/navigation/BottomTabBar';

const Profile = () => {
    const { layout, gutters, backgrounds } = useTheme();

    return (
        <SafeAreaView style={[styles.container, backgrounds.graySoft]}>
            <View style={styles.content}>
                <YStack space="$4" padding="$4">
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/150' }}
                            style={styles.avatar}
                        />
                    </View>
                    <H2 textAlign="center">John Doe</H2>
                    <Paragraph textAlign="center">john.doe@example.com</Paragraph>
                    <XStack space="$4" justifyContent="center">
                        <Button>Edit Profile</Button>
                        <Button variant="outlined">Settings</Button>
                    </XStack>
                    <YStack space="$2">
                        <Paragraph>Joined: January 1, 2023</Paragraph>
                        <Paragraph>Location: New York, USA</Paragraph>
                        <Paragraph>Bio: Passionate photographer and traveler</Paragraph>
                    </YStack>
                </YStack>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
});

export default Profile;