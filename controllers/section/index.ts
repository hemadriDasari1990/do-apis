import { NextFunction, Request, Response } from "express";
import { noteAddFields, notesLookup } from "../../util/noteFilters";

import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import Section from "../../models/section";
import { findNotesBySectionAndDelete } from "../note";
import mongoose from "mongoose";
import { socket } from "../../index";

export async function createSection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const created = await saveSection(req.body);
    if (!created) {
      return next(created);
    }
    socket.emit("new-section", created);
    return res.status(200).send("Title created Successfully");
  } catch (err) {
    throw new Error(err || err.message);
  }
}

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

export async function updateSection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.body.sectionId) },
      update = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          projectId: req.body.projectId,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const section = await getSection({
      $and: [{ title: req.body.title }, { userId: req.body.userId }],
    });
    if (section) {
      return res.status(409).json({
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Section with ${section?.title} already exist. Please choose different name`,
      });
    }
    const updated = await Section.findOneAndUpdate(query, update, options);
    if (!updated) {
      return next(updated);
    }
    socket.emit("update-section", updated);
    // await addDepartmentToUser(updated?._id, req.body.userId);
    return res.status(200).send(updated);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

async function getSection(query: { [Key: string]: any }): Promise<any> {
  try {
    const section = await Section.findOne(query);
    return section;
  } catch (err) {
    throw err | err.message;
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const deleted = deleteSectionAndNotes(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    socket.emit("delete-section", deleted);
    return res.status(200).send(deleted);
  } catch (err) {
    return res.status(500).send(err || err.message);
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
