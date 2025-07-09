import { Divider, Stack } from '@mui/material';
import React, { Fragment } from 'react';
import SchemeListItem from './SchemeListItem';
import { Scheme } from '.prisma/client';

type SchemeListProps = {
  schemes: (Scheme & { isNew: boolean })[];
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
};

const SchemeList: React.FC<SchemeListProps> = ({ schemes, onEdit = () => () => { }, onDelete = () => () => { } }) => {
  const newSchemes = schemes.filter(scheme => scheme.isNew);
  const oldSchemes = schemes.filter(scheme => !scheme.isNew);
  return (
    <Stack gap={1}>
      {newSchemes.length > 0 && (
        <Fragment key="new-maps">
          {newSchemes.map(scheme => (
            <SchemeListItem key={scheme.id} id={scheme.id} title={scheme.title} formula={scheme.formula} onEdit={onEdit} onDelete={onDelete} />
          ))}
          <Divider sx={{ my: 1 }}>Новые карты</Divider>
        </Fragment>
      )}

      {oldSchemes.map(scheme => (
        <SchemeListItem key={scheme.id} id={scheme.id} title={scheme.title} formula={scheme.formula} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Stack>
  )
}

export default SchemeList;
