import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getNews } from "@/services/news";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
