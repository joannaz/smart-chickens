import {Role} from './role'

export class User {
    token: string
    userObj: UserObj
  }

export class UserObj {
  username: string
  name: string
  verified: boolean
  door_control: boolean
  role: Role
  default_pic: boolean
}

export class Emails {
  emails: string[]
}