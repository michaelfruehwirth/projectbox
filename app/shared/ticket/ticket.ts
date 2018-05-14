export class Ticket {
  user: string;
  responsible: string;
  project?: any;
  priority?: any;
  number: number;
  name: string;
  id: string;
  estimate?: any;
  due_at?: any;
  description?: any;
  date: Date;
  completed_at?: any;
  completed?: any;
  pinned :boolean;
  color: string = '#000';
}