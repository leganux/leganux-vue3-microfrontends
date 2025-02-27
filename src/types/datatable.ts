export interface DynamicButton {
    label: string;
    icon?: string;
    action: string;
    class?: string;
    function_?: any;
  }
  
  export interface TableColumn {
    data: string;
    type: 'string' | 'enum' | 'date' | 'relationship' | 'boolean' | 'number' | 'picture'| 'custom';
    title: string;
    referenceName?: string;
    function_?: any;
  }
  
  export interface DatatableProps {
    columns: TableColumn[];
    uri: string;
    dynamicButtons?: DynamicButton[];
    showDefaultButtons?: boolean;
  }
  
  export interface ColumnDefinition {
    data: string | null;
    title: string;
    orderable?: boolean;
    render?: (data: any, type: any, row: any) => string;
  }