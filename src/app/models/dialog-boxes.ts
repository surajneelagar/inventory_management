export interface addInventory {
   serialNumber: string,
    purchaseDate: string,
    deliveryDate: string,
    lastPhysicalInventory: string,
    orderNumber: string,
    warrantyTill: string,
    manfId: string,
    model: string,
    status: string,
    deviceType: string,
    location: string,
}

export interface assignedDevice{
    serialNumber: string;
    assignedTo: string;
    assignedDate: string;
    assignedDepartment: string;
}

export interface diapatchedInventory{
    serialNumber : string,
    purchaseDate : string,
    deliveryDate : string,
    warrantyTill : string,
    assignedDepartment : string
}
  
export enum ButtonIndex {
    AllDevices = 0,
    Active = 1,
    InTransit = 2,
    Stock = 3,
    OutOfWarranty = 4,
    NonCompliant = 5,
    Returnable = 6,
    Recalled = 7,
    OffBoarding = 8,
    Ordered = 9
  }