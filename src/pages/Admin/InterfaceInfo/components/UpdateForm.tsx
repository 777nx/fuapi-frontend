import {
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React, { cloneElement, useCallback, useMemo, useState } from 'react';
import { updateInterfaceInfoUsingPost } from '@/services/fuapi-backend/interfaceInfoController';

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<API.InterfaceInfo>;
  columns: ProColumns<API.InterfaceInfo>[];
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger, columns } = props;
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const updateColumns = useMemo(
    () =>
      columns.map((col) => {
        if (col.dataIndex === 'status') {
          return { ...col, hideInForm: false };
        }
        return col;
      }),
    [columns],
  );

  return (
    <>
      {contextHolder}
      {trigger
        ? cloneElement(trigger, {
            onClick: onOpen,
          })
        : null}
      <Modal
        title="修改接口"
        width={600}
        open={open}
        footer={null}
        destroyOnHidden
        onCancel={onCancel}
      >
        <ProTable
          type="form"
          columns={updateColumns}
          form={{
            initialValues: values,
          }}
          onSubmit={async (formValues) => {
            const res = await updateInterfaceInfoUsingPost({
              ...(formValues as API.InterfaceInfoUpdateRequest),
              id: values.id,
            });
            if (res?.data) {
              messageApi.success('修改成功');
              onCancel();
              onOk?.();
              return;
            }
            messageApi.error(res?.message ?? '修改失败，请重试');
          }}
        />
      </Modal>
    </>
  );
};

export default UpdateForm;
