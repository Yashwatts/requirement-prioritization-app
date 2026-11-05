import { Type } from '@mikro-orm/core';
import { StudyModality } from '../../../domain/requirement/enums/study-modality.enum';

export class StudyModalityType extends Type<StudyModality, number> {
  private readonly enumMapper: Record<StudyModality, number> = {
    [StudyModality.VIRTUAL]: 1,
    [StudyModality.PRESENCIAL]: 2,
    [StudyModality.VIRTUAL_PRESENCIAL]: 3,
  };

  private readonly reverseMapper: Record<number, StudyModality> = {
    1: StudyModality.VIRTUAL,
    2: StudyModality.PRESENCIAL,
    3: StudyModality.VIRTUAL_PRESENCIAL,
  };

  convertToDatabaseValue(value: StudyModality): number {
    const dbValue = this.enumMapper[value];
    if (dbValue === undefined) {
      throw new Error(`Invalid StudyModality value: ${value}`);
    }
    return dbValue;
  }

  convertToJSValue(value: number): StudyModality {
    const jsValue = this.reverseMapper[value];
    if (jsValue === undefined) {
      throw new Error(`Invalid database value for StudyModality: ${value}`);
    }
    return jsValue;
  }
}
