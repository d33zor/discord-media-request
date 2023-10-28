import { lazy, useEffect, useState } from 'react';
import { IndexContext } from '../contexts/IndexContext';
import { QueueContext } from '../contexts/QueueContext';
import axios from 'axios';
const Player = lazy(() => import('../components/Player'));
import { useNavigate } from 'react-router-dom';
import { Button, Loader } from '@mantine/core';
import styled from 'styled-components';
import ChannelForm from '../components/ChannelForm';

const PlayerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [messagesFromChannel, setMessagesFromChannel] = useState([]);
  const [index, setIndex] = useState(0);
  const [messagesWithRequest, setMessagesWithRequest] = useState([]);
  const [queueRef, setQueueRef] = useState(null);
  const [apiData, setApiData] = useState({});
  const [error, setError] = useState(null);

  const reqInstance = axios.create({
    headers: {
      Authorization: apiData.token,
    },
  });

  const goBack = () => {
    localStorage.removeItem('api_data');
    navigate('/get-started');
  };

  const filterForMessagesWithRequest = (message) => {
    return (
      (message.attachments.length > 0 &&
        message.attachments[0].content_type !== 'image/png' &&
        message.attachments[0].content_type !== 'image/gif') ||
      (message.embeds.length > 0 &&
        !message.embeds[0]?.url?.startsWith('https://twitter.com/') &&
        message.embeds[0]?.type !== 'link' &&
        message.embeds[0]?.type !== 'image' &&
        message.embeds[0]?.type !== 'rich' &&
        message.embeds[0]?.provider?.name !== 'Tenor')
    );
  };

  const getMoreMessages = async (channelId) => {
    try {
      const lastMessageId = messagesFromChannel[messagesFromChannel.length - 1]?.id;

      const { data } = await reqInstance.get(
        lastMessageId
          ? `https://discord.com/api/v9/channels/${channelId}/messages?before=${lastMessageId}&limit=100`
          : `https://discord.com/api/v9/channels/${channelId}/messages?limit=100`
      );

      if (data.length > 0) {
        setMessagesFromChannel((current) => [...current, ...data]);
      } else {
        setIsLoading(false);
        setMessagesWithRequest(
          [...messagesFromChannel.filter(filterForMessagesWithRequest)].reverse()
        );
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response.status);
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('api_data'));
    if (data?.token && data?.channel) {
      setApiData(data);
    } else {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    apiData?.token && apiData?.channel && getMoreMessages(apiData.channel);
  }, [messagesFromChannel, apiData]);

  return (
    <QueueContext.Provider value={{ queueRef, setQueueRef }}>
      <IndexContext.Provider value={{ index, setIndex }}>
        {!isLoading && !error ? (
          <Player messages={messagesWithRequest} index={index} />
        ) : isLoading ? (
          <Wrapper>
            <Loader size='xl' />
            <h1>Loading messages from channel... ({messagesFromChannel.length})</h1>
            <div>This may take a while.</div>
          </Wrapper>
        ) : error ? (
          <Wrapper>
            {error === 404 ? (
              <>
                <Title>Channel not found.</Title>
                <div>Make sure you have copied the ID correctly and try again.</div>
                <ChannelForm />
                <div>or</div>
                <Button onClick={() => goBack()}>Go to the main page</Button>
              </>
            ) : error === 401 || error === 403 ? (
              <>
                <Title>You are not authorized to see this channel.</Title>
                <div>
                  Make sure you have copied the token correctly and that you can see the channel in
                  your Discord client.
                </div>
                <Button onClick={() => goBack()}>Go to the main page</Button>
              </>
            ) : error === 500 ? (
              <>
                <Title>Internal server error.</Title>
                <div>Try refreshing the page.</div>
                <Button onClick={() => location.reload()}>Refresh</Button>
              </>
            ) : null}
          </Wrapper>
        ) : null}
      </IndexContext.Provider>
    </QueueContext.Provider>
  );
};

export default PlayerPage;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;
