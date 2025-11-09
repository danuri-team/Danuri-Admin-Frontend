export interface Space {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  [key: string]: unknown;
}

export interface CreateSpaceRequest {
  name: string;
  startTime: string;
  endTime: string;
}

export interface UpdateSpaceRequest {
  spaceId: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface SpaceIdRequest {
  spaceId: string;
}
