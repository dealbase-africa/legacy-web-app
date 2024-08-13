import { DataViewType } from "@dealbase/core";
import {
  ColumnInstance,
  Row,
  SortingRule,
  TablePropGetter,
  TableProps,
  UseSortByColumnProps,
} from "react-table";

export interface DataViewPropsBase<T extends object> {
  heading?: boolean;
  enableEdit?: boolean;
  getTableProps: (propGetter?: TablePropGetter<T> | undefined) => TableProps;
  onChangeDataViewType: (newDataViewType: DataViewType) => void;
  headers: (ColumnInstance<T> & UseSortByColumnProps<T>)[];
  prepareRow: (row: Row<T>) => void;
  page: Row<T>[];
  loading?: boolean;
  actions?: React.ReactElement;
  setSortBy: (sortBy: SortingRule<T>[]) => void;
  defaultSortBy?: SortingRule<T>;
  dataViewType: DataViewType;
}
