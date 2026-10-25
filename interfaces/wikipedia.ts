export interface IWikipediaThumbnail {
  source: string;
  width: number;
  height: number;
}

export interface IWikipediaContentUrls {
  desktop: {
    page: string;
  };
  mobile: {
    page: string;
  };
}

export interface IWikipediaSummary {
  title: string;
  extract: string;
  thumbnail?: IWikipediaThumbnail;
  content_urls: IWikipediaContentUrls;
  description?: string;
}

/** Resumen de una ciudad en Wikipedia, ya recortado a lo que se muestra. */
export interface IWikipediaCityInfo {
  title: string;
  extract: string;
  thumbnail?: IWikipediaThumbnail;
  url: string;
  description?: string;
}
