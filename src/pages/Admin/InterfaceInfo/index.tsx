import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Popconfirm } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import {
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingGet,
  offlineInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
} from '@/services/fuapi-backend/interfaceInfoController';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

/** 接口状态：0 关闭，1 运行中 */
const INTERFACE_STATUS = {
  OFFLINE: 0,
  ONLINE: 1,
} as const;

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType | null>(null);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>(
    [],
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = useCallback(
    async (id?: number) => {
      if (!id) {
        messageApi.warning('接口 id 不存在');
        return false;
      }
      const res = await deleteInterfaceInfoUsingPost({ id });
      if (res?.data) {
        messageApi.success('删除成功');
        actionRef.current?.reload();
        return true;
      }
      messageApi.error(res?.message ?? '删除失败，请重试');
      return false;
    },
    [messageApi],
  );

  const handleOnline = useCallback(
    async (id?: number) => {
      if (!id) {
        messageApi.warning('接口 id 不存在');
        return;
      }
      const res = await onlineInterfaceInfoUsingPost({ id });
      if (res?.data) {
        messageApi.success('发布成功');
        actionRef.current?.reload();
        return;
      }
      messageApi.error(res?.message ?? '发布失败，请重试');
    },
    [messageApi],
  );

  const handleOffline = useCallback(
    async (id?: number) => {
      if (!id) {
        messageApi.warning('接口 id 不存在');
        return;
      }
      const res = await offlineInterfaceInfoUsingPost({ id });
      if (res?.data) {
        messageApi.success('下线成功');
        actionRef.current?.reload();
        return;
      }
      messageApi.error(res?.message ?? '下线失败，请重试');
    },
    [messageApi],
  );

  /**
   * 批量删除
   */
  const handleBatchRemove = useCallback(async () => {
    if (!selectedRowsState?.length) {
      messageApi.warning('请选择删除项');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定删除选中的 ${selectedRowsState.length} 个接口吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setDeleteLoading(true);
        try {
          const results = await Promise.all(
            selectedRowsState.map((row) =>
              deleteInterfaceInfoUsingPost({ id: row.id }),
            ),
          );
          const successCount = results.filter((res) => res?.data).length;
          if (successCount > 0) {
            messageApi.success(`成功删除 ${successCount} 条`);
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
          } else {
            messageApi.error('删除失败，请重试');
          }
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  }, [messageApi, selectedRowsState]);

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      search: false,
      hideInForm: true,
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入接口名称' }],
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入请求方法' }],
      },
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入 url' }],
      },
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      search: false,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <UpdateForm
          trigger={<a>修改</a>}
          key="config"
          onOk={actionRef.current?.reload}
          values={record}
          columns={columns}
        />,
        record.status === INTERFACE_STATUS.OFFLINE ? (
          <a key="online" onClick={() => handleOnline(record.id)}>
            发布
          </a>
        ) : (
          <a key="offline" onClick={() => handleOffline(record.id)}>
            下线
          </a>
        ),
        <Popconfirm
          key="delete"
          title="确定删除该接口吗？"
          okText="确认"
          cancelText="取消"
          onConfirm={() => handleDelete(record.id)}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.InterfaceInfo, API.PageParams>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params) => {
          const res = await listInterfaceInfoByPageUsingGet({
            ...params,
          });
          return {
            data: res?.data?.records || [],
            success: !!res?.data,
            total: res?.data?.total || 0,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Button
            danger
            loading={deleteLoading}
            onClick={() => {
              handleBatchRemove();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        size={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.InterfaceInfo>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.InterfaceInfo>[]}
          />
        )}
      </Drawer>
      <CreateForm
        columns={columns}
        visible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        reload={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default TableList;
