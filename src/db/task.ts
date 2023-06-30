import { Schema, model } from 'mongoose';
import { getCollectionName } from './utils/collection';
import Task from '../models/task';
import { ID_DEFINITION } from './utils/schema';
import { getEnvNumber } from '../helpers/system';
import { nowMs } from '../helpers/datetime';

const TaskSchema = new Schema<Task>({
  _id: ID_DEFINITION,
  payload: Object,
  triggerAt: { type: Number, index: true },

  createdAt: Number,
  updatedAt: Number,

  _processingAt: { type: Number, default: 0, index: true },
  _processingId: { type: String, index: true }
}, {
  versionKey: false,
  timestamps: true
});

const collection =  model<Task>(getCollectionName('Task'), TaskSchema);

export const updateManyById = (ids: string[], task: Partial<Task>) =>
  collection.updateMany({ _id: { $in: ids } }, task);

export const markFailed = (ids: string[]) => collection.updateMany(
  { _id: { $in: ids } },
  { $unset: { _processingAt: null, _processingId: null }
}).exec();

export const markCompleted = (processId: string) => collection.deleteMany({ _processingId: processId }).then(res => res.deletedCount);

export const find = (condition: Partial<Task>, options?: { fields: (keyof Task)[] }) =>
  collection.find(condition, options?.fields)
  .lean();

export const findAvailable = (limit: number, options?: { fields: (keyof Task)[] }) =>
  collection.find(
    {
      $or: [
        { _processingId: { $exists: false } },
        { _processingAt: { $lt: nowMs() - getEnvNumber('OVERDUE_PROCESSING_MS') } }
      ],
      triggerAt: { $lte: nowMs() }
    },
    options?.fields
  ).sort({ triggerAt: 1 })
    .limit(limit)
    .lean();
