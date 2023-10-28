/* eslint-disable react/prop-types */
import { lazy, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IndexContext } from '../contexts/IndexContext';
import { NativePlayer, TwitchPlayer, StreamablePlayer, TiktokPlayer } from './Players';
import { Modal, Button, ActionIcon } from '@mantine/core';
import { IconLayoutSidebarRightCollapse } from '@tabler/icons-react';
const Controls = lazy(() => import('./Controls'));
const Queue = lazy(() => import('./Queue'));
import { QueueContext } from '../contexts/QueueContext';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import ChannelForm from './ChannelForm';

const Player = ({ messages }) => {
  const { index, setIndex } = useContext(IndexContext);
  const attachments = messages[index]?.attachments;
  const embeds = messages[index]?.embeds;
  const [autoplay, setAutoplay] = useState(
    localStorage.getItem('autoplay') === 'true' ? true : false
  );
  const { queueRef } = useContext(QueueContext);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [queueVisible, setQueueVisible] = useState(true);

  useEffect(() => {
    if (queueRef?.current) {
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
    }
  }, [queueRef]);

  const leaveChannel = () => {
    localStorage.removeItem('api_data');
    localStorage.removeItem('video_index');
    navigate('/');
  };

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    localStorage.setItem('video_index', index);
  }, [index]);

  const changeMedia = (direction) => {
    if (direction === 'forward') {
      setIndex((i) => {
        if (i !== messages.length - 1) {
          queueRef?.current?.scrollToIndex({
            index: i + 1,
          });
          return i + 1;
        } else return i;
      });
    } else {
      setIndex((i) => {
        queueRef?.current?.scrollToIndex({
          index: i - 1,
        });
        return i - 1;
      });
    }
  };

  return (
    <Wrapper>
      {/* modal */}
      <Modal.Root opened={opened} onClose={close} centered>
        <ModalContentWrapper>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>Change channel</Modal.Title>
              <Modal.CloseButton variant='subtle' />
            </Modal.Header>
            <Modal.Body>
              <LeaveChannelWrapper>
                <ChannelForm />
                <div>Leave this channel</div>
                <Button onClick={leaveChannel} variant='filled' color='red'>
                  Leave
                </Button>
              </LeaveChannelWrapper>
            </Modal.Body>
          </Modal.Content>
        </ModalContentWrapper>
      </Modal.Root>

      {/* player */}
      <VideoContainer $queueVisible={queueVisible}>
        {attachments.length > 0 && (
          <NativePlayer
            autoplay={autoplay}
            url={attachments[0].url}
            key={messages[index].id}
            length={messages.length}
          />
        )}
        {embeds.length > 0 &&
          embeds[0]?.type === 'video' &&
          embeds[0]?.provider?.name !== 'Streamable' &&
          embeds[0]?.provider?.name !== 'TikTok' &&
          embeds[0]?.provider?.name !== 'YouTube' &&
          embeds[0]?.provider?.name !== 'Imgur' &&
          embeds[0]?.provider?.name !== 'Twitch' && (
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
          <StreamablePlayer
            changeMedia={changeMedia}
            url={embeds[0].url}
            key={messages[index].id}
          />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'Twitch' && (
          <TwitchPlayer key={messages[index].id} url={embeds[0].video.url} autoplay={autoplay} />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'TikTok' && (
          <TiktokPlayer key={messages[index].id} url={embeds[0].url} length={messages.length} />
        )}
        {embeds.length > 0 && embeds[0]?.provider?.name === 'YouTube' && (
          <ReactPlayerWrapper>
            <ReactPlayer
              key={messages[index].id}
              width='100%'
              height='100%'
              url={embeds[0].url}
              onEnded={() => autoplay && changeMedia('forward')}
              style={{ position: 'absolute', top: 0, left: 0 }}
              playing={true}
              controls={true}
              volume={+localStorage.getItem('volume') || 1}
            />
          </ReactPlayerWrapper>
        )}

        {/* controls */}
        <Controls
          messages={messages}
          index={index}
          autoplay={autoplay}
          changeMedia={changeMedia}
          setAutoplay={setAutoplay}
          open={open}
          queueVisible={queueVisible}
        />
      </VideoContainer>

      {/* collapse queue button */}
      <ActionIcon
        variant='subtle'
        radius='xl'
        size='xl'
        onClick={() => setQueueVisible((prev) => !prev)}
        aria-label='Collapse queue'
        style={{
          position: 'absolute',
          right: '1rem',
          top: '1rem',
          zIndex: 5,
        }}
      >
        {queueVisible ? <IconLayoutSidebarRightCollapse /> : <IconLayoutSidebarLeftCollapse />}
      </ActionIcon>

      {/* queue */}
      <Queue messages={messages} queueVisible={queueVisible} />
    </Wrapper>
  );
};

export default Player;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;
const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ $queueVisible }) => ($queueVisible ? 'calc(100% - 27rem)' : 'calc(100% - 9.75rem)')};
`;

const ReactPlayerWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LeaveChannelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
