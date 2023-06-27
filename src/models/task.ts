export default interface Task {
  _id: string;
  payload: {
    callbackUrl?: string;
    data: Record<string, unknown>;
  }
}
