import { type Report, ShareholderReports } from "@/components/ui/carousel";

const reportsData: Report[] = [
  {
    id: "q1fy26",
    quarter: "Q1FY26",
    period: "Q4FY26 | JULY 20, 2025",
    imageSrc:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    isNew: true,
  },
  {
    id: "q4fy25",
    quarter: "Q4FY25",
    period: "Q4FY25 | MAY 1, 2025",
    imageSrc:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "q3fy25",
    quarter: "Q3FY25",
    period: "Q3FY25 | JANUARY 20, 2025",
    imageSrc:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "q2fy25",
    quarter: "Q2FY25",
    period: "Q2FY25 | OCTOBER 15, 2024",
    imageSrc:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "q1fy25",
    quarter: "Q1FY25",
    period: "Q1FY25 | JULY 18, 2024",
    imageSrc:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  },
];

export default function ShareholderReportsDemo() {
  return (
    <div className="w-full bg-background">
      <ShareholderReports reports={reportsData} />
    </div>
  );
}
