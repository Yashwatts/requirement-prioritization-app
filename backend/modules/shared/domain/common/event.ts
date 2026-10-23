import { v4 as uuidv4 } from 'uuid';

export abstract class Event<TPayload = unknown> {
  id: string;
  appId: string;
  fired_at: Date;
  payload: TPayload;

  constructor(payload: TPayload, appId: string) {
    this.id = uuidv4();
    this.appId = appId;
    this.fired_at = new Date();
    this.payload = payload;
  }

  abstract type: string;
  abstract getBody(): Record<string, unknown>;

  getId(): string {
    return this.id;
  }

  getType(): string {
    return this.type;
  }

  getFiredAt(): Date {
    return this.fired_at;
  }

  getHeaders(): {
    type: string;
    content_type: string;
  } {
    return {
      type: this.getType(),
      content_type: 'application/json',
    };
  }

  getPayload(): Record<string, unknown> {
    return {
      uuid: this.getId(),
      fired_at: this.getFiredAt(),
      ...this.getBody(),
    };
  }

  getProperties(): {
    messageId: string;
    type: string;
    appId: string;
    contentType: string;
    headers: {
      type: string;
      content_type: string;
    };
  } {
    return {
      messageId: this.getId(),
      type: this.type,
      appId: this.appId,
      contentType: 'application/json',
      headers: this.getHeaders(),
    };
  }
}
