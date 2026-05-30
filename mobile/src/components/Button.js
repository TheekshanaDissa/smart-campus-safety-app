import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.outline,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style
      ]}
    >
      {loading ? <ActivityIndicator color={isOutline ? colors.primary : '#fff'} /> : (
        <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary
  },
  danger: {
    backgroundColor: colors.danger
  },
  disabled: {
    opacity: 0.6
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  outlineText: {
    color: colors.primary
  }
});
