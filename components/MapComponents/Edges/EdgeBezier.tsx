import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

function CustomEdge({ data, ...props }: EdgeProps) {
  const [edgePath] = getBezierPath(props);

  return (
    <>
      <BaseEdge path={edgePath} markerStart={''} markerEnd={''} />
      <EdgeLabelRenderer>
        <div>
          {data?.label as string ?? ''}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CustomEdge)