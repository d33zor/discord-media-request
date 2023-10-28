import styled from 'styled-components';
import { ActionIcon, Alert, Button, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
  IconCoin,
  IconBrandDiscordFilled,
  IconAlertTriangleFilled,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GetStartedPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { token: '', channel: '' },
    validate: {
      token: (value) => (value.length === 0 ? 'Token cannot be empty' : null),
      channel: (value) =>
        value.length === 0
          ? 'Channel ID cannot be empty'
          : !Number.isInteger(Number(value))
          ? 'Channel ID has to be an integer'
          : null,
    },
  });

  const submit = () => {
    localStorage.setItem(
      'api_data',
      JSON.stringify({
        token: form.values.token.replaceAll('"', ''),
        channel: form.values.channel,
      })
    );
    navigate('/queue');
  };

  return (
    <Wrapper
      as={motion.div}
      initial={{ opacity: 0, y: '10px' }}
      animate={{ opacity: 1, y: '0' }}
      key='get-started'
    >
      <Link to='/'>
        <ActionIcon variant='subtle' radius='xl' size='xl' aria-label='Go back'>
          <IconArrowLeft />
        </ActionIcon>
      </Link>
      <StepInfo>To get started please paste your Discord token.</StepInfo>
      <SecurityInfo>
        <Alert
          icon={<IconAlertTriangleFilled size='1rem' />}
          variant='light'
          color='orange'
          radius='md'
        >
          You have to be logged in to your Discord account in browser in order to make this app
          work. You can safely paste your Discord token here, because we do not store any data from
          you. If you still do not want to paste your main account token, you can always create
          another Discord account, join your server, and paste the token here.
        </Alert>
      </SecurityInfo>
      <Form onSubmit={form.onSubmit(submit)}>
        <InputWrapper>
          <TextInput
            placeholder='My Discord token'
            type='password'
            icon={<IconCoin size='1.25rem' />}
            {...form.getInputProps('token')}
          />

          <LinkToVideo
            href='https://youtu.be/LnBnm_tZlyU'
            target='_blank'
            rel='noopener noreferrer'
          >
            (how do i get it?)
          </LinkToVideo>
        </InputWrapper>
        <StepInfo>Then paste the ID of a channel to get media request from.</StepInfo>

        <InputWrapper>
          <TextInput
            placeholder='Channel ID'
            icon={<IconBrandDiscordFilled size='1.25rem' />}
            {...form.getInputProps('channel')}
          />
          <LinkToVideo
            href='https://youtu.be/YjiQ7CajAgg?t=26'
            target='_blank'
            rel='noopener noreferrer'
          >
            (how do i get it?)
          </LinkToVideo>
        </InputWrapper>
        <Button style={{ width: '6rem' }} type='submit' aria-label='Submit'>
          Submit
        </Button>
      </Form>
    </Wrapper>
  );
};

export default GetStartedPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SecurityInfo = styled.div`
  display: flex;
  gap: 1rem;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const StepInfo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const LinkToVideo = styled.a`
  text-decoration: none;
`;
