import { Request, Response } from "express";

import DefaultSection from "../../models/defaultSection";

export async function getDefaultSections(req: Request, res: Response) {
  try {
    const defaultSections = await DefaultSection.find({});
    return res.status(200).send(defaultSections);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
