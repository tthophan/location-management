export class UserInfo {
  userId?: string;
  userEmail?: string;
  uniqueDeviceId?: string;
  [k: string]: any;
}
export class RequestContext {
  cid: string;
  requestTimestamp: number;
  deviceId?: string;
  lang?: string;
  constructor(data: Partial<RequestContext>) {
    Object.assign(this, data);
  }
}

export class AuditContext {
  constructor(data: Partial<AuditContext>) {
    Object.assign(this, data);
  }
}
