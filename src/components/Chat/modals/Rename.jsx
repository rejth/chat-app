import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import useValidationSchema from '../hooks/useValidationSchema';
import { useChatService } from '../../../hooks/useContext';
import { getAllChannels } from '../../../store/selectors/index.js';

function RenameModal({
  channelId,
  isShow,
  handleClose,
}) {
  const { t } = useTranslation();
  const { socket } = useChatService();
  const channels = useSelector(getAllChannels);
  const schema = useValidationSchema(channels);
  const currentChannel = channels.find((c) => c.id === channelId);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: currentChannel?.name || '',
    },
  });

  React.useEffect(() => setFocus('name'), [setFocus]);

  const onSubmit = ({ name }) => {
    socket.emit('renameChannel', { id: channelId, name });
    handleClose();
  };

  return (
    <Modal
      data-testid="rename-channel-modal"
      show={isShow}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannelModal.title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>{t('modals.renameChannelModal.channelName')}</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              name="name"
              placeholder={t('modals.renameChannelModal.errors.placeholder')}
              {...register('name', schema)}
            />
            <div>{errors.name?.message}</div>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          data-testid="cancel-rename-btn"
          variant="secondary"
          onClick={handleClose}
        >
          {t('modals.renameChannelModal.closeButton')}
        </Button>
        <Button
          data-testid="save-rename-btn"
          type="submit"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
        >
          {t('modals.renameChannelModal.saveButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

RenameModal.propTypes = {
  channelId: PropTypes.number.isRequired,
  isShow: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default RenameModal;
