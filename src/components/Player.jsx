/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IndexContext } from '../contexts/IndexContext';
import StreamablePlayer from './StreamablePlayer';
import TwitchPlayer from './TwitchPlayer';
import TiktokPlayer from './TiktokPlayer';
import YoutubePlayer from './YoutubePlayer';
import NativePlayer from './NativePlayer';
import { ActionIcon, Switch, Tooltip } from '@mantine/core';
import {
  IconHelpCircleFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
} from '@tabler/icons-react';
import Queue from './Queue';
import { QueueContext } from '../contexts/QueueContext';
import formatDate from '../utils/formatDate';

const Player = ({ messages }) => {
  const { index, setIndex } = useContext(IndexContext);
  const attachments = messages[index].attachments;
  const embeds = messages[index].embeds;
  const [autoplay, setAutoplay] = useState(
    localStorage.getItem('autoplay') === 'true' ? true : false
  );
  const { queueRef } = useContext(QueueContext);

  useEffect(() => {
    const localIndex = localStorage.getItem('video_index');
    if (!localIndex) {
      localStorage.setItem('video_index', index);
    } else {
      if (+localIndex > messages.length - 1 || +localIndex < 0) return;
      setIndex(+localIndex);
      queueRef?.current?.scrollToIndex({
        index: +localIndex,
      });
    }
  }, [queueRef]);

  const changeMedia = (direction) => {
    if (direction === 'forward') {
      setIndex((i) => {
        localStorage.setItem('video_index', i + 1);
        queueRef?.current?.scrollToIndex({
          index: i + 1,
        });
        return i + 1;
      });
    } else {
      setIndex((i) => {
        localStorage.setItem('video_index', i - 1);
        queueRef?.current?.scrollToIndex({
          index: i - 1,
        });
        return i - 1;
      });
    }
  };

  return (
    <Wrapper>
      <VideoContainer>
        {attachments.length > 0 && (
          <NativePlayer
            autoplay={autoplay}
            url={attachments[0].url}
            key={messages[index].id}
            length={messages.length}
          />
        )}
        {embeds.length > 0 &&
          embeds[0].url.startsWith('https://cdn.discordapp.com/attachments/') && (
            <NativePlayer
              autoplay={autoplay}
              url={embeds[0].url}
              key={messages[index].id}
              length={messages.length}
            />
          )}
        {embeds.length > 0 && embeds[0].url.startsWith('https://i.nuuls.com/') && (
          <NativePlayer
            autoplay={autoplay}
            url={embeds[0].url}
            key={messages[index].id}
            length={messages.length}
          />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'Imgur' && (
          <NativePlayer
            autoplay={autoplay}
            url={embeds[0].video.proxy_url}
            key={messages[index].id}
            length={messages.length}
          />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'Streamable' && (
          <StreamablePlayer url={embeds[0].url} />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'Twitch' && (
          <TwitchPlayer url={embeds[0].video.url} />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'TikTok' && (
          <TiktokPlayer url={embeds[0].url} />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'YouTube' && (
          <YoutubePlayer url={embeds[0].video.url} />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'Tenor' && (
          <NativePlayer
            autoplay={autoplay}
            url={embeds[0].video.url}
            key={messages[index].id}
            length={messages.length}
          />
        )}
        <BottomPlayer>
          <Description>
            <Title>
              {embeds.length > 0 && embeds[0].title
                ? embeds[0].title
                : embeds.length > 0
                ? 'Untitled'
                : ''}
              {attachments.length > 0 && attachments[0].filename}
            </Title>
            <Request>
              requested by {messages[index].author.username} on{' '}
              {formatDate(messages[index].timestamp)}
            </Request>
          </Description>
          <Controls>
            <Tooltip
              label='Autoplay is currently working only for native player'
              multiline
              color='red'
              withArrow
              transitionProps={{ transition: 'pop', duration: 300 }}
            >
              <IconHelpCircleFilled />
            </Tooltip>
            <Switch
              label='Autoplay'
              labelPosition='left'
              size='md'
              style={{ cursor: 'pointer' }}
              defaultChecked={autoplay}
              onChange={() => {
                setAutoplay((prev) => {
                  localStorage.setItem('autoplay', !prev);
                  return !prev;
                });
              }}
            />
            <ActionIcon
              disabled={index === 0}
              variant='filled'
              color='#1971c2'
              size='xl'
              radius='xl'
              onClick={() => changeMedia('back')}
            >
              <IconPlayerSkipBackFilled />
            </ActionIcon>
            <ActionIcon
              disabled={index === messages.length - 1}
              variant='filled'
              color='#1971c2'
              size='xl'
              radius='xl'
              onClick={() => changeMedia('forward')}
            >
              <IconPlayerSkipForwardFilled />
            </ActionIcon>
          </Controls>
        </BottomPlayer>
      </VideoContainer>
      <Queue messages={messages} />
    </Wrapper>
  );
};

export default Player;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
const VideoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const BottomPlayer = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;
  font-weight: bold;
  font-size: 1.25rem;
  justify-content: space-between;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
const Description = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const Request = styled.div`
  font-size: 0.75rem;
  color: #6a6f76;
  font-weight: 600;
`;
