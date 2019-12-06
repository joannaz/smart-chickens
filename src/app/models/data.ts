export class Card {
    name: string;
    value: string;
    time: Date;
  }

  export class Data {
    data : Card[]
  }

  export class HisData {
    data: Single[];
  }

  export class Single {
    value: string;
    date: Date;
  }
  
  export class Log {
    response: string[]
  }

  export class Update {
    data : any;
  }