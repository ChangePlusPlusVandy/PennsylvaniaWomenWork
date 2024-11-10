// NO POPULATE VERSION

import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";

export const createWorkshop = async (req: Request, res: Response) => {
  try {
    const { mentorId, menteeId, textContent } = req.body;

    const newWorkshop = new Workshop({
      mentor: mentorId,
      mentee: menteeId,
      textContent,
    });

    const savedWorkshop = await newWorkshop.save();
    res.status(201).json(savedWorkshop);
  } catch (error) {
    res.status(500).json({ message: "Error creating workshop", error });
  }
};

export const getWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshop", error });
  }
};

// POPULATE VERSION (if details of mentor/mentee objects are needed on the frontend like name or picture)

// import { Request, Response } from 'express';
// import { Workshop } from '../model/Workshop';

// export const createWorkshop = async (req: Request, res: Response) => {
//     try {
//         const { mentorId, menteeId, textContent } = req.body;

//         const newWorkshop = new Workshop({
//             mentor: mentorId,
//             mentee: menteeId,
//             textContent,
//         });

//         const savedWorkshop = await newWorkshop.save();
//         res.status(201).json(savedWorkshop);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating workshop', error });
//     }
// };

// export const getWorkshop = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const workshop = await Workshop.findById(id)
//             .populate('mentor')    // Populate full user details for mentor
//             .populate('mentee');   // Populate full user details for mentee

//         if (!workshop) {
//             return res.status(404).json({ message: 'Workshop not found' });
//         }

//         res.status(200).json(workshop);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving workshop', error });
//     }
// };
