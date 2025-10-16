export interface ContactSection {
  title: string;
  description: string;
  delay?: number;
}

export interface ContactPageData {
  header: {
    title: string;
    description: string;
  };
  sections: ContactSection[];
}
