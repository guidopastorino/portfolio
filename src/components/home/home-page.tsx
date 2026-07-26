import {
  ArrowRightIcon,
  BriefcaseIcon,
  FolderGit2Icon,
  GlobeIcon,
  MapPinIcon,
  MusicIcon,
  PhoneIcon,
} from "lucide-react";

import { SectionLabel } from "@/components/home/section-label";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  experience,
  projects,
  siteConfig,
  skillGroups,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const projectIcons = [BriefcaseIcon, MusicIcon, FolderGit2Icon] as const;

export function HomePage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
        <section id="about" className="scroll-mt-20">
          <Card className="justify-between py-0">
            <CardHeader className="gap-4 pt-5">
              <SectionLabel>{"// About Me"}</SectionLabel>
              <div className="space-y-2">
                <CardTitle className="font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                  Hi, I&apos;m {siteConfig.name}
                </CardTitle>
                <CardDescription className="text-sm text-foreground/80">
                  {siteConfig.title}
                </CardDescription>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {siteConfig.bio}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="#projects"
                  className={buttonVariants({ size: "default" })}
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className={buttonVariants({
                    variant: "outline",
                    size: "default",
                  })}
                >
                  Contact Me
                </a>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="size-3.5" />
                {siteConfig.location}
              </span>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <PhoneIcon className="size-3.5" />
                {siteConfig.phone}
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <GlobeIcon className="size-3.5" />
                github.com/guidopastorino
              </a>
            </CardFooter>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card id="experience" className="scroll-mt-20 py-0 lg:col-span-2">
            <CardHeader className="pt-5">
              <div className="flex items-center justify-between gap-2">
                <SectionLabel>{"// Experience"}</SectionLabel>
                <span className="text-[11px] text-muted-foreground">
                  {experience.period}
                </span>
              </div>
              <CardTitle className="font-sans text-base font-semibold">
                {experience.role}
              </CardTitle>
              <CardDescription>
                {experience.company} · {experience.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-5">
              <ul className="space-y-2.5 text-xs leading-relaxed text-muted-foreground">
                {experience.highlights.map((item) => {
                  const key = typeof item === "string" ? item : item.link.href;
                  return (
                    <li key={key} className="flex gap-2">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/40" />
                      <span>
                        {typeof item === "string" ? (
                          item
                        ) : (
                          <>
                            {item.before}
                            <a
                              href={item.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground underline-offset-2 transition-colors hover:underline"
                            >
                              {item.link.label}
                            </a>
                            {item.after}
                          </>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                {experience.stack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card id="skills" className="scroll-mt-20 py-0">
            <CardHeader className="pt-5">
              <SectionLabel>{"// Skills & AI Tools"}</SectionLabel>
            </CardHeader>
            <CardContent className="space-y-4 pb-5">
              {skillGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <p className="text-[11px] font-medium text-foreground">
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="projects" className="scroll-mt-20 space-y-3">
          <div className="flex items-center justify-between gap-3 px-1">
            <SectionLabel>{"// Featured Projects"}</SectionLabel>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View all projects
              <ArrowRightIcon className="size-3" />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project, index) => {
              const Icon = projectIcons[index] ?? FolderGit2Icon;
              return (
                <Card key={project.title} className="py-0">
                  <CardHeader className="gap-3 pt-5">
                    <div className="flex size-8 items-center justify-center border bg-muted/50">
                      <Icon className="size-4" />
                    </div>
                    <div className="space-y-1.5">
                      <CardTitle className="font-sans text-sm font-semibold">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-xs leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardFooter className="mt-auto justify-end gap-2">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <GitHubIcon className="size-3.5" />
                      View Repo
                      <ArrowRightIcon className="size-3" />
                    </a>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="contact" className="scroll-mt-20">
          <Card className="py-0">
            <CardHeader className="gap-3 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <SectionLabel>{"// Let's Connect"}</SectionLabel>
                <CardTitle className="max-w-md font-sans text-base font-medium leading-relaxed text-muted-foreground">
                  Interested in working together or just want to say hi? Reach
                  out and let&apos;s talk.
                </CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={siteConfig.phoneHref}
                  className={cn(buttonVariants({ size: "lg" }), "min-w-36")}
                >
                  <PhoneIcon data-icon="inline-start" />
                  Call Me
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "min-w-36",
                  )}
                >
                  <LinkedInIcon className="size-4" data-icon="inline-start" />
                  LinkedIn
                </a>
              </div>
            </CardHeader>
            <CardFooter className="justify-center py-4 text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  );
}
