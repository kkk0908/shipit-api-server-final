import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken'

@Injectable()

export class AuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext();

		if (!ctx.headers.authorization) {
			return false;
		}
		ctx.user = await this.validateToken(ctx.headers.authorization);
		return true
	}


	async validateToken(auth: string) {
		if (auth.split(' ')[0] !== 'Bearer') {
			throw new UnauthorizedException("Invalid Token!")
		}
		const token = auth.split(' ')[1]
		try {
			return await jwt.verify(token, 'secret')
		} catch (error) {
			throw new UnauthorizedException("Invalid Token!")
		}
	}
}