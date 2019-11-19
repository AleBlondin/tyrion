import uuid from 'uuid';

import { DebtItemInterface } from './types';

export default class DebtItem implements DebtItemInterface {
  public id: string;
  public type: string;
  public category: string;
  public comment: string;
  public fileName: string;
  public price?: number;

  public constructor({
    id,
    type,
    category,
    comment,
    fileName,
    price,
  }: {
    id?: string;
    type: string;
    category: string;
    comment: string;
    fileName: string;
    price?: number;
  }) {
    this.id = id || uuid();
    this.type = type;
    this.category = category;
    this.comment = comment;
    this.fileName = fileName;
    this.price = price;
  }
}
