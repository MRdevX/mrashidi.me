import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiKubernetes,
  SiNestjs,
  SiRedis,
  SiMongodb,
  SiDocker,
  SiRabbitmq,
  SiKotlin,
  SiGo,
  SiSpring,
  SiDotnet,
  SiDjango,
  SiFlask,
  SiGraphql,
  SiGooglecloud,
  SiTerraform,
  SiHelm,
  SiGithubactions,
  SiMysql,
  SiJest,
  SiPostman,
  SiJira,
  SiConfluence,
  SiNx,
  SiMiro,
  SiFigma,
  SiPrometheus,
  SiGrafana,
  SiSentry,
  SiCplusplus,
  SiExpress,
  SiSwagger,
  SiAmazonapigateway,
  SiAwslambda,
  SiGitlab,
  SiApachekafka,
  SiHibernate,
  SiAmazoncloudwatch,
  SiLens,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { FaAws, FaNetworkWired, FaNodeJs, FaTools, FaHtml5, FaCss3, FaGit } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";
import { DiMsqlServer } from "react-icons/di";
import { IconType } from "react-icons";
import React from "react";
import Image from "next/image";

const InquirerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className} role="img" aria-label="Inquirer.js">
    💬
  </span>
);

const SvgIcon: React.FC<{ src: string; className?: string; alt: string }> = ({ src, className, alt }) => (
  <Image src={src} className={className} alt={alt} width={20} height={20} style={{ color: "currentColor" }} />
);

const techIconMap: Record<string, { Icon: IconType | React.FC<{ className?: string }>; colorClass: string }> = {
  react: { Icon: SiReact, colorClass: "text-cyan-400" },
  nextjs: { Icon: SiNextdotjs, colorClass: "text-black dark:text-white" },
  tailwindcss: { Icon: SiTailwindcss, colorClass: "text-sky-400" },
  typescript: {
    Icon: (props: { className?: string }) => (
      <SvgIcon src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg" alt="TypeScript" {...props} />
    ),
    colorClass: "",
  },
  framermotion: { Icon: SiFramer, colorClass: "text-pink-400" },
  nodejs: { Icon: FaNodeJs, colorClass: "text-green-600" },
  inquirerjs: { Icon: InquirerIcon, colorClass: "text-gray-400" },
  azure: { Icon: VscAzure, colorClass: "text-blue-500" },
  kubernetes: { Icon: SiKubernetes, colorClass: "text-blue-400" },
  nestjs: { Icon: SiNestjs, colorClass: "text-rose-600" },
  postgresql: {
    Icon: (props: { className?: string }) => <SvgIcon src="/icons/postgresql.svg" alt="PostgreSQL" {...props} />,
    colorClass: "text-blue-800",
  },
  redis: { Icon: SiRedis, colorClass: "text-red-500" },
  mongodb: { Icon: SiMongodb, colorClass: "text-green-700" },
  docker: { Icon: SiDocker, colorClass: "text-blue-500" },
  aws: { Icon: FaAws, colorClass: "text-yellow-500" },
  rabbitmq: { Icon: SiRabbitmq, colorClass: "text-orange-500" },
  websocket: { Icon: FaNetworkWired, colorClass: "text-gray-400" },
  javascript: {
    Icon: (props: { className?: string }) => (
      <SvgIcon src="https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg" alt="JavaScript" {...props} />
    ),
    colorClass: "",
  },
  java: {
    Icon: (props: { className?: string }) => <SvgIcon src="/icons/java.svg" alt="Java" {...props} />,
    colorClass: "text-red-700",
  },
  csharp: { Icon: TbBrandCSharp, colorClass: "text-purple-700" },
  python: {
    Icon: (props: { className?: string }) => <SvgIcon src="/icons/python.svg" alt="Python" {...props} />,
    colorClass: "text-yellow-300",
  },
  kotlin: { Icon: SiKotlin, colorClass: "text-purple-400" },
  go: { Icon: SiGo, colorClass: "text-cyan-500" },
  springboot: { Icon: SiSpring, colorClass: "text-green-500" },
  aspnet: { Icon: SiDotnet, colorClass: "text-blue-700" },
  django: { Icon: SiDjango, colorClass: "text-green-700" },
  flask: { Icon: SiFlask, colorClass: "text-gray-400" },
  graphql: { Icon: SiGraphql, colorClass: "text-pink-500" },
  gcp: { Icon: SiGooglecloud, colorClass: "text-blue-400" },
  terraform: { Icon: SiTerraform, colorClass: "text-purple-500" },
  helm: { Icon: SiHelm, colorClass: "text-blue-500" },
  githubactions: { Icon: SiGithubactions, colorClass: "text-blue-500" },
  mysql: { Icon: SiMysql, colorClass: "text-blue-500" },
  mssql: { Icon: DiMsqlServer, colorClass: "text-blue-800" },
  jest: { Icon: SiJest, colorClass: "text-red-500" },
  postman: { Icon: SiPostman, colorClass: "text-orange-500" },
  html5: { Icon: FaHtml5, colorClass: "text-orange-500" },
  css3: { Icon: FaCss3, colorClass: "text-blue-500" },
  jira: { Icon: SiJira, colorClass: "text-blue-500" },
  confluence: { Icon: SiConfluence, colorClass: "text-blue-400" },
  nx: { Icon: SiNx, colorClass: "text-gray-400" },
  miro: { Icon: SiMiro, colorClass: "text-pink-400" },
  figma: { Icon: SiFigma, colorClass: "text-pink-500" },
  prometheus: { Icon: SiPrometheus, colorClass: "text-orange-500" },
  grafana: { Icon: SiGrafana, colorClass: "text-orange-400" },
  sentry: { Icon: SiSentry, colorClass: "text-orange-500" },
  default: { Icon: FaTools, colorClass: "text-gray-400" },
  amazonapigateway: { Icon: SiAmazonapigateway, colorClass: "text-yellow-700" },
  amazoncloudwatch: { Icon: SiAmazoncloudwatch, colorClass: "text-purple-700" },
  apachekafka: { Icon: SiApachekafka, colorClass: "text-black" },
  awslambda: { Icon: SiAwslambda, colorClass: "text-orange-500" },
  cplusplus: { Icon: SiCplusplus, colorClass: "text-blue-700" },
  express: { Icon: SiExpress, colorClass: "text-gray-300" },
  git: { Icon: FaGit, colorClass: "text-orange-600" },
  gitlab: { Icon: SiGitlab, colorClass: "text-orange-600" },
  hibernate: { Icon: SiHibernate, colorClass: "text-yellow-700" },
  lens: { Icon: SiLens, colorClass: "text-blue-400" },
  mongoose: {
    Icon: (props: { className?: string }) => <SvgIcon src="/icons/mongoose.svg" alt="Mongoose" {...props} />,
    colorClass: "",
  },
  swagger: { Icon: SiSwagger, colorClass: "text-green-500" },
  typeorm: {
    Icon: (props: { className?: string }) => <SvgIcon src="/icons/typeorm.svg" alt="TypeORM" {...props} />,
    colorClass: "",
  },
  // Aliases for skills that include logo names
  k8slens: { Icon: SiLens, colorClass: "text-blue-400" }, // K8s Lens
  jpa: { Icon: SiHibernate, colorClass: "text-yellow-700" }, // JPA uses Hibernate logo
  serverless: { Icon: SiAwslambda, colorClass: "text-orange-500" }, // Serverless uses AWS Lambda
};

export function getTechIcon(iconKey: string) {
  return techIconMap[iconKey] || techIconMap["default"];
}

export default techIconMap;
