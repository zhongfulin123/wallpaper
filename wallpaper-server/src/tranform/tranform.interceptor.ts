import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable,map } from 'rxjs';
@Injectable()
export class TranformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data=>{
      return {
        code: HttpStatus.OK,
        data
      }
    }));
  }
}
