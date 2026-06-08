import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  const { title, description, image, url, source } = useLocalSearchParams<{
    title: string;
    description: string;
    image: string;
    url: string;
    source: string;
  }>();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {image ? <Image source={image} style={styles.image} contentFit="cover" /> : null}
        <ThemedText type="title">{title}</ThemedText>
        {source ? <ThemedText style={styles.meta}>{source}</ThemedText> : null}
        {description ? <ThemedText style={styles.description}>{description}</ThemedText> : null}
        {url ? (
          <Pressable style={styles.button} onPress={() => openBrowserAsync(url)}>
            <ThemedText type="link">Leer noticia completa</ThemedText>
          </Pressable>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 10 },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: 6 },
  meta: { fontSize: 13, opacity: 0.7 },
  description: { fontSize: 16, marginTop: 6 },
  button: { marginTop: 20, paddingVertical: 12 },
});
