import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandDiscordFilled } from '@tabler/icons-react';
import styled from 'styled-components';

const ChannelForm = () => {
  const changeChannel = () => {
    const data = JSON.parse(localStorage.getItem('api_data'));
    data.channel = form.values.channel;
    localStorage.setItem('api_data', JSON.stringify(data));
    localStorage.removeItem('video_index');
    location.reload();
  };

  const form = useForm({
    initialValues: { channel: '' },
    validate: {
      channel: (value) =>
        value.length === 0
          ? 'Channel ID cannot be empty'
          : !Number.isInteger(Number(value))
          ? 'Channel ID has to be an integer'
          : null,
    },
  });

  return (
    <Form onSubmit={form.onSubmit(changeChannel)}>
      <TextInput
        style={{ width: '100%' }}
        placeholder='Channel ID'
        icon={<IconBrandDiscordFilled size='1.25rem' />}
        {...form.getInputProps('channel')}
      />
      <Button type='submit'>Go</Button>
    </Form>
  );
};

export default ChannelForm;

const Form = styled.form`
  display: flex;
  gap: 1rem;
`;
