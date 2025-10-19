export interface ContactSection {
  title: string;
  description: string;
  icon?: string;
  delay?: number;
}

export interface ContactPageData {
  header: {
    title: string;
    description: string;
  };
  sections: ContactSection[];
}
