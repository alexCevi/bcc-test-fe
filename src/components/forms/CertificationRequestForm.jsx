import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, message } from 'antd';
import { createCertificationRequest } from '../../api/certificationsApi';
import dayjs from 'dayjs';

const { TextArea } = Input;

const CertificationRequestForm = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const requestData = {
                description: values.description,
                budget: values.budget,
                expectedDate: values.expectedDate.format('YYYY-MM-DD')
            };

            const result = await createCertificationRequest(requestData);

            if (result.success) {
                message.success('Certification request created successfully!');
                form.resetFields();
                onSuccess();
                onCancel();
            } else {
                message.error(result.error);
            }
        } catch (error) {
            message.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const handleClear = () => {
        form.resetFields();
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <Modal
            title="New Certification Request"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                validateTrigger="onSubmit"
            >
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: 'Please provide a description' },
                        { min: 10, message: 'Description must be at least 10 characters' }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Explain the certification and its relevance..."
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item
                    label="Estimated Budget"
                    name="budget"
                    rules={[
                        { required: true, message: 'Please enter the estimated budget' },
                        { type: 'number', min: 0.01, message: 'Budget must be greater than 0' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        placeholder="0.00"
                        precision={2}
                        min={0.01}
                    />
                </Form.Item>

                <Form.Item
                    label="Expected Date"
                    name="expectedDate"
                    rules={[
                        { required: true, message: 'Please select an expected date' }
                    ]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                        placeholder="Select expected completion date"
                        format="YYYY-MM-DD"
                    />
                </Form.Item>

                <Form.Item className="mb-0">
                    <div className="flex justify-between gap-2">
                        <div className="flex gap-2">
                            <Button onClick={() => form.resetFields()}>
                                Reset & Clear
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Submit Request
                            </Button>
                        </div>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CertificationRequestForm;