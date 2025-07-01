import React from 'react';
import { Table, Button, Tag, Space, Typography, Card, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getCertificationRequests } from '../api/certificationsApi';
import CertificationRequestForm from '../components/forms/CertificationRequestForm';
import dayjs from 'dayjs';

const { Title } = Typography;

const EmployeeRequestPage = () => {
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const result = await getCertificationRequests();
            if (result.success) {
                setRequests(result.data);
            } else {
                message.error(result.error);
            }
        } catch (error) {
            message.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRequests();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            'Draft': 'default',
            'Submitted for Approval': 'processing',
            'Approved': 'success',
            'Rejected': 'error'
        };
        return colors[status] || 'default';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (text) => (
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            width: '15%',
            render: (budget) => formatCurrency(budget),
            sorter: (a, b) => a.budget - b.budget,
        },
        {
            title: 'Expected Date',
            dataIndex: 'expectedDate',
            key: 'expectedDate',
            width: '15%',
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
            sorter: (a, b) => dayjs(a.expectedDate).unix() - dayjs(b.expectedDate).unix(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status}
                </Tag>
            ),
            filters: [
                { text: 'Draft', value: 'Draft' },
                { text: 'Submitted for Approval', value: 'Submitted for Approval' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
            render: (date) => dayjs(date).format('MMM DD'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
    ];

    const handleModalSuccess = () => {
        fetchRequests();
    };

    return (
        <div className="p-6">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <Title level={2} className="mb-0">
                        My Requests
                    </Title>
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchRequests}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setModalVisible(true)}
                        >
                            New Request
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={requests}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} requests`,
                    }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            <CertificationRequestForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
};

export default EmployeeRequestPage;