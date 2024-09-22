import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Profile } from '@/screens';
import BottomTabBar from '@/components/navigation/BottomTabBar';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Profile" component={Profile} />
            {/* 添加更多需要共享 BottomTabBar 的页面 */}
        </Tab.Navigator>
    );
};

export default TabNavigator;