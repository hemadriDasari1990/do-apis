import { Request, Response } from "express";
import { noteAddFields, notesLookup } from "../../util/noteFilters";

import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import Section from "../../models/section";
import SectionActivity from "../../models/sectionActivity";
import { findNotesBySectionAndDelete } from "../note";
import mongoose from "mongoose";

export async function saveSection(input: any) {
  try {
    if (!input) {
      return;
    }
    const section = new Section(input);
    return await section.save();
  } catch (err) {
    throw err;
  }
}

export async function updateSection(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(payload?.sectionId) },
      update = {
        $set: {
          title: payload?.title,
          description: payload?.description,
          boardId: payload?.boardId,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const section = await getSection({
      $and: [{ title: payload?.title?.trim() }, { boardId: payload?.boardId }],
    });
    if (section) {
      return {
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Section with ${section?.title} already exist. Please choose different name`,
      };
    }
    const updated: any = await Section.findOneAndUpdate(query, update, options);
    await createSectionActivity(updated._id, "update", payload?.user?._id);
    return updated;
  } catch (err) {
    return err;
  }
}

export async function getSection(query: { [Key: string]: any }): Promise<any> {
  try {
    const sections = await Section.aggregate([
      { $match: query },
      notesLookup,
      noteAddFields,
    ]);
    return sections ? sections[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function createSectionActivity(
  sectionId: string,
  action: string,
  userId?: string
): Promise<any> {
  try {
    const activity = await new SectionActivity({
      userId: userId,
      sectionId: sectionId,
      type: "section",
      action: action,
    });
    await activity.save();
  } catch (err) {
    throw err || err.message;
  }
}

export async function getSectionsByBoardId(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const sections = await getSections(req.params.boardId);
    return res.status(200).json(sections);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function addAndRemoveNoteFromSection(data: {
  [Key: string]: any;
}): Promise<any> {
  try {
    await addNoteToSection(data.noteId, data.destinationSectionId);
    const updated = await removeNoteFromSection(
      data.noteId,
      data.sourceSectionId
    );
    return updated;
  } catch (err) {
    throw err || err.message;
  }
}

async function getSections(boardId: string): Promise<any> {
  try {
    const query = { boardId: mongoose.Types.ObjectId(boardId) };
    const sections = await Section.aggregate([
      { $match: query },
      notesLookup,
      noteAddFields,
    ]);
    // socket.emit("sections-list", sections);
    return sections;
  } catch (err) {
    throw err | err.message;
  }
}

export async function deleteSection(
  sectionId: string,
  userId: string
): Promise<any> {
  try {
    const deleted: any = deleteSectionAndNotes(sectionId);
    if (!deleted) {
      return deleted;
    }
    await createSectionActivity(deleted._id, "delete", userId);
    return { deleted: true, _id: sectionId };
  } catch (err) {
    return {
      deleted: false,
      message: err || err?.message,
      _id: sectionId,
    };
  }
}

async function deleteSectionAndNotes(sectionId: string) {
  try {
    await findNotesBySectionAndDelete(sectionId);
    const deleted = await Section.findByIdAndRemove(sectionId);
    return deleted;
  } catch (err) {
    throw `Error while deleting section and notes associated ${err ||
      err.message}`;
  }
}

export async function removeNoteFromSection(
  noteId: string,
  sectionId: string
): Promise<any> {
  try {
    if (!noteId || !sectionId) {
      return;
    }
    const updated = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { notes: noteId } }
      // { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while removing note from section ${err || err.message}`;
  }
}

export async function findSectionsByBoardAndDelete(
  boardId: string
): Promise<any> {
  try {
    const sectionsList = await getSections(boardId);
    if (!sectionsList?.length) {
      return;
    }
    const deleted = sectionsList.reduce(
      async (promise: Promise<any>, section: { [Key: string]: any }) => {
        await promise;
        await deleteSectionAndNotes(section._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function addNoteToSection(
  noteId: string,
  sectionId: string
): Promise<any> {
  try {
    if (!noteId || !sectionId) {
      return;
    }
    const updated = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { notes: noteId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while adding note to section ${err || err.message}`;
  }
}
