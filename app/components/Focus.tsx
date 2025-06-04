import React, { FC, useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Icon, IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import type { Content } from '@google/genai';
import { ReducedMessage, extractHtmlContent, reduceContentMessage } from 'app/utils/contentHelpers.';
import WebView from 'react-native-webview';
import { Pressable, ScrollView } from 'react-native-gesture-handler';

type FocusProps = {
  content: Content;
};

export const FocusComponent = ({ content }: FocusProps) => {
  const blobs = reduceContentMessage(content);
  return (
    <View
      style={[
        styles.messageContainer,
      ]}
    >
      {blobs.map((blob, idx) => <Blob blob={blob} index={idx} key={idx}></Blob>)}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  blob: ReducedMessage;
  index: number;
}

const Blob: FC<BlobProps> = ({ index, blob }) => {
  const theme = useTheme();
  const baseColor = theme.colors.surfaceVariant;
  const textColor = theme.colors.onSurfaceVariant;
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
          <Card.Content style={{ flex: 1 }}>
            <ScrollView>
              {played ?
                <WebView style={{ height: 600, }}
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

