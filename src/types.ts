export type Project = {
  img?: string;
  alt?: string;
  title: string;
  desc: string;
  path: string;
  external?: boolean;
  tags?: string[];
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
};
