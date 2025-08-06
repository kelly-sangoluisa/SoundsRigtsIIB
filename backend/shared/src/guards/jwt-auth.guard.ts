// JWT Auth Guard placeholder - will be implemented in each service
export interface JwtAuthGuard {
  canActivate(context: any): boolean | Promise<boolean>;
}
