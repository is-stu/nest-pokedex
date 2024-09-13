export interface HttpAdapter {
  get<T>(url: string, headers?: any): Promise<T>;
}
