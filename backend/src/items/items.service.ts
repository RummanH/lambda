import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Item } from './item.model';

// In-memory only - resets whenever the process restarts (and each Lambda
// instance has its own copy). No database, on purpose - this exists to
// exercise the deploy pipeline, not to persist real data.
@Injectable()
export class ItemsService {
  private items: Item[] = [];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: string): Item {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return item;
  }

  create(name: string): Item {
    const item: Item = { id: randomUUID(), name };
    this.items.push(item);
    return item;
  }

  update(id: string, name: string): Item {
    const item = this.findOne(id);
    item.name = name;
    return item;
  }

  remove(id: string): void {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    this.items.splice(index, 1);
  }
}
