export interface InvalidParam {
  name: string;
  reason: string;
}

export interface ProblemDetailsOptions {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  type_constant: string;
  invalidParams?: InvalidParam[];
}

export class ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  type_constant: string;
  invalidParams?: InvalidParam[];

  constructor(options: ProblemDetailsOptions) {
    this.type = options.type;
    this.title = options.title;
    this.status = options.status;
    this.detail = options.detail;
    this.instance = options.instance;
    this.type_constant = options.type_constant;
    if (options.invalidParams && options.invalidParams.length > 0) {
      this.invalidParams = options.invalidParams;
    }
  }

  toJSON(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      type: this.type,
      title: this.title,
      detail: this.detail,
      instance: this.instance ?? '',
      status: this.status,
      type_constant: this.type_constant,
    };

    if (this.invalidParams && this.invalidParams.length > 0) {
      result.invalidParams = this.invalidParams;
    }

    return result;
  }
}
