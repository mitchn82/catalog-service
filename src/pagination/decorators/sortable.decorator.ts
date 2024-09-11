import { SetMetadata } from '@nestjs/common';

export const SORTABLE_KEY = 'sortable';
export const Sortable = () => SetMetadata(SORTABLE_KEY, true);
