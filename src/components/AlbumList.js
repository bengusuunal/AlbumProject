import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Tooltip, Modal, Input, Card, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getAlbums, getAlbumPhotos } from '../api/api';

import { setAlbums, setLoading, setError } from '../store/albumSlice';
import { updateAlbum, deleteAlbum } from '../api/api';

const StyledContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height:40vh;

  .ant-table {
    background-color: ${({ theme }) => theme.tableBackground};
    color: ${({ theme }) => theme.text};
  }

  .ant-table-thead > tr > th {
    background-color: ${({ theme }) => theme.tableHeader};
    color: ${({ theme }) => theme.tableHeaderText};
  }

  .ant-table-tbody > tr:hover {
    background-color: ${({ theme }) => theme.tableRowHover};
  }
`;

const ActionButton = styled(Button)`
  margin: 0 10px;
  color: ${({ theme, type }) => (type === 'danger' ? theme.text : theme.text)};
  background-color: ${({ theme, type }) =>
          type === 'primary' ? theme.primary :
                  type === 'default' ? theme.default :
                          type === 'danger' ? theme.danger :
                                  theme.background};
  border: ${({ theme, type }) => (type === 'danger' ? `1px solid ${theme.danger}` : 'none')};
`;

const AlbumList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.albums);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal görünürlüğü için state
    const [selectedAlbum, setSelectedAlbum] = useState(null); // Seçilen albüm bilgisi için state
    const [newTitle, setNewTitle] = useState(''); // Yeni başlık için state
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Düzenleme modal'ı görünürlük
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState(null);
    const [photos, setPhotos] = useState([]); // Albüm fotoğrafları için state


    useEffect(() => {
        const fetchAlbums = async () => {
            dispatch(setLoading(true));
            try {
                const data = await getAlbums();
                dispatch(setAlbums(data)); // Redux'a albümleri kaydet
            } catch (err) {
                dispatch(setError(err.message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchAlbums();
    }, [dispatch]);

    const handleView = async (id) => {
        const album = list.find((album) => album.id === id);
        setSelectedAlbum(album);
        setIsModalVisible(true);


        try {
            const data = await getAlbumPhotos(id);
            setPhotos(data);

            const recentAlbums = JSON.parse(localStorage.getItem('recentAlbums')) || [];

            const newAlbumData = { album, photos: data };
            recentAlbums.unshift(newAlbumData);

            if (recentAlbums.length > 5) {
                recentAlbums.pop();
            }

            localStorage.setItem('recentAlbums', JSON.stringify(recentAlbums));
            console.log('last 5 ', localStorage.getItem('recentAlbums'))

        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleEdit = (id) => {
        const album = list.find((album) => album.id === id);
        setSelectedAlbum(album);
        setNewTitle(album.title);
        setIsEditModalVisible(true);
    };
    const handleDelete = (id) => {
        setAlbumToDelete(id);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteAlbum(albumToDelete);
            dispatch(setAlbums(list.filter((album) => album.id !== albumToDelete)));
            console.log('Album deleted:', albumToDelete);
        } catch (err) {
            console.error('error delete album:', err);
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        localStorage.getItem('recentAlbums')
    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalVisible(false);
    };

    const handleSaveEdit = async () => {
        try {

            const updatedAlbum = await updateAlbum(selectedAlbum.id, { title: newTitle });

            dispatch(setAlbums(list.map((album) => (album.id === selectedAlbum.id ? updatedAlbum : album))));
            setIsEditModalVisible(false);
        } catch (err) {
            console.error("Error:", err);
        }
    };
    const StyledCard = styled(Card)`
      max-height: 250px; 
      min-height: 250px;
      margin-bottom: 16px;
      background-color: ${({ theme }) => theme.tableBackground}; /* Tema bazlı arka plan */
      color: ${({ theme }) => theme.text}; /* Tema bazlı yazı rengi */
      border: 1px solid ${({ theme }) => theme.default} /* Tema bazlı border rengi *
    `;
    const StyledModal = styled(Modal)`
      .ant-modal-content {
        background-color: ${({ theme }) => theme.tableBackground};
        color: ${({ theme }) => theme.text};
      }
    
      .ant-modal-header {
        background-color: transparent;
        color: ${({ theme }) => theme.text};
      }
    
      .ant-modal-footer {
        background-color: ${({ theme }) => theme.tableBackground};
      }
    
      .ant-btn-primary {
        background-color: ${({ theme }) => theme.primary};
        border-color: ${({ theme }) => theme.primary};
      }
    
      .ant-btn-danger {
        background-color: ${({ theme }) => theme.danger};
        border-color: ${({ theme }) => theme.danger};
      }
    `;


    const modalContent = selectedAlbum ? (
        <div>
            <p><strong>Album {selectedAlbum.id} </strong> </p>
            <p><strong>Title:</strong> {selectedAlbum.title}</p>
            <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Photos</h2>

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                {photos.map((photo) => (
                    <Col key={photo.id} xs={24} sm={12} md={8} lg={6}>
                        <StyledCard
                            hoverable
                            cover={<img alt={photo.title} src={photo.thumbnailUrl} />}
                        >
                            <Card.Meta title={photo.title} description={photo.url} />
                        </StyledCard>
                    </Col>
                ))}
            </Row>
        </div>
    ) : (
        <p>Loading..</p>
    );

    const columns = [
        {
            title: 'Album',
            dataIndex: 'id',
            key: 'id',
            render: (_, record) => `Album ${record.id}`,
        },
        {
            title: 'Album Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Tooltip title="Detail">
                        <ActionButton
                            icon={<EyeOutlined />}
                            type="primary"
                            onClick={() => handleView(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <ActionButton
                            icon={<EditOutlined />}
                            type="default"
                            onClick={() => handleEdit(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <ActionButton
                            icon={<DeleteOutlined />}
                            type="danger"
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    if (error) return <p>Error: {error}</p>;

    return (
        <StyledContainer>
            <Table
                columns={columns}
                dataSource={list}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowKey="id"
            />


            <StyledModal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
                width={1000}
            >
                {modalContent}
            </StyledModal>


            <StyledModal
                title="Edit Album"
                visible={isEditModalVisible}
                onCancel={handleCloseEditModal}
                onOk={handleSaveEdit}
                okText="Save"
                cancelText="Cancel"
            >
                <div>
                    <p><strong>ID:</strong> {selectedAlbum?.id}</p>
                    <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter a new title"
                    />
                </div>
            </StyledModal>


            <StyledModal
                title="Delete Confirmation"
                visible={isDeleteModalVisible}
                onCancel={handleCloseDeleteModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseDeleteModal}>
                        No
                    </Button>,
                    <Button key="delete" type="danger" onClick={confirmDelete}>
                        Yes
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete this album?</p>
            </StyledModal>
        </StyledContainer>
    );
};

export default AlbumList;
