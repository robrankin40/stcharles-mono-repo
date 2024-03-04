import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useDeleteUserMutation, useListUsersQuery } from '../store/api/usersApi';
import { AddUserModal } from '../components/AddUserModal';
import { logout } from '../store/authSlice';

function UserListPage() {
  const dispatch = useDispatch();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const { isSuccess, data = [] } = useListUsersQuery()
  const [deleteUser] = useDeleteUserMutation();
  const onRemoveItem = (userId) => {
    deleteUser(userId)
  }
  const handleLogout = () => {
    dispatch(logout());
  }
  const TABLE_COLUMNS = [
    {
      label: 'Name',
      renderCell: (item) => `${item.firstName} ${item.lastName}`,
    },
    {
      label: 'Email',
      renderCell: (item) => `${item.email}`,
    },
    {
      label: 'Invite Code',
      renderCell: item => item.inviteCode
    },
    {
      label: 'Status',
      renderCell: item => item.status,
    },
    { label: 'Action', renderCell: item => <button onClick={() => onRemoveItem(item._id)}>Remove</button> }
  ]
  return (
    <div className="user-list">
      <h4>User List</h4>
      <button onClick={() => setShowAddUserModal(true)}>Add New User</button>
      <AddUserModal
        isVisible={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
      />
      {isSuccess && <CompactTable
        columns={TABLE_COLUMNS}
        data={{nodes: data ?? []}}
      />}
      <button className="sign-out" onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default UserListPage;
