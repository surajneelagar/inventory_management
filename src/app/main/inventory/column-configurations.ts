// column-configurations.ts

export const ColumnConfigurations: { [key: string]: string[] } = {
    allDevice: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'warrantyTill', 'assignTo', 'userEmailId', 
      'lastSyncDate', 'sources', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 
      'location', 'lastPhysicalInventory'
    ],
    active: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'warrantyTill', 'assignTo', 'displayName', 
      'lastSyncDate', 'sources', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 
      'location'
    ],
    intransit: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'warrantyTill', 'assignTo', 'userEmailId', 
      'lastSyncDate', 'sources', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 
      'location', 'lastPhysicalInventory'
    ],
    stock: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'warrantyTill', 'assignTo', 'userEmailId', 
      'lastSyncDate', 'sources', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 
      'location', 'lastPhysicalInventory'
    ],
    expired: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'warrantyTill', 'assignTo', 'displayName', 
      'lastSyncDate', 'sources', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 
      'location'
    ],
    non_compliant: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'warrantyTill', 'assignTo', 'userEmailId', 
      'lastSyncDate', 'sources', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 
      'location', 'lastPhysicalInventory'
    ],
    returnable: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'returnDate', 'lastAssignedUser', 'comment', 
      'returnReason', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 'location'
    ],
    recalled: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'returnDate', 'lastAssignedUser', 'comment', 
      'returnReason', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 'location'
    ],
    offboarding: [
      'serialNumber', 'purchaseDate', 'deliveryDate', 'returnDate', 'lastAssignedUser', 'comment', 
      'returnReason', 'orderNumber', 'manufacturerId', 'model', 'status', 'deviceType', 'location'
    ]
  };