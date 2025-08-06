import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const USER_KEY = 'user';
export const CurrentUser = () => SetMetadata(USER_KEY, true);
