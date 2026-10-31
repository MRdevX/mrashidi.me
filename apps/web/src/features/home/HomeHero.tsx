"use client";

import { MapPin } from "lucide-react";
import { SocialButtonsRow } from "@/components/ui";
import { useContent } from "@/lib/content";
import { TypingAnimation } from "./TypingAnimation";

export function HomeHero() {
  const { profile } = useContent();
  return (
    <section className="hero-section">
      <h1 className="hero-name">{profile.person.name}</h1>
      <p className="hero-subtitle text-body">
        <TypingAnimation
          strings={[
            profile.person.title,
            "Cloud Practitioner",
            "Backend & Systems Engineer",
            "Open Source Contributor",
          ]}
          typeSpeed={80}
          deleteSpeed={40}
          pauseAtEnd={1500}
          className="font-terminal text-brand-text"
        />
      </p>
      <p className="hero-description text-body">{profile.site.description}</p>
      <p className="hero-location text-body">
        <MapPin className="icon-primary size-5" aria-hidden />
        {profile.person.location}
      </p>
      <SocialButtonsRow className="md:[&_.social-buttons-container]:justify-start" />
    </section>
  );
}
