import Image from "next/image";
import type React from "react";
import type { IconType } from "react-icons";
import { AiOutlineKubernetes, AiOutlineTranslation } from "react-icons/ai";
import { BsFillHexagonFill } from "react-icons/bs";
import { DiMsqlServer } from "react-icons/di";
import {
  FaAws,
  FaBrain,
  FaCloud,
  FaCode,
  FaCss3,
  FaDatabase,
  FaEye,
  FaGit,
  FaHtml5,
  FaKey,
  FaLock,
  FaMobile,
  FaNetworkWired,
  FaNodeJs,
  FaShieldAlt,
  FaTerminal,
  FaTools,
  FaUserCog,
  FaWindows,
} from "react-icons/fa";
import { GiCargoCrate } from "react-icons/gi";
import {
  SiAmazonapigateway,
  SiAmazoncloudwatch,
  SiAmazonecs,
  SiApachekafka,
  SiApple,
  SiAwsfargate,
  SiAwslambda,
  SiCloudflare,
  SiConfluence,
  SiCplusplus,
  SiDeno,
  SiDjango,
  SiDocker,
  SiDotnet,
  SiDrizzle,
  SiEventstore,
  SiExpress,
  SiFigma,
  SiFlask,
  SiFramer,
  SiGithubactions,
  SiGitlab,
  SiGnubash,
  SiGo,
  SiGooglecloud,
  SiGrafana,
  SiGraphql,
  SiHelm,
  SiHibernate,
  SiHono,
  SiJest,
  SiJira,
  SiJsonwebtokens,
  SiKotlin,
  SiKubernetes,
  SiLangchain,
  SiLens,
  SiLerna,
  SiLinux,
  SiMiro,
  SiMongodb,
  SiMqtt,
  SiMysql,
  SiNatsdotio,
  SiNestjs,
  SiNextdotjs,
  SiNx,
  SiOpenapiinitiative,
  SiOpenid,
  SiPostman,
  SiPrometheus,
  SiQt,
  SiRabbitmq,
  SiReact,
  SiRedash,
  SiRedis,
  SiRust,
  SiSentry,
  SiShell,
  SiSpotify,
  SiSpring,
  SiSupabase,
  SiSwagger,
  SiTailwindcss,
  SiTerraform,
  SiTrpc,
  SiVitest,
  SiZod,
} from "react-icons/si";
import { TbApi, TbBrain, TbBrandCSharp, TbBrandGoogle, TbBrandOauth, TbBrandOpenai, TbLicense } from "react-icons/tb";
import { VscAzure, VscAzureDevops, VscVscode } from "react-icons/vsc";

const createSvgIcon = (src: string, alt: string) => {
  const SvgIconComponent = (props: { className?: string }) => (
    <Image src={src} className={props.className} alt={alt} width={20} height={20} style={{ color: "currentColor" }} />
  );
  SvgIconComponent.displayName = `SvgIcon(${alt})`;
  return SvgIconComponent;
};

const createEmojiIcon = (emoji: string, label: string) => {
  const EmojiIconComponent = ({ className }: { className?: string }) => (
    <span className={className} role="img" aria-label={label}>
      {emoji}
    </span>
  );
  EmojiIconComponent.displayName = `EmojiIcon(${label})`;
  return EmojiIconComponent;
};

const InquirerIcon = createEmojiIcon("💬", "Inquirer.js");
const TypeScriptIcon = createSvgIcon(
  "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg",
  "TypeScript"
);
const JavaScriptIcon = createSvgIcon("https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg", "JavaScript");
const JavaIcon = createSvgIcon("/icons/java.svg", "Java");
const PythonIcon = createSvgIcon("/icons/python.svg", "Python");
const PostgreSQLIcon = createSvgIcon("/icons/postgresql.svg", "PostgreSQL");
const MongooseIcon = createSvgIcon("/icons/mongoose.svg", "Mongoose");
const TypeORMIcon = createSvgIcon("/icons/typeorm.svg", "TypeORM");
const GraphileWorkerIcon = createSvgIcon("https://worker.graphile.org/img/logo.optimized.svg", "Graphile Worker");

const ICON_DEFINITIONS: Record<string, { Icon: IconType | React.FC<{ className?: string }>; colorClass: string }> = {
  react: { Icon: SiReact, colorClass: "text-cyan-400" },
  nextjs: { Icon: SiNextdotjs, colorClass: "text-black dark:text-white" },
  tailwindcss: { Icon: SiTailwindcss, colorClass: "text-sky-400" },
  framermotion: { Icon: SiFramer, colorClass: "text-pink-400" },

  typescript: { Icon: TypeScriptIcon, colorClass: "" },
  javascript: { Icon: JavaScriptIcon, colorClass: "" },
  java: { Icon: JavaIcon, colorClass: "text-red-700" },
  python: { Icon: PythonIcon, colorClass: "text-yellow-300" },
  csharp: { Icon: TbBrandCSharp, colorClass: "text-purple-700" },
  kotlin: { Icon: SiKotlin, colorClass: "text-purple-400" },
  go: { Icon: SiGo, colorClass: "text-cyan-500" },
  rust: { Icon: SiRust, colorClass: "text-orange-600" },
  cplusplus: { Icon: SiCplusplus, colorClass: "text-blue-700" },

  nodejs: { Icon: FaNodeJs, colorClass: "text-green-600" },
  express: { Icon: SiExpress, colorClass: "text-gray-300" },
  nestjs: { Icon: SiNestjs, colorClass: "text-rose-600" },
  springboot: { Icon: SiSpring, colorClass: "text-green-500" },
  javaee: { Icon: SiSpring, colorClass: "text-green-500" },
  aspnet: { Icon: SiDotnet, colorClass: "text-blue-700" },
  django: { Icon: SiDjango, colorClass: "text-green-700" },
  flask: { Icon: SiFlask, colorClass: "text-gray-400" },
  deno: { Icon: SiDeno, colorClass: "text-green-600" },
  hono: { Icon: SiHono, colorClass: "text-orange-500" },

  postgresql: { Icon: PostgreSQLIcon, colorClass: "text-blue-800" },
  mongodb: { Icon: SiMongodb, colorClass: "text-green-700" },
  mysql: { Icon: SiMysql, colorClass: "text-blue-500" },
  mssql: { Icon: DiMsqlServer, colorClass: "text-blue-800" },
  redis: { Icon: SiRedis, colorClass: "text-red-500" },
  drizzle: { Icon: SiDrizzle, colorClass: "text-blue-600" },
  mongoose: { Icon: MongooseIcon, colorClass: "" },
  typeorm: { Icon: TypeORMIcon, colorClass: "" },
  hibernate: { Icon: SiHibernate, colorClass: "text-yellow-700" },
  jpa: { Icon: SiHibernate, colorClass: "text-yellow-700" },

  aws: { Icon: FaAws, colorClass: "text-yellow-500" },
  azure: { Icon: VscAzure, colorClass: "text-blue-500" },
  gcp: { Icon: SiGooglecloud, colorClass: "text-blue-400" },
  kubernetes: { Icon: SiKubernetes, colorClass: "text-blue-400" },
  aks: { Icon: SiKubernetes, colorClass: "text-blue-400" },
  docker: { Icon: SiDocker, colorClass: "text-blue-500" },
  terraform: { Icon: SiTerraform, colorClass: "text-purple-500" },
  helm: { Icon: SiHelm, colorClass: "text-blue-500" },
  cloudflare: { Icon: SiCloudflare, colorClass: "text-orange-500" },

  awslambda: { Icon: SiAwslambda, colorClass: "text-orange-500" },
  serverless: { Icon: SiAwslambda, colorClass: "text-orange-500" },
  awsfargate: { Icon: SiAwsfargate, colorClass: "text-orange-500" },
  awsecs: { Icon: SiAmazonecs, colorClass: "text-blue-500" },
  awss3: { Icon: FaAws, colorClass: "text-yellow-500" },
  awsamplify: { Icon: FaAws, colorClass: "text-yellow-500" },
  awssqs: { Icon: FaAws, colorClass: "text-yellow-500" },
  awssns: { Icon: FaAws, colorClass: "text-yellow-500" },
  amazonapigateway: { Icon: SiAmazonapigateway, colorClass: "text-yellow-700" },
  apigateway: { Icon: SiAmazonapigateway, colorClass: "text-orange-500" },
  amazoncloudwatch: { Icon: SiAmazoncloudwatch, colorClass: "text-purple-700" },

  graphql: { Icon: SiGraphql, colorClass: "text-pink-500" },
  restfulapis: { Icon: SiAmazonapigateway, colorClass: "text-blue-500" },
  rest: { Icon: TbApi, colorClass: "text-blue-500" },
  grpc: { Icon: SiTrpc, colorClass: "text-blue-500" },
  openapi: { Icon: SiOpenapiinitiative, colorClass: "text-green-500" },
  swagger: { Icon: SiSwagger, colorClass: "text-green-500" },
  websocket: { Icon: FaNetworkWired, colorClass: "text-gray-400" },
  websockets: { Icon: FaNetworkWired, colorClass: "text-gray-400" },
  mqtt: { Icon: SiMqtt, colorClass: "text-blue-500" },
  rabbitmq: { Icon: SiRabbitmq, colorClass: "text-orange-500" },
  apachekafka: { Icon: SiApachekafka, colorClass: "text-black" },

  git: { Icon: FaGit, colorClass: "text-orange-600" },
  gitlab: { Icon: SiGitlab, colorClass: "text-orange-600" },
  gitlabcicd: { Icon: SiGitlab, colorClass: "text-orange-600" },
  githubactions: { Icon: SiGithubactions, colorClass: "text-blue-500" },
  vscode: { Icon: VscVscode, colorClass: "text-blue-500" },
  postman: { Icon: SiPostman, colorClass: "text-orange-500" },
  jira: { Icon: SiJira, colorClass: "text-blue-500" },
  confluence: { Icon: SiConfluence, colorClass: "text-blue-400" },
  miro: { Icon: SiMiro, colorClass: "text-pink-400" },
  figma: { Icon: SiFigma, colorClass: "text-pink-500" },

  jest: { Icon: SiJest, colorClass: "text-red-500" },
  vitest: { Icon: SiVitest, colorClass: "text-green-500" },
  supertest: { Icon: SiJest, colorClass: "text-red-500" },
  unittesting: { Icon: SiJest, colorClass: "text-green-500" },
  integrationtesting: { Icon: SiJest, colorClass: "text-blue-500" },
  endtoendtesting: { Icon: SiJest, colorClass: "text-purple-500" },

  prometheus: { Icon: SiPrometheus, colorClass: "text-orange-500" },
  grafana: { Icon: SiGrafana, colorClass: "text-orange-400" },
  sentry: { Icon: SiSentry, colorClass: "text-orange-500" },
  lens: { Icon: SiLens, colorClass: "text-blue-400" },
  k8slens: { Icon: SiLens, colorClass: "text-blue-400" },
  azuremonitor: { Icon: VscAzureDevops, colorClass: "text-blue-500" },
  redash: { Icon: SiRedash, colorClass: "text-red-500" },
  freshping: { Icon: FaCloud, colorClass: "text-blue-400" },

  html5: { Icon: FaHtml5, colorClass: "text-orange-500" },
  css3: { Icon: FaCss3, colorClass: "text-blue-500" },

  jwt: { Icon: SiJsonwebtokens, colorClass: "text-purple-500" },
  oauth: { Icon: TbBrandOauth, colorClass: "text-blue-500" },
  oauth2: { Icon: TbBrandOauth, colorClass: "text-blue-500" },
  oidc: { Icon: SiOpenid, colorClass: "text-blue-600" },
  apisecurity: { Icon: FaShieldAlt, colorClass: "text-green-500" },
  rbac: { Icon: FaUserCog, colorClass: "text-purple-500" },
  ssltls: { Icon: FaLock, colorClass: "text-green-600" },
  zerotrust: { Icon: FaEye, colorClass: "text-red-500" },
  apitokens: { Icon: FaKey, colorClass: "text-yellow-500" },

  llmapis: { Icon: TbBrain, colorClass: "text-purple-500" },
  gemini: { Icon: TbBrandGoogle, colorClass: "text-blue-500" },
  openai: { Icon: TbBrandOpenai, colorClass: "text-green-500" },
  finetuning: { Icon: TbBrain, colorClass: "text-purple-600" },
  rag: { Icon: FaBrain, colorClass: "text-purple-500" },
  langchain: { Icon: SiLangchain, colorClass: "text-blue-500" },
  cursorai: { Icon: BsFillHexagonFill, colorClass: "text-purple-500" },

  inquirerjs: { Icon: InquirerIcon, colorClass: "text-gray-400" },
  bash: { Icon: SiGnubash, colorClass: "text-gray-700" },
  cli: { Icon: FaTerminal, colorClass: "text-gray-600" },
  shellscripting: { Icon: SiShell, colorClass: "text-gray-600" },
  cargo: { Icon: GiCargoCrate, colorClass: "text-orange-500" },
  nx: { Icon: SiNx, colorClass: "text-gray-400" },
  lerna: { Icon: SiLerna, colorClass: "text-blue-500" },
  monorepos: { Icon: SiLerna, colorClass: "text-blue-500" },
  supabase: { Icon: SiSupabase, colorClass: "text-green-600" },

  ipados: { Icon: FaMobile, colorClass: "text-blue-500" },
  macos: { Icon: SiApple, colorClass: "text-gray-800" },
  windows: { Icon: FaWindows, colorClass: "text-blue-600" },
  linux: { Icon: SiLinux, colorClass: "text-yellow-500" },
  linuxdistros: { Icon: SiLinux, colorClass: "text-yellow-500" },

  weatherapis: { Icon: FaCloud, colorClass: "text-blue-400" },
  translationapis: { Icon: AiOutlineTranslation, colorClass: "text-blue-500" },
  spotifyapi: { Icon: SiSpotify, colorClass: "text-green-500" },
  googlesheetsapi: { Icon: TbBrandGoogle, colorClass: "text-green-600" },
  chromeextensionapi: { Icon: TbApi, colorClass: "text-green-500" },

  microservices: { Icon: FaCode, colorClass: "text-blue-400" },
  domaindrivendesign: { Icon: FaDatabase, colorClass: "text-purple-500" },
  eventdrivenarchitecture: { Icon: SiEventstore, colorClass: "text-green-600" },
  apiversioning: { Icon: TbApi, colorClass: "text-purple-500" },
  databasemanagement: { Icon: FaDatabase, colorClass: "text-blue-600" },
  devops: { Icon: AiOutlineKubernetes, colorClass: "text-purple-600" },

  licenseanalysis: { Icon: TbLicense, colorClass: "text-green-600" },
  pyqt: { Icon: SiQt, colorClass: "text-green-600" },

  zod: { Icon: SiZod, colorClass: "text-blue-500" },
  nats: { Icon: SiNatsdotio, colorClass: "text-white-500" },
  graphileworker: { Icon: GraphileWorkerIcon, colorClass: "text-orange-600" },

  default: { Icon: FaTools, colorClass: "text-gray-400" },
};
const getIconKey = (techName: string): string => {
  const normalized = techName.toLowerCase().trim();

  if (ICON_DEFINITIONS[normalized]) {
    return normalized;
  }

  const noSpaces = normalized.replace(/\s+/g, "");
  if (ICON_DEFINITIONS[noSpaces]) {
    return noSpaces;
  }

  const noDots = normalized.replace(/[.\s]+/g, "");
  if (ICON_DEFINITIONS[noDots]) {
    return noDots;
  }

  const keywords = normalized.split(/[\s.-]+/);
  for (const keyword of keywords) {
    if (keyword && ICON_DEFINITIONS[keyword]) {
      return keyword;
    }
  }

  const abbreviations: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    py: "python",
    cpp: "cplusplus",
    "c++": "cplusplus",
    "c#": "csharp",
    golang: "go",

    next: "nextjs",
    node: "nodejs",
    nest: "nestjs",
    spring: "springboot",
    tailwind: "tailwindcss",
    framer: "framermotion",
    asp: "aspnet",
    dotnet: "aspnet",

    postgres: "postgresql",
    mongo: "mongodb",
    sqlserver: "mssql",

    amazon: "aws",
    microsoft: "azure",
    googlecloud: "gcp",
    google: "gcp",
    k8s: "kubernetes",

    lambda: "awslambda",
    serverless: "awslambda",
    fargate: "awsfargate",
    ecs: "awsecs",
    s3: "awss3",
    amplify: "awsamplify",
    sqs: "awssqs",
    sns: "awssns",
    apigateway: "amazonapigateway",
    cloudwatch: "amazoncloudwatch",

    monitor: "azuremonitor",
    keyvault: "azure",
    blobstorage: "azure",
    servicebus: "azure",

    github: "githubactions",
    vsc: "vscode",

    test: "jest",
    testing: "jest",
    unit: "unittesting",
    integration: "integrationtesting",
    e2e: "endtoendtesting",

    html: "html5",
    css: "css3",

    rest: "restfulapis",
    restful: "restfulapis",
    api: "restfulapis",
    websockets: "websocket",

    oauth2: "oauth",
    ssl: "ssltls",
    tls: "ssltls",
    security: "apisecurity",
    trust: "zerotrust",
    zero: "zerotrust",

    spotify: "spotifyapi",
    weather: "weatherapis",
    translation: "translationapis",
    sheets: "googlesheetsapi",
    chrome: "chromeextensionapi",
    extension: "chromeextensionapi",

    microservice: "microservices",
    monorepo: "monorepos",
    domain: "domaindrivendesign",
    design: "domaindrivendesign",
    event: "eventdrivenarchitecture",
    architecture: "eventdrivenarchitecture",
    versioning: "apiversioning",
    database: "databasemanagement",
    db: "databasemanagement",

    shell: "shellscripting",
    terminal: "cli",
    ipad: "ipados",
    mobile: "ipados",
    mac: "macos",
    distros: "linuxdistros",
    qt: "pyqt",
    license: "licenseanalysis",
    tokens: "apitokens",
    llm: "llmapis",
    cursor: "cursorai",
    inquirer: "inquirerjs",
    graphile: "graphileworker",
    worker: "graphileworker",
  };

  if (abbreviations[normalized]) {
    return abbreviations[normalized];
  }

  for (const keyword of keywords) {
    if (keyword && abbreviations[keyword]) {
      return abbreviations[keyword];
    }
  }

  return noDots;
};

export function getTechIcon(iconKey: string) {
  const normalizedKey = getIconKey(iconKey);
  return ICON_DEFINITIONS[normalizedKey] || ICON_DEFINITIONS.default;
}

export default ICON_DEFINITIONS;
