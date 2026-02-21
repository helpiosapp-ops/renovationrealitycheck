import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="privacy" name="privacy">
        <Icon sf="lock.shield.fill" />
        <Label>Privacy</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
