import type { ContactPageData } from "./types";

export const contactData: ContactPageData = {
  header: {
    title: "Get In Touch",
    description:
      "Have a question or want to discuss a potential project? Feel free to reach out using the form below. I'll get back to you as soon as possible.",
  },
  sections: [
    {
      title: "Book a Mentorship Session",
      description:
        "Interested in career guidance or technical mentorship? Book a free session with me through ADPList.",
      delay: 0.4,
    },
    {
      title: "My Mentorship Impact & Reviews",
      description: "See what others have said about their mentorship sessions and the impact we've made together.",
      delay: 0.5,
    },
  ],
  adpListWidgets: {
    booking: {
      src: "booking?src=mahdi-rashidi&theme=dark",
      title: "ADPList Mentorship Calendar",
      height: "600px",
    },
    impact: {
      src: "impact?src=mahdi-rashidi&theme=dark",
      title: "ADPList Impact",
      height: "560px",
      padding: "16px",
    },
    reviews: {
      src: "reviews?src=mahdi-rashidi&theme=dark",
      title: "ADPList Reviews",
      height: "560px",
      padding: "16px",
    },
  },
};
