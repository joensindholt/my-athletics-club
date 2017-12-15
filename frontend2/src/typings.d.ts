/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var gapi: any;

interface DatePickerOptions {
  autoShow?: boolean;
  autoHide?: boolean;
  format?: string;
}

interface JQuery {
  datepicker: (options?: DatePickerOptions) => any;
}
