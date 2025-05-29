import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import type { Content } from '@google/genai';
import { ReducedMessage, reduceContentMessage } from 'app/utils/contentHelpers.';

type ChatProps = {
  messages: Content[];
};

const Chat = ({ messages }: ChatProps) => {
  const theme = useTheme();

  const renderBlob = (blob: ReducedMessage, index: number, isUser: boolean) => {
    const baseColor = isUser ? theme.colors.primary : theme.colors.surfaceVariant;
    const textColor = isUser ? theme.colors.onPrimary : theme.colors.onSurfaceVariant;

    switch (blob.type) {
      case 'text':
        return (
          <Card style={[styles.messageCard, { backgroundColor: baseColor }]} key={index}>
            <Card.Content>
              <Text style={{ color: textColor }}>{blob.content}</Text>
            </Card.Content>
          </Card>
        );

      case 'image':
        return (
          <Card style={styles.mediaCard} key={index}>
            <Image source={{ uri: blob.content }} style={styles.image} resizeMode="contain" />
          </Card>
        );

      case 'html':
        return (
          <Card style={[styles.messageCard, { backgroundColor: baseColor }]} key={index}>
            <Card.Content>
              <Text style={{ color: textColor }}>[HTML content]</Text>
            </Card.Content>
          </Card>
        );

      case 'video':
        return (
          <Card style={[styles.messageCard]} key={index}>
            <Card.Content>
              <Text>[Video content not rendered]</Text>
            </Card.Content>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderMessage = ({ item }: { item: Content }) => {
    const isUser = item.role === 'user';
    const blobs = reduceContentMessage(item);

    return (
      <View
        style={[
          styles.messageContainer,
          { alignSelf: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        {blobs.map((blob, idx) => renderBlob(blob, idx, isUser))}
      </View>
    );
  };

  return (
    <FlashList
      data={messages}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderMessage}
      estimatedItemSize={100}
      contentContainerStyle={styles.container}
      inverted
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '75%',
  },
  messageCard: {
    borderRadius: 16,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  mediaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Chat;
