import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

export default function Input({ label, error, multiline = false, ...props }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#9CA3AF"
        style={[styles.input, multiline && styles.multiline, error && styles.errorBorder]}
        multiline={multiline}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { color: colors.text, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    color: colors.text
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  errorBorder: {
    borderColor: colors.danger
  },
  error: {
    color: colors.danger,
    marginTop: 4,
    fontSize: 12
  }
});
