export interface ContactSection {
  title: string;
  description: string;
  delay?: number;
}

export interface ADPListWidget {
  src: string;
  title: string;
  height: string;
  width?: string;
  padding?: string;
}

export interface ContactPageData {
  header: {
    title: string;
    description: string;
  };
  sections: ContactSection[];
  adpListWidgets: {
    booking: ADPListWidget;
    impact: ADPListWidget;
    reviews: ADPListWidget;
  };
}
