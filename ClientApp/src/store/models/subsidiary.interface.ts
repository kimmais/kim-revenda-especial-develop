export interface ISubsidiary {
    id: number;
    email: string;
    name: string;
    status: boolean;
    tableData?:any;
}

export enum SubsidiaryModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}