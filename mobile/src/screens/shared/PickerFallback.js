import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

export function PickerFallback({ options, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.row}>
        {options.map(item => (
          <Pressable key={item.value} onPress={() => onChange(item.value)} style={[styles.item, value === item.value && styles.active]}>
            <Text style={[styles.text, value === item.value && styles.activeText]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  item: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.text, fontWeight: '700' },
  activeText: { color: '#fff' }
});
