import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getNews } from '@/services/news';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';

function formatDate(value) {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'America/Mexico_City',
  }).format(new Date(value));
}

export function NewsList({ category }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getNews(category)
      .then((data) => active && setArticles(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [category]);

  async function onRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getNews(category);
      setArticles(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  if (articles.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No hay noticias para esta categoría.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item, index) => item.url ?? String(index)}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/modal',
              params: {
                title: item.title,
                description: item.description ?? '',
                image: item.urlToImage ?? '',
                url: item.url,
                source: item.source?.name ?? '',
              },
            })
          }>
          <ThemedView style={styles.card}>
            {item.urlToImage ? (
              <Image source={item.urlToImage} style={styles.image} contentFit="cover" />
            ) : null}
            <ThemedText type="subtitle" style={styles.title}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.date}>{formatDate(item.publishedAt)}</ThemedText>
            {item.description ? <ThemedText>{item.description}</ThemedText> : null}
          </ThemedView>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 16 },
  card: { gap: 8 },
  image: { width: '100%', height: 200, borderRadius: 8 },
  title: { marginTop: 4 },
  date: { fontSize: 13, opacity: 0.7 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
