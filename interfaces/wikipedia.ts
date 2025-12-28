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
