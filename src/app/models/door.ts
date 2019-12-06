export class Door {
    date: Date;
    value: string;
    reason: string;
}

export class DoorOptions {
    open_time: number;
    close_time: number;
}

export class DoorResponse {
    authorized: boolean;
    success: boolean;
    message: string
}