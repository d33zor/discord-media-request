import { useCallback, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IndexContext } from '../contexts/IndexContext';
import { QueueContext } from '../contexts/QueueContext';

const NativePlayer = ({ url, autoplay, length }) => {
  const video = useRef();
  const { setIndex } = useContext(IndexContext);
  const { queueRef } = useContext(QueueContext);

  useEffect(() => {
    video.current.volume = localStorage.getItem('volume') || 1;
    video.current.muted = localStorage.getItem('volume_muted') === 'true' || false;

    video.current.addEventListener('volumechange', () => {
      localStorage.setItem('volume', video.current.volume);
      localStorage.setItem('volume_muted', video.current.muted);
    });
  }, [video]);

  const listener = useCallback(() => {
    setIndex((i) => {
      if (i !== length - 1) {
        localStorage.setItem('video_index', i + 1);
        queueRef?.current?.scrollToIndex({
          index: i + 1,
        });
        return i + 1;
      } else return i;
    });
  }, [setIndex]);

  useEffect(() => {
    if (autoplay) {
      video.current.addEventListener('ended', listener, true);
    } else {
      video.current.removeEventListener('ended', listener, true);
    }
  }, [autoplay]);

  return (
    <Wrapper>
      <video
        ref={video}
        width='100%'
        height='100%'
        controls
        autoPlay
        style={{ position: 'absolute' }}
      >
        <source src={url} type='video/mp4' />
      </video>
    </Wrapper>
  );
};

export default NativePlayer;

const Wrapper = styled.div`
  flex: 1;
  position: relative;
`;
