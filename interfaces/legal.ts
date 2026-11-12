export interface ILegalSection { id: string; title: string; paragraphs: string[]; bullets?: string[] }
export interface ILegalDocument { title: string; updatedAt: string /* YYYY-MM-DD */; intro?: string; sections: ILegalSection[] }
