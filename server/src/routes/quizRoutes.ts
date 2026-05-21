import { Request, Response } from 'express';
import { ModelInfo } from "@lmstudio/sdk";
import { AiServerError, Config, Quiz, QuiZRequestItem, StudyGroup } from "../objects.js";
import { isValidQuizItem } from "../services/data_validation.js";

import {broadcastStudyData, config, ai_models_available, device_ip } from '../index.js';
import { data_study } from '../services/state.js';

export async function generateQuiz(req: Request, res: Response): Promise<void> {
  if (!req.body.data || typeof req.body.data !== "object") {
    res.send("n");
    return;
  }
  const data: QuiZRequestItem = req.body.data;
  let it = data_study.data.find((it) => it.name === data.materie_name);
  if (it && isValidQuizItem(data, it.quizs, it.files)) {
    let nou = new Quiz();
    nou.title = data.title;
    nou.is_grila = data.is_grile;
    it.quizs.push(nou);
    const materie: string[] = it.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.sinteza || "");
    const file_names: string[] = it.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.path);
    it.quizs[it.quizs.length - 1].genereate(
      data.nr_intrebari_pe_materie,
      materie,
      file_names,
      data.is_grile,
      ai_models_available,
      device_ip || "",
      () => {},
      config,
      (error: AiServerError) => {
        data_study.AiServerError.push(error);
        broadcastStudyData();
      }
    ).then(() => {
      data_study.save();
      broadcastStudyData();
    });
    data_study.save();
    broadcastStudyData();
    res.send("y");
  } else {
    res.send("n");
  }
}

export async function regenerateQuiz(req: Request, res: Response): Promise<void> {
  if (!req.body.data || typeof req.body.data !== "object") {
    res.send("n");
    return;
  }
  const data: QuiZRequestItem = req.body.data;
  console.log(data);
  if (typeof data.materie_name === 'string' && typeof data.title === 'string') {
    let materie = data_study.data.find((it) => it.name === data.materie_name);
    if (materie == null) {
      res.send('n');
      return;
    }
    const m: string[] = materie.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.sinteza || "");
    const file_names: string[] = materie.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.path);
    let quiz = materie.quizs.find((it) => it.title == data.title);
    if (quiz) {
      quiz.regenerate(
        data.nr_intrebari_pe_materie,
        m,
        file_names,
        data.is_grile,
        ai_models_available,
        device_ip || "",
        () => {},
        config,
        (error: AiServerError) => {
          data_study.AiServerError.push(error);
          broadcastStudyData();
        }
      ).then(() => {
        data_study.save();
        broadcastStudyData();
      });
    } else {
      res.send('n');
      return;
    }
  }
}

export async function deleteQuiz(req: Request, res: Response): Promise<void> {
  const { title, materie } = req.body;
  if (typeof title !== "string" || typeof materie !== "string") {
    res.send("n");
    return;
  }
  for (let it of data_study.data) {
    if (it.name === materie) {
      it.quizs = it.quizs.filter((q) => q.title.toLowerCase() !== title.toLowerCase());
      data_study.save();
      broadcastStudyData();
      res.send("y");
      return;
    }
  }
  res.send("n");
}
