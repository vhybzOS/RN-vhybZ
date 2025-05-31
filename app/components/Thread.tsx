import React, { FC, useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Icon, IconButton, List, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import type { Content } from '@google/genai';
import { ReducedMessage, extractHtmlContent, reduceContentMessage } from 'app/utils/contentHelpers.';
import WebView from 'react-native-webview';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { ThreadItem } from 'app/services/agent';
import { useNavigation } from '@react-navigation/native';
import { AppNavigation } from 'app/navigators';

export type ThreadProps = {
  thread: ThreadItem[];
};

export const ThreadComponent = ({ thread }: ThreadProps) => {

  const navigation = useNavigation<AppNavigation>();

  const renderHeader = (name: string) => {
    return (<List.Item key={name} title={name}></List.Item>)
  }

  const renderBlob = (blob: ReducedMessage, index: number, isUser: boolean) => {
    return (<Blob key={index} blob={blob} index={index} isUser={isUser}></Blob>)
  };

  const renderMessage = (item: Content, index: number) => {
    const isUser = item.role === 'user';
    const blobs = reduceContentMessage(item);

    return (
      <View
        key={index}
        style={[
          styles.messageContainer,
          { alignSelf: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        {blobs.map((blob, idx) => renderBlob(blob, idx, isUser))}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Content | string, index: number }) => {
    if (typeof item === 'string') {
      return renderHeader(item);
    }
    return <Pressable key={index} onPress={() => navigation.navigate("Focus", { msg: item })}>{renderMessage(item, index)}</Pressable>;

  }

  const flatMessages = useMemo(() => {
    const flat: (Content | string)[] = [];
    thread.forEach((i) => {
      flat.push(i.name)
      flat.push(...i.messages)
    })
    return flat;
  }, [thread]);

  return (
    <FlashList
      data={flatMessages} // Reverse to show the latest message at the bottom
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
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
  index: number;
  blob: ReducedMessage;
  isUser: boolean;
}

const Blob: FC<BlobProps> = ({ index, blob, isUser }) => {
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

export default ThreadComponent;
