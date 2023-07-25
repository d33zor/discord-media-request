import { useEffect, useState } from 'react';
import './App.css';

import axios from 'axios';
import Player from './components/Player';
import { IndexContext } from './contexts/IndexContext';
import { QueueContext } from './contexts/QueueContext';
import { MantineProvider } from '@mantine/core';

function App() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(0);
  const [reversed, setReversed] = useState([]);
  const [queueRef, setQueueRef] = useState(null);

  const reqInstance = axios.create({
    headers: {
      Authorization: import.meta.env.VITE_AUTH_KEY,
    },
  });

  const getMoreMessages = async (channelId) => {
    const lastMessageId = messages[messages.length - 1]?.id;

    if (lastMessageId) {
      const response = await reqInstance.get(
        `https://discord.com/api/v9/channels/${channelId}/messages?before=${lastMessageId}&limit=100`
      );

      if (response.data.length !== 0) {
        setMessages((current) => [...current, ...response.data]);
      } else {
        setLoading(false);
        let arr = [
          ...messages.filter(
            (message) =>
              message.attachments.length > 0 ||
              (message.embeds.length > 0 &&
                !message.embeds[0].url.startsWith('https://vm.tiktok.com') &&
                !message.embeds[0].url.startsWith('https://twitter.com/'))
          ),
        ];
        arr.reverse();
        setReversed(arr);
      }
    } else {
      const response = await reqInstance.get(
        `https://discord.com/api/v9/channels/${channelId}/messages?limit=100`
      );

      if (response.data.length !== 0) {
        setMessages((current) => [...current, ...response.data]);
      } else {
        setLoading(false);
        let arr = [...messages.filter((message) => message.embeds.length > 0)];
        arr.reverse();
        setReversed(arr);
      }
    }
  };

  useEffect(() => {
    getMoreMessages('1109907837582315530');
  }, [messages]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        colors: {
          dark: [
            '#d5d7e0',
            '#acaebf',
            '#8c8fa3',
            '#666980',
            '#4d4f66',
            '#34354a',
            '#2b2c3d',
            '#0f131a',
            '#0c0d21',
            '#01010a',
          ],
        },
      }}
    >
      <QueueContext.Provider value={{ queueRef, setQueueRef }}>
        <IndexContext.Provider value={{ index, setIndex }}>
          {!loading ? <Player messages={reversed} index={index} /> : <div>Loading...</div>}
        </IndexContext.Provider>
      </QueueContext.Provider>
    </MantineProvider>
  );
}

export default App;
