import { Divider, Stack } from '@mui/material';
import React, { Fragment } from 'react';
import FunnelListItem from './FunnelListItem';
import { IFunnel } from '@/types/funnel';

type FunnelListProps = {
  funnels: (IFunnel & { isNew: boolean })[];
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
};

const FunnelList: React.FC<FunnelListProps> = ({ funnels, onEdit = () => () => { }, onDelete = () => () => { } }) => {

  console.log(funnels);

  const newFunnels = funnels.filter(funnel => funnel.isNew);
  const oldFunnels = funnels.filter(funnel => !funnel.isNew);

  const GetList = (funnel: IFunnel & { isNew: boolean }) => {
    const { id, title, blocks, isNew } = funnel;

    const blocksCount = blocks ? JSON.parse(`${blocks}`) : [];
    return { id, title, blocksCount: blocksCount?.length, isNew, onEdit, onDelete }
  }

  return (
    <Stack gap={1}>
      {newFunnels.length > 0 && (
        <Fragment key="new-funnels">
          {newFunnels.map(funnel => (
            <FunnelListItem key={funnel.id} {...GetList(funnel)} />
          ))}
          <Divider sx={{ my: 1 }}>Новые воронки</Divider>
        </Fragment>
      )}

      {oldFunnels.map(funnel => (
        <FunnelListItem key={funnel.id} {...GetList(funnel)} />
      ))}
    </Stack>
  )
}

export default FunnelList;