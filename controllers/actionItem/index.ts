import { Request, Response } from "express";
import {
  assignedByLookUp,
  assignedToLookUp,
} from "../../util/actionItemFilters";

import ActionItem from "../../models/actionItem";
import { addActionItemToAction } from "../action";

import mongoose from "mongoose";

export async function updateActionItem(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(payload.noteId) },
      update = {
        $set: {
          description: payload.description,
          actionId: payload.actionId,
          assignedById: payload.assignedById || null,
          assignedToId: payload.assignedToId || null,
          status: payload?.status,
          priority: payload?.priority,
          dueDate: payload?.dueDate,
          boardId: payload?.boardId,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updated: any = await ActionItem.findOneAndUpdate(
      query,
      update,
      options
    );
    await addActionItemToAction(updated._id, payload.actionId);
    return updated;
  } catch (err) {
    return err || err.message;
  }
}

export async function getActionItemsByActionId(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { actionId: mongoose.Types.ObjectId(req.params.actionId) };
    const actionItems = await ActionItem.aggregate([
      { $match: query },
      assignedByLookUp,
      {
        $unwind: {
          path: "$assignedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      assignedToLookUp,
      {
        $unwind: {
          path: "$assignedTo",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return res.status(200).json(actionItems);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function deleteActionItem(
  id: string,
  actionId: string
): Promise<any> {
  try {
    const deleted = deleteActionItemById(id);
    if (!deleted) {
      return deleted;
    }
    return { deleted: true, _id: id, actionId };
  } catch (err) {
    return {
      deleted: false,
      message: err || err?.message,
      _id: id,
      actionId,
    };
  }
}

export async function updateActionItemActionId(
  actionItemId: string,
  actionId: string
): Promise<any> {
  try {
    if (!actionItemId || !actionId) {
      return;
    }
    const updated = await ActionItem.findByIdAndUpdate(actionItemId, {
      actionId: actionId,
    });
    return updated;
  } catch (err) {
    throw `Error while updating new action ${err || err.message}`;
  }
}

export async function findActionItemsByActionAndDelete(
  sectionId: string
): Promise<any> {
  try {
    const notesList = await getActionItemsByAction(sectionId);
    if (!notesList?.length) {
      return;
    }
    const deleted = notesList.reduce(
      async (promise: Promise<any>, note: { [Key: string]: any }) => {
        await promise;
        await deleteActionItemById(note._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getActionItem(query: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const actionItem = await ActionItem.findOne(query);
    return actionItem;
  } catch (err) {
    throw err | err.message;
  }
}

async function deleteActionItemById(actionItemId: string): Promise<any> {
  try {
    if (!actionItemId) {
      return;
    }
    return await ActionItem.findByIdAndRemove(actionItemId);
  } catch (err) {
    throw `Error while deleting action item ${err || err.message}`;
  }
}

async function getActionItemsByAction(actionId: string): Promise<any> {
  try {
    if (!actionId) {
      return;
    }
    return await ActionItem.find({ actionId });
  } catch (err) {
    throw `Error while fetching action items ${err || err.message}`;
  }
}
