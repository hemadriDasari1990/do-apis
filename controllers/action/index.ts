import { Request, Response } from "express";
import {
  actionItemAddFields,
  actionItemsLookup,
} from "../../util/actionItemFilters";

import Action from "../../models/action";
import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import { findActionItemsByActionAndDelete } from "../actionItem";
import mongoose from "mongoose";

export async function saveSection(input: any) {
  try {
    if (!input) {
      return;
    }
    const action = new Action(input);
    return await action.save();
  } catch (err) {
    throw err;
  }
}

export async function updateAction(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(payload?.actionId) },
      update = {
        $set: {
          title: payload?.title,
          boardId: payload?.boardId,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const action = await getAction({
      $and: [{ title: payload?.title?.trim() }, { boardId: payload?.boardId }],
    });
    if (action) {
      return {
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Action with ${action?.title} already exist. Please choose different name`,
      };
    }
    const updated: any = await Action.findOneAndUpdate(query, update, options);
    return updated;
  } catch (err) {
    return err;
  }
}

export async function getAction(query: { [Key: string]: any }): Promise<any> {
  try {
    const actions = await Action.aggregate([
      { $match: query },
      actionItemsLookup,
      actionItemAddFields,
    ]);
    return actions ? actions[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getActionByBoardId(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const action = await getAction({
      boardId: mongoose.Types.ObjectId(req.params.boardId),
    });
    return res.status(200).json(action);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function deleteAction(actionId: string): Promise<any> {
  try {
    const deleted: any = deleteActionAndActionItems(actionId);
    if (!deleted) {
      return deleted;
    }
    return { deleted: true, _id: actionId };
  } catch (err) {
    return {
      deleted: false,
      message: err || err?.message,
      _id: actionId,
    };
  }
}

async function deleteActionAndActionItems(actionId: string) {
  try {
    await findActionItemsByActionAndDelete(actionId);
    const deleted = await Action.findByIdAndRemove(actionId);
    return deleted;
  } catch (err) {
    throw `Error while deleting action and action items associated ${err ||
      err.message}`;
  }
}

export async function removeActionItemFromAction(
  actionItemId: string,
  actionId: string
): Promise<any> {
  try {
    if (!actionItemId || !actionId) {
      return;
    }
    const updated = await Action.findByIdAndUpdate(
      actionId,
      { $pull: { notes: actionItemId } }
      // { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while removing action item from action ${err || err.message}`;
  }
}

export async function findActionsByBoardAndDelete(
  boardId: string
): Promise<any> {
  try {
    const action = await getAction({
      boardId: mongoose.Types.ObjectId(boardId),
    });
    if (!action) {
      return;
    }
    const deleted = await deleteAction(action._id);
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function addActionItemToAction(
  actionItemId: string,
  actionId: string
): Promise<any> {
  try {
    if (!actionItemId || !actionId) {
      return;
    }
    const updated = await Action.findByIdAndUpdate(
      actionId,
      { $push: { notes: actionItemId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while adding action item to action ${err || err.message}`;
  }
}
