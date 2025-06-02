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
import { useGraph } from 'app/services/agent/GraphContext';

export type ThreadProps = {
  thread: ThreadItem[];
};

export const ThreadComponent = ({ thread }: ThreadProps) => {

  const navigation = useNavigation<AppNavigation>();
  const { runFrom } = useGraph();

  const renderHeader = (name: string, index: number) => {
    return (<List.Item key={name} title={name} right={props =>
      <TouchableRipple onPress={() => {
        console.log("Running from index", index, flatMessages.mapper[index]);
        if (typeof flatMessages.mapper[index] === "number") {
          runFrom(flatMessages.mapper[index])
        }
      }}>
        <Icon source="arrow-u-left-bottom" size={25}></Icon>
      </TouchableRipple>}></List.Item>);
  }

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
        {
          blobs.map((blob, idx) => (
            <Blob key={idx} blob={blob} index={idx} isUser={isUser} actions={[
              {
                icon: "fullscreen",
                onPress: () => {
                  navigation.navigate("Focus", { msg: item })
                }
              }]} />
          ))
        }
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Content | string, index: number }) => {
    if (typeof item === 'string') {
      return renderHeader(item, index);
    }
    return renderMessage(item, index);

  }

  const flatMessages = useMemo(() => {
    const flat: (Content | string)[] = [];
    const mapper: (number | [number, number])[] = []
    const zip: boolean = true;
    thread.forEach((item, tdi) => {
      let msgs = item.messages.slice()
      if (zip && msgs.length > 0) {
        msgs = msgs.slice(msgs.length - 1, msgs.length);
      }
      flat.push(item.name)
      mapper.push(tdi)
      flat.push(...msgs)
      mapper.push(...msgs.map((_, index) => ([tdi, index] as [number, number])));
    })
    return { flat, mapper };
  }, [thread]);

  return (
    <FlashList
      data={flatMessages.flat} // Reverse to show the latest message at the bottom
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

type Action = {
  icon: string;
  onPress: () => void;
}

interface BlobProps {
  index: number;
  blob: ReducedMessage;
  isUser: boolean;
  actions: Action[]
}

const Blob: FC<BlobProps> = ({ index, blob, isUser, actions }) => {
  const theme = useTheme();
  const baseColor = isUser ? theme.colors.inverseSurface : theme.colors.surfaceVariant;
  const textColor = isUser ? theme.colors.inverseOnSurface : theme.colors.onSurfaceVariant;
  const [played, setPlayed] = React.useState<boolean>(true);

  const renderActions = (actions: Action[]) => {
    return actions.map((action, idx) => (
      <TouchableRipple key={idx} onPress={action.onPress}>
        <Icon color={textColor} size={25} source={action.icon}></Icon>
      </TouchableRipple>
    ))
  }

  switch (blob.type) {
    case 'text':
      return (
        <Card style={[styles.messageCard, { backgroundColor: baseColor }]} key={index}>
          <Card.Actions>
            {renderActions(actions || [])}
          </Card.Actions>
          <Card.Content>
            <Text style={{ color: textColor }}>{blob.content}</Text>
          </Card.Content>
        </Card>
      );

    case 'image':
      return (
        <Card style={styles.mediaCard} key={index}>
          <Card.Actions>
            {renderActions(actions || [])}
          </Card.Actions>
          <Image source={{ uri: blob.content }} style={styles.image} resizeMode="contain" />
        </Card>
      );

    case 'html':
      return (
        <Card style={[styles.messageCard, { backgroundColor: baseColor }]} key={index}>
          <Card.Actions>
            {renderActions(actions || [])}
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
          <Card.Actions>
            {renderActions(actions || [])}
          </Card.Actions>
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
