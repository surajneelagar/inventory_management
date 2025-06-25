import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportExcelService {
  baseUrl: string = 'https://localhost:7111';
  refreshData: Subject<any> = new Subject();

  constructor(private _http: HttpClient) { }

  importExcel(file: any): Observable<any> {
     return this._http.post(`${this.baseUrl}/draft-excelInventory`, file);
  }

  uploadExcelFile(data:any): Observable<any> {
    return this._http.post(`${this.baseUrl}/inventoryItemsUpload`,data);
  } 

  getEntityData(serialNumber?:any): Observable<any> {
     return this._http.get(`${this.baseUrl}/sync/inventory`);
  }

  addInventory(param: any) {
    return this._http.post(`${this.baseUrl}/inventory`, param);
  }

  assignDevice(param: any) {
    console.log(param)
    return this._http.post(`${this.baseUrl}/assign/inventory`, param);
  }
 
  returnedInventory(param: any) {
    console.log(param)
    return this._http.post(`${this.baseUrl}/returned/inventory`, param);
  }

  updateInventoryStatus(param: any) {
    console.log(param)
    return this._http.post(`${this.baseUrl}/updateInventoryStatus`, param);
  }

  inventoryList(params: any, page: number, pageSize: number){
    // const {serialNumber, orderId, status } = params;
    const { inventorySearch } = params;
    // return this._http.get(`${this.baseUrl}/sync/inventory?pageNumber=${page}&pageSize=${pageSize}&Search=${inventorySearch}`);
    return of (
      [
        {
            "itemId": 1,
            "itemType": "Laptop",
            "serialNumber": "A12345B",
            "purchaseDate": "2020-01-15T00:00:00Z",
            "deliveryDate": "2020-01-20T00:00:00Z",
            "lastPhysicalInventoryItem": "2020-01-25T00:00:00Z",
            "endOfWarranty": "2023-01-15T00:00:00Z",
            "networkIdentifier": null,
            "order": "US0001234",
            "manufacturer": "HP",
            "model": "EliteBook 840",
            "location": "NY\\US",
            "status": "In Stock",
            "itemDescription": null,
            "createdAt": "2025-02-01T10:00:00Z"
        },
        {
            "itemId": 2,
            "itemType": "Desktop",
            "serialNumber": "B98765D",
            "purchaseDate": "2021-03-10T00:00:00Z",
            "deliveryDate": "2021-03-15T00:00:00Z",
            "lastPhysicalInventoryItem": "2021-03-20T00:00:00Z",
            "endOfWarranty": "2024-03-10T00:00:00Z",
            "networkIdentifier": null,
            "order": "US0002345",
            "manufacturer": "Dell",
            "model": "OptiPlex 7080",
            "location": "LA\\US",
            "status": "In Stock",
            "itemDescription": null,
            "createdAt": "2025-02-02T11:00:00Z"
        }
    ]
    
    )
  }

  userList(params: any, page: number, pageSize: number){
    const { displayName } = params;
    // https://localhost:7111/user/allocatedDevice
    //  return this._http.get(`${this.baseUrl}/user/allocatedDevice?displayName=${displayName}`); 

    return of(
      [
        {
            "displayName": "A Adabala",
            "userEmailId": "abc@xyz.com",
            "allocatedMachinesCount": 1,
            "deAllocatedMachinesCount": 0,
            "location": "India, Hyderabad"
        },
        {
            "displayName": "A.J. Hopke",
            "userEmailId": "abc123@xyz.com",
            "allocatedMachinesCount": 1,
            "deAllocatedMachinesCount": 0,
            "location": "United States of America, Saint Louis"
        }
      ]
    )
  }

  masterData() {
    //  return this._http.get(`${this.baseUrl}/masterData`);
    return of(
      {
        "countries": [
            {
                "name": "United States of America",
                "code": "US"
            },
            {
                "name": "India",
                "code": "IN"
            },
            {
                "name": "Germany",
                "code": "DE"
            }
        ],
        "deviceTypes": [
            {
                "name": "Laptop",
                "code": "LP"
            },
            {
                "name": "iPhone",
                "code": "iPhone"
            },
            {
                "name": "iPad",
                "code": "iPad"
            }
        ],
        "machineModels": [
            {
                "name": "Dell XPS 13",
                "code": "Dell"
            },
            {
                "name": "iPhone 13",
                "code": "Iphone"
            },
            {
                "name": "Samsung Galaxy Tab S8",
                "code": "SG"
            }
        ],
        "status": [
            {
                "name": "In Stock",
                "code": "InStock"
            },
            {
                "name": "Assigned",
                "code": "Assigned"
            },
            {
                "name": "OutOfWarranty",
                "code": "OutOfWarranty"
            },
            {
                "name": "In Transit",
                "code": "InTransit"
            },
            {
                "name": "Non-Compliant",
                "code": "NonCompliant"
            },
            {
                "name": "Returnable",
                "code": "Returnable"
            },
            {
                "name": "Recalled",
                "code": "Recalled"
            },
            {
                "name": "Offboarding",
                "code": "Offboarding"
            }
        ],
        "returnableStatus": [
            {
                "name": "Returnable",
                "code": "Returnable"
            },
            {
                "name": "Recalled",
                "code": "Recalled"
            },
            {
                "name": "Offboarding",
                "code": "Offboarding"
            }
        ],
        "returnReason": [
            {
                "name": "Damaged",
                "code": "Damaged"
            },
            {
                "name": "Expired",
                "code": "Expired"
            },
            {
                "name": "Incorrect Item",
                "code": "Incorrect Item"
            },
            {
                "name": "Defective",
                "code": "Defective"
            },
            {
                "name": "Recalled",
                "code": "Recalled"
            },
            {
                "name": "Overstock",
                "code": "Overstock"
            },
            {
                "name": "Customer Return",
                "code": "Customer Return"
            }
        ]
    }
    )
  }

  deviceHistory(deviceId: string): Observable<any> {
    //  return this._http.get(`${this.baseUrl}/device/detailby/${deviceId}`);
    https://localhost:7111/devices/1MPFGY3
    return of (
      {
            "deviceDetail": {
                "serialNumber": "BQ0HBY3",
                "purchaseDate": null,
                "warrantyTill": "2027-10-26 22:59",
                "physicalInventory": null,
                "orderNumber": null,
                "manufacturer": "Dell Inc.",
                "type": "Laptop",
                "machineHost": "UKL-BQ0HBY3",
                "syncLastLoggedCrowdstrikeDate": "2025-02-27 12:25",
                "syncLastLoggedIntuneDate": "2025-02-27 08:44",
                "location": "United Kingdom of Great Britain and Northern Ireland, Farnborough, United Kingdom of Great Britain and Northern Ireland, Farnborough",
                "warrantyEntitlementType": null,
                "warrantyServiceLevelDesc": null,
                "syncDate": "2025-02-27T18:31:16.327879+05:30"
            },
            "deviceHistory": [
                {
                    "serialNumber": "BQ0HBY3",
                    "userEmail": "",
                    "eventDate": "2025-03-05 16:35",
                    "status": "Assigned",
                    "returnReason": null,
                    "trackingNumber": null,
                    "description": "Damaged"
                },
                {
                    "serialNumber": "BQ0HBY3",
                    "userEmail": "",
                    "eventDate": "2025-03-05 17:43",
                    "status": "Returned",
                    "returnReason": "Damaged",
                    "trackingNumber": "t131",
                    "description": "Damaged"
                }
            ]
        }
        
    )

  }


  deviceHistoryEmail(userMailId: string): Observable<any> {
      // return this._http.get(`${this.baseUrl}/device/${userMailId}`);
    // https://localhost:7111/device/Liam.Morris@crawco.co.uk

  return of(
      [
        {
            "serialNumber": "CSKD043",
            "manufacturer": "Dell Inc.",
            "type": "Laptop",
            "machineHost": "UKL-CSKD043",
            "location": "United Kingdom of Great Britain and Northern Ireland, London"
        },
        {
          "serialNumber": "CSKD043",
          "manufacturer": "Dell Inc.",
          "type": "Laptop",
          "machineHost": "UKL-CSKD043",
          "location": "United Kingdom of Great Britain and Northern Ireland, London"
      },
      
    ]
     
    )
  }

  allInventoryList(params: any, page: number, pageSize: number,status: string){
    // const {serialNumber, orderId, status } = params;
    const { inventorySearch } = params;
    console.log(status);
    // return this._http.get(`${this.baseUrl}/allInventory?tab=${status}&pageNumber=${page}&pageSize=${pageSize}&search=${inventorySearch}`);
    return of(
      {
        "tab": "All Devices",
        "devices": [
            {
                "serialNumber": "0000",
                "purchaseDate": "",
                "deliveryDate": "",
                "warrantyTill": "",
                "assignTo": "Jaime Jeffs",
                "userEmailId": "Jaime.Jeffs@crawco.co.uk",
                "lastSyncDate": "2025-02-24T07:31:57Z",
                "sources": "Intune, Crowdstrike",
                "orderNumber": "",
                "manufacturerId": "Microsoft Corporation",
                "model": "Virtual Machine",
                "status": "INStioc",
                "deviceType": "Virtual machine",
                "location": "United Kingdom of Great Britain and Northern Ireland, London",
                "lastPhysicalInventory": ""
            },
            {
                "serialNumber": "0000",
                "purchaseDate": "",
                "deliveryDate": "",
                "warrantyTill": "",
                "assignTo": "Arjay Sumagaysay",
                "userEmailId": "Arjay.Sumagaysay@crawco.co.uk",
                "lastSyncDate": "2025-02-26T04:18:03Z",
                "sources": "Intune, Crowdstrike",
                "orderNumber": "",
                "manufacturerId": "Microsoft Corporation",
                "model": "Virtual Machine",
                "status": "Assigned",
                "deviceType": "Virtual machine",
                "location": "United Kingdom of Great Britain and Northern Ireland, London",
                "lastPhysicalInventory": ""
            },
            {
              "serialNumber": "0000",
              "purchaseDate": "",
              "deliveryDate": "",
              "warrantyTill": "",
              "assignTo": "Jaime Jeffs",
              "userEmailId": "Jaime.Jeffs@crawco.co.uk",
              "lastSyncDate": "2025-02-24T07:31:57Z",
              "sources": "Intune, Crowdstrike",
              "orderNumber": "",
              "manufacturerId": "Microsoft Corporation",
              "model": "Virtual Machine",
              "status": "INStioc",
              "deviceType": "Virtual machine",
              "location": "United Kingdom of Great Britain and Northern Ireland, London",
              "lastPhysicalInventory": ""
          },
          {
              "serialNumber": "0000",
              "purchaseDate": "",
              "deliveryDate": "",
              "warrantyTill": "",
              "assignTo": "Arjay Sumagaysay",
              "userEmailId": "Arjay.Sumagaysay@crawco.co.uk",
              "lastSyncDate": "2025-02-26T04:18:03Z",
              "sources": "Intune, Crowdstrike",
              "orderNumber": "",
              "manufacturerId": "Microsoft Corporation",
              "model": "Virtual Machine",
              "status": "Assigned",
              "deviceType": "Virtual machine",
              "location": "United Kingdom of Great Britain and Northern Ireland, London",
              "lastPhysicalInventory": ""
          }
        
        ]
      }
  )
}
  
allInventoryAssignment(searchQuery: string = '', pageNumber: number = 1) {
    // const { searchQuery, pageNumber } = params;
    console.log(searchQuery)
    // return this._http.get(`${this.baseUrl}/userList?search=${searchQuery}&pageNumber=${pageNumber}`)
     return of (
      [
            {
                "fullName": "Aljhemar Umadhay",
                "email": "Aljhemar.Umadhay@crawco.co.uk"
            },
            { 
                "fullName": "Aljhemar Umadhay",
                "email": "Aljhemar.Umadhay@us.crawco.com"
            },
            {
                "fullName": "Khema Rivera (Archived Account)",
                "email": "archive_khema_rivera_20190114@crawco.onmicrosoft.com"
            },
            {
                "fullName": "Thadee Rushemeza (Archived Account)",
                "email": "Archive_Thadee_Rushemeza_20240202@Crawco.onmicrosoft.com"
            },
            {
                "fullName": "Charles Echemuna",
                "email": "charles.echemuna@us.crawco.com"
            },
            {
                "fullName": "Chemene McLeod Freeman",
                "email": "chemene.mcleodfreeman@us.crawco.com"
            },
            {
                "fullName": "Hemant Garg",
                "email": "EXT_Hemant.Garg@Crawford.asia"
            },
            {
                "fullName": "FrenchEmail",
                "email": "FrenchEmail@crawco.ca"
            },
            {
                "fullName": "Hem Shah (Archived Account)",
                "email": "archive_Hem_Shah_20210729@Crawco.onmicrosoft.com"
            },
            {
                "fullName": "ATX - Mayhem Training 2 - 2nd Floor - Flood",
                "email": "G8078106aab294471b2ccf18a2a253ba8@Crawco.onmicrosoft.com"
            },
            {
                "fullName": "ATX - Mayhem Training 1 - 2nd Floor - Flood",
                "email": "Gd3bd8c38a9ec451dae782c6f3225e8bc@Crawco.onmicrosoft.com"
            },
            {
                "fullName": "Hem Shah",
                "email": "Hem.Shah@crawco.ca"
            },
            {
                "fullName": "Hem Shah",
                "email": "Hem.Shah@us.crawco.com"
            },
            {
                "fullName": "Hema Bisht",
                "email": "Hema_Bisht@us.crawco.com"
            },
            {
                "fullName": "Hemant Garg (Admin)",
                "email": "Hemant.Garg@Crawco.onmicrosoft.com"
            },
            {
                "fullName": "Hemant Garg",
                "email": "Hemant.Garg@us.crawco.com"
            },
            {
                "fullName": "Hemant Wanhere",
                "email": "Hemant.Wanhere@us.crawco.com"
            },
            {
                "fullName": "Hemant Mehra",
                "email": "Hemant_Mehra@us.crawco.com"
            },
            {
                "fullName": "AP ME Hemayti Travel Claims",
                "email": "hemaytitravelclaims@broadspire.me"
            },
            {
                "fullName": "Hemi Borell",
                "email": "hemi.borell@crdbce.com.au"
            },
            {
                "fullName": "Jamie Hempkin",
                "email": "Jamie.Hempkin@crawco.co.uk"
            },
            {
                "fullName": "Johnny Richemond",
                "email": "johnny.richemond@us.crawco.com"
            },
            {
                "fullName": "Khema Rivera",
                "email": "Khema_Rivera@us.crawco.com"
            },
            {
                "fullName": "Mathala Hemant",
                "email": "Mathala.Hemant@crawco.co.uk"
            },
            {
                "fullName": "Mathala Hemanth (Guest)",
                "email": "mathala.hemanth@primussoft.com"
            },
            {
                "fullName": "Mayhem-1",
                "email": "Mayhem-1@crawco.onmicrosoft.com"
            },
            {
                "fullName": "Mayhem-2",
                "email": "Mayhem-2@crawco.onmicrosoft.com"
            },
            {
                "fullName": "Mayhem-3",
                "email": "Mayhem-3@crawco.onmicrosoft.com"
            },
            {
                "fullName": "ATX - Mayhem Training 3 - 2nd Floor - Flood",
                "email": "MayhemTraining-3@crawco.onmicrosoft.com"
            },
            {
                "fullName": "Monique Authement",
                "email": "Monique.Authement@choosebroadspire.com"
            },
            {
                "fullName": "Paul van Bethlehem",
                "email": "PaulvanBethlehem@crawco.nl"
            },
            {
                "fullName": "Rashemia Woodley",
                "email": "Rashemia.Woodley@us.crawco.com"
            },
            {
                "fullName": "RiskTechEmail",
                "email": "RiskTechEmail@us.crawco.com"
            },
            {
                "fullName": "Robyn Hemming",
                "email": "Robyn.Hemming@crawco.co.uk"
            },
            {
                "fullName": "Shemika Archable",
                "email": "shemika.archable@us.crawco.com"
            },
            {
                "fullName": "Stacey Hemming (Guest)",
                "email": "shemming@breakthrubev.com"
            },
            {
                "fullName": "Katalyst Bicycle Scheme",
                "email": "stubbenedgebikescheme@crawco.co.uk"
            }
        ]
    )
  }
}


