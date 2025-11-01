import { NodePoint } from "@/components/Diagram/Nodes";
import { Edge } from "@xyflow/react";
import { rootNodeID } from '@/utils/Formula/FormulaConfig';


export const getChildren = (parentId: string, edges: Edge[]): string[] => {
    const directChildren = edges
        .filter(e => e.source === parentId)
        .map(e => e.target);

    return directChildren;
};

export const getAllDescendants = (parentId: string, edges: Edge[]): string[] => {
    const children = edges
        .filter(e => e.source === parentId)
        .map(e => e.target);

    const descendants = children.flatMap(child => getAllDescendants(child, edges));
    return [...children, ...descendants];
};


export function findRootNode(nodes: NodePoint[], edges: Edge[]): NodePoint | undefined {
    if (!nodes?.length) return undefined;

    let rootNode = nodes.find(n => n.id === rootNodeID);
    if (rootNode) return rootNode;

    const childCountMap: Record<string, number> = {};
    edges.forEach(edge => {
        const source = edge.source;
        if (source) childCountMap[source] = (childCountMap[source] || 0) + 1;
    });

    const rootCandidateId = Object.entries(childCountMap).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (rootCandidateId) {
        rootNode = nodes.find(n => n.id === rootCandidateId);
        if (rootNode) return rootNode;
    }
    
    return nodes.reduce((top, current) =>
        current.position.y < top.position.y ? current : top
    );
}