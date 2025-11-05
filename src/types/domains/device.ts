export interface Device {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface CreateDeviceRequest {
  name: string;
}

export interface UpdateDeviceRequest {
  deviceId: string;
  name: string;
}

export interface DeviceIdRequest {
  deviceId: string;
}

export interface DeviceQRResponse {
  qrCode: string;
  qr_link: string;
  code: string;
}
