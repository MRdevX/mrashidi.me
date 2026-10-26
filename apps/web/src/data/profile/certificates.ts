export interface Certificate {
  name: string;
  year: string;
  provider: string;
  type: string;
  url?: string;
}

export interface CertificateCategory {
  category: string;
  certificates: Certificate[];
}

const certificates: CertificateCategory[] = [
  {
    category: "Cloud & DevOps",
    certificates: [
      {
        name: "AWS Cloud Technical Essentials",
        year: "2025",
        provider: "AWS Training",
        type: "Certificate of Completion",
        url: "https://www.coursera.org/account/accomplishments/verify/YYO9N4WROW94",
      },
      {
        name: "Introduction to Generative AI by Google Cloud",
        year: "2025",
        provider: "Google Cloud",
        type: "Certificate of Completion",
        url: "https://www.coursera.org/account/accomplishments/records/AW1BY8KMPD2B",
      },
      {
        name: "Advanced Terraform",
        year: "2024",
        provider: "LinkedIn",
        type: "Certificate of Completion",
        url: "https://www.linkedin.com/learning/certificates/cc2c2401ede3d03935e490b1a16c5917e8a9c2cdbbf7634822b28710114a4082?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BAJVt7XQKQum8d2MLRm5Jcg%3D%3D",
      },
      {
        name: "Microservices: Security",
        year: "2024",
        provider: "LinkedIn",
        type: "Certificate of Completion",
        url: "https://www.linkedin.com/learning/certificates/6081f6b02e24d03c43943b62e12317892e637f2c1550dd320285276c4f061959?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BAJVt7XQKQum8d2MLRm5Jcg%3D%3D",
      },
      {
        name: "Azure Administration Essential Training",
        year: "2024",
        provider: "LinkedIn",
        type: "Certificate of Completion",
        url: "https://www.linkedin.com/learning/certificates/f70407d91eedefa56890e46d1ce422d1918b45b2e5755c3673f2255b38801fe3?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BAJVt7XQKQum8d2MLRm5Jcg%3D%3D",
      },
    ],
  },
  {
    category: "Backend Development",
    certificates: [
      {
        name: "Building High‑Throughput Data Microservices",
        year: "2024",
        provider: "LinkedIn",
        type: "Certificate of Completion",
        url: "https://www.linkedin.com/learning/certificates/538366a4ed7d77a6b343c449c177747909fd86466fc3e403bccbe02666fbf634?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BAJVt7XQKQum8d2MLRm5Jcg%3D%3D",
      },
      {
        name: "The Complete Docker Bootcamp for Web Developers",
        year: "2020",
        provider: "Udemy",
        type: "Certificate of Completion",
        url: "https://www.udemy.com/certificate/UC-f153ca95-6cfb-4eb2-93f2-f56adb547bfc/",
      },
      {
        name: "Object‑Oriented Programming in JavaScript",
        year: "2018",
        provider: "Code With Mosh",
        type: "Course Completion",
      },
      {
        name: "The Complete Node.js Course",
        year: "2018",
        provider: "Code With Mosh",
        type: "Course Completion",
      },
      {
        name: "REST APIs with Flask and Python",
        year: "2017",
        provider: "Udemy",
        type: "Certificate of Completion",
        url: "https://www.udemy.com/certificate/UC-CHNKG5M3/",
      },
      {
        name: "The Complete Python & PostgreSQL Developer Course",
        year: "2017",
        provider: "Udemy",
        type: "Certificate of Completion",
        url: "https://www.udemy.com/certificate/UC-4IZQ20EP/",
      },
      {
        name: "The Complete Java Developer Course",
        year: "2017",
        provider: "Udemy",
        type: "Certificate of Completion",
        url: "https://www.udemy.com/certificate/UC-BQ5PNP4G/",
      },
      {
        name: "Learn Database Design with MySQL",
        year: "2017",
        provider: "Udemy",
        type: "Certificate of Completion",
        url: "https://www.udemy.com/certificate/UC-V1A0ATIM/",
      },
    ],
  },
  {
    category: "Leadership & Collaboration",
    certificates: [
      {
        name: "Critical Thinking for Better Judgment and Decision‑Making",
        year: "2024",
        provider: "LinkedIn",
        type: "Certificate of Completion",
        url: "https://www.linkedin.com/learning/certificates/6d597142433ba7665cc30ab529120bea1caccb60401d333d0d5dd77dfac5363a?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BAJVt7XQKQum8d2MLRm5Jcg%3D%3D",
      },
      {
        name: "Working with Difficult People",
        year: "2024",
        provider: "LinkedIn",
        type: "Certificate of Completion",
        url: "https://www.linkedin.com/learning/certificates/7ca34d78f0854adf2b019ef016794ac4d8c7ee553fa688afa876b7864c7e6e94?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BAJVt7XQKQum8d2MLRm5Jcg%3D%3D",
      },
      {
        name: "How to Have Productive One‑on‑One Meetings",
        year: "2024",
        provider: "LinkedIn",
        type: "Certificate of Completion",
        url: "https://www.linkedin.com/learning/certificates/71398e1fc506b5057f093ed1e5f60dcbdbd0435d6e838da037c71ec9204e921d?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BAJVt7XQKQum8d2MLRm5Jcg%3D%3D",
      },
    ],
  },
];

export default certificates;
