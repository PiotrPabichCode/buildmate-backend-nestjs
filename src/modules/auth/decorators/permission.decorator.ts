import { SetMetadata, applyDecorators } from '@nestjs/common';
import { PERMISSION_KEY } from '../auth.constant';

export function Perm(permission: string | string[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission));
}

let permissions: string[] = [];

export function definePermission(modulePrefix: string, actions) {
  Object.entries(actions).forEach(([key, action]) => {
    actions[key] = `${modulePrefix}:${action}`;
  });
  permissions = [
    ...new Set([...permissions, ...Object.values<string>(actions)]),
  ];
  return actions;
}
