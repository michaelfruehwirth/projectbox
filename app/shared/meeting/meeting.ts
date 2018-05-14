export class Meeting {
    protocol :string;
    project :string;
    name :string;
    location :string;
    id :string;
    duration :Number;
    date :Date;
    attendees? :any;
    project_color? :string;
    agenda? :any;
  }

  export class AgendaPoint {
    id :string;
    name :string;
    responsible :string;
    duration :number;
    order :number;
  }

  export class Attendee {
    id :string;
    name :string;
    email :string;
    abbreviation :string;
    order :number;
  }