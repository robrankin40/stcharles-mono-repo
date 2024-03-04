import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useForm } from "react-hook-form";
import { useCreateUserMutation } from '../store/api/usersApi';
import { generateInviteCode } from '../utils';

export const AddUserModal = ({ isVisible, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    setValue,
  } = useForm()
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [error, setError] = useState();
  const onSubmit = async (data) => {
    try {
      createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        inviteCode: data.inviteCode,
      })
      reset();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    if (isVisible) {
      const inviteCode = generateInviteCode()
      setValue('inviteCode', inviteCode)
    } else {
      reset();
    }
  }, [isVisible, reset, setValue])
  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      contentLabel="Add New User"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      ariaHideApp={false}
    >
      <form className="new-user-form" onSubmit={handleSubmit(onSubmit)}>
        <label>First Name</label>
        <input type="text" {...register('firstName', {required: true, minLength: 2})} />
        {errors.firstName && <span className="error">Please check first name again</span>}
        <label>Last Name</label>
        <input type="text" {...register('lastName', {required: true, minLength: 2})} />
        {errors.lastName && <span className="error">Please check last name again</span>}
        <label>Email</label>
        <input type="text" {...register('email', {required: true, minLength: 2})} />
        {errors.email && <span className="error">Please check email again</span>}
        <label>Invite Code</label>
        <input type="text" {...register('inviteCode', {required: true, minLength: 2})} />
        {errors.inviteCode && <span className="error">Please check invite code again</span>}
        {error && <span className="error">{error}</span>}
        <input type="submit" disabled={isLoading} />
      </form>
    </Modal>
  )
}