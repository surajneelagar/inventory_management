export interface Dashboard {
  serialNumber: string | null;
  purchaseDate: string | null;
  deliveryDate: string | null;
  warrantyTill: string | null;
  assignTo: string | null | null;
  lastSyncDate: string | null;
  orderNumber: number | null;
  sources : string | null;
  manufacturerId: string | null;
  model: string | null;
  status: string | null;
  deviceType: string | null;
  location: string | null;
}

  export interface Inventory {
    serialNumber: number;
    purchaseDate: string;
    deliveryDate: string;
    warrantyTill: string;
    lastPhysicalInventory: string;
    orderNumber: string;
    manfId: string;  // New field
    model: string;  // New field
    status: string;
    type: string;
  }

  export interface UserList {
    displayName: string;
    allocatedMachinesCount: number;
    deAllocatedMachinesCount:number;
    location:string;
  }