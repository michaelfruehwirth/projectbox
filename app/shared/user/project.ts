export interface Pivot {
  user_id: string;
  project_id: string;
  id: number;
  role_id: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  short_name: string;
  description: string;
  status: string;
  state: string;
  start_date: string;
  due_date: string;
  finish_date: string;
  rate: string;
  rate_internal: string;
  budget: string;
  budget_internal?: any;
  budget_external?: any;
  settings: string;
  type: string;
  created_at: string;
  updated_at: string;
  state_description?: any;
  summary?: any;
  lessons_learned?: any;
  report_finish_date: string;
  number: string;
  customer_id?: any;
  logo_id: string;
  aim: string;
  non_aim: string;
  risks_text?: any;
  benefit?: any;
  steering_committee?: any;
  private: boolean;
  template: boolean;
  color: string;
  cost_type: string;
  risk: number;
  company_success?: any;
  inserted_at?: any;
  current_iteration?: any;
  customer_text: string;
  pivot: Pivot;
  user: string;
  tasks_length: number;
  customer?: any;
  actual_costs: number;
  progress_initial: number;
  logo: boolean;
}