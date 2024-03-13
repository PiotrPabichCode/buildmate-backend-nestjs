export enum ErrorEnum {
  DEFAULT = '0:Unknown error',
  SERVER_ERROR = '500:Service busy, please try again later',

  SYSTEM_USER_EXISTS = '1001:System user already exists',
  USER_NOT_FOUND = '1002:User not found',
  INVALID_USER_PASSWORD = '1003:Invalid username password',
  INVALID_LOGIN = '1004:Invalid login credentials',
}
