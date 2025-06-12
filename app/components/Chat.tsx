import React, { FC, useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Icon, IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import type { Content } from '@google/genai';
import { ReducedMessage, extractHtmlContent, reduceContentMessage } from 'app/utils/contentHelpers.';
import WebView from 'react-native-webview';
import { Pressable, ScrollView } from 'react-native-gesture-handler';

type ChatProps = {
  messages: Content[];
};

const Chat = ({ messages }: ChatProps) => {

  const renderBlob = (blob: ReducedMessage, index: number, isUser: boolean, key: number) => {
    return (<Blob blob={blob} key={key} index={index} isUser={isUser}></Blob>)
  };

  const renderMessage = ({ item, index }: { item: Content, index: number }) => {
    const isUser = item.role === 'user';
    const blobs = reduceContentMessage(item);

    return (
      <View
        style={[
          styles.messageContainer,
          { alignSelf: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        {blobs.map((blob, idx) => renderBlob(blob, idx, isUser, index))}
      </View>
    );
  };

  return (
    <FlashList
      data={messages} // Reverse to show the latest message at the bottom
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderMessage}
      nestedScrollEnabled
      estimatedItemSize={100}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  messageContainer: {
    marginVertical: 0,
    width: '100%',
  },
  messageCard: {
    width: "100%",
    borderRadius: 0,
    // paddingHorizontal: 8,
    // marginBottom: 4,
  },
  mediaCard: {
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: 4,
    height: 200,
  },
  image: {
    width: 200,
    height: 200,
  },
});

interface BlobProps {
  key: number;
  index: number;
  blob: ReducedMessage;
  isUser: boolean;
}

const Blob: FC<BlobProps> = ({ key, index, blob, isUser }) => {
  const theme = useTheme();
  const baseColor = isUser ? theme.colors.inverseSurface : theme.colors.surfaceVariant;
  const textColor = isUser ? theme.colors.inverseOnSurface : theme.colors.onSurfaceVariant;
  const [played, setPlayed] = React.useState<boolean>(true);

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
          <Card.Actions>
            <TouchableRipple onPress={() => { setPlayed(!played) }}>
              <Icon size={25} source={played ? "stop-circle" : "play-circle"}></Icon>
            </TouchableRipple>
          </Card.Actions>
          <Card.Content style={{ maxHeight: 300 }}>
            <ScrollView>
              {played ?
                <WebView style={{ height: 300 }}
                  injectedJavaScript="window.alert = '';"
                  source={{ html: extractHtmlContent(blob.content) || "" }}
                /> :
                <Text style={{ color: textColor }}>{blob.content}</Text>
              }
            </ScrollView>
          </Card.Content>
        </Card >
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

export default Chat;
