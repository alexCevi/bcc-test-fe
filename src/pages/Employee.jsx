import React from 'react';
import { Card, Button, Typography, Space, Avatar } from 'antd';
import { UserOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/context';

const { Title, Text } = Typography;

const EmployeePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleViewRequests = () => {
        navigate('/employee/requests');
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <Title level={2} className="mb-6">Employee Dashboard</Title>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Info Card */}
                    <Card>
                        <div className="text-center">
                            <Avatar
                                size={64}
                                icon={<UserOutlined />}
                                className="mb-4"
                            />
                            <Title level={4} className="mb-2">Welcome back!</Title>
                            {user && (
                                <div className="space-y-2">
                                    <Text strong>Email: </Text>
                                    <Text>{user.email || user.emailAddress || 'N/A'}</Text>
                                    <br />
                                    <Text strong>Role: </Text>
                                    <Text className="capitalize">{user.role?.toLowerCase() || 'Employee'}</Text>
                                    <br />
                                    <Text strong>Status: </Text>
                                    <Text type="success">Active</Text>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card title="Quick Actions">
                        <Space direction="vertical" className="w-full">
                            <Button
                                type="primary"
                                icon={<FileTextOutlined />}
                                size="large"
                                className="w-full"
                                onClick={handleViewRequests}
                            >
                                View My Requests
                            </Button>
                            <Button
                                type="default"
                                icon={<LogoutOutlined />}
                                size="large"
                                className="w-full"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Space>
                    </Card>
                </div>

                {/* Demo Info */}
                <Card className="mt-6">
                    <Title level={5}>Routing Assessment Outline</Title>
                    <div className="space-y-2">
                        <Text>Current route: <Text code>/employee</Text></Text>
                        <Text>Next route when clicking button: <Text code>/employee/requests</Text></Text>
                        <Text>User role: <Text code>{user?.role || 'EMPLOYEE'}</Text></Text>
                        <Text>Navigation method: <Text code>useNavigate()</Text> from react-router-dom</Text>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EmployeePage;