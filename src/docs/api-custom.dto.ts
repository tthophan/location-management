import { ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

export class CustomErrorResponse {
  detail: string;
  title: string;
  timestamp: number;
  responseTime: string;
  instance: string;
  status: number;
  invalidParams: InvalidParam[];
  constructor(data: Partial<CustomErrorResponse>) {
    Object.assign(this, data);
  }
}

export class InvalidParam {
  name: string;
  reason: string;
}

export const InternalServerErrorResponse = (): ApiResponseOptions => {
  return {
    description: 'Internal Server Error',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(CustomErrorResponse),
          type: 'object',
        },
      },
    },
  };
};

export const BadRequestResponse = (): ApiResponseOptions => {
  return {
    description: 'Bad Request',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(CustomErrorResponse),
          type: 'object',
        },
      },
    },
  };
};
