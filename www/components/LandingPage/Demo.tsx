import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import * as React from "react";
import Icon from "../Icon";
import Markdown from "../Markdown";
import Spacer from "../Spacer";
import { P } from "../Typography";

const dateOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};

function getDateBefore(date) {
  const today = new Date(date);
  today.setDate(today.getDate() - 1);
  return today;
}

function getDates() {
  const today = new Date();
  const yesterday = getDateBefore(today);
  const dayBefore = getDateBefore(yesterday);

  return [today, yesterday, dayBefore].map((date) =>
    new Date(date).toLocaleDateString("en-US", dateOptions)
  );
}

export default function LandingPageDemo() {
  const dates = getDates();

  return (
    <Container>
      <Header>
        <P size="tiny">{dates[0]}</P>
      </Header>
      <Grid>
        <ClipWrapper>
          <ClipItem>
            <LinkClip
              title="Abstract – Design collaboration without the chaos"
              markdown={`**Taking this for a spin 👨🏻‍🎨** \n* Collaborate in individual workspaces and maintain explorations for yourself and your team.\n\n* Document and capture the process as you go.\n\n* Bring only what’s in scope into a centralized Master file.\n\n* Bring visibility into the design process"
              `}
            />
          </ClipItem>
        </ClipWrapper>
        <ClipWrapper>
          <ClipItem>
            <ImageClip
              description="We’ve come to Cold Springs a fair amount of times over the past few
          months. 😁🍂"
              src="https://user-images.githubusercontent.com/12195101/98868257-d92ad500-243d-11eb-8ca4-760a7de83e33.jpg"
              width={1280}
              height={960}
            />
          </ClipItem>
        </ClipWrapper>
      </Grid>
      <Header>
        <P size="tiny">{dates[1]}</P>
      </Header>
      <Grid>
        <ClipWrapper>
          <ClipItem>
            <ImageClip
              description=""
              src="https://user-images.githubusercontent.com/12195101/98869286-894d0d80-243f-11eb-9c93-e06e640c83bb.gif"
              width={400}
              height={500}
            />
          </ClipItem>
        </ClipWrapper>
      </Grid>
      <Header>
        <P size="tiny">{dates[2]}</P>
      </Header>
      <Grid>
        <ClipWrapper>
          <ClipItem>
            <TextClip
              markdown={`**New Macbook announcement 💻**\n\n> And up to 20 hours of battery life — the longest of any Mac ever.\n\nWait til you open any application! 🌪`}
            />
          </ClipItem>
        </ClipWrapper>
        <ClipWrapper>
          <ClipItem>
            <LinkClip
              title="Orbit Controls"
              markdown={`Taking the orbit controls from three and putting a little spin to it. Honestly there's so much math in here that I don't really know what I'm doing – but you know what it works 🙃`}
            />
          </ClipItem>
        </ClipWrapper>
      </Grid>
    </Container>
  );
}

const fadeIn = keyframes`
  to {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px);
  }
`;

const Container = styled.div`
  transform: translate3d(0px, 16px, 0px);
  opacity: 0;
  box-shadow: 0 0 0 1px var(--gridColor);
  animation: ${fadeIn} 2000ms var(--ease) 400ms;
  animation-fill-mode: forwards;
`;

const Header = styled.div`
  padding: var(--unit);
  border-bottom: 1px solid var(--gridColor);
`;

const ClipWrapper = styled.div`
  position: relative;
  padding-top: 100%;
  box-shadow: 0 0 0 1px var(--gridColor);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--contentBackgroundTint);
  box-shadow: 0 0 0 1px var(--gridColor);

  @media (min-width: 601px) {
    ${ClipWrapper}:nth-of-type(3n+3) {
      box-shadow: none;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);

    ${ClipWrapper}:nth-of-type(even) {
      box-shadow: none;
    }
  }
`;

const ClipItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--contentBackground);
  padding: calc(var(--unit) * 2);
  overflow: hidden;
`;

function LinkClip({ title, markdown }: { title: string; markdown?: string }) {
  return (
    <div>
      <LinkWrapper>
        <Icon icon="markdown-link" size="small" />
        <P size="tiny">{title}</P>
      </LinkWrapper>
      <Spacer />
      <Markdown markdown={markdown} />
    </div>
  );
}

const LinkWrapper = styled.div`
  padding: var(--unit);
  box-shadow: 0 0 0 1px var(--gridColor);
  display: flex;
  align-items: center;
  gap: calc(var(--unit) * 0.5);
`;

function ImageClip({
  src,
  width,
  height,
  description,
}: {
  src: string;
  width: number;
  height: number;
  description;
}) {
  return (
    <div>
      <Img src={src} loading="lazy" width={width} height={height} />
      <Spacer />
      <ImageText>
        <P size="tiny">{description}</P>
      </ImageText>
    </div>
  );
}

const Img = styled.img`
  width: 100%;
  height: auto;
`;

const ImageText = styled.div`
  padding: var(--unit);
  background: var(--commentBackgroundTint);
  border-left: 4px solid var(--contentBackgroundTint);
`;

function TextClip({ markdown }: { markdown: string }) {
  return <Markdown markdown={markdown} />;
}
