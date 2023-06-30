export default interface Task {
  _id: string;
  payload: {
    callbackUrl?: string;
    data: Record<string, unknown>;
  };
  triggerAt: number;
  createdAt: number;
  updatedAt: number;

  _processingId: string;
  _processingAt: number;
}
