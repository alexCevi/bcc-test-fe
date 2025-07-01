import React, { useState, useEffect, useMemo } from 'react';
import {
    Card,
    Typography,
    Badge,
    Space,
    Button,
    Table,
    Tag,
    Select,
    Input,
    Modal,
    message,
    Slider,
    Dropdown
} from 'antd';
import {
    FilterOutlined,
    SortAscendingOutlined,
    EditOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const mockRequests = [
    {
        id: 1,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        description: 'AWS Solutions Architect Certification',
        budget: 2500,
        expectedDate: '2024-03-15',
        status: 'DRAFT',
        createdDate: '2024-01-10',
        submittedDate: null
    },
    {
        id: 2,
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        description: 'Google Cloud Professional Data Engineer',
        budget: 3200,
        expectedDate: '2024-04-20',
        status: 'SUBMITTED',
        createdDate: '2024-01-15',
        submittedDate: '2024-01-20'
    },
    {
        id: 3,
        employeeName: 'Mike Davis',
        employeeId: 'EMP003',
        description: 'Kubernetes Certification (CKA)',
        budget: 1800,
        expectedDate: '2024-05-10',
        status: 'APPROVED',
        createdDate: '2024-01-05',
        submittedDate: '2024-01-10'
    },
    {
        id: 4,
        employeeName: 'Lisa Wong',
        employeeId: 'EMP004',
        description: 'Microsoft Azure DevOps Engineer',
        budget: 4500,
        expectedDate: '2024-06-15',
        status: 'REJECTED',
        createdDate: '2024-01-12',
        submittedDate: '2024-01-18'
    },
    {
        id: 5,
        employeeName: 'David Brown',
        employeeId: 'EMP005',
        description: 'Docker Certified Associate',
        budget: 1200,
        expectedDate: '2024-03-30',
        status: 'SUBMITTED',
        createdDate: '2024-01-20',
        submittedDate: '2024-01-25'
    }
];

const RequestStatusCard = ({ status, count, icon, color }) => (
    <Card className="h-full">
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <Text className="text-sm font-medium text-gray-600">{status}</Text>
                </div>
                <div className="text-2xl font-bold" style={{ color }}>{count}</div>
            </div>
        </div>
    </Card>
);



const getStatusColor = (status) => {
    const colors = {
        'DRAFT': 'default',
        'SUBMITTED': 'processing',
        'APPROVED': 'success',
        'REJECTED': 'error'
    };
    return colors[status] || 'default';
};



const RequestTable = ({ requests, onStatusUpdate, onViewDetails }) => {

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employeeName',
            key: 'employeeName',
            sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
            render: (name, record) => (
                <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{record.employeeId}</div>
                </div>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            sorter: (a, b) => a.budget - b.budget,
            render: (budget) => `$${budget.toLocaleString()}`
        },
        {
            title: 'Expected Date',
            dataIndex: 'expectedDate',
            key: 'expectedDate',
            sorter: (a, b) => dayjs(a.expectedDate).unix() - dayjs(b.expectedDate).unix(),
            render: (date) => dayjs(date).format('MMM DD, YYYY')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.replace('_', ' ')}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <Space direction="vertical" size="small" className="w-full">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => onViewDetails(record)}
                        className="w-full"
                    >
                        View Details
                    </Button>
                    <Dropdown
                        menu={{
                            items: [
                                { key: 'SUBMITTED', label: 'Submit for Approval', icon: <ClockCircleOutlined /> },
                                { key: 'APPROVED', label: 'Approve', icon: <CheckCircleOutlined /> },
                                { key: 'REJECTED', label: 'Reject', icon: <CloseCircleOutlined /> },
                                { key: 'DRAFT', label: 'Move to Draft', icon: <FileTextOutlined /> }
                            ].filter(item => item.key !== record.status).map(item => ({
                                ...item,
                                onClick: () => {
                                    Modal.confirm({
                                        title: 'Update Request Status',
                                        content: `Are you sure you want to change the status to ${item.label}?`,
                                        onOk: () => onStatusUpdate(record.id, item.key)
                                    });
                                }
                            }))
                        }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="default"
                            size="small"
                            icon={<EditOutlined />}
                            className="w-full"
                        >
                            Change Status
                        </Button>
                    </Dropdown>
                </Space>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={requests}
            rowKey="id"
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`
            }}
        />
    );
};

const SupervisorRequestsPage = () => {
    const [requests, setRequests] = useState(mockRequests);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        employeeName: '',
        status: 'ALL',
        budgetRange: [0, 10000],
        dateRange: null
    });
    const [sortBy, setSortBy] = useState('expectedDate');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    // Load requests on component mount
    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            setRequests(mockRequests);
        } catch (error) {
            message.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            setRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            ));
            message.success(`Request status updated to ${newStatus}`);
        } catch (error) {
            message.error('Failed to update request status');
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setDetailModalVisible(true);
    };

    // Handle status filter change
    const handleStatusFilterChange = (status) => {
        setFilters(prev => ({ ...prev, status }));
    };

    // Reset all filters
    const handleClearFilters = () => {
        setFilters({
            employeeName: '',
            status: 'ALL',
            budgetRange: [0, 10000],
            dateRange: null
        });
    };

    // Filter and sort requests
    const filteredAndSortedRequests = useMemo(() => {
        let filtered = requests.filter(request => {
            const matchesName = !filters.employeeName ||
                request.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase());

            // For status filtering:
            // - If "ALL" is selected, show all requests
            // - If specific status is selected, filter by that status
            const matchesStatus = filters.status === 'ALL' || request.status === filters.status;

            const matchesBudget = request.budget >= filters.budgetRange[0] &&
                request.budget <= filters.budgetRange[1];
            const matchesDate = !filters.dateRange || (
                dayjs(request.expectedDate).isAfter(filters.dateRange[0]) &&
                dayjs(request.expectedDate).isBefore(filters.dateRange[1])
            );

            return matchesName && matchesStatus && matchesBudget && matchesDate;
        });

        // Sort requests
        filtered.sort((a, b) => {
            let aValue, bValue;

            if (sortBy === 'expectedDate') {
                aValue = dayjs(a.expectedDate).unix();
                bValue = dayjs(b.expectedDate).unix();
            } else if (sortBy === 'budget') {
                aValue = a.budget;
                bValue = b.budget;
            } else if (sortBy === 'employeeName') {
                aValue = a.employeeName.toLowerCase();
                bValue = b.employeeName.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [requests, filters, sortBy, sortOrder]);

    // Calculate status counts for summary cards
    const statusCounts = useMemo(() => {
        const counts = {
            DRAFT: 0,
            SUBMITTED: 0,
            APPROVED: 0,
            REJECTED: 0
        };

        filteredAndSortedRequests.forEach(request => {
            if (counts.hasOwnProperty(request.status)) {
                counts[request.status]++;
            }
        });

        return counts;
    }, [filteredAndSortedRequests]);



    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <Title level={2}>Certification Requests Management</Title>
                <Text className="text-gray-600">
                    Review and manage employee certification requests
                </Text>
            </div>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <RequestStatusCard
                    status="Draft"
                    count={statusCounts.DRAFT}
                    icon={<FileTextOutlined style={{ color: '#8c8c8c' }} />}
                    color="#8c8c8c"
                />
                <RequestStatusCard
                    status="Submitted"
                    count={statusCounts.SUBMITTED}
                    icon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                    color="#1890ff"
                />
                <RequestStatusCard
                    status="Approved"
                    count={statusCounts.APPROVED}
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    color="#52c41a"
                />
                <RequestStatusCard
                    status="Rejected"
                    count={statusCounts.REJECTED}
                    icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                    color="#ff4d4f"
                />
            </div>

            {/* Filters and Controls */}
            <Card className="mb-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FilterOutlined />
                            <Text strong>Filters & Sorting</Text>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Text className="block mb-2">Employee Name</Text>
                            <Input
                                placeholder="Search by employee name"
                                prefix={<Search className="w-4 h-4" />}
                                value={filters.employeeName}
                                onChange={(e) => setFilters(prev => ({ ...prev, employeeName: e.target.value }))}
                            />
                        </div>

                        <div>
                            <Text className="block mb-2">Status</Text>
                            <Select
                                style={{ width: '100%' }}
                                value={filters.status}
                                onChange={handleStatusFilterChange}
                                placeholder="Select status filter"
                            >
                                <Option value="ALL">All Statuses</Option>
                                <Option value="DRAFT">Draft</Option>
                                <Option value="SUBMITTED">Submitted</Option>
                                <Option value="APPROVED">Approved</Option>
                                <Option value="REJECTED">Rejected</Option>
                            </Select>
                        </div>

                        <div>
                            <Text className="block mb-2">Budget Range</Text>
                            <Slider
                                range
                                min={0}
                                max={10000}
                                step={100}
                                value={filters.budgetRange}
                                onChange={(value) => setFilters(prev => ({ ...prev, budgetRange: value }))}
                                tooltip={{
                                    formatter: (value) => `$${value}`
                                }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>${filters.budgetRange[0]}</span>
                                <span>${filters.budgetRange[1]}</span>
                            </div>
                        </div>

                        <div>
                            <Text className="block mb-2">Sort By</Text>
                            <Space.Compact style={{ width: '100%' }}>
                                <Select
                                    style={{ width: '70%' }}
                                    value={sortBy}
                                    onChange={setSortBy}
                                >
                                    <Option value="expectedDate">Expected Date</Option>
                                    <Option value="budget">Budget</Option>
                                    <Option value="employeeName">Employee Name</Option>
                                </Select>
                                <Button
                                    style={{ width: '30%' }}
                                    icon={<SortAscendingOutlined />}
                                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </Button>
                            </Space.Compact>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Content */}
            <Card>
                <RequestTable
                    requests={filteredAndSortedRequests}
                    onStatusUpdate={handleStatusUpdate}
                    onViewDetails={handleViewDetails}
                />
            </Card>

            {/* Request Details Modal */}
            <Modal
                title="Request Details"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedRequest && (
                    <div className="space-y-4">
                        <div>
                            <Text strong>Employee:</Text>
                            <div>{selectedRequest.employeeName} ({selectedRequest.employeeId})</div>
                        </div>
                        <div>
                            <Text strong>Description:</Text>
                            <div>{selectedRequest.description}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Text strong>Budget:</Text>
                                <div>${selectedRequest.budget.toLocaleString()}</div>
                            </div>
                            <div>
                                <Text strong>Expected Date:</Text>
                                <div>{dayjs(selectedRequest.expectedDate).format('MMMM DD, YYYY')}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                                                    <div>
                            <Text strong>Status:</Text>
                            <div>
                                <Tag color={getStatusColor(selectedRequest.status)}>
                                    {selectedRequest.status.replace('_', ' ')}
                                </Tag>
                            </div>
                        </div>
                            <div>
                                <Text strong>Created Date:</Text>
                                <div>{dayjs(selectedRequest.createdDate).format('MMMM DD, YYYY')}</div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SupervisorRequestsPage;
