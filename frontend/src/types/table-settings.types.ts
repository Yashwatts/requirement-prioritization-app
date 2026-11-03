export interface ColumnConfigItem {
  id: string;
  label: string;
}

export type ColumnListType = "visible" | "hidden";

export interface DraggedItemState {
  item: ColumnConfigItem;
  sourceList: ColumnListType;
  sourceIndex: number;
}

export interface DragOverTargetState {
  listType: ColumnListType;
  targetIndex: number;
}

export interface UserTableSettings {
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
}

export interface TableSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  availableColumns: ColumnConfigItem[];
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  onSave: (
    newColumnOrder: string[],
    newColumnVisibility: Record<string, boolean>,
  ) => void;
}

