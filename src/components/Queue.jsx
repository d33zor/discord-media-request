import styled from 'styled-components';
import Request from './Request';
import { ViewportList } from 'react-viewport-list';
import { useContext, useEffect, useRef } from 'react';
import { IndexContext } from '../contexts/IndexContext';
import { QueueContext } from '../contexts/QueueContext';

const Queue = ({ messages }) => {
  const { index } = useContext(IndexContext);
  const { setQueueRef } = useContext(QueueContext);
  const ref = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setQueueRef(listRef);
  }, []);

  return (
    <Wrapper>
      <Title>
        Queue ({index + 1}/{messages.length})
      </Title>
      <QueueWrapper ref={ref}>
        <RequestsWrapper>
          <ViewportList items={messages} viewportRef={ref} ref={listRef}>
            {(item, msgIndex) => <Request key={item.id} message={item} msgIndex={msgIndex} />}
          </ViewportList>
        </RequestsWrapper>
      </QueueWrapper>
    </Wrapper>
  );
};

export default Queue;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const QueueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 30rem;
  padding: 0 1rem 1rem 1rem;
  overflow-y: scroll;
  gap: 1rem;
  scroll-behavior: smooth;
`;
const Title = styled.div`
  padding: 1rem;
  font-size: 1.5rem;
`;
const RequestsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
