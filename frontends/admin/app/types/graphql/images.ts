import type { BaseImage } from './products';
import type { GraphQlData, RelayEdge } from './utils';



export type ProductImage = GraphQlData<'allImages', BaseImage[]>
