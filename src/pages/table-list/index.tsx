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
import { useMutation } from '@tanstack/react-query';

import { Button, Drawer, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { removeRule } from '@/services/ant-design-pro/api';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {listInterfaceInfoByPageUsingGet} from "@/services/fuapi-backend/interfaceInfoController";
import type {SortOrder} from "antd/lib/table/interface";
import {FilterValue} from "@ant-design/pro-components/es/table/typing";

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: delRun, isPending: loading } = useMutation({
    mutationFn: removeRule,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();

      messageApi.success('Deleted successfully and will refresh soon');
    },
    onError: () => {
      messageApi.error('Delete failed, please try again');
    },
  });

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: (
        'id'
      ),
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: (
        '接口名称'
      ),
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: (
        '描述'
      ),
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: (
        '请求方法'
      ),
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: (
        'url'
      ),
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: (
        '请求头'
      ),
      dataIndex: 'requestHeader',
      valueType: 'textarea',
    },
    {
      title: (
        '响应头'
      ),
      dataIndex: 'responseHeader',
      valueType: 'textarea',
    },
    {
      title: (
        '状态'
      ),
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            '关闭'
          ),
          status: 'Default',
        },
        1: {
          text: (
            '运行中'
          ),
          status: 'Processing',
        },
      },
    },
    {
      title: (
        '创建时间'
      ),
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: (
        '更新时间'
      ),
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
    {
      title: (
        '操作'
      ),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <UpdateForm
          trigger={
            <a>
              配置
            </a>
          }
          key="config"
          onOk={actionRef.current?.reload}
          values={record}
        />,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          订阅警报
        </a>,
      ],
    },
  ];

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: API.RuleListItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');

        return;
      }

      await delRun({
        data: {
          key: selectedRows.map((row) => row.key),
        },
      });
    },
    [delRun, messageApi.warning],
  );

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm key="create" reload={actionRef.current?.reload} />,
        ]}
        request={async (params, sort: Record<string, SortOrder>, filter: Record<string, FilterValue> | null) => {
          const res = await listInterfaceInfoByPageUsingGet({
            ...params,
          });
          if (res?.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total,
            }
          }
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
              '已选择'
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>
              '项'
              &nbsp;&nbsp;
              <span>
                '服务调用次数总计'
                {selectedRowsState.reduce(
                  (pre, item) => pre + (item.callNo ?? 0),
                  0,
                )}
                '万'
              </span>
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            批量删除
          </Button>
          <Button type="primary">
            批量审批
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
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
