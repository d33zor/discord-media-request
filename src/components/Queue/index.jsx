import styled from 'styled-components';
import Request from './Request';
import { ViewportList } from 'react-viewport-list';
import { useContext, useEffect, useRef } from 'react';
import { IndexContext } from '../../contexts/IndexContext';
import { QueueContext } from '../../contexts/QueueContext';

const Queue = ({ messages, queueVisible }) => {
  const { index } = useContext(IndexContext);
  const { setQueueRef } = useContext(QueueContext);
  const ref = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setQueueRef(listRef);
  }, []);

  return (
    <Wrapper>
      <Title $queueVisible={queueVisible}>
        {queueVisible && (
          <>
            Queue ({index + 1}/{messages.length})
          </>
        )}
      </Title>
      <QueueWrapper $queueVisible={queueVisible} ref={ref}>
        <RequestsWrapper>
          <ViewportList items={messages} viewportRef={ref} ref={listRef}>
            {(item, msgIndex) => (
              <Request
                key={item.id}
                message={item}
                msgIndex={msgIndex}
                queueVisible={queueVisible}
              />
            )}
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
  padding: 1rem 0.5rem 1rem 1rem;
`;

const QueueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ $queueVisible }) => ($queueVisible ? '25rem' : '8.25rem')};
  overflow-y: scroll;
  gap: 1rem;
  scroll-behavior: smooth;
  margin-top: ${({ $queueVisible }) => ($queueVisible ? '0' : '2rem')};

  &::-webkit-scrollbar {
    width: ${({ $queueVisible }) => ($queueVisible ? '7px' : '5px')};
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #6a6f76;
  }
`;
const Title = styled.div`
  padding-bottom: 1rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;
const RequestsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-right: 0.5rem;
`;
