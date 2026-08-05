import {
  type ActionType,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import type { FC } from 'react';
import { addInterfaceInfoUsingPost } from '@/services/fuapi-backend/interfaceInfoController';

interface CreateFormProps {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  visible: boolean;
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { columns, visible, onCancel, reload } = props;
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <Modal
        title="新建接口"
        width={600}
        open={visible}
        footer={null}
        destroyOnHidden
        onCancel={onCancel}
      >
        <ProTable
          type="form"
          columns={columns}
          onSubmit={async (values) => {
            const res = await addInterfaceInfoUsingPost(
              values as API.InterfaceInfoAddRequest,
            );
            if (res?.data) {
              messageApi.success('创建成功');
              onCancel();
              reload?.();
              return;
            }
            messageApi.error(res?.message ?? '创建失败，请重试');
          }}
        />
      </Modal>
    </>
  );
};

export default CreateForm;
