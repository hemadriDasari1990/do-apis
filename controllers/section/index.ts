import {
  RESOURCE_ALREADY_EXISTS,
  SECTION_COUNT_EXCEEDS,
} from "../../util/constants";
import { Request, Response } from "express";
import {
  findNotesBySectionAndDelete,
  getNoteDetails,
  updateNoteSectionId,
} from "../note";
import {
  noteAddFields,
  notesLookup,
  sectionNoteAddFields,
} from "../../util/noteFilters";

import Section from "../../models/section";
import { createActivity } from "../activity";
import mongoose from "mongoose";
import { addSectionToBoard } from "../board";

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
    const sectionCount: number = await Section.find({
      boardId: payload?.boardId,
    }).count();
    if (sectionCount > 10) {
      return {
        errorId: SECTION_COUNT_EXCEEDS,
        message: `Max no of sections allowed are only 10`,
      };
    }
    const query = { _id: mongoose.Types.ObjectId(payload?.sectionId) },
      update = {
        $set: {
          name: payload?.name,
          boardId: payload?.boardId,
          ...(!payload?.sectionId ? { position: sectionCount || 0 } : {}),
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const section = await getSection({
      $and: [{ name: payload?.name?.trim() }, { boardId: payload?.boardId }],
    });
    if (section && !payload?.sectionId) {
      return {
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Section with ${section?.name} already exist. Please choose different name`,
      };
    }
    const updated: any = await Section.findOneAndUpdate(query, update, options);

    if (!payload?.sectionId && updated?._id) {
      await addSectionToBoard(updated?._id, updated?.boardId);
    }
    if (payload?.sectionId) {
      await createActivity({
        memberId: payload?.memberId,
        boardId: payload?.boardId,
        title: `section`,
        primaryAction: "from",
        primaryTitle: payload?.previousTitle,
        secondaryAction: "to",
        secondaryTitle: updated?.name,
        type: "section",
        action: "update",
      });
    } else {
      await createActivity({
        memberId: payload?.memberId,
        boardId: payload?.boardId,
        title: `${updated?.name}`,
        primaryAction: "as",
        primaryTitle: "section",
        type: "section",
        action: "create",
      });
    }

    return updated;
  } catch (err) {
    throw err;
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
    const destinationSectionUpdated: any = await addNoteToSection(
      data.noteId,
      data.destinationSectionId
    );
    const sourceSectionUpdated: any = await removeNoteFromSection(
      data.noteId,
      data.sourceSectionId
    );
    await updateNoteSectionId(data.noteId, data.destinationSectionId);
    const noteDetails = await getNoteDetails(data.noteId);
    await createActivity({
      memberId: data?.memberId,
      boardId: data?.boardId,
      title: `${noteDetails?.description}`,
      primaryAction: "from",
      primaryTitle: `${sourceSectionUpdated?.name}`,
      secondaryAction: "to",
      secondaryTitle: `${destinationSectionUpdated?.name}`,
      type: "note",
      action: "move",
    });
    return noteDetails;
  } catch (err) {
    throw err || err.message;
  }
}

async function getSections(boardId: string): Promise<any> {
  try {
    const query = { boardId: mongoose.Types.ObjectId(boardId) };
    const sections = await Section.aggregate([
      { $match: query },
      { $sort: { position: 1 } },
      notesLookup,
      sectionNoteAddFields,
    ]);
    // socket.emit("sections-list", sections);
    return sections;
  } catch (err) {
    throw err | err.message;
  }
}

export async function deleteSection(
  sectionId: string,
  memberId: string,
  boardId: string
): Promise<any> {
  try {
    const deleted: any = deleteSectionAndNotes(sectionId);
    if (!deleted) {
      return deleted;
    }
    await createActivity({
      memberId,
      boardId: boardId,
      title: "section",
      type: "section",
      action: "delete",
    });
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
      { $pull: { notes: noteId } },
      { new: true, useFindAndModify: false }
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

export async function changeSectionPosition(
  sourceSection: { [Key: string]: any },
  destinationSection: { [Key: string]: any }
): Promise<any> {
  try {
    if (
      !sourceSection ||
      !sourceSection?._id ||
      !destinationSection ||
      !destinationSection?._id
    ) {
      return;
    }
    await Section.findByIdAndUpdate(
      sourceSection?._id,
      { $set: { position: destinationSection?.position } },
      { new: true, useFindAndModify: false }
    );
    await Section.findByIdAndUpdate(
      destinationSection?._id,
      { $set: { position: sourceSection?.position } },
      { new: true, useFindAndModify: false }
    );
    return {
      updated: true,
    };
  } catch (err) {
    throw `Error while reordering section ${err || err.message}`;
  }
}
