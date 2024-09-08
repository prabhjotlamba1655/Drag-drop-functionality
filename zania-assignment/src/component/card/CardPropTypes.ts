import { DocumentCard } from "../../LayoutPropTypes";

export interface CardProps {
  card: DocumentCard;
  index: number;
  handleDragStart: (index: number) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  thumbnails: Record<string, string>;
}
