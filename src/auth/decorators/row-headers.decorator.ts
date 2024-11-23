import { createParamDecorator, ExecutionContext, InternalServerErrorException, } from '@nestjs/common';

export const RowHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (!request) {
            throw new InternalServerErrorException('Request not found(request)')
        }
        return !data ? request.headers : request.headers[data];
    }); 
